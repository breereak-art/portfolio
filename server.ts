import { createServer } from "http";
import type { IncomingMessage } from "http";
import { readFileSync, existsSync } from "fs";
import { join, resolve, sep } from "path";
import { parse } from "url";

const PORT = parseInt(process.env.PORT || "3001");
const DIST_PATH = resolve("dist");

// Rate limiting
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 1000;

function getClientIP(req: IncomingMessage): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  const realIp = req.headers["x-real-ip"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }

  return req.socket.remoteAddress || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const mimeTypes = {
  "html": "text/html",
  "htm": "text/html",
  "js": "application/javascript",
  "mjs": "application/javascript",
  "css": "text/css",
  "png": "image/png",
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "gif": "image/gif",
  "svg": "image/svg+xml",
  "ico": "image/x-icon",
  "webp": "image/webp",
  "woff": "font/woff",
  "woff2": "font/woff2",
  "txt": "text/plain",
};

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url || "/", true);
  const pathname = parsedUrl.pathname || "/";
  
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API routes
  if (pathname === "/api/contact" && req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  if (pathname === "/api/contact" && req.method === "POST") {
    const key = getClientIP(req);
    if (isRateLimited(key)) {
      res.writeHead(429, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Too many requests. Try again in a minute." }));
      return;
    }
    
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const { name, email, projectType, timeline, message } = data;
        
        if (!name?.trim() || !email?.trim() || !message?.trim()) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Name, email, and message are required." }));
          return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid email address." }));
          return;
        }
        
        const subject = `[Zo Lead] Portfolio inquiry from ${name.trim()}`;
        const htmlBody = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
          <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
          <p><strong>Project Type:</strong> ${escapeHtml(projectType?.trim() || "Not specified")}</p>
          <p><strong>Timeline:</strong> ${escapeHtml(timeline?.trim() || "Not specified")}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message.trim()).replace(/\n/g, "<br>")}</p>
        `;
        
        try {
          const ZO_API_KEY = process.env.ZO_API_KEY;
          if (!ZO_API_KEY) throw new Error("ZO_API_KEY not set");
          
          const zoResponse = await fetch("https://api.zo.computer/zo/ask", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ZO_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              input: `You are Bree's inbox assistant.

Create a Gmail draft in the connected account breereak@gmail.com. Do not send the email.
Use this subject line: ${subject}

Lead summary:
${htmlBody}

Write the draft in Bree's playful, casual voice so it feels warm, short, and human. Keep it roughly 80-140 words, acknowledge the lead's idea, include one helpful next-step question, and end with a friendly sign-off.

After the draft is created, send a Telegram message to @Jadennixxi saying a new lead arrived and the Gmail draft is ready. Include the lead name, email, project type, and timeline.

Do not send the email.`,
              model_name: "openai:gpt-5.4-mini-2026-03-17",
            }),
          });
          
          if (!zoResponse.ok) throw new Error("Zo API request failed");
        } catch (e) {
          console.error("Email error:", e);
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Message could not be routed through Zo. Please try again." }));
          return;
        }
        
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }
    });
    return;
  }
  
  // Static files
  const filePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const fullPath = resolve(DIST_PATH, filePath);
  
  // Security: prevent path traversal
  if (fullPath !== DIST_PATH && !fullPath.startsWith(`${DIST_PATH}${sep}`)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  
  if (existsSync(fullPath)) {
    const ext = filePath.split(".").pop()?.toLowerCase() || "txt";
    const contentType = mimeTypes[ext as keyof typeof mimeTypes] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(readFileSync(fullPath));
  } else {
    const indexPath = join(DIST_PATH, "index.html");
    if (existsSync(indexPath)) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(readFileSync(indexPath));
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

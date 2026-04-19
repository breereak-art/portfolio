import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RECIPIENT_EMAIL = Deno.env.get("CONTACT_RECIPIENT_EMAIL") || "hello@yourdomain.com";
const ZO_WORKFLOW_EMAIL = Deno.env.get("ZO_WORKFLOW_EMAIL") || "";
const CONTACT_FROM_EMAIL = Deno.env.get("CONTACT_FROM_EMAIL") || "onboarding@resend.dev";
const ZO_API_KEY = Deno.env.get("ZO_API_KEY") || "";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const cleanText = (value: unknown, maxLength: number) => {
  if (!value || typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

const queueZoWorkflow = async (input: string) => {
  if (!ZO_API_KEY) return { queued: false, reason: "ZO_API_KEY is not configured" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch("https://api.zo.computer/zo/ask", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ZO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      console.error(`Zo API error [${response.status}]:`, details);
      return { queued: false, reason: `Zo API error ${response.status}` };
    }

    return { queued: true };
  } catch (error) {
    console.error("Zo API request failed:", error);
    const details = error instanceof Error ? `${error.name}: ${error.message}` : "Unknown error";
    return { queued: false, reason: `Zo API request failed (${details})` };
  } finally {
    clearTimeout(timeout);
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, message, projectType, timeline } = await req.json();

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Invalid name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0 || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Invalid message" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const sanitizedName = cleanText(name, 100);
    const sanitizedEmail = cleanText(email, 255);
    const sanitizedProjectType = cleanText(projectType, 100) || "Not specified";
    const sanitizedTimeline = cleanText(timeline, 100) || "Not specified";
    const sanitizedMessage = cleanText(message, 2000);

    const recipients = Array.from(
      new Set([RECIPIENT_EMAIL, ZO_WORKFLOW_EMAIL].filter(Boolean))
    );

    const zoInstructions = [
      "Zo workflow request: Treat this as a new portfolio lead for Bree Reak.",
      "1. Summarize the opportunity in 3 bullet points.",
      "2. Estimate whether it sounds like freelance work, collaboration, internship/recruiting, or general hello.",
      "3. Draft a warm reply in Bree's playful but professional voice.",
      "4. Suggest one follow-up question about scope, timeline, or goals.",
      "5. Remind Bree to respond within 24 hours if this looks promising.",
    ].join("\n");

    // Send email using Resend API
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Bree Reak Portfolio <${CONTACT_FROM_EMAIL}>`,
        to: recipients,
        subject: `[Zo Lead] Portfolio inquiry from ${sanitizedName}`,
        reply_to: sanitizedEmail,
        text: `${zoInstructions}

Lead details
Name: ${sanitizedName}
Email: ${sanitizedEmail}
Project type: ${sanitizedProjectType}
Timeline: ${sanitizedTimeline}
Source: Bree Reak portfolio contact form

Visitor message:
${sanitizedMessage}
`,
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fdf6e3; border-radius: 12px;">
            <p style="margin: 0 0 8px; color: #777; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">Zo-ready portfolio lead</p>
            <h1 style="color: #e91e8c; font-size: 24px; margin-bottom: 8px;">New message for Bree</h1>
            <div style="background: #111827; color: #fef3c7; border-radius: 8px; padding: 16px; margin: 16px 0; font-family: monospace; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(zoInstructions)}</div>
            <div style="background: white; border: 2px solid #e91e8c; border-radius: 8px; padding: 20px; margin: 16px 0;">
              <p style="margin: 0 0 8px;"><strong>From:</strong> ${escapeHtml(sanitizedName)}</p>
              <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
              <p style="margin: 0 0 8px;"><strong>Project type:</strong> ${escapeHtml(sanitizedProjectType)}</p>
              <p style="margin: 0 0 8px;"><strong>Timeline:</strong> ${escapeHtml(sanitizedTimeline)}</p>
              <hr style="border: 1px dashed #ddd; margin: 12px 0;" />
              <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(sanitizedMessage)}</p>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center;">Sent from Bree's portfolio contact form</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.text();
      console.error(`Resend API error [${emailResponse.status}]:`, errorBody);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const zoPrompt = `You are Bree's inbox assistant.

Create a Gmail draft in the connected account breereak@gmail.com. Do not send the email.
Use this subject line: [Zo Lead] Portfolio inquiry from ${sanitizedName}

Lead summary:
Name: ${sanitizedName}
Email: ${sanitizedEmail}
Project type: ${sanitizedProjectType}
Timeline: ${sanitizedTimeline}
Message:
${sanitizedMessage}

Write the draft in Bree's playful, casual voice so it feels warm, short, and human. Keep it roughly 80-140 words, acknowledge the lead's idea, include one helpful next-step question, and end with a friendly sign-off.

After the draft is created, send a Telegram message to @Jadennixxi saying a new lead arrived and the Gmail draft is ready. Include the lead name, email, project type, and timeline.

Do not send the email.`;

    const zoResult = await queueZoWorkflow(zoPrompt);

    return new Response(
      JSON.stringify({
        success: true,
        zoQueued: zoResult.queued,
        ...(zoResult.queued ? {} : { zoReason: zoResult.reason || "Unknown Zo queue failure" }),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-contact-email:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

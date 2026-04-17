import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "@supabase/supabase-js/cors";

const RECIPIENT_EMAIL = Deno.env.get("CONTACT_RECIPIENT_EMAIL") || "hello@yourdomain.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

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

    const sanitizedName = name.trim().replace(/[<>]/g, "");
    const sanitizedMessage = message.trim().replace(/[<>]/g, "");

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
        from: `Portfolio Contact <onboarding@resend.dev>`,
        to: [RECIPIENT_EMAIL],
        subject: `New message from ${sanitizedName}`,
        reply_to: email.trim(),
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fdf6e3; border-radius: 12px;">
            <h1 style="color: #e91e8c; font-size: 24px; margin-bottom: 8px;">New Portfolio Message!</h1>
            <div style="background: white; border: 2px solid #e91e8c; border-radius: 8px; padding: 20px; margin: 16px 0;">
              <p style="margin: 0 0 8px;"><strong>From:</strong> ${sanitizedName}</p>
              <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email.trim()}</p>
              <hr style="border: 1px dashed #ddd; margin: 12px 0;" />
              <p style="white-space: pre-wrap; line-height: 1.6;">${sanitizedMessage}</p>
            </div>
            <p style="color: #999; font-size: 12px; text-align: center;">Sent from your portfolio contact form</p>
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

    return new Response(
      JSON.stringify({ success: true }),
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

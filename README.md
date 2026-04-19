# Bree Reak Portfolio

A playful creative web portfolio for Bree Reak.

Built with React, TypeScript, Vite, and Tailwind CSS.

## Contact workflow

The live Zo site is a static Vite build. Contact submissions go through the
Supabase `send-contact-email` Edge Function, which sends a `[Zo Lead]` email
with Resend and queues Zo to create a Gmail draft plus Telegram ping. Bree's
Zo/Gmail workflow can then summarize the lead, classify it, draft a reply, and
suggest the next follow-up.

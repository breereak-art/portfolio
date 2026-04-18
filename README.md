# Bree Reak Portfolio

A playful creative web portfolio for Bree Reak.

Built with React, TypeScript, Vite, Tailwind CSS, and Supabase contact form support.

## Contact workflow

The contact form sends messages through the Supabase Edge Function at
`supabase/functions/send-contact-email`.

Set these secrets before deploying the form:

- `RESEND_API_KEY`
- `CONTACT_RECIPIENT_EMAIL`
- `CONTACT_FROM_EMAIL`
- `ZO_WORKFLOW_EMAIL`

`ZO_WORKFLOW_EMAIL` should be Bree's Zo Computer email address if the form should
trigger a Zo lead follow-up workflow. The email includes a structured prompt for
Zo to summarize the lead, classify it, draft a reply, suggest a follow-up
question, and remind Bree to respond.

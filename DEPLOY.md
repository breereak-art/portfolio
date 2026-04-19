# Portfolio - Zo Site Deployment Docs

## Current State

This repo is the Bree Reak portfolio app at:

`https://github.com/breereak-art/portfolio`

Zo added a `zosite.json` build config and a Zo-routed contact endpoint at `/api/contact`.

## Site URL

Target Zo URL:

`https://breereak.zo.computer`

A custom domain can be connected later from Zo's site settings. It is optional for launch.

## Contact Form

Current production flow for static Zo Sites:

```text
Visitor fills form
-> Supabase Edge Function send-contact-email
-> Resend sends a [Zo Lead] email to breereak@gmail.com
-> Bree's Zo/Gmail agent summarizes, classifies, drafts a reply, and reminds Bree
-> frontend shows the sent state after Supabase/Resend accepts the message
```

Required Zo Sites frontend env:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Required Supabase function secrets:

- `RESEND_API_KEY`
- `CONTACT_RECIPIENT_EMAIL`
- `CONTACT_FROM_EMAIL`
- `ZO_WORKFLOW_EMAIL`

The repo still includes `server.ts` and `/api/contact` as a fallback for a dynamic Zo server, but the current public Zo Sites deployment serves a static Vite build. For that setup, the Supabase function is the contact backend.

## Build Settings

Zo Sites should build the React app from this repo.

```text
Install/build command: bun install && bun run build
Output directory: dist
Run command: bun run start
Port: 3001
```

If Zo Sites is configured as static-only, the `dist` output is enough as long as the Supabase frontend env vars are set before build.

## Deploy Checklist

- [x] Repo cloned/pulled from GitHub
- [x] `zosite.json` added
- [x] Supabase contact function exists in the repo
- [ ] Set Zo Sites frontend env vars for Supabase
- [ ] Deploy Supabase `send-contact-email`
- [ ] Set Supabase function secrets
- [ ] Trigger Zo build/deploy
- [ ] Submit the live form and confirm email arrives at `breereak@gmail.com`
- [ ] Confirm the Zo/Gmail agent processes the `[Zo Lead]` message
- [ ] Record the 30-second challenge walkthrough

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS 3
- shadcn/ui and Radix primitives
- Supabase Edge Function + Resend for contact delivery
- Zo/Gmail agent for lead processing and reply drafting

## Troubleshooting

If the form says the message could not be routed through Zo:

- Confirm `ZO_API_KEY` is set in Zo.
- Confirm the deployed site is serving `/api/contact`.
- Check Zo logs for the API route.
- Make sure Gmail and Telegram integrations are connected to the Zo account.

If the frontend deploys but `/api/contact` returns 404:

- Zo is probably serving only the static `dist` build.
- Either configure the Node server/API route in Zo or switch the form back to the Supabase Edge Function path.

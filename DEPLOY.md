# Portfolio - Zo Site Deployment Docs

## Current State

This repo is the Bree Reak portfolio app at:

`https://github.com/breereak-art/portfolio`

Zo added a `zosite.json` build config. The repo still has a dynamic `/api/contact`
fallback, but the public Zo URL is currently serving a static Vite build.

## Site URL

Current Zo URL:

`https://portfolio-site-breereak.zocomputer.io`

A custom domain can be connected later from Zo's site settings. It is optional for launch.

## Contact Form

Current production flow for static Zo Sites:

```text
Visitor fills form
-> Supabase Edge Function send-contact-email
-> Resend sends a [Zo Lead] email to breereak@gmail.com
-> Supabase calls Zo so the Gmail draft + Telegram ping can be queued immediately
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
- `ZO_API_KEY`

The repo still includes `server.ts` and `/api/contact` as a fallback for a dynamic Zo server, but the current public Zo Sites deployment serves a static Vite build. For that setup, the Supabase function is the contact backend.

## Build Settings

Zo Sites should build the React app from this repo.

```text
Install/build command: bun install && bun run build
Output directory: dist
```

The current live deployment is static-only. The `dist` output is enough as long as
the Supabase frontend env vars are set before build.

## Deploy Checklist

- [x] Repo cloned/pulled from GitHub
- [x] `zosite.json` added
- [x] Supabase contact function exists in the repo
- [ ] Set Zo Sites frontend env vars for Supabase
- [ ] Deploy Supabase `send-contact-email`
- [ ] Set Supabase function secrets
- [ ] Confirm Supabase function response includes `"zoQueued": true`
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

If the live form says the contact route is not live yet:

- Confirm Zo rebuilt after `2f4b7a0c` or later.
- Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set in Zo before build.
- Confirm the built JS asset is newer than `index-DaBzT1_x.js`.

If the form sends but no email arrives:

- Confirm the Supabase `send-contact-email` function is deployed.
- Confirm the Supabase function secrets are set.
- Check Supabase function logs for Resend errors.
- Confirm the email subject starts with `[Zo Lead] Portfolio inquiry`.

If someone wants to use the dynamic `/api/contact` fallback later:

- Configure Zo to run `bun run start` on port `3001`.
- Set `ZO_API_KEY`.
- Confirm `/api/health` returns JSON instead of `index.html`.

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

Current intended flow:

```text
Visitor fills form
-> POST /api/contact
-> server.ts validates and rate-limits the message
-> Zo API creates a Gmail draft in breereak@gmail.com
-> Zo sends Bree a Telegram ping
-> frontend shows the sent state only after Zo accepts the request
```

Required secret:

`ZO_API_KEY`

Set it in Zo's secrets/settings before testing the live contact form.

## Build Settings

Zo Sites should build the React app from this repo.

```text
Install/build command: bun install && bun run build
Output directory: dist
Run command: bun run start
Port: 3001
```

The app has a tiny server for `/api/contact`. `zosite.json` points Zo at `bun run start`, which runs `server.ts`, serves the built `dist` frontend, and handles the contact API.

## Deploy Checklist

- [x] Repo cloned/pulled from GitHub
- [x] `zosite.json` added
- [x] `/api/contact` endpoint added
- [x] `bun run start` wired as the site run command
- [ ] Add `ZO_API_KEY` secret in Zo
- [ ] Trigger Zo build/deploy
- [ ] Test `/api/contact` from the deployed URL
- [ ] Submit the live form and confirm the Gmail draft appears
- [ ] Confirm Telegram ping arrives
- [ ] Record the 30-second challenge walkthrough

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS 3
- shadcn/ui and Radix primitives
- Zo API for the contact workflow
- Supabase client is still installed, but the current contact form no longer posts to the Supabase Edge Function

## Troubleshooting

If the form says the message could not be routed through Zo:

- Confirm `ZO_API_KEY` is set in Zo.
- Confirm the deployed site is serving `/api/contact`.
- Check Zo logs for the API route.
- Make sure Gmail and Telegram integrations are connected to the Zo account.

If the frontend deploys but `/api/contact` returns 404:

- Zo is probably serving only the static `dist` build.
- Either configure the Node server/API route in Zo or switch the form back to the Supabase Edge Function path.

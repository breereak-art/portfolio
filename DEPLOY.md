# Portfolio — Zo Site Deployment Docs

## What was done

The breereak.art portfolio was cloned from GitHub to this Zo workspace at:
`/home/workspace/bree-portfolio`

A `zosite.json` build config was added so Zo can build and host it.
The Supabase contact form was replaced with a Zo-hosted API route (`/api/contact`).

---

## Site URL

Once deployed: `https://breereak.zo.computer`

You can configure a custom domain in [Settings > Sites](https://jaden.zo.computer/?t=sites&s=sites) after deploying.

---

## Contact Form — How it works

**Before (Supabase edge function + Resend):**
- Frontend → Supabase function → Resend API → email to bree@breereak.art

**After (Zo-native):**
- Frontend → `POST /api/contact` → Zo routes → Gmail integration → bree@breereak.art

The `/api/contact` route validates input, rate-limits (5 req/min per IP), and delivers the email via your connected Gmail (breereak@gmail.com).

---

## Environment Variables — What you need

Add these in [Settings > Advanced](https://jaden.zo.computer/?t=settings&s=advanced) under **Secrets**:

| Variable | Value | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | leave empty or `""` | No longer used |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | leave empty or `""` | No longer used |

The Supabase env vars are not needed anymore — the form is fully routed through Zo.

---

## Deploy Checklist

- [x] Repo cloned
- [x] `zosite.json` added
- [x] `bun install` completed (478 packages)
- [ ] Build triggered (hit **Build** in [Hosting > Sites](/?t=sites&s=sites))
- [ ] Custom domain set up (optional — paid plan required)
- [ ] Test the contact form

---

## Stack

- React 19 + Vite (TypeScript)
- Tailwind CSS v4
- shadcn/ui + Radix UI primitives
- Framer Motion (animations)
- Supabase client (installed but no longer used by contact form)

---

## Contact Form Flow

```
User fills form → POST https://breereak.zo.computer/api/contact
  → validates name, email, message
  → rate limit check (5/min)
  → sends email via breereak@gmail.com Gmail
  → returns { success: true }
  → frontend shows "Yay, sent!"
```

---

## Troubleshooting

**Contact form says "something went wrong":**
- Check [Zo Browser](/browser?url=https://breereak.zo.computer/api/contact) for errors
- Check Gmail is connected in [Integrations](/?t=settings&s=integrations)

**Build fails:**
- Run `bun install` in `/home/workspace/bree-portfolio` and check for errors
- Share the build error output via [Terminal](/?t=terminal)
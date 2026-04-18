# Bree Reak Portfolio

A playful creative web portfolio for Bree Reak.

Built with React, TypeScript, Vite, and Tailwind CSS.

## Contact workflow

The contact form sends submissions to `/api/contact`, which routes the lead through Zo.
Zo creates a Gmail draft in `breereak@gmail.com` and pings Bree on Telegram so the draft can be reviewed before sending.

Set this secret before deploying the form:

- `ZO_API_KEY`

Save it in [Settings > Advanced](/?t=settings&s=advanced) as a Zo access token.

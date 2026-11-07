# Parlance B1 | French learning website

An original full-stack Next.js learning website for multiple users: Supabase email/password accounts, private conversation history, personalized AI French tutoring, browser voice dictation/read-aloud, self-scoring B1 grammar quizzes, AI-supported DELF writing practice, weekly activity and progress analytics.

## Quick start

1. Install Node.js 20.9+ and run `npm install` in this directory.
2. Create a project at https://supabase.com/dashboard. In its **SQL Editor**, run `supabase/schema.sql`.
3. In Supabase **Authentication > Providers**, enable **Email**. Choose email confirmation settings. For production, configure a real SMTP service, suitable email templates, and authorized redirect/site URLs.
4. Copy `.env.example` to `.env.local`. Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase publishable/anon key), and `OPENAI_API_KEY` from https://platform.openai.com. The OpenAI API requires a separate billed account from ChatGPT Plus. `OPENAI_MODEL` is configurable.
5. Run `npm run dev`, then open http://localhost:3000. Create two accounts to verify private data separation.
6. For hosting, push this folder to GitHub and import into https://vercel.com/new. Set the same environment variables in Vercel. Add the production domain to Supabase Authentication URL configuration before welcoming learners.

## What is functional

- **Accounts:** Supabase Auth email/password signup/login/logout. Individual learner data protected by PostgreSQL row-level security (RLS).
- **Tutor:** AI conversation and short, structured corrections (OpenAI Responses API); conversation histories persist per account and per mode.
- **Voice assistance:** Browser speech recognition for dictated French and browser text-to-speech for read-aloud. Availability and voice quality vary by browser and OS. This is not a realtime voice-to-voice agent or automatic pronunciation grading.
- **Grammar:** 4 original lessons, 16 multiple-choice questions, answer explanations, saved attempts and mastery threshold (75%).
- **DELF:** 4 original B1-style writing/oral-expression prompts, with AI feedback. This is *practice*, not official examination or certification. Oral prompts use typed/dictated transcripts, not audio evaluation.
- **Progress:** per-user attempts, score average, daily activities, time estimates, streaks, and self-study activity bars. Activity metrics are not official CEFR competency assessments.

## Important production checklist

This is a functional **starter**, not a production-audited commercial language platform. Before a public launch:

- Set up Supabase Auth email delivery, password resets, abuse controls / CAPTCHA, and an acceptable use and privacy policy.
- Implement durable per-user rate limiting, model budget caps, request monitoring, prompt safety controls and server-side spending limits. The authenticated AI endpoint has a simple, non-atomic 50-message-per-mode rolling daily limit, but this is not sufficient protection against concurrent or automated abuse and can incur costs.
- Keep `OPENAI_API_KEY` only on the server. Never prefix it with `NEXT_PUBLIC_` and never commit `.env.local`.
- Establish GDPR-compliant retention and deletion flows for EU learners; chat messages may contain personal data. Consider age restrictions, consent and data processing agreements before using with minors.
- Review database permissions and RLS policies carefully. This MVP lets authenticated users insert their own activity events and quiz scores, so these metrics are **self-reported and not tamper-proof**. For leaderboards, rewards, grading, or paid certificates, validate scores on the server using a database-safe workflow.
- The tutor history is limited to recent messages to manage token use. For long-term personalized weakness tracking, add a per-user diagnostic summary and validated learning objectives.
- Add automated tests, accessibility audit, internationalization, log retention controls, and backup/recovery before onboarding real users at scale.

## Architecture

- Next.js 16 App Router, React 19, TypeScript, custom CSS, Lucide icons
- Supabase Auth + Postgres + RLS
- OpenAI JavaScript SDK Responses API, secret server API route `/api/tutor`
- Vercel-ready. Health endpoint `/api/health` reports which services have credentials configured, without exposing credentials.

## Troubleshooting

- Blank setup screen: missing NEXT_PUBLIC_SUPABASE_* variables; restart dev server after adding.
- Supabase `relation does not exist`: execute `supabase/schema.sql` in the correct Supabase project.
- AI unavailable: confirm OPENAI_API_KEY is valid and separately funded, and OPENAI_MODEL is available to your organization.
- Email verification: use the confirmation link and check Supabase Auth URL and Redirect URLs.
- Voice input: grant microphone permission and use a browser offering `SpeechRecognition`; otherwise use typing.

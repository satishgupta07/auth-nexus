# AuthNexus

A production-quality authentication app built with Next.js (App Router), TypeScript, MongoDB/Mongoose, JWT, Nodemailer + Mailtrap, and Tailwind CSS.

Built in two phases:

- **Phase 1 (done)** — email/password signup, email verification, login, logout, forgot/reset password, all backed by short-lived JWTs and an httpOnly session cookie.
- **Phase 2 (planned)** — Google and GitHub sign-in via Auth.js, sharing the same `User` collection as Phase 1.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | MongoDB via Mongoose |
| Auth | Custom JWT (access + one-time email tokens); Auth.js for OAuth in Phase 2 |
| Password hashing | bcryptjs |
| Email | Nodemailer via Mailtrap (dev sandbox) |
| Validation | Zod |
| Styling | Tailwind CSS v4 |
| Client HTTP / notifications | Axios, react-hot-toast |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Base URL used to build verify-email / reset-password links |
| `MONGODB_URI` | MongoDB connection string (e.g. a free MongoDB Atlas cluster) |
| `JWT_ACCESS_SECRET` / `JWT_ACCESS_EXPIRES_IN` | Signs the session cookie |
| `JWT_EMAIL_TOKEN_SECRET` | Signs one-time verify-email / reset-password links (kept separate from the access secret on purpose) |
| `JWT_VERIFY_EMAIL_EXPIRES_IN` / `JWT_RESET_PASSWORD_EXPIRES_IN` | TTLs for those one-time links |
| `MAILTRAP_HOST` / `MAILTRAP_PORT` / `MAILTRAP_USER` / `MAILTRAP_PASS` | SMTP credentials from your Mailtrap sandbox inbox |
| `MAIL_FROM` | From-address used on outgoing mail |

Generate secrets with:

```bash
openssl rand -base64 32
```

### 3. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login` or `/dashboard` depending on whether you have a valid session.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build (also type-checks and prerenders static routes) |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Auth flows

- **Sign up** (`/signup`) → creates the account (unverified) and emails a verify link.
- **Verify email** (`/verify-email?token=...`) → activates the account.
- **Log in** (`/login`) → requires a verified account; sets an httpOnly session cookie.
- **Forgot password** (`/forgot-password`) → always responds the same way whether or not the email exists, and only emails a reset link if it does.
- **Reset password** (`/reset-password?token=...`) → sets a new password and clears any existing session.
- **Dashboard** (`/dashboard`) → protected; gated by `src/proxy.ts` (optimistic check) and `src/app/(protected)/layout.tsx` (authoritative, DB-backed check).

## Project structure

```
src/
  app/
    (auth)/          public auth pages: login, signup, verify-email, forgot-password, reset-password
    (protected)/      dashboard, gated behind session checks
    api/auth/         signup, login, logout, verify-email, forgot-password, reset-password, current-user
  components/auth/    shared form primitives (AuthCard, TextInput, PasswordInput, SubmitButton)
  lib/
    auth/             password hashing, JWT signing/verifying, session/cookie helpers
    db/               cached Mongoose connection
    mail/             Nodemailer transport + HTML email templates
    api/              shared response helpers and Zod schemas
  models/User.ts       Mongoose user schema
  proxy.ts              route protection (Next 16's renamed Middleware)
```

See `CLAUDE.md` for the architectural notes and conventions behind these decisions.

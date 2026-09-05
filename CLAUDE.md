# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build (also type-checks via `tsc` and prerenders static routes)
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- `npx tsc --noEmit` — type-check only, no build

There is no test runner configured yet. There is no `db:*` script — Mongoose connects directly via `MONGODB_URI`, there is no migration step.

## Architecture

This is a Next.js App Router auth app (TypeScript, MongoDB/Mongoose, JWT-based sessions) named AuthNexus. Only Phase 1 (custom email/password auth) is built right now. Phase 2 (Google/GitHub OAuth via Auth.js) is planned but deliberately not scaffolded yet — see "Phase 1 only, no speculative Phase 2 code" below before adding anything OAuth-shaped.

**Two parallel token families — do not cross them.** `src/lib/auth/jwt.ts` defines two independent secrets/signing functions: `signAccessToken`/`verifyAccessToken` (session cookie, `JWT_ACCESS_SECRET`) and `signEmailToken`/`verifyEmailToken` (one-time verify-email/reset-password links, `JWT_EMAIL_TOKEN_SECRET`, tagged with a `purpose: 'verify' | 'reset'`). A leaked reset link must never double as a login session, which is why these never share a secret or a signing function.

**Email/reset token lifecycle lives in `src/lib/auth/emailToken.ts`, not in the routes.** `issueEmailToken(user, purpose, expiresIn)` mints a random `jti`, signs the JWT, and stores the `jti` + expiry on the right `User` fields (`verifyToken`/`forgotPasswordToken` etc., both `select: false` in the schema) via a `purpose -> field names` map — the caller still calls `user.save()`. `consumeEmailToken(token, purpose)` verifies signature/purpose/expiry *and* that the stored `jti` still matches in the DB, clears it, and returns the user (or `null`). This DB-side check is what makes a link single-use even though the JWT itself would stay valid until its own `exp`. Both `signup`/`forgot-password` (issue) and `verify-email`/`reset-password` (consume) share this module — don't reimplement the jti/expiry dance inline in a route again.

**Session flow**: `src/lib/auth/session.ts` owns the `authnexus_token` httpOnly cookie (`setAccessTokenCookie`/`clearAccessTokenCookie`, only callable from Route Handlers/Server Actions — Next 16 throws if called during Server Component render) and `getCurrentUser()` (React `cache()`-wrapped, safe to call anywhere, does the actual DB-backed lookup). Route protection has two layers: `src/proxy.ts` does an optimistic, DB-free cookie/signature check to redirect `/dashboard` vs `/login`+`/signup` (Next's own guidance: proxy isn't for slow data fetching), while `src/app/(protected)/layout.tsx` calls `getCurrentUser()` for the authoritative check.

**`src/proxy.ts`, not `middleware.ts`.** Next 16 renamed Middleware to Proxy and changed its default runtime to Node.js (confirmed against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`) — do not assume pre-16 Middleware conventions or edge-runtime constraints when touching routing/auth checks.

**`cookies()`/`headers()` are async-only** in this Next version — every helper that touches them (`session.ts`) is `async` and every caller must `await`.

**API responses are built inline with `NextResponse.json`, on purpose — there is no `ok()`/`fail()` wrapper.** Every route returns `{ success: true, data }` or `{ success: false, error: { message } }` directly via `NextResponse.json(...)`, so the shape is visible at the call site instead of hidden behind a helper. The one thing that *is* shared is `withErrorHandling()` (`src/lib/api/withErrorHandling.ts`), a HOF that wraps a route handler's body in try/catch and returns the same `{ success: false, error: { message } }` 500 on an unexpected throw — apply it to new routes that do real work, the same way `login`/`signup`/`logout`/`verify-email`/`forgot-password`/`reset-password` already do. `current-user` is the one exception: it never had a try/catch and is left bare so an unexpected error surfaces as Next's default error response rather than silently changing shape. On the client, `extractErrorMessage(error, fallback)` (`src/lib/api/clientError.ts`) pulls the message back out of that shape for `react-hot-toast` calls — use it instead of re-deriving the `axios.isAxiosError(...)` check per page.

**Security-sensitive conventions to preserve**:
- `forgot-password` always returns the same success message whether or not the account exists (no enumeration) — only the side effect (sending mail) is conditional.
- `login` returns one generic "Invalid email or password" for both unknown-email and wrong-password cases.
- `password`/`verifyToken`/`forgotPasswordToken` fields on `User` are `select: false` — routes that need them explicitly `.select('+password')` etc.
- Password hashing is `bcrypt` at 12 rounds (`src/lib/auth/password.ts`).

**Mongoose connection caching**: `src/lib/db/connect.ts` caches the connection (and in-flight connect promise) on `globalThis` to survive dev-mode hot reload and avoid connection storms — always call `await connectDB()` before touching `User`, never instantiate a new connection.

**Mail**: `src/lib/mail/sendMail.ts` is a module-level Nodemailer transport pointed at Mailtrap via env vars (never hardcode credentials). Templates in `src/lib/mail/templates/` are plain functions returning HTML strings sharing `emailShell()` for consistent branding.

**Env vars are introduced incrementally in `.env.example`** — only add a var there in the same commit as the code that first reads it, don't front-load unused vars.

## UI conventions

Visual identity is a dark "aurora glass" theme (see `globals.css` `@theme` tokens: `--color-surface`, `--color-brand-violet/cyan/magenta`) — Tailwind v4, CSS-first config, no `tailwind.config.js`. Auth pages compose the shared `src/components/auth/` primitives (`AuthCard`, `TextInput`, `PasswordInput`, `SubmitButton`) rather than duplicating form markup, including non-auth pages that need the same centered glass card (e.g. `dashboard` reuses `AuthCard`). `TextInput`/`PasswordInput` share their label/error styling and the base input class via `fieldStyles.ts` + `FieldError` rather than each defining its own copy — if you add a third field-like input, pull its shared bits from there too instead of re-inlining the classes. A single `<Toaster />` is mounted once in the root `src/app/layout.tsx`.

## Conventions & best practices

- **Phase 1 only, no speculative Phase 2 code.** The `User` model, routes, and pages only contain what Phase 1 (email/password auth) actually uses. Don't add OAuth-shaped fields (`linkedAccounts`, `avatarUrl`, a `provider` discriminator, etc.) or Auth.js scaffolding until Phase 2 actually starts — YAGNI over "prepare the schema now." When Phase 2 begins, expect to revisit `src/models/User.ts` (`password` is currently `required`, which will need to change for OAuth-only accounts) and `src/lib/auth/session.ts`.
- **Extract shared logic once it's duplicated twice, not before.** `emailToken.ts`, `withErrorHandling.ts`, `clientError.ts`, and `fieldStyles.ts` all exist because the same handful of lines showed up in 2+ routes/pages/components — not because they might be useful someday. If you're about to copy a third occurrence of something, that's the signal to extract it; don't pre-extract a helper for a single call site.
- **No response-shape wrapper.** Build API responses inline with `NextResponse.json({ success, data | error }, { status })` in each route — this was a deliberate choice to keep the response shape visible at the call site instead of hidden behind an `ok()`/`fail()` indirection. Do reach for `withErrorHandling()` for the try/catch itself, since that's boilerplate, not a response-shape decision.
- **Prefer `.lean()` / `.exists()` when a query result won't be mutated.** `login` uses `.lean()` (reads password/id/name/email, never calls `.save()`), and `signup`'s existence check uses `User.exists({ email })` instead of a full `findOne` — both skip Mongoose document hydration for a small, real cost saving. Routes that call `.save()` on the result (`verify-email`, `reset-password`, `forgot-password`) correctly stay as full hydrated documents.
- **Verify before committing.** Run `npx tsc --noEmit` and `npm run lint` (and `npm run build` for anything touching routing/rendering) before committing — this repo has caught real issues this way (an eslint-plugin-react-hooks violation, a stale `eslint-disable`), and there's no test suite yet to catch them another way.
- **Env vars are introduced incrementally.** Only add a variable to `.env.example` in the same commit as the code that first reads it — don't front-load vars for functionality that doesn't exist yet.

# Satark Rahein — Frontend Starter

Page 1 (`/`): landing page with the app name and disaster-themed visuals.
Page 2 (`/auth`): login/register with role tabs (Student / Teacher / Admin).

Page 3 (`/dashboard`): homepage after login — four module cards (Virtual Evacuation Drills, Preparedness Quizzes, Awareness Games, Ask Satark AI), each linking to its own page.

## Run it

```bash
cp .env.example .env     # points at the backend; edit if your backend runs elsewhere
npm install
npm run dev
```

Opens at `http://localhost:5173`. Needs the `satark-rahein-backend` server running too (see its README).

## How auth currently works
- `AuthPage.jsx` calls `POST /api/auth/login` or `/api/auth/register` (see `src/api.js`).
- On success, the JWT and user object are saved to `localStorage` (`sr_token`, `sr_user`) and the app navigates to `/dashboard`.

## Module pages
`/drills`, `/quiz`, `/games`, `/chatbot` are currently placeholders (`ModulePlaceholder.jsx`) reached from the dashboard cards. Replace each with real content as the team builds it:
- **Drills** — step-driven evacuation simulations (fire/earthquake/flood), probably a stepper UI.
- **Quiz** — question bank + scoring, feeds the weak-area analytics from the project proposal.
- **Games** — lightweight interactive awareness games.
- **Chatbot** — likely a call to an LLM API from the backend; keep the API key server-side, never in the frontend.

## Next steps for the team
- Split `/dashboard` cards' target pages into role-aware views if admin/teacher need different content than students.
- Add a `ProtectedRoute` wrapper that checks `sr_token` and redirects to `/auth` if missing/expired.
- Move the JWT out of `localStorage` into an httpOnly cookie if you want better XSS protection.

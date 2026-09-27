# Satark Rahein — Backend

Auth API only, for now: register/login with role (`student` / `teacher` / `admin`), JWT-based.

## Setup

```bash
cp .env.example .env     # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev
```

Runs on `http://localhost:5000` (or whatever `PORT` you set).

## Endpoints

| Method | Route             | Body                                                  | Notes                     |
|--------|-------------------|--------------------------------------------------------|---------------------------|
| POST   | `/api/auth/register` | `fullName, email, password, role, roleField`         | `roleField` = roll no / staff ID / institute code |
| POST   | `/api/auth/login`    | `email, password, role`                              | Returns `{ token, user }` |
| GET    | `/api/auth/me`       | — (send `Authorization: Bearer <token>`)             | Protected, returns current user |

## Next steps
- Add `express-validator` or `zod` for stricter input validation.
- Add refresh tokens / logout (blacklist) if you need session revocation.
- Add role-specific dashboards' data routes under `src/routes/` (e.g. `admin.js`, `teacher.js`, `student.js`), guarded with `requireRole(...)`.

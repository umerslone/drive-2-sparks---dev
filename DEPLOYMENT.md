# Sentinel SaaS Deployment Guide (Heroku + Neon)

This document outlines the architecture, environment configurations, and deployment procedures for the Sentinel SaaS platform. We have transitioned from GitHub Spark to a single-app Heroku deployment strategy with a multi-branch Neon PostgreSQL architecture.

## Architecture Overview

- **Frontend:** React + Vite SPA, compiled into static assets (`dist/`).
- **Backend:** Node.js HTTP server (`backend/server.mjs`) acting as:
  - API and Authentication server (JWT, rate limiting, RBAC).
  - Database proxy.
  - LLM API gateway.
  - **Static File Server:** Serves the compiled `dist/` frontend with an SPA fallback (`index.html`) in production.
- **Database:** Serverless Postgres via Neon (Dev, Staging, Prod branches).

## Environment Variables Matrix

| Variable | Local / Spark (Dev) | Staging (Heroku) | Production (Heroku) | Description |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | `development` | `production` | `production` | Enables secure cookies and optimizations. |
| `NEON_DATABASE_URL` | Neon `Dev` Branch URL | Neon `Staging` Branch URL | Neon `Prod` Branch URL | Database connection string. |
| `JWT_SECRET` | Local secret | Secure random string | Secure random string | Signs Sentinel auth tokens. |
| `BACKEND_SENTINEL_AUTH` | `true` | `true` | `true` | Enables the full SaaS authentication flow. |
| `BACKEND_REQUIRE_AUTH` | `false` (usually) | `true` | `true` | Disallows unauthenticated proxy routes. |
| `GEMINI_API_KEY` | Dev key | Staging key | Prod key | For LLM provider fallback/routing. |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | `https://staging-app.com` | `https://app.com` | Allowed domains. |
| `VITE_BACKEND_API_BASE_URL` | `http://localhost:8787` | (Empty) | (Empty) | Empty in Heroku to trigger relative same-origin API requests. |

## Deployment Checklists

### First-Time Deploy (Heroku)

1. **Create the Heroku App:**
   ```bash
   heroku create sentinel-saas-prod
   ```
2. **Set Buildpacks:**
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```
3. **Configure Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set NEON_DATABASE_URL="postgresql://..."
   heroku config:set JWT_SECRET="<generate-secure-secret>"
   heroku config:set BACKEND_SENTINEL_AUTH=true
   heroku config:set BACKEND_REQUIRE_AUTH=true
   heroku config:set GEMINI_API_KEY="<api-key>"
   # Omit VITE_BACKEND_API_BASE_URL so the frontend makes relative calls
   ```
4. **Deploy:**
   ```bash
   git push heroku main
   ```
   *(Heroku will automatically run `npm install` (including devDependencies), execute `npm run build` via the `heroku-postbuild` script, prune devDependencies, and start the app via the `Procfile` command `web: npm run start`.)*

### Rollback Procedure

If a critical failure occurs in production:

1. **Identify previous stable release:**
   ```bash
   heroku releases
   ```
2. **Rollback to known good release:**
   ```bash
   heroku rollback v[XX]
   ```
3. **Database (Neon) Rollback (If data corruption occurred):**
   - Access the Neon Console.
   - Navigate to the `Prod` branch.
   - Use the "Restore to point in time" feature to rollback the database state to right before the failed deployment.

## Local Development (Single-App Verification)

To test the production build locally:

1. `npm run build`
2. Ensure `.env.local` lacks `VITE_BACKEND_API_BASE_URL` (or temporarily comment it out).
3. `npm run start` (Starts the backend on port 8787)
4. Navigate to `http://localhost:8787` to confirm the static frontend serves correctly and the API routes work seamlessly.

# RegionLore — Production Deployment and Operations

**Status:** Current production architecture
**Initial production deployment:** October 2026

---

## 1. Purpose

This document explains how RegionLore is deployed in production, how the frontend, backend, and database communicate, and how common production operations are performed.

It documents infrastructure and procedures without storing passwords, API keys, JWT secrets, database credentials, or other sensitive values in the repository.

---

## 2. Production Architecture

RegionLore uses separate frontend, backend, and database infrastructure.

```text
Browser
   |
   v
https://regionlore.com
   |
   v
Amazon CloudFront
   |
   +--------------------> Amazon S3
   |                       React / Vite frontend
   |
   +---- /api/* --------> AWS Elastic Beanstalk
                           Node.js / Express API
                                |
                                +----> Amazon RDS PostgreSQL
                                |
                                +----> OpenAI
                                |
                                +----> OpenWeather
```

Production services:

```text
Frontend
  Amazon S3
  Bucket: popshift-frontend

CDN / public entry point
  Amazon CloudFront
  Domain: regionlore.com

Backend
  AWS Elastic Beanstalk
  Application: popshift-api
  Environment: Popshift-api-env
  Runtime: Node.js 22 / Amazon Linux 2023

Database
  Amazon RDS for PostgreSQL
  Instance: regionlore-prod
  Database: regionlore
  Port: 5432
```

The repository retains the historical `popshift` name even though the application is branded as RegionLore.

---

## 3. Frontend Deployment

The frontend is a React application built with Vite.

Build production assets from `client/`:

```bash
npm run build
```

Vite writes the production application to:

```text
client/dist/
```

Upload the contents of `client/dist/` to the root of the `popshift-frontend` S3 bucket.

After replacing the frontend files, create a CloudFront invalidation for:

```text
/*
```

Wait for the invalidation to reach `Completed` before validating the deployed frontend.

The existing Vite large-chunk warning is currently a non-blocking performance optimization concern. It does not indicate a failed build.

---

## 4. Frontend Production Environment

The local production frontend configuration is stored in:

```text
client/.env.production
```

This file is git-ignored and must not be committed.

The production API origin is:

```text
VITE_API_URL=https://regionlore.com
```

The value is baked into the frontend during the Vite production build, so changing the file requires rebuilding and redeploying the frontend.

### Why the API uses the RegionLore domain

RegionLore admin authentication uses an HTTP-only JWT cookie.

The application is served from:

```text
https://regionlore.com
```

API requests should therefore also use:

```text
https://regionlore.com/api/...
```

During the initial production deployment, the frontend instead used the raw CloudFront distribution hostname as `VITE_API_URL`.

Login itself succeeded:

```text
POST /api/admin/auth/login -> 200
```

but the following authenticated request failed:

```text
GET /api/admin/auth/me -> 401
```

The authentication cookie was not being reused correctly across the different browser origins.

Changing `VITE_API_URL` to `https://regionlore.com`, rebuilding the frontend, redeploying it to S3, and invalidating CloudFront resolved the issue.

---

## 5. Backend Deployment

The backend is a Node.js / Express application deployed through AWS Elastic Beanstalk.

```text
Application: popshift-api
Environment: Popshift-api-env
```

The backend provides the RegionLore `/api` surface, including:

- city data;
- state data;
- metro data;
- search;
- articles;
- admin authentication and article administration;
- structured comparison;
- AI-assisted comparison;
- current weather.

CloudFront routes `/api/*` requests to the Elastic Beanstalk backend.

---

## 6. Backend Production Environment Variables

Production backend configuration is stored in the Elastic Beanstalk environment.

Current variable names include:

```text
NODE_ENV
DATABASE_URL
CLIENT_URL
JWT_SECRET
OPENAI_API_KEY
OPENWEATHER_API_KEY
CENSUS_API_KEY
```

Expected non-secret values include:

```text
NODE_ENV=production
CLIENT_URL=https://regionlore.com
```

Actual credentials and secrets must not be committed to Git or copied into repository documentation.

A local production operations file may also exist at:

```text
server/.env.production
```

This file is git-ignored.

It is useful when intentionally running production-targeted maintenance scripts from an authorized local machine.

### dotenv behavior

The server uses `dotenv/config`.

Plain dotenv does not automatically load `.env.production` merely because:

```text
NODE_ENV=production
```

When a local command must use the production environment file, select it explicitly:

```bash
DOTENV_CONFIG_PATH=.env.production node ...
```

---

## 7. Production PostgreSQL

Production data is stored in Amazon RDS PostgreSQL.

```text
RDS instance: regionlore-prod
Database: regionlore
Port: 5432
```

RDS should normally remain:

```text
Not publicly accessible
```

The Elastic Beanstalk application reaches RDS privately inside AWS.

The RDS security group permits PostgreSQL traffic from the Elastic Beanstalk EC2 security group.

PostgreSQL must never be opened to:

```text
0.0.0.0/0
```

---

## 8. Production Database TLS

Production PostgreSQL connections use verified TLS.

The AWS RDS CA bundle is stored at:

```text
server/src/config/certs/rds-global-bundle.pem
```

The database configuration enables SSL when:

```text
NODE_ENV=production
```

and verifies the RDS certificate rather than disabling certificate validation.

Local development does not require that production SSL configuration.

---

## 9. Database Migrations

Schema migrations live in:

```text
server/migrations/
```

The V2 production schema includes migrations for:

```text
places
geography extension tables
place relationships
data provenance
population history
city profile metrics
climate monthly data
weather cache
crime statistics
articles and tags
users
AI comparison cache
```

Migrations should be run deliberately.

Completed production migrations should not be rerun merely as a troubleshooting step.

---

## 10. Production Data Initialization

The initial V2 production database was populated through the RegionLore seed pipelines.

The production load included:

```text
Geography identities
Data sources
Data releases
Population history
City ACS profiles
City climate normals
City crime data / coverage
```

Initial V2 scale:

```text
500 supported cities
3,000 population-history rows
499 ACS city profiles
1,996 ACS domain metric rows
6,000 monthly climate rows
500 city crime coverage/statistic rows
```

Missing data is preserved explicitly rather than replaced with invented values or inappropriate substitute geographies.

---

## 11. Admin Authentication

RegionLore includes a private administration system for the editorial workflow.

Admin frontend routes include:

```text
/admin/login
/admin/articles
/admin/articles/new
/admin/articles/:id/edit
```

Authentication flow:

```text
email + password
      |
      v
POST /api/admin/auth/login
      |
      v
PostgreSQL users table
      |
      v
bcrypt password verification
      |
      v
JWT
      |
      v
HTTP-only admin_token cookie
      |
      v
protected admin routes
```

The V2 administration system assumes a single administrator.

It does not include:

```text
public registration
public user profiles
OAuth
password recovery
```

---

## 12. Creating an Admin User

The administration bootstrap script is:

```text
server/src/scripts/createAdminUser.js
```

Run it from `server/` against the intended environment:

```bash
DOTENV_CONFIG_PATH=.env.production node src/scripts/createAdminUser.js
```

The script asks interactively for:

```text
Email
Password
```

The password is hidden while typing and is hashed with bcrypt before being stored.

The plaintext admin password should be saved in a normal password manager, not in `.env.production`.

Before running any production maintenance script, verify the target database without printing credentials.

For example:

```bash
DOTENV_CONFIG_PATH=.env.production node --input-type=module -e 'import "dotenv/config"; const u = new URL(process.env.DATABASE_URL); console.log("NODE_ENV:", process.env.NODE_ENV); console.log("CLIENT_URL:", process.env.CLIENT_URL); console.log("Host:", u.hostname); console.log("Port:", u.port || "5432"); console.log("Database:", u.pathname.slice(1));'
```

---

## 13. Changing an Admin Password

The existing password-change script is:

```text
server/src/scripts/changeAdminPassword.js
```

Use the script rather than manually constructing or editing bcrypt password hashes.

Do not place plaintext admin passwords in Git, source files, or repository documentation.

---

## 14. Temporary Local RDS Access

RDS should normally remain private.

During initial production bootstrap, direct local database access was temporarily required for production initialization and admin creation.

The controlled procedure is:

```text
1. Temporarily change RDS to Publicly accessible.
2. Add one PostgreSQL 5432 inbound rule for the administrator current public /32 IP.
3. Perform the required maintenance operation.
4. Remove the temporary /32 inbound rule.
5. Change RDS back to Not publicly accessible.
```

Only the specific administrator IP should be allowed during the temporary window.

Never expose PostgreSQL to:

```text
0.0.0.0/0
```

This is a temporary maintenance procedure rather than the desired permanent operational model.

A later infrastructure improvement should provide a private maintenance-command path without temporarily making RDS public.

---

## 15. AI-Assisted Comparison

RegionLore V2 uses:

```text
OpenAI gpt-5.6-luna
```

The production AI endpoint is:

```text
POST /api/comparisons/ai
```

The backend flow is:

```text
request
-> validation
-> structured RegionLore comparison
-> compact AI context
-> data fingerprint and cache key
-> PostgreSQL cache lookup
-> OpenAI generation on cache miss
-> response validation
-> successful response cache
-> frontend
```

The AI layer does not own the underlying geographic facts.

RegionLore structured data remains the factual source.

Successful AI responses are cached in PostgreSQL.

AI failure does not prevent the structured comparison from being displayed.

---

## 16. Current Weather

Current city weather is requested through the RegionLore backend.

```text
Frontend
-> RegionLore weather endpoint
-> PostgreSQL weather cache
-> OpenWeather when the cache is missing or stale
```

The OpenWeather API key remains server-side.

Weather is cached for approximately 60 minutes and refreshed on demand.

RegionLore does not proactively refresh weather for every supported city.

---

## 17. Production Smoke Testing

After a meaningful production deployment, validate representative application flows.

Recommended checks:

```text
Home page
State directory and state profile
Metro directory and metro profile
City directory and city profile
City weather
Articles directory
Compare Places
AI-assisted comparison
Admin login
Admin article dashboard
```

For admin authentication, successful behavior is:

```text
POST /api/admin/auth/login -> 200
GET /api/admin/auth/me    -> 200
```

For Compare Places, verify both:

```text
structured RegionLore comparison
AI explanation
```

AI failure should not remove the structured comparison.

---

## 18. Deployment Principles

Production work should follow these rules:

1. Keep secrets out of Git.
2. Keep RDS private by default.
3. Restrict PostgreSQL access to known application infrastructure.
4. Use verified TLS for production database connections.
5. Run migrations deliberately.
6. Preserve missing data rather than inventing replacements.
7. Keep third-party API keys server-side.
8. Keep structured RegionLore functionality usable when optional providers fail.
9. Build the frontend before uploading it to S3.
10. Invalidate CloudFront after replacing frontend assets.
11. Smoke-test the live application after meaningful deployments.
12. Document non-obvious production lessons so they do not have to be rediscovered.

---

## 19. Future Operations Improvements

Potential later infrastructure improvements include:

- a permanent private production maintenance path;
- properly configured AWS Systems Manager access or another controlled task runner;
- separate development and production provider credentials where useful;
- environment templates containing variable names but no secrets;
- more formal deployment automation;
- CI/CD when the additional maintenance cost is justified.

These are future operational improvements, not requirements for the current production system.
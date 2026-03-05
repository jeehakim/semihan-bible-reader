# Scaling toward SaaS and mobile

## Database: PostgreSQL

The app uses **PostgreSQL** (e.g. Railway Postgres). The schema is created on startup (`CREATE TABLE IF NOT EXISTS ...`). This fits the org → teams → members → schedules model, supports multi-tenancy, and is ready for future auth (e.g. Row-Level Security per org or user).

---

## Multi-tenancy (Organizations)

The app is **multi-tenant**: data is isolated by **Organization**. Each organization has its own teams; teams belong to exactly one org. The UI has an **Organizations** panel (search first, then join or create) and a **Team Management** panel; selecting an org shows only that org’s teams. Creating a team assigns it to the currently selected org. This layout is ready for adding logins and per-org or per-user access control later (e.g. “user can only see orgs they belong to”).

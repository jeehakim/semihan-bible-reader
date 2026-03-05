# Deploy to Railway

This app runs as a **single Docker container**: Node server serves the React SPA and the REST API, with SQLite for storage. Railway builds from the **Dockerfile**.

## Push to GitHub

From the project root, with `.gitignore` and `.dockerignore` in place:

```bash
git init
git add .
git commit -m "Initial commit: Semihan Bible Reader (Shofar scheduler)"
git remote add origin https://github.com/jeehakim/semihan-bible-reader.git
git branch -M main
git push -u origin main
```

Railway can then connect to this repo and deploy using the Dockerfile.

## One-time setup

1. **Create a Railway project** and connect your GitHub repo (or deploy from CLI).
2. **Add a Volume** (required for data persistence):
   - In the Railway dashboard, open your service → **Variables** → **Volumes**.
   - Add a volume and set the **mount path** to: `/data`
   - The app uses `DATABASE_DIR=/data` so the SQLite file is stored on this volume.
3. **Deploy**: Railway will build from the `Dockerfile` and run the container. No extra build command needed.

## Environment (optional)

| Variable         | Default | Description                                                                 |
|------------------|---------|-----------------------------------------------------------------------------|
| `PORT`           | 3000    | Set by Railway automatically                                                |
| `DATABASE_DIR`   | `/data` | Set in Dockerfile for Railway                                                |
| `NODE_ENV`       | -       | Set to `production` in production; hides internal error messages in API     |
| `ALLOWED_ORIGIN` | -       | Optional. Your app URL (e.g. `https://scheduler.shofar.ai`) to restrict CORS. If unset, all origins allowed. |

## Security (no-login app behind Cloudflare)

The app has **no login** and is intended to sit behind **Cloudflare** (TLS + DNS). Cloudflare provides TLS (HTTPS) and DDoS mitigation; you can add WAF and rate limiting in the dashboard.

The server adds: security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS in prod), 100KB JSON body limit, optional CORS via `ALLOWED_ORIGIN`, input validation (UUIDs, trimmed/length-limited names, bounded array sizes, schedule entry validation), and generic 500 error messages in production.

**Recommendation**: In Cloudflare set SSL/TLS to Full or Full (Strict) and consider rate limiting for `/api/*` if you want to cap abuse.

## Local development

- **Frontend only**: `npm run dev` (Vite). Point API at a running server (see below).
- **API only**: `cd server && npm install && node index.js` (runs on port 3000).
- **Full stack**: Run the server in one terminal (`npm run dev:server`), then run `npm run dev` in another. Vite proxies `/api` to the server.

## Run locally without Docker (see UI changes immediately)

Use this to test the latest code without Docker cache issues.

1. **First time**: install root and server deps:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```
2. **If port 3000 is in use**, either stop the process (e.g. `docker stop <container>`) or use port 3001 (see below).
3. **Build and start** (from project root):
   ```bash
   npm run build
   node server/index.js
   ```
   Or in one step: `npm run start:local`
   If 3000 is busy, run on 3001: `npm run start:local:3001` then open **http://localhost:3001**.
4. Open **http://localhost:3000** (or 3001 if you used the alternate script). The app serves the React build and API from the same process.

## Build and run locally with Docker

```bash
# Build (use --no-cache if the UI doesn’t update after code changes)
docker build -t shofar-scheduler .

# Run (stops/removes existing container if present)
docker rm -f shofar-scheduler-test 2>/dev/null
docker run -d --name shofar-scheduler-test -p 3000:3000 -v shofar-scheduler-data:/data shofar-scheduler
```

Open **http://localhost:3000**. Data is persisted in the `shofar-scheduler-data` volume. To rebuild from scratch: `docker build --no-cache -t shofar-scheduler .`

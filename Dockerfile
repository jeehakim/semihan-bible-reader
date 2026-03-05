# Build stage: frontend (React + Vite)
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage: single container with API + static files (Debian for better-sqlite3)
FROM node:20-slim
WORKDIR /app

# Build deps for better-sqlite3 native module
RUN apt-get update -y && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

# Server dependencies
COPY server/package.json server/package-lock.json* server/
RUN cd server && npm install --omit=dev

# Copy server code and built frontend
COPY server server
COPY --from=frontend /app/dist dist

# Data lives in DATABASE_DIR. Mount a volume at /data so it persists across redeploys.
ENV DATABASE_DIR=/data
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server/index.js"]

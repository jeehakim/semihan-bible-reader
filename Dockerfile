# Build stage: frontend (React + Vite)
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage: single container with API + static files (PostgreSQL via DATABASE_URL)
FROM node:20-alpine
WORKDIR /app

# Server dependencies (pg only; no native build)
COPY server/package.json server/package-lock.json* server/
RUN cd server && npm ci --omit=dev

# Copy server code and built frontend
COPY server server
COPY --from=frontend /app/dist dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server/index.js"]

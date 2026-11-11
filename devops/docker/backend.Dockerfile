# Backend Production Multi-stage Dockerfile
# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npm run build

# Stage 2: Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 4000

USER node

CMD ["node", "dist/server.js"]

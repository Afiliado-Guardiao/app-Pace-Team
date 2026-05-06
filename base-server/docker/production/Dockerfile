# syntax=docker/dockerfile:1.4

# Stage 1: Builder
FROM node:22-alpine AS builder

# Install build dependencies (openssl-dev only needed for build)
RUN apk add --no-cache openssl openssl-dev libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY tsup.config.ts ./
COPY prisma ./prisma/

# Install all dependencies with BuildKit cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline

# Copy source code
COPY src ./src

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript code
RUN NODE_ENV=production npm run build

# Stage 2: Production
FROM node:22-alpine

# Install only runtime dependencies + tini
RUN apk add --no-cache openssl libc6-compat wget netcat-openbsd tini

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3333
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
ENV PRISMA_CLIENT_ENGINE_TYPE=binary

# Copy package files
COPY package*.json ./

# Install only production dependencies with BuildKit cache mount
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production --prefer-offline && \
    npm cache clean --force

# Copy Prisma schema
COPY prisma ./prisma/

# Copy Prisma Client from builder (no need to regenerate)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333/health || exit 1

# Use tini as init process
ENTRYPOINT ["/sbin/tini", "--"]

# Run Node.js directly (not via npm)
CMD ["node", "dist/server.js"]

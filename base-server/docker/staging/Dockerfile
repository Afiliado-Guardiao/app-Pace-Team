FROM node:22-alpine

# Install only required runtime dependencies
RUN apk add --no-cache openssl libc6-compat netcat-openbsd

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies using npm ci (faster and deterministic)
RUN npm ci

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy application source code
COPY src ./src
COPY tsconfig.json ./

EXPOSE 4444

CMD ["npm", "run", "dev"]

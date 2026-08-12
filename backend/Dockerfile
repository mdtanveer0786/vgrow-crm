# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev for prisma generate)
RUN npm ci

# Generate prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/config ./config
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/services ./services
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/server.js ./

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]

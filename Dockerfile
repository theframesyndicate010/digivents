# Build stage
FROM node:20-alpine AS builder

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY backend ./

# Build Strapi with increased heap memory
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app/backend

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy from builder
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package*.json ./
COPY backend/config ./config
COPY backend/src ./src
COPY backend/public ./public
COPY backend/.env.example ./.env.example

# Set environment variables
ENV NODE_ENV=production

# Expose port (Railway dynamically assigns PORT)
EXPOSE 1337

# Health check (flexible for dynamic ports)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 1337), (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start Strapi in production mode
CMD ["npm", "run", "start"]

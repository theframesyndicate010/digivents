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

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S strapi -u 1001

# Copy package files and install production dependencies only
COPY backend/package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/backend/build ./build
COPY --from=builder /app/backend/node_modules ./node_modules

# Copy necessary files
COPY backend/config ./config
COPY backend/src ./src
COPY backend/public ./public
COPY backend/.env.example ./.env.example

# Change ownership to non-root user
RUN chown -R strapi:nodejs /app/backend

# Switch to non-root user
USER strapi

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Expose port (Railway dynamically assigns PORT)
EXPOSE 1337

# Health check - uses the PORT environment variable if available
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 1337) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)}).on('error', (e) => {throw e})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start Strapi in production mode
CMD ["npm", "run", "start"]

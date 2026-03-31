
# Backend - Node.js/Express Server (Production Ready)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install native build prerequisites for npm modules
RUN apk add --no-cache dumb-init python3 make g++

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files first for better layer caching
COPY backend/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy application code (after dependencies for better cache)
COPY backend ./

# Copy environment variables (if present)
COPY backend/.env ./


# Ensure uploads directory exists with subdirectories and is writable by nodejs user
RUN mkdir -p public/uploads/graphics && \
    mkdir -p public/uploads/videos && \
    mkdir -p public/uploads/images && \
    mkdir -p public/uploads/projects && \
    mkdir -p public/uploads/creators && \
    chown -R nodejs:nodejs public/uploads

# Switch to non-root user
USER nodejs

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Expose port
EXPOSE 3000


# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)}).on('error', (e) => {throw e})"

# Use dumb-init to handle signals properly and start the app
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]

# Multi-stage build untuk optimasi ukuran image
FROM node:22-alpine AS builder

# Install build dependencies untuk sharp dan native modules lainnya
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev \
    vips-tools \
    libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Set environment variables untuk sharp (build dari source jika download gagal)
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV npm_config_build_from_source=true

# Install dependencies (menggunakan npm install untuk kompatibilitas yang lebih baik)
RUN npm install --only=production && npm cache clean --force

# Production stage
FROM node:22-alpine AS production

# Install runtime dependencies untuk sharp (vips runtime library)
RUN apk add --no-cache vips

# Create app user untuk security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Create logs directory structure with proper permissions
RUN mkdir -p logs/listener logs/upload logs/email logs/queue logs/mail logs/image-ktp logs/pdf logs/excel && \
    chown -R nodejs:nodejs logs && \
    chmod -R 755 logs && \
    chmod -R 777 logs/*

# Create other necessary directories
RUN mkdir -p public/pdf public/excel storages/tmp && \
    chown -R nodejs:nodejs public storages && \
    chmod -R 755 public storages && \
    chmod -R 777 public/* storages/*

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 9509

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:9509/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start application
CMD ["node", "src/server.js"]
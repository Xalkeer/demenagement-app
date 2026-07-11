FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# -----------------
# 1. BUILD BACKEND
# -----------------
FROM base AS backend-builder
WORKDIR /app/backend
COPY ossif-backend/package.json ossif-backend/package-lock.json ./
RUN npm install
COPY ossif-backend ./
RUN npx prisma generate

# -----------------
# 2. BUILD FRONTEND
# -----------------
FROM base AS frontend-builder
WORKDIR /app/frontend
COPY react-sqlite-app/package.json react-sqlite-app/package-lock.json ./
RUN npm install
COPY react-sqlite-app ./
# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# -----------------
# 3. PRODUCTION
# -----------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Database volume
ENV DATABASE_URL="file:/data/sqlite.db"
RUN mkdir -p /data && chown -R node:node /data

# Copy Backend
COPY --from=backend-builder /app/backend /app/backend

# Copy Frontend (Standalone)
COPY --from=frontend-builder /app/frontend/.next/standalone /app/frontend
COPY --from=frontend-builder /app/frontend/.next/static /app/frontend/.next/static
COPY --from=frontend-builder /app/frontend/public /app/frontend/public

# Startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'cd /app/backend' >> /app/start.sh && \
    echo 'npx prisma db push' >> /app/start.sh && \
    echo 'npm run dev &' >> /app/start.sh && \
    echo 'cd /app/frontend' >> /app/start.sh && \
    echo 'node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Change ownership
RUN chown -R node:node /app
USER node

EXPOSE 3000
EXPOSE 4000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["/app/start.sh"]

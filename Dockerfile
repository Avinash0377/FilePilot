FROM node:20-bullseye-slim AS base

# 1. Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
# Install dependencies using npm install for robustness
COPY package.json package-lock.json* ./
RUN npm install

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install system dependencies including LibreOffice and Java
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-java-common \
    openjdk-17-jre-headless \
    ghostscript \
    graphicsmagick \
    ffmpeg \
    poppler-utils \
    fonts-liberation \
    fonts-dejavu-core \
    fonts-noto-core \
    procps \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME for LibreOffice
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Fix ImageMagick policy to allow PDF processing
RUN sed -i 's/<policy domain="coder" rights="none" pattern="PDF" \/>/<policy domain="coder" rights="read|write" pattern="PDF" \/>/g' /etc/ImageMagick-6/policy.xml || true

# Create temp directory for file processing
RUN mkdir -p /tmp/filepilot && chmod 777 /tmp/filepilot

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Manually copy @imgly to ensure binary assets (wasm/json) are present
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@imgly ./node_modules/@imgly

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Simple startup - no daemon complexity
CMD ["node", "server.js"]

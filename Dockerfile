FROM node:20-bullseye

# Install system dependencies for file conversion
RUN apt-get update && apt-get install -y \
    libreoffice \
    ghostscript \
    imagemagick \
    ffmpeg \
    tesseract-ocr \
    poppler-utils \
    zip \
    unzip \
    fonts-dejavu-core \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Fix ImageMagick policy to allow PDF processing
RUN sed -i 's/<policy domain="coder" rights="none" pattern="PDF" \/>/<policy domain="coder" rights="read|write" pattern="PDF" \/>/g' /etc/ImageMagick-6/policy.xml || true

# Create temp directory for file processing
RUN mkdir -p /tmp/filepilot && chmod 777 /tmp/filepilot

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Set environment variables
FROM node:20-bullseye

# Install system dependencies for file conversion
RUN apt-get update && apt-get install -y \
    libreoffice \
    ghostscript \
    imagemagick \
    ffmpeg \
    tesseract-ocr \
    poppler-utils \
    zip \
    unzip \
    fonts-dejavu-core \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Fix ImageMagick policy to allow PDF processing
RUN sed -i 's/<policy domain="coder" rights="none" pattern="PDF" \/>/<policy domain="coder" rights="read|write" pattern="PDF" \/>/g' /etc/ImageMagick-6/policy.xml || true

# Create temp directory for file processing
RUN mkdir -p /tmp/filepilot && chmod 777 /tmp/filepilot

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use standalone server
CMD ["node", ".next/standalone/server.js"]

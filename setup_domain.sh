#!/bin/bash
set -e

# Configuration
DOMAINS="filepilot.online filepilot.me"
EMAIL="sudhimallaavinash07@gmail.com" # Using email from README
APP_PORT=3000

echo "🚀 Starting Domain Configuration..."

# 1. Install Nginx & Certbot
echo "🔧 Installing Nginx and Certbot..."
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# 2. Configure Firewall
echo "🛡️ allowing HTTP/HTTPS..."
ufw allow 'Nginx Full'

# 3. Create Nginx Config
echo "📝 Generating Nginx Configuration..."

# We create a single server block for both domains
cat > /etc/nginx/sites-available/filepilot <<EOF
server {
    listen 80;
    server_name $DOMAINS;
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/filepilot /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and Reload
nginx -t
systemctl reload nginx

# 4. Setup SSL (HTTPS)
echo "🔒 Obtaining SSL Certificates..."
# We use --register-unsafely-without-email to avoid prompts if email is missing, but better to use one.
# We will use the non-interactive mode
certbot --nginx \
    --non-interactive \
    --agree-tos \
    --redirect \
    --email $EMAIL \
    -d filepilot.online -d filepilot.me

echo "✅ Success! Your domains are now configured with HTTPS."
echo "   - https://filepilot.online"
echo "   - https://filepilot.me"

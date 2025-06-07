
#!/bin/bash

# Complete installation script for Ubuntu Server LTS
# E-commerce application deployment with nginx

set -e

echo "🚀 Starting e-commerce application installation..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
echo "📦 Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx
echo "📦 Installing nginx..."
sudo apt install -y nginx

# Install git
echo "📦 Installing git..."
sudo apt install -y git

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/ecommerce
sudo chown -R $USER:$USER /var/www/ecommerce

# Clone your GitHub repository
echo "📥 Cloning application from GitHub..."
sudo rm -rf /var/www/ecommerce
git clone https://github.com/JeffMolenaar/shop-style-wordpress-ease.git /var/www/ecommerce
cd /var/www/ecommerce

# Install dependencies
echo "📦 Installing application dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Create PM2 ecosystem file
echo "⚙️  Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'ecommerce-app',
    script: 'npm',
    args: 'run preview',
    cwd: '/var/www/ecommerce',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure nginx
echo "⚙️  Configuring nginx..."
sudo tee /etc/nginx/sites-available/ecommerce << 'EOF'
server {
    listen 80;
    server_name _;  # Replace with your domain if needed
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Hide nginx version
    server_tokens off;
}
EOF

# Enable the site
echo "🔗 Enabling nginx site..."
sudo ln -sf /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

# Start and enable services
echo "🚀 Starting services..."
sudo systemctl enable nginx
sudo systemctl restart nginx

# Create update script for easy deployments
echo "🔄 Creating update script..."
cat > /var/www/ecommerce/update.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating application..."
cd /var/www/ecommerce
git pull origin main
npm install
npm run build
pm2 restart ecommerce-app
echo "✅ Update completed!"
EOF

chmod +x /var/www/ecommerce/update.sh

# Create a simple health check script
echo "📊 Creating health check script..."
cat > /var/www/ecommerce/health-check.sh << 'EOF'
#!/bin/bash
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is running"
    exit 0
else
    echo "❌ Application is down, restarting..."
    pm2 restart ecommerce-app
    exit 1
fi
EOF

chmod +x /var/www/ecommerce/health-check.sh

# Add health check to crontab
echo "⏰ Setting up health monitoring..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /var/www/ecommerce/health-check.sh") | crontab -

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw --force enable

# Create backup script
echo "💾 Creating backup script..."
cat > /var/www/ecommerce/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/ecommerce"
DATE=$(date +%Y%m%d_%H%M%S)

sudo mkdir -p $BACKUP_DIR

# Backup application files
sudo tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /var/www/ecommerce .

# Keep only last 7 backups
sudo find $BACKUP_DIR -name "app_*.tar.gz" -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/app_$DATE.tar.gz"
EOF

chmod +x /var/www/ecommerce/backup.sh

# Setup automatic backup (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/ecommerce/backup.sh") | crontab -

# Create log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/ecommerce << 'EOF'
/var/www/ecommerce/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Final status check
echo "🏁 Installation complete! Checking status..."
echo "📊 System Status:"
echo "- Node.js version: $(node --version)"
echo "- NPM version: $(npm --version)"
echo "- PM2 status:"
pm2 list
echo "- Nginx status:"
sudo systemctl status nginx --no-pager -l
echo "- Application URL: http://$(hostname -I | awk '{print $1}')"

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Quick Commands:"
echo "- Update app: /var/www/ecommerce/update.sh"
echo "- View app logs: pm2 logs ecommerce-app"
echo "- Restart app: pm2 restart ecommerce-app"
echo "- Stop app: pm2 stop ecommerce-app"
echo "- Nginx reload: sudo systemctl reload nginx"
echo "- Check health: /var/www/ecommerce/health-check.sh"
echo ""
echo "📁 Important paths:"
echo "- Application: /var/www/ecommerce"
echo "- Nginx config: /etc/nginx/sites-available/ecommerce"
echo "- Logs: pm2 logs or /var/log/nginx/"
echo ""
echo "⚠️  Don't forget to:"
echo "1. Update server_name in nginx config if using a domain"
echo "2. Configure your reverse proxy to point to this server"
echo "3. Set up SSL on your main nginx server"

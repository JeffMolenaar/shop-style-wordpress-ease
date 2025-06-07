
# Deployment Guide

This guide explains how to deploy the e-commerce application to an Ubuntu Server.

## Quick Start

1. **Clone and run the deployment script:**
   ```bash
   git clone https://github.com/JeffMolenaar/shop-style-wordpress-ease.git
   cd shop-style-wordpress-ease
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Alternative: Download and run directly:**
   ```bash
   wget https://raw.githubusercontent.com/JeffMolenaar/shop-style-wordpress-ease/main/deploy.sh
   chmod +x deploy.sh
   ./deploy.sh
   ```

## What the deployment script does

- ✅ Updates system packages
- ✅ Installs Node.js 20 LTS
- ✅ Installs nginx as reverse proxy
- ✅ Installs PM2 for process management
- ✅ Clones the application from GitHub
- ✅ Builds the production application
- ✅ Configures nginx with security headers and caching
- ✅ Sets up automatic health monitoring
- ✅ Configures daily backups
- ✅ Sets up log rotation
- ✅ Configures firewall (ports 22, 80)

## Post-deployment

After running the deployment script, your application will be available at:
- **Local:** http://localhost
- **Network:** http://YOUR_SERVER_IP

## Management Commands

### Application Management
```bash
# Update application
/var/www/ecommerce/update.sh

# View logs
pm2 logs ecommerce-app

# Restart application
pm2 restart ecommerce-app

# Stop application
pm2 stop ecommerce-app

# Check application health
/var/www/ecommerce/health-check.sh
```

### Server Management
```bash
# Reload nginx configuration
sudo systemctl reload nginx

# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### SSH Session Disconnects
If your SSH session disconnects during installation, use `screen`:

```bash
# Install screen
sudo apt install screen -y

# Start screen session
screen -S deploy

# Run deployment script
./deploy.sh

# If disconnected, reconnect with:
screen -r deploy
```

### PM2 Startup Issues
If PM2 startup fails, run manually after installation:

```bash
pm2 startup
# Follow the instructions provided by PM2
pm2 save
```

## SSL Configuration

To add SSL, update the nginx configuration in `/etc/nginx/sites-available/ecommerce`:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # ... rest of configuration
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## Important Paths

- **Application:** `/var/www/ecommerce`
- **Nginx config:** `/etc/nginx/sites-available/ecommerce`
- **PM2 logs:** `pm2 logs` or `/home/user/.pm2/logs/`
- **Nginx logs:** `/var/log/nginx/`
- **Backups:** `/var/backups/ecommerce`

## Security Notes

- The script configures a basic firewall (UFW)
- Nginx is configured with security headers
- Application runs as non-root user
- Regular security updates should be applied manually

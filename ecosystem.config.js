
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

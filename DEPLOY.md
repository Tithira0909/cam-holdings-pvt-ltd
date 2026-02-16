# Deployment Guide

This guide details how to deploy the Cam Holdings application on a Digital Ocean Droplet (Ubuntu 22.04/24.04).

## Prerequisites

1.  **Digital Ocean Droplet**: Create a Droplet with at least 1GB RAM (2GB recommended for build process).
2.  **SSH Access**: Ensure you can SSH into the server.
3.  **Domain Name**: Point your domain's A record to the Droplet's IP address.

## Initial Server Setup

SSH into your server:
```bash
ssh root@your_server_ip
```

Update packages and install dependencies:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx unzip build-essential
```

Install Node.js (v18+):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Install PM2 globally:
```bash
sudo npm install -g pm2
```

## Deployment Steps

1.  **Clone the Repository**:
    ```bash
    # Replace with your repository URL
    git clone https://github.com/your-username/your-repo.git /var/www/cam-holdings
    cd /var/www/cam-holdings
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a new `.env` file:
    ```bash
    nano .env
    ```
    Add the following configuration (adjust as needed):
    ```env
    PORT=3001
    DB_CLIENT=sqlite
    DB_FILE=./database/database.sqlite

    # Email Configuration
    SMTP_HOST=smtp.ethereal.email
    SMTP_PORT=587
    SMTP_USER=test@ethereal.email
    SMTP_PASS=testpass
    FROM_EMAIL=info@camholdings.lk

    # Frontend API Keys (Required for build)
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Build the Frontend**:
    ```bash
    npm run build
    ```

5.  **Database Migration**:
    ```bash
    npm run migrate
    ```

6.  **Start the Backend**:
    Use PM2 to start the server using the configuration file:
    ```bash
    pm2 start ecosystem.config.cjs
    pm2 save
    pm2 startup
    ```

## Nginx Configuration

Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/cam-holdings
```

Paste the following configuration (replace `your_domain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    root /var/www/cam-holdings/dist;
    index index.html;

    # Serve Frontend (SPA Support)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/cam-holdings /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default if strictly replacing
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Configuration (HTTPS)

Install Certbot and obtain an SSL certificate:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
```

Your site should now be live and secure!

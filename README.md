# Piexed AI

Piexed AI is a large language model AI designed for various applications. This repository contains the source code and installation instructions for setting up Piexed AI 
Developed by - Piexed Inc Team & Developer 
Version - 9.2.2

## Table of Contents

- [System Requirements](#system-requirements)
- [Installation Methods](#installation-methods)
  - [VPS/Dedicated Server Installation](#vpsdedicated-server-installation)
  - [AWS Cloud Installation](#aws-cloud-installation)
  - [Alibaba Cloud Installation](#alibaba-cloud-installation)
  - [Manual Installation](#manual-installation)
- [Post-Installation Steps](#post-installation-steps)
- [Troubleshooting](#troubleshooting)
- [Features](#features)
- [Getting Help](#getting-help)

## System Requirements

### Minimum Requirements

- VPS or Dedicated Server
- 1GB RAM (2GB+ recommended for production)
- 10GB storage space
- Node.js 18.0 or higher
- PostgreSQL 13.0 or higher
- Nginx or Apache web server

### Recommended Cloud Providers

- Amazon Web Services (EC2)
- Alibaba Cloud (ECS)
- Piexed VPS & Dedicated server
  
## Installation Methods

### VPS/Dedicated Server Installation

1. Connect to your server via SSH
2. Download the installer script:
    ```sh
    wget https://github.com/developerbrother123/piexedai/blob/main/piexed-ai/install.sh
    ```
3. Make the script executable:
    ```sh
    chmod +x install.sh
    ```
4. Run the installer:
    ```sh
    sudo ./install.sh
    ```
5. Follow the on-screen instructions to complete the installation

### AWS Cloud Installation

1. Connect to your EC2 instance via SSH
2. Download the AWS installer script:
    ```sh
    wget https://github.com/developerbrother123/piexedai/blob/main/piexed-ai/cloud/aws-install.sh
    ```
3. Make the script executable:
    ```sh
    chmod +x aws-install.sh
    ```
4. Run the installer:
    ```sh
    sudo ./aws-install.sh
    ```
5. Follow the on-screen instructions to complete the installation

### Alibaba Cloud Installation

1. Connect to your ECS instance via SSH
2. Download the Alibaba Cloud installer script:
    ```sh
    wget https://github.com/developerbrother123/piexedai/blob/main/piexed-ai/cloud/alibaba-install.sh
    ```
3. Make the script executable:
    ```sh
    chmod +x alibaba-install.sh
    ```
4. Run the installer:
    ```sh
    sudo ./alibaba-install.sh
    ```
5. Follow the on-screen instructions to complete the installation

### Piexed VPS & KVM1,2,3,4,5,6,7 & Dedicated server Cloud Installation

1. Connect to your Piexed instance via SSH
2. Download the Piexed Cloud installer script:
    ```sh
    wget https://github.com/developerbrother123/piexedai/install.sh
    ```
3. Make the script executable:
    ```sh
    chmod +x install.sh
    ```
4. Run the installer:
    ```sh
    sudo ./install.sh
    ```
5. Follow the on-screen instructions to complete the installation

### Manual Installation

For advanced users who prefer to install Piexed AI manually:

1. Install Node.js 18 or higher:
    ```sh
    # For Debian/Ubuntu
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    # For CentOS/RHEL
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
    ```
2. Install PostgreSQL:
    ```sh
    # For Debian/Ubuntu
    sudo apt-get install -y postgresql postgresql-contrib
    
    # For CentOS/RHEL
    sudo yum install -y postgresql-server postgresql-contrib
    sudo postgresql-setup initdb
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    ```
3. Create PostgreSQL user and database:
    ```sh
    sudo -u postgres psql -c "CREATE USER piexed_user WITH PASSWORD 'your_password';"
    sudo -u postgres psql -c "CREATE DATABASE piexed_ai;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE piexed_ai TO piexed_user;"
    sudo -u postgres psql -c "ALTER USER piexed_user WITH SUPERUSER;"
    ```
4. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/piexed-ai.git
    cd piexed-ai
    ```
5. Install dependencies:
    ```sh
    npm install
    ```
6. Create a `.env` file with your configuration:
    ```env
    DB_TYPE=postgresql
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=piexed_user
    DB_PASSWORD=your_password
    DB_NAME=piexed_ai
    
    NEXT_PUBLIC_APP_URL=https://your-domain.com
    NEXT_PUBLIC_API_URL=https://your-domain.com/api
    
    JWT_SECRET=your_random_secret
    
    TOGETHER_API_KEY=your_together_api_key
    
    CRYPTO_API_KEY=your_crypto_api_key
    CRYPTO_SUPPORTED_CURRENCIES=BTC,ETH,USDT,USDC
    ```
7. Build the application:
    ```sh
    npm run build
    ```
8. Start the application:
    ```sh
    npm start
    ```
9. Set up Nginx as a reverse proxy:
    ```sh
    sudo nano /etc/nginx/sites-available/piexed-ai
    ```
    Add the following configuration:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
10. Enable the site and restart Nginx:
    ```sh
    sudo ln -s /etc/nginx/sites-available/piexed-ai /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

## Post-Installation Steps

After installing Piexed AI, you should:

1. Log in to the admin dashboard at `https://your-domain.com/admin`
2. Defsult login is admin,admin user and pass
3. Configure your AI models:
    - Add your Together AI API key
    - Configure model parameters
    - Enable/disable specific models
4. Set up subscription plans:
    - Define pricing tiers
    - Configure usage limits
    - Set model access permissions
5. Configure payment gateways:
    - Set up crypto payment options
    - Configure other payment methods
6. Customize your landing page:
    - Update site name and description
    - Modify hero section content
    - Add custom features and testimonials
7. Configure storage options:
    - Set up local or cloud storage
    - Configure storage quotas
8. Set up SSL with Let's Encrypt:
    ```sh
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

## Troubleshooting

### Common Issues

| Issue                       | Solution                                                                                   |
|-----------------------------|--------------------------------------------------------------------------------------------|
| Database connection error   | - Verify database credentials in .env file <br> - Ensure PostgreSQL is running: `sudo systemctl status postgresql` <br> - Check if the database exists: `sudo -u postgres psql -c "\l"` <br> - Verify PostgreSQL is listening on the correct port: `sudo netstat -tuln | grep 5432` |
| Node.js application won't start | - Check Node.js version: `node -v` (should be 18.0+) <br> - Verify all dependencies are installed: `npm install` <br> - Check for errors in the logs: `pm2 logs` <br> - Ensure the correct environment variables are set in .env file |
| Nginx configuration errors  | - Test Nginx configuration: `sudo nginx -t` <br> - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log` <br> - Verify Nginx is running: `sudo systemctl status nginx` <br> - Ensure the correct domain is configured in the Nginx server block |
| Memory issues on 1GB RAM servers | - Optimize Node.js memory usage: `NODE_OPTIONS="--max-old-space-size=512"` <br> - Configure swap space: <br> ```sh sudo fallocate -l 2G /swapfile sudo chmod 600 /swapfile sudo mkswap /swapfile sudo swapon /swapfile echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab ``` <br> - Reduce PostgreSQL memory usage by editing `postgresql.conf`: <br> ```sh shared_buffers = 128MB work_mem = 4MB maintenance_work_mem = 32MB ``` |

## Features

- Easy installation on VPS, dedicated servers, and cloud environments
- Support for major cloud providers (AWS,Piexed,Alibaba Cloud, Google Cloud, Microsoft Azure, DigitalOcean, Linode, Vultr)
- Comprehensive documentation and support
- Configurable AI models with API key integration and withown Opensource AI Pretrained model
- Subscription plans and payment gateway configuration stripe and nowpayment.io
- Customizable landing page and storage options
- SSL setup with Let's Encrypt
- Optimized for performance on servers with limited resources
-selflearning capabilites

## Whole Project Feature Admin and User 
# Application Features

## User Panel Features

### Chat Interface
- Real-time chat functionality with AI
- Voice command integration Like the Gemini
- Message history and conversation management

### Video Editor
- Video editing capabilities
- Custom video processing tools
- Export and save edited videos

### APK Builder
- Android application package building
- Custom APK configuration options
- Build and deployment tools

### User Storage
- Personal file storage management
- Storage quota monitoring
- File upload and download capabilities

## Admin Panel Features

### Dashboard
- System overview and analytics
- Performance metrics
- Real-time monitoring

### User Management
- User account administration
- User limits configuration
- Access control management

### API Keys Management
- API key generation and management
- Access token administration
- API usage monitoring

### Model Management
#### Local Models
- Local AI model administration
- Model deployment and configuration
- Performance optimization

#### Model Selection
- AI model selection interface
- Model compatibility checking
- Version management

#### Model Training
- Custom model training capabilities
- Training data management
- Model performance tracking

### Storage Management
- System-wide storage administration
- Storage allocation
- Backup and recovery options

### Caching System
- Cache management
- Performance optimization
- Cache clearing and maintenance

### Installation Management
- System installation tools
- Configuration management
- Update and maintenance utilities

## Global Features

### Theme Support
- Light/dark mode switching
- Custom theme configuration
- UI customization options

### Mobile Responsiveness
- Adaptive mobile interface
- Touch-friendly controls
- Cross-device compatibility

### Security Features
- Authentication system
- Authorization controls
- Data encryption

### System Integration
- Cloud platform support (AWS, Alibaba)
- Database integration
- API endpoints for external services
## Getting Help

For the Commercial use please see the license 
If you encounter issues not covered in this guide:

- Check the [documentation](public/docs-installation.html)
- Visit our [GitHub issues](https://github.com/your-repo/piexed-ai/issues) page
- Contact support at [email developer brother](mailto:transfernowat@gmail.com)
- - Check the [Commercial Use License](public/license/license.txt)

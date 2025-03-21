#!/bin/bash

# Piexed AI Installer Script for VPS and Cloud Environments
# This script installs Piexed AI on VPS, dedicated servers, and cloud computing platforms

# Text colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "██████╗ ██╗███████╗██╗  ██╗███████╗██████╗      █████╗ ██╗"
echo "██╔══██╗██║██╔════╝╚██╗██╔╝██╔════╝██╔══██╗    ██╔══██╗██║"
echo "██████╔╝██║█████╗   ╚███╔╝ █████╗  ██║  ██║    ███████║██║"
echo "██╔═══╝ ██║██╔══╝   ██╔██╗ ██╔══╝  ██║  ██║    ██╔══██║██║"
echo "██║     ██║███████╗██╔╝ ██╗███████╗██████╔╝    ██║  ██║██║"
echo "╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝     ╚═╝  ╚═╝╚═╝"
echo -e "${NC}"
echo -e "${GREEN}VPS & Cloud Installer${NC}"
echo -e "Self-Evolving Generative AI Platform\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root or with sudo privileges${NC}"
  exit 1
fi

# Function to check system requirements
check_requirements() {
  echo -e "${BLUE}Checking system requirements...${NC}"
  
  # Check CPU cores
  CPU_CORES=$(nproc)
  echo -e "CPU Cores: ${GREEN}$CPU_CORES${NC}"
  
  # Check RAM
  TOTAL_RAM=$(free -m | awk '/^Mem:/{print $2}')
  echo -e "Total RAM: ${GREEN}$TOTAL_RAM MB${NC}"
  
  if [ "$TOTAL_RAM" -lt 1024 ]; then
    echo -e "${YELLOW}Warning: Less than 1GB RAM detected. Minimum recommended is 1GB.${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
  
  # Check disk space
  DISK_SPACE=$(df -h / | awk 'NR==2 {print $4}')
  echo -e "Available Disk Space: ${GREEN}$DISK_SPACE${NC}"
  
  # Check if Node.js is installed
  if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Installing...${NC}"
    install_nodejs
  else
    NODE_VERSION=$(node -v)
    echo -e "Node.js Version: ${GREEN}$NODE_VERSION${NC}"
    
    # Check Node.js version
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1 | tr -d 'v')
    if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
      echo -e "${RED}Node.js version must be 18.0 or higher. Please upgrade Node.js.${NC}"
      exit 1
    fi
  fi
  
  # Check if PostgreSQL is installed
  if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL is not installed. Installing...${NC}"
    install_postgresql
  else
    PSQL_VERSION=$(psql --version | awk '{print $3}')
    echo -e "PostgreSQL Version: ${GREEN}$PSQL_VERSION${NC}"
  fi
  
  # Check if Git is installed
  if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Installing...${NC}"
    install_git
  else
    GIT_VERSION=$(git --version | awk '{print $3}')
    echo -e "Git Version: ${GREEN}$GIT_VERSION${NC}"
  fi
  
  echo -e "${GREEN}System requirements check completed.${NC}\n"
}

# Function to install Node.js
install_nodejs() {
  echo -e "${BLUE}Installing Node.js...${NC}"
  
  # Detect OS
  if [ -f /etc/debian_version ]; then
    # Debian/Ubuntu
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
  elif [ -f /etc/redhat-release ]; then
    # CentOS/RHEL
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs
  else
    echo -e "${RED}Unsupported OS. Please install Node.js manually.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Node.js installed successfully.${NC}"
}

# Function to install PostgreSQL
install_postgresql() {
  echo -e "${BLUE}Installing PostgreSQL...${NC}"
  
  # Detect OS
  if [ -f /etc/debian_version ]; then
    # Debian/Ubuntu
    apt-get update
    apt-get install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
  elif [ -f /etc/redhat-release ]; then
    # CentOS/RHEL
    yum install -y postgresql-server postgresql-contrib
    postgresql-setup initdb
    systemctl enable postgresql
    systemctl start postgresql
  else
    echo -e "${RED}Unsupported OS. Please install PostgreSQL manually.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}PostgreSQL installed successfully.${NC}"
}

# Function to install Git
install_git() {
  echo -e "${BLUE}Installing Git...${NC}"
  
  # Detect OS
  if [ -f /etc/debian_version ]; then
    # Debian/Ubuntu
    apt-get update
    apt-get install -y git
  elif [ -f /etc/redhat-release ]; then
    # CentOS/RHEL
    yum install -y git
  else
    echo -e "${RED}Unsupported OS. Please install Git manually.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}Git installed successfully.${NC}"
}

# Function to configure PostgreSQL
configure_postgresql() {
  echo -e "${BLUE}Configuring PostgreSQL...${NC}"
  
  # Create PostgreSQL user and database
  echo -e "Creating PostgreSQL user and database..."
  
  # Generate random password
  DB_PASSWORD=$(openssl rand -base64 12)
  
  # Create user and database
  sudo -u postgres psql -c "CREATE USER piexed_user WITH PASSWORD '$DB_PASSWORD';"
  sudo -u postgres psql -c "CREATE DATABASE piexed_ai;"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE piexed_ai TO piexed_user;"
  sudo -u postgres psql -c "ALTER USER piexed_user WITH SUPERUSER;"
  
  echo -e "${GREEN}PostgreSQL configured successfully.${NC}"
  echo -e "Database: ${YELLOW}piexed_ai${NC}"
  echo -e "Username: ${YELLOW}piexed_user${NC}"
  echo -e "Password: ${YELLOW}$DB_PASSWORD${NC}"
  echo -e "Please save these credentials for the next steps.\n"
  
  # Save credentials to a file
  echo "DB_TYPE=postgresql" > db_credentials.txt
  echo "DB_HOST=localhost" >> db_credentials.txt
  echo "DB_PORT=5432" >> db_credentials.txt
  echo "DB_USER=piexed_user" >> db_credentials.txt
  echo "DB_PASSWORD=$DB_PASSWORD" >> db_credentials.txt
  echo "DB_NAME=piexed_ai" >> db_credentials.txt
  
  echo -e "Credentials saved to ${YELLOW}db_credentials.txt${NC}\n"
}

# Function to clone and setup Piexed AI
setup_piexed_ai() {
  echo -e "${BLUE}Setting up Piexed AI...${NC}"
  
  # Ask for installation directory
  read -p "Enter installation directory (default: /var/www/piexed-ai): " INSTALL_DIR
  INSTALL_DIR=${INSTALL_DIR:-/var/www/piexed-ai}
  
  # Create directory if it doesn't exist
  mkdir -p $INSTALL_DIR
  
  # Clone repository or copy files
  echo -e "Downloading Piexed AI..."
  
  # For now, we'll just create the directory structure
  # In a real scenario, you would clone from a repository
  mkdir -p $INSTALL_DIR/app
  mkdir -p $INSTALL_DIR/components
  mkdir -p $INSTALL_DIR/lib
  mkdir -p $INSTALL_DIR/public
  
  # Copy files from current directory if this is the installation package
  if [ -d "./app" ] && [ -d "./components" ]; then
    cp -r ./* $INSTALL_DIR/
    echo -e "${GREEN}Files copied to $INSTALL_DIR${NC}"
  else
    echo -e "${RED}Installation files not found. Please download the Piexed AI package first.${NC}"
    exit 1
  fi
  
  # Set permissions
  chown -R $(whoami):$(whoami) $INSTALL_DIR
  chmod -R 755 $INSTALL_DIR
  
  echo -e "${GREEN}Piexed AI setup completed.${NC}\n"
}

# Function to configure environment
configure_environment() {
  echo -e "${BLUE}Configuring environment...${NC}"
  
  # Load database credentials
  source db_credentials.txt
  
  # Ask for site URL
  read -p "Enter your site URL (e.g., https://example.com): " SITE_URL
  
  # Generate JWT secret
  JWT_SECRET=$(openssl rand -base64 32)
  
  # Create .env file
  cat > $INSTALL_DIR/.env << EOF
# Database Configuration
DB_TYPE=$DB_TYPE
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME

# Application Configuration
NEXT_PUBLIC_APP_URL=$SITE_URL
NEXT_PUBLIC_API_URL=$SITE_URL/api

# JWT Secret
JWT_SECRET=$JWT_SECRET

# Together AI API Key (to be filled by admin)
TOGETHER_API_KEY=

# Crypto Payment API Key (to be filled by admin)
CRYPTO_API_KEY=
CRYPTO_SUPPORTED_CURRENCIES=BTC,ETH,USDT,USDC
EOF

  echo -e "${GREEN}Environment configured successfully.${NC}\n"
}

# Function to install dependencies and build
build_application() {
  echo -e "${BLUE}Building application...${NC}"
  
  # Navigate to installation directory
  cd $INSTALL_DIR
  
  # Install dependencies
  echo -e "Installing dependencies..."
  npm install
  
  # Build application
  echo -e "Building application..."
  npm run build
  
  echo -e "${GREEN}Application built successfully.${NC}\n"
}

# Function to setup process manager (PM2)
setup_process_manager() {
  echo -e "${BLUE}Setting up process manager (PM2)...${NC}"
  
  # Install PM2 globally
  npm install -g pm2
  
  # Create PM2 ecosystem file
  cat > $INSTALL_DIR/ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'piexed-ai',
      script: 'npm',
      args: 'start',
      cwd: '$INSTALL_DIR',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
EOF

  # Start application with PM2
  cd $INSTALL_DIR
  pm2 start ecosystem.config.js
  
  # Save PM2 configuration
  pm2 save
  
  # Setup PM2 to start on boot
  pm2 startup
  
  echo -e "${GREEN}Process manager setup completed.${NC}\n"
}

# Function to setup Nginx
setup_nginx() {
  echo -e "${BLUE}Setting up Nginx...${NC}"
  
  # Check if Nginx is installed
  if ! command -v nginx &> /dev/null; then
    echo -e "Installing Nginx..."
    
    # Detect OS
    if [ -f /etc/debian_version ]; then
      # Debian/Ubuntu
      apt-get update
      apt-get install -y nginx
    elif [ -f /etc/redhat-release ]; then
      # CentOS/RHEL
      yum install -y nginx
    else
      echo -e "${RED}Unsupported OS. Please install Nginx manually.${NC}"
      return
    fi
  fi
  
  # Ask for domain name
  read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
  
  # Create Nginx configuration
  cat > /etc/nginx/sites-available/piexed-ai << EOF
server {
    listen 80;
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

  # Create symbolic link
  ln -sf /etc/nginx/sites-available/piexed-ai /etc/nginx/sites-enabled/
  
  # Test Nginx configuration
  nginx -t
  
  # Restart Nginx
  systemctl restart nginx
  
  echo -e "${GREEN}Nginx setup completed.${NC}"
  echo -e "Your site should now be accessible at: ${YELLOW}http://$DOMAIN_NAME${NC}"
  echo -e "Consider setting up HTTPS with Let's Encrypt for production use.\n"
}

# Function to create admin user
create_admin_user() {
  echo -e "${BLUE}Creating admin user...${NC}"
  
  # Ask for admin details
  read -p "Enter admin username: " ADMIN_USERNAME
  read -p "Enter admin email: " ADMIN_EMAIL
  read -s -p "Enter admin password: " ADMIN_PASSWORD
  echo
  
  # Navigate to installation directory
  cd $INSTALL_DIR
  
  # Create admin user script
  cat > create-admin.js << EOF
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function createAdminUser() {
  try {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Hash password
    const hashedPassword = await bcrypt.hash('$ADMIN_PASSWORD', 10);
    const adminId = uuidv4();
    
    // Insert admin user
    await pool.query(
      \`INSERT INTO users (id, username, email, password, role, created_at, updated_at)
       VALUES (\$1, \$2, \$3, \$4, 'admin', NOW(), NOW())\`,
      [adminId, '$ADMIN_USERNAME', '$ADMIN_EMAIL', hashedPassword]
    );

    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
EOF

  # Run script
  node create-admin.js
  
  # Remove script
  rm create-admin.js
  
  echo -e "${GREEN}Admin user created successfully.${NC}\n"
}

# Function to finalize installation
finalize_installation() {
  echo -e "${BLUE}Finalizing installation...${NC}"
  
  # Create installation lock file
  mkdir -p $INSTALL_DIR/install
  echo $(date) > $INSTALL_DIR/install/.installed
  
  echo -e "${GREEN}Installation completed successfully!${NC}"
  echo -e "Piexed AI is now installed and running on your server."
  echo -e "You can access the admin dashboard at: ${YELLOW}http://$DOMAIN_NAME/admin${NC}"
  echo -e "Login with the admin credentials you provided during installation."
  echo -e "\n${YELLOW}Important:${NC} Make sure to set up your Together AI API key in the admin dashboard."
  echo -e "For security, consider setting up HTTPS with Let's Encrypt for production use."
  echo -e "\nThank you for installing Piexed AI!\n"
}

# Main installation process
main() {
  echo -e "${BLUE}Starting Piexed AI installation...${NC}\n"
  
  check_requirements
  
  echo -e "${YELLOW}This installer will set up Piexed AI on your server.${NC}"
  echo -e "${YELLOW}It will install and configure PostgreSQL, Node.js, and Nginx.${NC}"
  echo -e "${YELLOW}Make sure you have at least 1GB of RAM and 10GB of free disk space.${NC}\n"
  
  read -p "Continue with installation? (y/n): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
  
  configure_postgresql
  setup_piexed_ai
  configure_environment
  build_application
  setup_process_manager
  setup_nginx
  create_admin_user
  finalize_installation
}

# Run the installer
main


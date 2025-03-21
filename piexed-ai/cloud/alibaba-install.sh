#!/bin/bash

# Piexed AI Alibaba Cloud Installer
# This script installs Piexed AI on Alibaba Cloud ECS instances

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
echo -e "${GREEN}Alibaba Cloud Installer${NC}"
echo -e "Self-Evolving Generative AI Platform\n"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root or with sudo privileges${NC}"
  exit 1
fi

# Function to check Alibaba Cloud CLI
check_aliyun_cli() {
  echo -e "${BLUE}Checking Alibaba Cloud CLI...${NC}"
  
  if ! command -v aliyun &> /dev/null; then
    echo -e "${RED}Alibaba Cloud CLI is not installed. Installing...${NC}"
    
    # Install Alibaba Cloud CLI
    curl -o aliyun-cli-linux-latest-amd64.tgz https://aliyuncli.alicdn.com/aliyun-cli-linux-latest-amd64.tgz
    tar -xvzf aliyun-cli-linux-latest-amd64.tgz
    mv aliyun /usr/local/bin/
    rm aliyun-cli-linux-latest-amd64.tgz
    
    echo -e "${GREEN}Alibaba Cloud CLI installed successfully.${NC}"
  else
    ALIYUN_VERSION=$(aliyun version)
    echo -e "Alibaba Cloud CLI Version: ${GREEN}$ALIYUN_VERSION${NC}"
  fi
  
  # Check Alibaba Cloud configuration
  if [ ! -f ~/.aliyun/config.json ]; then
    echo -e "${YELLOW}Alibaba Cloud CLI is not configured. Please configure it now.${NC}"
    aliyun configure
  else
    echo -e "${GREEN}Alibaba Cloud CLI is configured.${NC}"
  fi
  
  echo -e "${GREEN}Alibaba Cloud CLI check completed.${NC}\n"
}

# Function to check ECS instance type
check_ecs_instance() {
  echo -e "${BLUE}Checking ECS instance...${NC}"
  
  # Get instance metadata
  INSTANCE_ID=$(curl -s http://100.100.100.200/latest/meta-data/instance-id)
  
  if [ -z "$INSTANCE_ID" ]; then
    echo -e "${RED}Not running on an Alibaba Cloud ECS instance.${NC}"
    return
  fi
  
  # Get instance type
  INSTANCE_TYPE=$(curl -s http://100.100.100.200/latest/meta-data/instance/instance-type)
  echo -e "Instance Type: ${GREEN}$INSTANCE_TYPE${NC}"
  
  # Get region
  REGION=$(curl -s http://100.100.100.200/latest/meta-data/region-id)
  echo -e "Region: ${GREEN}$REGION${NC}"
  
  echo -e "${GREEN}ECS instance check completed.${NC}\n"
}

# Function to setup ApsaraDB RDS (optional)
setup_rds() {
  echo -e "${BLUE}Setting up ApsaraDB RDS for PostgreSQL...${NC}"
  
  echo -e "${YELLOW}Do you want to use ApsaraDB RDS for PostgreSQL?${NC}"
  echo -e "1. Yes, use an existing RDS instance"
  echo -e "2. No, use local PostgreSQL"
  
  read -p "Select an option (1-2): " RDS_OPTION
  
  case $RDS_OPTION in
    1)
      # Use existing RDS instance
      echo -e "${BLUE}Using existing ApsaraDB RDS instance...${NC}"
      
      # Ask for RDS details
      read -p "Enter RDS endpoint: " RDS_ENDPOINT
      read -p "Enter database name: " RDS_DATABASE
      read -p "Enter username: " RDS_USERNAME
      read -s -p "Enter password: " RDS_PASSWORD
      echo
      
      # Save RDS credentials
      echo "DB_TYPE=postgresql" > db_credentials.txt
      echo "DB_HOST=$RDS_ENDPOINT" >> db_credentials.txt
      echo "DB_PORT=5432" >> db_credentials.txt
      echo "DB_USER=$RDS_USERNAME" >> db_credentials.txt
      echo "DB_PASSWORD=$RDS_PASSWORD" >> db_credentials.txt
      echo "DB_NAME=$RDS_DATABASE" >> db_credentials.txt
      ;;
    2)
      # Use local PostgreSQL
      echo -e "${BLUE}Using local PostgreSQL...${NC}"
      
      # Install PostgreSQL
      apt-get update
      apt-get install -y postgresql postgresql-contrib
      
      # Start PostgreSQL
      systemctl enable postgresql
      systemctl start postgresql
      
      # Generate random password
      DB_PASSWORD=$(openssl rand -base64 12)
      
      # Create user and database
      sudo -u postgres psql -c "CREATE USER piexed_user WITH PASSWORD '$DB_PASSWORD';"
      sudo -u postgres psql -c "CREATE DATABASE piexed_ai;"
      sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE piexed_ai TO piexed_user;"
      sudo -u postgres psql -c "ALTER USER piexed_user WITH SUPERUSER;"
      
      # Save credentials
      echo "DB_TYPE=postgresql" > db_credentials.txt
      echo "DB_HOST=localhost" >> db_credentials.txt
      echo "DB_PORT=5432" >> db_credentials.txt
      echo "DB_USER=piexed_user" >> db_credentials.txt
      echo "DB_PASSWORD=$DB_PASSWORD" >> db_credentials.txt
      echo "DB_NAME=piexed_ai" >> db_credentials.txt
      
      echo -e "${GREEN}Local PostgreSQL configured successfully.${NC}"
      echo -e "Database: ${YELLOW}piexed_ai${NC}"
      echo -e "Username: ${YELLOW}piexed_user${NC}"
      echo -e "Password: ${YELLOW}$DB_PASSWORD${NC}"
      ;;
    *)
      echo -e "${RED}Invalid option. Using local PostgreSQL.${NC}"
      ;;
  esac
  
  echo -e "${GREEN}Database setup completed.${NC}\n"
}

# Function to setup OSS for storage (optional)
setup_oss() {
  echo -e "${BLUE}Setting up Alibaba Cloud OSS for storage...${NC}"
  
  echo -e "${YELLOW}Do you want to use Alibaba Cloud OSS for storage?${NC}"
  echo -e "1. Yes, use OSS"
  echo -e "2. No, use local storage"
  
  read -p "Select an option (1-2): " OSS_OPTION
  
  case $OSS_OPTION in
    1)
      # Use OSS
      echo -e "${BLUE}Using Alibaba Cloud OSS...${NC}"
      
      # Ask for OSS details
      read -p "Enter OSS bucket name: " OSS_BUCKET
      read -p "Enter OSS endpoint: " OSS_ENDPOINT
      read -p "Enter Access Key ID: " ACCESS_KEY_ID
      read -s -p "Enter Access Key Secret: " ACCESS_KEY_SECRET
      echo
      
      # Save OSS credentials
      echo "STORAGE_TYPE=oss" > storage_credentials.txt
      echo "OSS_BUCKET=$OSS_BUCKET" >> storage_credentials.txt
      echo "OSS_ENDPOINT=$OSS_ENDPOINT" >> storage_credentials.txt
      echo "OSS_ACCESS_KEY_ID=$ACCESS_KEY_ID" >> storage_credentials.txt
      echo "OSS_ACCESS_KEY_SECRET=$ACCESS_KEY_SECRET" >> storage_credentials.txt
      ;;
    2)
      # Use local storage
      echo -e "${BLUE}Using local storage...${NC}"
      
      # Create storage directory
      mkdir -p /var/www/piexed-ai/storage
      chmod -R 755 /var/www/piexed-ai/storage
      
      # Save storage credentials
      echo "STORAGE_TYPE=local" > storage_credentials.txt
      echo "STORAGE_PATH=/var/www/piexed-ai/storage" >> storage_credentials.txt
      ;;
    *)
      echo -e "${RED}Invalid option. Using local storage.${NC}"
      ;;
  esac
  
  echo -e "${GREEN}Storage setup completed.${NC}\n"
}

# Function to setup Elastic IP (optional)
setup_eip() {
  echo -e "${BLUE}Setting up Elastic IP...${NC}"
  
  # Get public IP
  PUBLIC_IP=$(curl -s http://100.100.100.200/latest/meta-data/eipv4)
  
  if [ -z "$PUBLIC_IP" ]; then
    echo -e "${YELLOW}No Elastic IP associated with this instance.${NC}"
    PUBLIC_IP=$(curl -s http://100.100.100.200/latest/meta-data/public-ipv4)
    echo -e "Using public IP: ${YELLOW}$PUBLIC_IP${NC}"
  else
    echo -e "${GREEN}Elastic IP detected.${NC}"
    echo -e "Elastic IP: ${YELLOW}$PUBLIC_IP${NC}"
  fi
  
  echo -e "${GREEN}IP setup completed.${NC}\n"
}

# Main Alibaba Cloud installation process
alibaba_main() {
  echo -e "${BLUE}Starting Piexed AI installation on Alibaba Cloud...${NC}\n"
  
  check_aliyun_cli
  check_ecs_instance
  setup_rds
  setup_oss
  setup_eip
  
  # Continue with standard installation
  source ./install.sh
}

# Run the Alibaba Cloud installer
alibaba_main


#!/bin/bash

# Piexed AI AWS Cloud Installer
# This script installs Piexed AI on Amazon Web Services EC2 instances

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
echo -e "${GREEN}AWS Cloud Installer${NC}"
echo -e "Self-Evolving Generative AI Platform\n"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root or with sudo privileges${NC}"
  exit 1
fi

# Function to check AWS CLI
check_aws_cli() {
  echo -e "${BLUE}Checking AWS CLI...${NC}"
  
  if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Installing...${NC}"
    
    # Install AWS CLI
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    ./aws/install
    rm -rf aws awscliv2.zip
    
    echo -e "${GREEN}AWS CLI installed successfully.${NC}"
  else
    AWS_VERSION=$(aws --version | awk '{print $1}' | cut -d/ -f2)
    echo -e "AWS CLI Version: ${GREEN}$AWS_VERSION${NC}"
  fi
  
  # Check AWS configuration
  if [ ! -f ~/.aws/credentials ]; then
    echo -e "${YELLOW}AWS CLI is not configured. Please configure it now.${NC}"
    aws configure
  else
    echo -e "${GREEN}AWS CLI is configured.${NC}"
  fi
  
  echo -e "${GREEN}AWS CLI check completed.${NC}\n"
}

# Function to check EC2 instance type
check_instance_type() {
  echo -e "${BLUE}Checking EC2 instance type...${NC}"
  
  # Get instance ID
  INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
  
  if [ -z "$INSTANCE_ID" ]; then
    echo -e "${RED}Not running on an EC2 instance.${NC}"
    return
  fi
  
  # Get instance type
  INSTANCE_TYPE=$(curl -s http://169.254.169.254/latest/meta-data/instance-type)
  echo -e "Instance Type: ${GREEN}$INSTANCE_TYPE${NC}"
  
  # Check if instance type is suitable
  case $INSTANCE_TYPE in
    t2.micro|t3.micro)
      echo -e "${YELLOW}Warning: You are using a micro instance ($INSTANCE_TYPE).${NC}"
      echo -e "${YELLOW}This instance type has limited resources and may not be suitable for production use.${NC}"
      echo -e "${YELLOW}Recommended: t3.medium or higher for production use.${NC}"
      ;;
    t2.small|t3.small)
      echo -e "${YELLOW}Warning: You are using a small instance ($INSTANCE_TYPE).${NC}"
      echo -e "${YELLOW}This instance type has limited resources.${NC}"
      echo -e "${YELLOW}Recommended: t3.medium or higher for production use.${NC}"
      ;;
    *)
      echo -e "${GREEN}Instance type $INSTANCE_TYPE should be suitable for Piexed AI.${NC}"
      ;;
  esac
  
  echo -e "${GREEN}EC2 instance check completed.${NC}\n"
}

# Function to setup RDS (optional)
setup_rds() {
  echo -e "${BLUE}Setting up Amazon RDS for PostgreSQL...${NC}"
  
  echo -e "${YELLOW}Do you want to use Amazon RDS for PostgreSQL?${NC}"
  echo -e "1. Yes, create a new RDS instance"
  echo -e "2. Yes, use an existing RDS instance"
  echo -e "3. No, use local PostgreSQL"
  
  read -p "Select an option (1-3): " RDS_OPTION
  
  case $RDS_OPTION in
    1)
      # Create new RDS instance
      echo -e "${BLUE}Creating new RDS instance...${NC}"
      
      # Ask for RDS details
      read -p "Enter RDS instance identifier: " RDS_IDENTIFIER
      read -p "Enter master username: " RDS_USERNAME
      read -s -p "Enter master password: " RDS_PASSWORD
      echo
      read -p "Enter database name: " RDS_DATABASE
      
      # Create RDS instance
      aws rds create-db-instance \
        --db-instance-identifier $RDS_IDENTIFIER \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --master-username $RDS_USERNAME \
        --master-user-password $RDS_PASSWORD \
        --allocated-storage 20 \
        --db-name $RDS_DATABASE
      
      echo -e "${YELLOW}RDS instance is being created. This may take several minutes.${NC}"
      echo -e "${YELLOW}You can check the status in the AWS RDS console.${NC}"
      
      # Wait for RDS instance to be available
      echo -e "Waiting for RDS instance to be available..."
      aws rds wait db-instance-available --db-instance-identifier $RDS_IDENTIFIER
      
      # Get RDS endpoint
      RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier $RDS_IDENTIFIER --query "DBInstances[0].Endpoint.Address" --output text)
      
      echo -e "${GREEN}RDS instance created successfully.${NC}"
      echo -e "RDS Endpoint: ${YELLOW}$RDS_ENDPOINT${NC}"
      echo -e "Database: ${YELLOW}$RDS_DATABASE${NC}"
      echo -e "Username: ${YELLOW}$RDS_USERNAME${NC}"
      
      # Save RDS credentials
      echo "DB_TYPE=postgresql" > db_credentials.txt
      echo "DB_HOST=$RDS_ENDPOINT" >> db_credentials.txt
      echo "DB_PORT=5432" >> db_credentials.txt
      echo "DB_USER=$RDS_USERNAME" >> db_credentials.txt
      echo "DB_PASSWORD=$RDS_PASSWORD" >> db_credentials.txt
      echo "DB_NAME=$RDS_DATABASE" >> db_credentials.txt
      ;;
    2)
      # Use existing RDS instance
      echo -e "${BLUE}Using existing RDS instance...${NC}"
      
      # List available RDS instances
      echo -e "Available RDS instances:"
      aws rds describe-db-instances --query "DBInstances[*].[DBInstanceIdentifier,Endpoint.Address,Engine]" --output table
      
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
    3)
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

# Function to setup S3 for storage (optional)
setup_s3() {
  echo -e "${BLUE}Setting up Amazon S3 for storage...${NC}"
  
  echo -e "${YELLOW}Do you want to use Amazon S3 for storage?${NC}"
  echo -e "1. Yes, create a new S3 bucket"
  echo -e "2. Yes, use an existing S3 bucket"
  echo -e "3. No, use local storage"
  
  read -p "Select an option (1-3): " S3_OPTION
  
  case $S3_OPTION in
    1)
      # Create new S3 bucket
      echo -e "${BLUE}Creating new S3 bucket...${NC}"
      
      # Ask for S3 details
      read -p "Enter S3 bucket name: " S3_BUCKET
      
      # Create S3 bucket
      aws s3api create-bucket --bucket $S3_BUCKET --region us-east-1
      
      # Enable versioning
      aws s3api put-bucket-versioning --bucket $S3_BUCKET --versioning-configuration Status=Enabled
      
      # Create IAM user for S3 access
      IAM_USER="piexed-s3-user"
      aws iam create-user --user-name $IAM_USER
      
      # Create access key
      ACCESS_KEY=$(aws iam create-access-key --user-name $IAM_USER)
      ACCESS_KEY_ID=$(echo $ACCESS_KEY | jq -r .AccessKey.AccessKeyId)
      SECRET_ACCESS_KEY=$(echo $ACCESS_KEY | jq -r .AccessKey.SecretAccessKey)
      
      # Create policy
      POLICY_ARN=$(aws iam create-policy --policy-name PiexedS3Policy --policy-document '{
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "s3:PutObject",
              "s3:GetObject",
              "s3:DeleteObject",
              "s3:ListBucket"
            ],
            "Resource": [
              "arn:aws:s3:::'$S3_BUCKET'",
              "arn:aws:s3:::'$S3_BUCKET'/*"
            ]
          }
        ]
      }' --query 'Policy.Arn' --output text)
      
      # Attach policy to user
      aws iam attach-user-policy --user-name $IAM_USER --policy-arn $POLICY_ARN
      
      echo -e "${GREEN}S3 bucket created successfully.${NC}"
      echo -e "Bucket: ${YELLOW}$S3_BUCKET${NC}"
      echo -e "Access Key ID: ${YELLOW}$ACCESS_KEY_ID${NC}"
      echo -e "Secret Access Key: ${YELLOW}$SECRET_ACCESS_KEY${NC}"
      
      # Save S3 credentials
      echo "STORAGE_TYPE=s3" > storage_credentials.txt
      echo "S3_BUCKET=$S3_BUCKET" >> storage_credentials.txt
      echo "S3_ACCESS_KEY_ID=$ACCESS_KEY_ID" >> storage_credentials.txt
      echo "S3_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY" >> storage_credentials.txt
      echo "S3_REGION=us-east-1" >> storage_credentials.txt
      ;;
    2)
      # Use existing S3 bucket
      echo -e "${BLUE}Using existing S3 bucket...${NC}"
      
      # List available S3 buckets
      echo -e "Available S3 buckets:"
      aws s3 ls
      
      # Ask for S3 details
      read -p "Enter S3 bucket name: " S3_BUCKET
      read -p "Enter Access Key ID: " ACCESS_KEY_ID
      read -s -p "Enter Secret Access Key: " SECRET_ACCESS_KEY
      echo
      read -p "Enter S3 region (default: us-east-1): " S3_REGION
      S3_REGION=${S3_REGION:-us-east-1}
      
      # Save S3 credentials
      echo "STORAGE_TYPE=s3" > storage_credentials.txt
      echo "S3_BUCKET=$S3_BUCKET" >> storage_credentials.txt
      echo "S3_ACCESS_KEY_ID=$ACCESS_KEY_ID" >> storage_credentials.txt
      echo "S3_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY" >> storage_credentials.txt
      echo "S3_REGION=$S3_REGION" >> storage_credentials.txt
      ;;
    3)
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
setup_elastic_ip() {
  echo -e "${BLUE}Setting up Elastic IP...${NC}"
  
  echo -e "${YELLOW}Do you want to allocate an Elastic IP for this instance?${NC}"
  echo -e "1. Yes, allocate a new Elastic IP"
  echo -e "2. Yes, associate an existing Elastic IP"
  echo -e "3. No, use the default public IP"
  
  read -p "Select an option (1-3): " EIP_OPTION
  
  # Get instance ID
  INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
  
  case $EIP_OPTION in
    1)
      # Allocate new Elastic IP
      echo -e "${BLUE}Allocating new Elastic IP...${NC}"
      
      # Allocate Elastic IP
      ALLOCATION_ID=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
      
      # Associate Elastic IP with instance
      aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOCATION_ID
      
      # Get Elastic IP
      ELASTIC_IP=$(aws ec2 describe-addresses --allocation-ids $ALLOCATION_ID --query 'Addresses[0].PublicIp' --output text)
      
      echo -e "${GREEN}Elastic IP allocated and associated successfully.${NC}"
      echo -e "Elastic IP: ${YELLOW}$ELASTIC_IP${NC}"
      ;;
    2)
      # Associate existing Elastic IP
      echo -e "${BLUE}Associating existing Elastic IP...${NC}"
      
      # List available Elastic IPs
      echo -e "Available Elastic IPs:"
      aws ec2 describe-addresses --query 'Addresses[*].[PublicIp,AllocationId]' --output table
      
      # Ask for Elastic IP
      read -p "Enter Allocation ID: " ALLOCATION_ID
      
      # Associate Elastic IP with instance
      aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOCATION_ID
      
      # Get Elastic IP
      ELASTIC_IP=$(aws ec2 describe-addresses --allocation-ids $ALLOCATION_ID --query 'Addresses[0].PublicIp' --output text)
      
      echo -e "${GREEN}Elastic IP associated successfully.${NC}"
      echo -e "Elastic IP: ${YELLOW}$ELASTIC_IP${NC}"
      ;;
    3)
      # Use default public IP
      echo -e "${BLUE}Using default public IP...${NC}"
      
      # Get public IP
      PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
      
      echo -e "${GREEN}Using default public IP.${NC}"
      echo -e "Public IP: ${YELLOW}$PUBLIC_IP${NC}"
      ;;
    *)
      echo -e "${RED}Invalid option. Using default public IP.${NC}"
      ;;
  esac
  
  echo -e "${GREEN}IP setup completed.${NC}\n"
}

# Main AWS installation process
aws_main() {
  echo -e "${BLUE}Starting Piexed AI installation on AWS...${NC}\n"
  
  check_aws_cli
  check_instance_type
  setup_rds
  setup_s3
  setup_elastic_ip
  
  # Continue with standard installation
  source ./install.sh
}

# Run the AWS installer
aws_main


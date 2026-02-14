#!/bin/bash

# BackOffice UI Kit - Deployment Script
# This script deploys the application to AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT=${1:-dev}
AWS_REGION=${AWS_REGION:-us-east-1}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}BackOffice UI Kit - Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "Region: ${YELLOW}$AWS_REGION${NC}"
echo ""

# Check prerequisites
echo -e "${GREEN}Checking prerequisites...${NC}"

if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Install from: https://aws.amazon.com/cli/"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}Error: pnpm is not installed${NC}"
    echo "Install with: npm install -g pnpm"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites met${NC}"
echo ""

# Check AWS credentials
echo -e "${GREEN}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    echo "Run: aws configure"
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓ AWS Account: $AWS_ACCOUNT_ID${NC}"
echo ""

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
pnpm install --frozen-lockfile
echo ""

# Build packages
echo -e "${GREEN}Building packages...${NC}"
pnpm --filter shared build
pnpm --filter ui build
echo ""

# Deploy infrastructure
echo -e "${GREEN}Deploying infrastructure with CDK...${NC}"
cd infrastructure
pnpm install --frozen-lockfile

echo -e "${YELLOW}This will create/update AWS resources. Continue? (y/n)${NC}"
read -r response
if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

npx cdk deploy --all -c environment=$ENVIRONMENT --require-approval never

# Get outputs
echo ""
echo -e "${GREEN}Deployment complete!${NC}"
echo ""
echo -e "${GREEN}Getting deployment outputs...${NC}"

API_URL=$(aws cloudformation describe-stacks \
    --stack-name backoffice-kit-$ENVIRONMENT \
    --query "Stacks[0].Outputs[?OutputKey=='APIURL'].OutputValue" \
    --output text 2>/dev/null || echo "Not found")

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name backoffice-kit-$ENVIRONMENT \
    --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
    --output text 2>/dev/null || echo "Not found")

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Information${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "Website URL: ${YELLOW}$WEBSITE_URL${NC}"
echo -e "API URL: ${YELLOW}$API_URL${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Update apps/web/.env.local with NEXT_PUBLIC_API_URL=$API_URL"
echo "2. Rebuild Next.js: cd apps/web && NEXT_BUILD_MODE=static pnpm build"
echo "3. Sync to S3: aws s3 sync out/ s3://backoffice-web-$ENVIRONMENT-$AWS_ACCOUNT_ID/"
echo ""
echo -e "${GREEN}Deployment script completed!${NC}"

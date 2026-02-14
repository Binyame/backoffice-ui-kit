# BackOffice UI Kit - AWS Deployment Guide

This guide covers deploying the BackOffice UI Kit to AWS using AWS CDK (Cloud Development Kit).

## Architecture Overview

The application is deployed across multiple AWS services:

- **Next.js Web App** → S3 + CloudFront (static hosting with CDN)
- **NestJS API** → ECS Fargate (containerized, auto-scaling)
- **Database** → RDS PostgreSQL (managed database)
- **Infrastructure** → AWS CDK (Infrastructure as Code)
- **CI/CD** → GitHub Actions

## Prerequisites

### Required Tools

1. **AWS CLI** (v2+)
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

2. **AWS CDK** (v2+)
   ```bash
   npm install -g aws-cdk
   cdk --version
   ```

3. **Node.js** (v20+) and **pnpm** (v8+)
   ```bash
   node --version
   pnpm --version
   ```

4. **Docker** (for building container images)
   ```bash
   docker --version
   ```

### AWS Account Setup

1. **Create an AWS Account** (if you don't have one)
   - Go to https://aws.amazon.com
   - Sign up for a new account

2. **Create an IAM User** with Administrator Access
   ```bash
   # Create IAM user via AWS Console
   # Attach policy: AdministratorAccess
   # Generate Access Keys
   ```

3. **Configure AWS CLI**
   ```bash
   aws configure
   # Enter:
   # - AWS Access Key ID
   # - AWS Secret Access Key
   # - Default region (e.g., us-east-1)
   # - Default output format: json
   ```

4. **Bootstrap CDK** (one-time per AWS account/region)
   ```bash
   cdk bootstrap aws://ACCOUNT-ID/REGION
   # Example:
   cdk bootstrap aws://123456789012/us-east-1
   ```

## Deployment Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd backoffice

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### 2. Configure Environment Variables

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=your-account-id

# Database Configuration
DB_HOST=<will-be-set-by-cdk>
DB_PORT=5432
DB_NAME=backoffice
DB_USERNAME=postgres
DB_PASSWORD=<will-be-in-secrets-manager>

# API Configuration
NEXT_PUBLIC_API_URL=<will-be-set-after-deployment>
```

### 3. Deploy Infrastructure (CDK)

```bash
cd infrastructure

# Install CDK dependencies
pnpm install

# Preview changes (optional)
npx cdk diff -c environment=dev

# Deploy to development
npx cdk deploy --all -c environment=dev

# Deploy to production
npx cdk deploy --all -c environment=prod
```

**Note:** The first deployment takes ~10-15 minutes as it provisions:
- VPC with public/private subnets
- RDS PostgreSQL database
- ECS Fargate cluster
- Application Load Balancer
- S3 bucket + CloudFront distribution

### 4. Get Deployment Outputs

After deployment, CDK will output important values:

```
Outputs:
BackofficeStack-dev.WebsiteURL = https://d1234567890.cloudfront.net
BackofficeStack-dev.APIURL = http://backo-apise-abc123.us-east-1.elb.amazonaws.com
BackofficeStack-dev.DatabaseEndpoint = backoffice-db.abc123.us-east-1.rds.amazonaws.com
BackofficeStack-dev.DatabaseSecretArn = arn:aws:secretsmanager:us-east-1:123456789012:secret:dev/backoffice/db-abc123
```

**Save these values!** You'll need them for configuration.

### 5. Update Environment Variables

Update your Next.js app with the API URL:

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://backo-apise-abc123.us-east-1.elb.amazonaws.com
```

Rebuild and redeploy:

```bash
# Rebuild Next.js with new API URL
cd apps/web
NEXT_BUILD_MODE=static NEXT_PUBLIC_API_URL=<your-api-url> pnpm build

# Deploy to S3
aws s3 sync out/ s3://backoffice-web-dev-<account-id>/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <your-distribution-id> \
  --paths "/*"
```

### 6. Access Your Application

- **Website:** https://your-cloudfront-domain.cloudfront.net
- **API:** http://your-alb-domain.us-east-1.elb.amazonaws.com
- **Storybook:** http://localhost:6006 (local only)

## CI/CD with GitHub Actions

The project includes automated deployments via GitHub Actions.

### Setup GitHub Secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add:

```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012
API_URL=http://your-alb-domain.us-east-1.elb.amazonaws.com
CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
```

### Automated Deployments

- **Push to `develop`** → Deploys to **dev** environment
- **Push to `main`** → Deploys to **prod** environment
- **Manual workflow** → Deploy to any environment

```bash
# Trigger manual deployment
# Go to: Actions → Deploy to AWS → Run workflow
# Select environment: dev, staging, or prod
```

## Environment Management

The infrastructure supports multiple environments:

```bash
# Deploy to development
cdk deploy --all -c environment=dev

# Deploy to staging
cdk deploy --all -c environment=staging

# Deploy to production
cdk deploy --all -c environment=prod
```

Each environment has:
- Separate VPC and database
- Different resource sizes (prod uses larger instances)
- Isolated S3 buckets and CloudFront distributions

## Database Migrations

To run database migrations on your RDS instance:

1. **Get database credentials from Secrets Manager**

```bash
aws secretsmanager get-secret-value \
  --secret-id dev/backoffice/db \
  --query SecretString \
  --output text | jq -r '.password'
```

2. **Connect to the database** (requires VPN or bastion host)

```bash
# Option 1: Use Systems Manager Session Manager
aws ssm start-session --target <bastion-instance-id>

# Option 2: SSH tunnel through bastion
ssh -i key.pem -L 5432:<db-endpoint>:5432 ec2-user@<bastion-ip>

# Connect with psql
psql -h localhost -U postgres -d backoffice
```

3. **Run migrations** (using TypeORM or your migration tool)

```bash
cd apps/api
pnpm run migration:run
```

## Monitoring and Logs

### CloudWatch Logs

```bash
# View API logs
aws logs tail /ecs/backoffice-api-dev --follow

# View specific log group
aws logs get-log-events \
  --log-group-name /ecs/backoffice-api-dev \
  --log-stream-name <stream-name>
```

### CloudWatch Metrics

- **ECS Service** → CPU/Memory utilization, request count
- **RDS** → Database connections, read/write IOPS
- **ALB** → Request count, response time, error rates
- **CloudFront** → Cache hit ratio, viewer requests

### Alarms

Production environment includes CloudWatch alarms for:
- High CPU utilization (>80%)
- High memory utilization (>80%)
- Database connection failures
- API error rate (>5%)

## Cost Optimization

### Development Environment

- **RDS:** db.t3.micro (~$15/month)
- **ECS:** 1 Fargate task 0.5 vCPU / 1 GB (~$15/month)
- **NAT Gateway:** 1 instance (~$32/month)
- **S3 + CloudFront:** ~$5/month
- **Total:** ~$70/month

### Production Environment

- **RDS:** db.t3.small (~$30/month)
- **ECS:** 2 Fargate tasks 1 vCPU / 2 GB (~$60/month)
- **NAT Gateway:** 2 instances (~$64/month)
- **S3 + CloudFront:** ~$20/month
- **Total:** ~$175/month

### Cost Reduction Tips

1. **Use NAT Instances** instead of NAT Gateways (~$10/month vs $32/month)
2. **Stop dev environment** when not in use
3. **Use Reserved Instances** for RDS in production (save 30-40%)
4. **Enable S3 Intelligent-Tiering** for long-term storage

```bash
# Stop dev environment (keeps data, stops compute)
aws ecs update-service --cluster backoffice-api-dev \
  --service api-service --desired-count 0

# Start dev environment
aws ecs update-service --cluster backoffice-api-dev \
  --service api-service --desired-count 1
```

## Cleanup / Destroy

To completely remove all AWS resources:

```bash
cd infrastructure

# Destroy development environment
npx cdk destroy --all -c environment=dev

# Destroy production environment
npx cdk destroy --all -c environment=prod
```

**Warning:** This will permanently delete:
- Database (unless deletion protection is enabled)
- S3 buckets (if autoDeleteObjects is enabled)
- All logs and metrics

## Troubleshooting

### Issue: CDK deploy fails with "No default VPC"

**Solution:** Ensure you've bootstrapped CDK in your region

```bash
cdk bootstrap aws://ACCOUNT-ID/REGION
```

### Issue: Docker build fails in GitHub Actions

**Solution:** Check that the Dockerfile has correct paths

```bash
# Test locally
cd apps/api
docker build -t test .
```

### Issue: Next.js app can't connect to API

**Solution:** Check CORS configuration and API URL

```bash
# Verify API is running
curl http://your-alb-domain/health

# Check CORS headers
curl -H "Origin: https://your-cloudfront-domain" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS http://your-alb-domain/owners
```

### Issue: Database connection timeout

**Solution:** Check security groups allow ECS → RDS traffic

```bash
# Verify security group rules
aws ec2 describe-security-groups \
  --group-ids <db-security-group-id>
```

## Security Best Practices

1. **Enable MFA** on AWS root account
2. **Use IAM roles** for ECS tasks (not access keys)
3. **Encrypt RDS** at rest (enabled by default)
4. **Use Secrets Manager** for database credentials
5. **Enable CloudTrail** for audit logging
6. **Use WAF** on CloudFront (production)
7. **Implement rate limiting** on API Gateway
8. **Regularly update dependencies** (pnpm update)

## Support

For issues or questions:
- **GitHub Issues:** https://github.com/your-org/backoffice/issues
- **Documentation:** https://docs.your-org.com
- **Email:** devops@your-org.com

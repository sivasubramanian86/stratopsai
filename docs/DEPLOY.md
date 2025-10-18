# StratOpsAI Deployment Guide

## Overview

StratOpsAI uses AWS Amplify Hosting for frontend deployment, providing a Firebase-like experience with automatic builds, branch deployments, and seamless integration with the backend infrastructure.

## Prerequisites

1. **Backend Deployed**: Ensure Stack 1 and Stack 2 are deployed
2. **GitHub Repository**: Code pushed to GitHub with appropriate branch structure
3. **AWS CLI**: Configured with appropriate permissions
4. **GitHub Token**: Personal access token with repo permissions

## Deployment Architecture

```
GitHub Repository → AWS Amplify → CloudFront CDN → Users
       ↓
   Webhook Trigger → Auto Build → Deploy to Environment
```

## Step-by-Step Deployment

### 1. Prepare GitHub Repository

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial StratOpsAI commit"

# Create branches for environments
git checkout -b develop
git push origin develop
git checkout -b main
git push origin main
```

### 2. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` permissions
3. Copy the token (starts with `ghp_`)

### 3. Deploy Backend Infrastructure

```bash
# Deploy Stack 1 (Infrastructure)
aws cloudformation deploy \
  --template-file infra/stack1.yaml \
  --stack-name stratopsai-infrastructure \
  --capabilities CAPABILITY_IAM

# Upload models
./scripts/upload_dummy_models.sh

# Deploy Stack 2 (AI Core)
./scripts/deploy_stack2.sh
```

### 4. Deploy Frontend with Amplify

```bash
# Deploy Amplify hosting
./scripts/deploy-amplify.sh \
  https://github.com/yourusername/StratOpsAI \
  ghp_your_github_token_here \
  dev
```

### 5. Verify Deployment

```bash
# Get Amplify app URL
aws cloudformation describe-stacks \
  --stack-name stratopsai-amplify-dev \
  --query 'Stacks[0].Outputs[?OutputKey==`AmplifyAppUrl`].OutputValue' \
  --output text
```

## Environment Management

### Development Environment
- **Branch**: `develop`
- **Stack**: `stratopsai-amplify-dev`
- **URL**: `https://develop.xxxxx.amplifyapp.com`
- **API**: Development API Gateway endpoint

### Production Environment
- **Branch**: `main`
- **Stack**: `stratopsai-amplify-prod`
- **URL**: `https://main.xxxxx.amplifyapp.com`
- **API**: Production API Gateway endpoint

## Amplify Configuration

### Build Settings
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/build
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### Environment Variables
- `REACT_APP_API_URL`: Automatically injected from CloudFormation
- `AMPLIFY_MONOREPO_APP_ROOT`: Set to `frontend` for monorepo structure

### Custom Rules
- SPA routing: `/<*>` → `/index.html` (404-200 redirect)

## Continuous Deployment Workflow

### Automatic Builds
1. **Push to develop** → Triggers dev environment build
2. **Push to main** → Triggers production environment build
3. **Pull requests** → Creates preview deployments

### Build Process
1. **Webhook**: GitHub notifies Amplify of code changes
2. **Clone**: Amplify clones the repository
3. **Install**: `npm ci` installs dependencies
4. **Build**: `npm run build` creates production bundle
5. **Deploy**: Upload to CloudFront CDN
6. **Notify**: Build status sent to GitHub

### Build Monitoring
```bash
# View build logs
aws amplify list-jobs --app-id <app-id> --branch-name develop

# Get build status
aws amplify get-job --app-id <app-id> --branch-name develop --job-id <job-id>
```

## Firebase-like Experience

### Key Similarities
- **One-command deploy**: `./scripts/deploy-amplify.sh`
- **Automatic builds**: Push to deploy
- **Branch environments**: develop/main → dev/prod
- **Environment variables**: Managed through console/CloudFormation
- **Custom domains**: Optional SSL certificates
- **Preview deployments**: PR-based previews

### Advantages over Firebase
- **AWS Integration**: Native integration with API Gateway, Lambda
- **CloudFormation**: Infrastructure as Code
- **Enterprise features**: VPC, IAM, compliance
- **Cost optimization**: Pay-per-use pricing

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs
aws logs describe-log-groups --log-group-name-prefix "/aws/amplify"

# Common fixes:
# 1. Check package.json dependencies
# 2. Verify environment variables
# 3. Check build commands in amplify.yml
```

#### API Connection Issues
```bash
# Verify API endpoint
aws cloudformation describe-stacks \
  --stack-name stratopsai-ai-core \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue'

# Check CORS settings in API Gateway
# Verify Lambda function is deployed
```

#### Environment Variable Issues
```bash
# Update environment variables
aws amplify update-app \
  --app-id <app-id> \
  --environment-variables REACT_APP_API_URL=<new-url>

# Trigger rebuild
aws amplify start-job \
  --app-id <app-id> \
  --branch-name develop \
  --job-type RELEASE
```

### Performance Optimization

#### Build Time
- Use `npm ci` instead of `npm install`
- Enable dependency caching
- Optimize bundle size with tree shaking

#### Runtime Performance
- CloudFront CDN for global distribution
- Gzip compression enabled by default
- Browser caching for static assets

## Custom Domain Setup (Optional)

### 1. Purchase Domain
- Use Route 53 or external registrar
- Verify domain ownership

### 2. Configure SSL
```bash
# Add domain to Amplify app
aws amplify create-domain-association \
  --app-id <app-id> \
  --domain-name yourdomain.com \
  --sub-domain-settings prefix=www,branchName=main
```

### 3. DNS Configuration
- Point domain to Amplify-provided CNAME
- SSL certificate automatically provisioned

## Cost Management

### Amplify Pricing
- **Build minutes**: $0.01 per build minute
- **Storage**: $0.023 per GB per month
- **Data transfer**: $0.15 per GB (first 15 GB free)

### Optimization Tips
- Use efficient build processes
- Minimize bundle size
- Leverage CloudFront caching
- Monitor usage in AWS Cost Explorer

## Security Considerations

### Access Control
- GitHub token with minimal permissions
- IAM roles with least privilege
- Environment variable encryption

### Content Security
- HTTPS enforced by default
- CloudFront security headers
- No sensitive data in frontend code

## Monitoring and Logging

### Amplify Console
- Build history and logs
- Performance metrics
- Error tracking

### CloudWatch Integration
- Custom metrics for API calls
- Error rate monitoring
- Performance dashboards

This deployment strategy provides a modern, scalable, and maintainable approach to hosting the StratOpsAI frontend while maintaining seamless integration with the AWS backend infrastructure.
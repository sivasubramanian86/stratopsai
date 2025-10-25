#!/bin/bash

# StratOpsAI Stack 1 Deployment Script
# Usage: ./scripts/deploy_stack1.sh [--project-name=NAME] [--environment=ENV] [--log-retention=DAYS]

set -euo pipefail  # Strict error handling

# Default values
PROJECT_NAME="StratOpsAI"
ENVIRONMENT="dev"
LOG_RETENTION_DAYS=7
AWS_REGION="${AWS_REGION:-us-east-1}"
STACK_NAME="stratopsai-infrastructure"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --project-name=*)
      PROJECT_NAME="${1#*=}"
      shift
      ;;
    --environment=*)
      ENVIRONMENT="${1#*=}"
      shift
      ;;
    --log-retention=*)
      LOG_RETENTION_DAYS="${1#*=}"
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [--project-name=NAME] [--environment=ENV] [--log-retention=DAYS]"
      echo "Defaults: project-name=StratOpsAI, environment=dev, log-retention=7"
      echo "Region: $AWS_REGION (override with AWS_REGION env var)"
      exit 0
      ;;
    *)
      echo "❌ Unknown parameter: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo "🚀 Deploying StratOpsAI Infrastructure Stack"
echo "📍 Region: $AWS_REGION"
echo "📦 Project: $PROJECT_NAME"
echo "🏷️  Environment: $ENVIRONMENT"
echo "📅 Log Retention: $LOG_RETENTION_DAYS days"
echo ""

# Validate template exists
if [[ ! -f "infra/stack1.yaml" ]]; then
  echo "❌ Error: infra/stack1.yaml not found"
  echo "Please run this script from the StratOpsAI root directory"
  exit 1
fi

# Validate AWS CLI and credentials
if ! command -v aws &> /dev/null; then
  echo "❌ Error: AWS CLI not found"
  echo "Please install AWS CLI: https://aws.amazon.com/cli/"
  exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
  echo "❌ Error: AWS credentials not configured"
  echo "Please run: aws configure"
  exit 1
fi

# Check if stack exists and delete if present
if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" &> /dev/null; then
  echo "🗑️  Deleting existing stack: $STACK_NAME"
  
  # Clean S3 buckets using dedicated script
  if [[ -f "scripts/cleanup_buckets.sh" ]]; then
    chmod +x scripts/cleanup_buckets.sh
    ./scripts/cleanup_buckets.sh
  fi
  
  aws cloudformation delete-stack --stack-name "$STACK_NAME" --region "$AWS_REGION"
  echo "⏳ Waiting for stack deletion to complete..."
  aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME" --region "$AWS_REGION"
  echo "✅ Stack deleted successfully"
fi

# Deploy CloudFormation stack
echo "📦 Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file infra/stack1.yaml \
  --stack-name "$STACK_NAME" \
  --parameter-overrides \
    ProjectName="$PROJECT_NAME" \
    Environment="$ENVIRONMENT" \
    LogRetentionDays="$LOG_RETENTION_DAYS" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "$AWS_REGION" \
  --no-fail-on-empty-changeset

# Wait for stack to be complete
echo "⏳ Waiting for stack deployment to complete..."
aws cloudformation wait stack-deploy-complete \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION"

# Get and display stack outputs
echo ""
echo "✅ Stack deployment completed successfully!"
echo ""
echo "📊 Stack Outputs:"
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[*].{Key:OutputKey,Value:OutputValue}' \
  --output table

# Get stack tags
echo ""
echo "🏷️  Stack Tags:"
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Tags[*].{Key:Key,Value:Value}' \
  --output table

# Extract key outputs for validation
ARTIFACTS_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`ArtifactsBucketName`].OutputValue' \
  --output text)

RAW_DATA_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`RawDataBucketName`].OutputValue' \
  --output text)

API_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`StratOpsApiId`].OutputValue' \
  --output text)

echo ""
echo "🔍 Validation Results:"
echo "✅ Artifacts Bucket: $ARTIFACTS_BUCKET"
echo "✅ Raw Data Bucket: $RAW_DATA_BUCKET"
echo "✅ API Gateway ID: $API_ID"

# Verify S3 buckets are accessible
if aws s3 ls "s3://$ARTIFACTS_BUCKET" &> /dev/null; then
  echo "✅ Artifacts bucket accessible"
else
  echo "⚠️  Warning: Artifacts bucket not accessible"
fi

if aws s3 ls "s3://$RAW_DATA_BUCKET" &> /dev/null; then
  echo "✅ Raw data bucket accessible"
else
  echo "⚠️  Warning: Raw data bucket not accessible"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Upload model artifacts: ./scripts/upload_dummy_models.sh"
echo "2. Deploy AI core: ./scripts/deploy_stack2.sh"
echo ""
echo "💰 Cost Notice:"
echo "• S3 buckets: Free tier eligible (5GB storage)"
echo "• API Gateway: Free tier (1M requests/month)"
echo "• Kinesis: 1 shard, minimal cost (~$0.36/month)"
echo "• CloudWatch Logs: $LOG_RETENTION_DAYS day retention"
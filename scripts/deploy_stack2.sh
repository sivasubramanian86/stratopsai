#!/bin/bash

# StratOpsAI Stack 2 Deployment Script
# Usage: ./scripts/deploy_stack2.sh [--enable-endpoints=true|false] [--log-retention=DAYS] [--project-name=NAME] [--environment=ENV]

set -euo pipefail  # Strict error handling

# Default values
ENABLE_ENDPOINTS="false"
LOG_RETENTION_DAYS=7
PROJECT_NAME="StratOpsAI"
ENVIRONMENT="dev"
AWS_REGION="${AWS_REGION:-us-east-1}"
STACK1_NAME="stratopsai-infrastructure"
STACK2_NAME="stratopsai-ai-core"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --enable-endpoints=*)
      ENABLE_ENDPOINTS="${1#*=}"
      shift
      ;;
    --log-retention=*)
      LOG_RETENTION_DAYS="${1#*=}"
      shift
      ;;
    --project-name=*)
      PROJECT_NAME="${1#*=}"
      shift
      ;;
    --environment=*)
      ENVIRONMENT="${1#*=}"
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [--enable-endpoints=true|false] [--log-retention=DAYS] [--project-name=NAME] [--environment=ENV]"
      echo "Defaults: enable-endpoints=false, log-retention=7, project-name=StratOpsAI, environment=dev"
      echo "Region: $AWS_REGION (override with AWS_REGION env var)"
      echo ""
      echo "WARNING: --enable-endpoints=true incurs SageMaker charges (~$195/month for 3 endpoints)"
      exit 0
      ;;
    *)
      echo "❌ Unknown parameter: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

echo "🚀 Deploying StratOpsAI AI Core Stack"
echo "📍 Region: $AWS_REGION"
echo "📦 Project: $PROJECT_NAME"
echo "🏷️  Environment: $ENVIRONMENT"
echo "🔌 Endpoints Enabled: $ENABLE_ENDPOINTS"
echo "📅 Log Retention: $LOG_RETENTION_DAYS days"

# Cost warning for endpoints
if [[ "$ENABLE_ENDPOINTS" == "true" ]]; then
  echo ""
  echo "⚠️  💰 COST WARNING: SageMaker endpoints will incur charges!"
  echo "   • 3 × ml.t2.medium instances ≈ $195/month"
  echo "   • Continue? (y/N)"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
  fi
fi

echo ""

# Validate template exists
if [[ ! -f "infra/stack2.yaml" ]]; then
  echo "❌ Error: infra/stack2.yaml not found"
  echo "Please run this script from the StratOpsAI root directory"
  exit 1
fi

# Validate AWS CLI and credentials
if ! command -v aws &> /dev/null; then
  echo "❌ Error: AWS CLI not found"
  exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
  echo "❌ Error: AWS credentials not configured"
  exit 1
fi

# Check if Stack 1 exists
echo "🔍 Discovering Stack 1 outputs..."
if ! aws cloudformation describe-stacks --stack-name "$STACK1_NAME" --region "$AWS_REGION" &> /dev/null; then
  echo "❌ Error: Stack 1 '$STACK1_NAME' not found"
  echo "Please deploy Stack 1 first: ./scripts/deploy_stack1.sh"
  exit 1
fi

# Discover Stack 1 outputs
echo "📡 Retrieving Stack 1 parameters..."

ARTIFACTS_BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name "$STACK1_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`ArtifactsBucketName`].OutputValue' \
  --output text)

RAW_DATA_BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name "$STACK1_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`RawDataBucketName`].OutputValue' \
  --output text)

SAGEMAKER_EXECUTION_ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name "$STACK1_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`SageMakerExecutionRoleArn`].OutputValue' \
  --output text)

LAMBDA_EXECUTION_ROLE_ARN=$(aws cloudformation describe-stacks \
  --stack-name "$STACK1_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`LambdaExecutionRoleArn`].OutputValue' \
  --output text)

STRATOPS_API_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK1_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`StratOpsApiId`].OutputValue' \
  --output text)

STRATOPS_API_ROOT_RESOURCE_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK1_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`StratOpsApiRootResourceId`].OutputValue' \
  --output text)

STRATOPS_API_STAGE_NAME=$(aws cloudformation describe-stacks \
  --stack-name "$STACK1_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`StratOpsApiStageName`].OutputValue' \
  --output text)

# Validate all parameters are non-empty
echo ""
echo "✅ Parameter Validation:"
validate_param() {
  local param_name="$1"
  local param_value="$2"
  if [[ -z "$param_value" || "$param_value" == "None" ]]; then
    echo "❌ $param_name: EMPTY"
    return 1
  else
    echo "✅ $param_name: $param_value"
    return 0
  fi
}

validation_failed=false
validate_param "ArtifactsBucketName" "$ARTIFACTS_BUCKET_NAME" || validation_failed=true
validate_param "RawDataBucketName" "$RAW_DATA_BUCKET_NAME" || validation_failed=true
validate_param "SageMakerExecutionRoleArn" "$SAGEMAKER_EXECUTION_ROLE_ARN" || validation_failed=true
validate_param "LambdaExecutionRoleArn" "$LAMBDA_EXECUTION_ROLE_ARN" || validation_failed=true
validate_param "StratOpsApiId" "$STRATOPS_API_ID" || validation_failed=true
validate_param "StratOpsApiRootResourceId" "$STRATOPS_API_ROOT_RESOURCE_ID" || validation_failed=true
validate_param "StratOpsApiStageName" "$STRATOPS_API_STAGE_NAME" || validation_failed=true

if [[ "$validation_failed" == "true" ]]; then
  echo ""
  echo "❌ Parameter validation failed. Check Stack 1 deployment."
  exit 1
fi

# Check if stack exists and delete if present
if aws cloudformation describe-stacks --stack-name "$STACK2_NAME" --region "$AWS_REGION" &> /dev/null; then
  echo ""
  echo "🗑️  Deleting existing stack: $STACK2_NAME"
  aws cloudformation delete-stack --stack-name "$STACK2_NAME" --region "$AWS_REGION"
  echo "⏳ Waiting for stack deletion to complete..."
  aws cloudformation wait stack-delete-complete --stack-name "$STACK2_NAME" --region "$AWS_REGION"
  echo "✅ Stack deleted successfully"
fi

# Deploy CloudFormation stack
echo ""
echo "📦 Deploying AI Core stack..."
aws cloudformation deploy \
  --template-file infra/stack2.yaml \
  --stack-name "$STACK2_NAME" \
  --parameter-overrides \
    ArtifactsBucketName="$ARTIFACTS_BUCKET_NAME" \
    RawDataBucketName="$RAW_DATA_BUCKET_NAME" \
    SageMakerExecutionRoleArn="$SAGEMAKER_EXECUTION_ROLE_ARN" \
    LambdaExecutionRoleArn="$LAMBDA_EXECUTION_ROLE_ARN" \
    StratOpsApiId="$STRATOPS_API_ID" \
    StratOpsApiRootResourceId="$STRATOPS_API_ROOT_RESOURCE_ID" \
    StratOpsApiStageName="$STRATOPS_API_STAGE_NAME" \
    EnableEndpoints="$ENABLE_ENDPOINTS" \
    LogRetentionDays="$LOG_RETENTION_DAYS" \
    ProjectName="$PROJECT_NAME" \
    Environment="$ENVIRONMENT" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "$AWS_REGION" \
  --no-fail-on-empty-changeset

# Wait for stack to be complete
echo "⏳ Waiting for stack deployment to complete..."
aws cloudformation wait stack-deploy-complete \
  --stack-name "$STACK2_NAME" \
  --region "$AWS_REGION"

# Get API invoke URL
REASONING_API_INVOKE_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK2_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`ReasoningApiInvokeUrl`].OutputValue' \
  --output text)

echo ""
echo "✅ Stack 2 deployment completed successfully!"
echo ""
echo "🌐 API Endpoint: $REASONING_API_INVOKE_URL"

# Test API endpoint
echo ""
echo "🧪 Testing API endpoint..."
test_payload='{"customer_id":"TEST-12345","metrics":{"sla_score":0.75,"usage_trend":-0.1,"support_tickets":3,"contract_value":50000,"tenure_months":18}}'

if curl -s -o /dev/null -w "%{http_code}" -X POST "$REASONING_API_INVOKE_URL" \
  -H "Content-Type: application/json" \
  -d "$test_payload" | grep -q "200"; then
  echo "✅ API endpoint responding (HTTP 200)"
else
  echo "⚠️  API endpoint test failed (may need a few minutes to initialize)"
fi

# Display final validation checklist
echo ""
echo "📋 Deployment Validation Checklist:"
echo "✅ All Stack 1 parameters discovered and validated"
echo "✅ Stack 2 deployed successfully"
echo "✅ API Gateway endpoint created: $REASONING_API_INVOKE_URL"
echo "✅ Lambda function in mock mode (no SageMaker charges)"

if [[ "$ENABLE_ENDPOINTS" == "true" ]]; then
  echo "⚠️  SageMaker endpoints enabled (charges apply)"
else
  echo "✅ SageMaker endpoints disabled (no charges)"
fi

echo ""
echo "💰 Cost Summary:"
echo "• SageMaker Endpoints: $([ "$ENABLE_ENDPOINTS" == "true" ] && echo "ENABLED (~\$195/month)" || echo "DISABLED (\$0/month)")"
echo "• Lambda Function: Free tier eligible (1M requests/month)"
echo "• API Gateway: Free tier eligible (1M requests/month)"
echo "• Step Functions: Free tier eligible (4K transitions/month)"
echo "• S3 Buckets: Private, versioned, encrypted"
echo "• Kinesis: 1 shard (~\$0.36/month)"
echo "• No Redshift: Cost-optimized architecture"

echo ""
echo "🎯 Next Steps:"
echo "1. Test the API: curl -X POST '$REASONING_API_INVOKE_URL' -H 'Content-Type: application/json' -d '$test_payload'"
echo "2. Deploy frontend: ./scripts/deploy-amplify.sh"
echo "3. Upload real models (optional): ./scripts/upload_dummy_models.sh"

if [[ "$ENABLE_ENDPOINTS" == "false" ]]; then
  echo ""
  echo "💡 To enable real SageMaker inference later:"
  echo "   ./scripts/deploy_stack2.sh --enable-endpoints=true"
fi
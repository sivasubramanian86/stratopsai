#!/bin/bash

# Deploy Stack 2 with dynamic parameter discovery
set -e

echo "🚀 Deploying StratOpsAI AI Core Stack..."

# Check if infrastructure stack exists
if ! aws cloudformation describe-stacks --stack-name stratopsai-infrastructure >/dev/null 2>&1; then
  echo "❌ Error: Infrastructure stack 'stratopsai-infrastructure' not found"
  echo "Please deploy Stack 1 first using:"
  echo "aws cloudformation deploy --template-file infra/stack1.yaml --stack-name stratopsai-infrastructure --capabilities CAPABILITY_IAM"
  exit 1
fi

# Get environment (default to dev)
ENVIRONMENT=${1:-dev}

echo "🔍 Deploying to environment: $ENVIRONMENT"

# Deploy Stack 2
aws cloudformation deploy \
  --template-file infra/stack2.yaml \
  --stack-name stratopsai-ai-core \
  --parameter-overrides \
    Environment="$ENVIRONMENT" \
    InfraStackName=stratopsai-infrastructure \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# Wait for deployment to complete
echo "⏳ Waiting for stack deployment to complete..."
aws cloudformation wait stack-deploy-complete --stack-name stratopsai-ai-core

# Get API endpoint
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name stratopsai-ai-core \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text)

echo "✅ Stack 2 deployed successfully!"
echo "🌐 API Endpoint: $API_ENDPOINT"
echo ""
echo "🧪 Test the API:"
echo "curl -X POST \"$API_ENDPOINT/ai/reasoning\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"customer_id\": \"12345\", \"metrics\": {\"sla_score\": 0.85, \"usage_trend\": -0.1}}'"
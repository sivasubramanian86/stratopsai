#!/bin/bash

# Deploy Amplify Hosting for StratOpsAI Frontend
set -e

echo "🚀 Deploying StratOpsAI Frontend to AWS Amplify..."

# Check required parameters
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <github-repo-url> <github-token> [environment]"
  echo "Example: $0 https://github.com/username/StratOpsAI ghp_xxxxxxxxxxxx dev"
  exit 1
fi

GITHUB_REPO="$1"
GITHUB_TOKEN="$2"
ENVIRONMENT="${3:-dev}"

echo "🔍 Environment: $ENVIRONMENT"
echo "📂 Repository: $GITHUB_REPO"

# Get API endpoint from Stack 2
echo "🔍 Getting API endpoint from Stack 2..."
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name stratopsai-ai-core \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
  --output text)

if [ -z "$API_ENDPOINT" ]; then
  echo "❌ Error: Could not find API endpoint from Stack 2"
  echo "Please ensure Stack 2 (stratopsai-ai-core) is deployed first"
  exit 1
fi

echo "✅ Found API endpoint: $API_ENDPOINT"

# Deploy Amplify stack
echo "📦 Deploying Amplify hosting stack..."
aws cloudformation deploy \
  --template-file infra/amplify-hosting.yaml \
  --stack-name "stratopsai-amplify-${ENVIRONMENT}" \
  --parameter-overrides \
    Environment="$ENVIRONMENT" \
    GitHubRepository="$GITHUB_REPO" \
    GitHubToken="$GITHUB_TOKEN" \
    ApiEndpoint="$API_ENDPOINT" \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# Get Amplify app URL
echo "🔍 Getting Amplify app URL..."
AMPLIFY_URL=$(aws cloudformation describe-stacks \
  --stack-name "stratopsai-amplify-${ENVIRONMENT}" \
  --query 'Stacks[0].Outputs[?OutputKey==`AmplifyAppUrl`].OutputValue' \
  --output text)

CONSOLE_URL=$(aws cloudformation describe-stacks \
  --stack-name "stratopsai-amplify-${ENVIRONMENT}" \
  --query 'Stacks[0].Outputs[?OutputKey==`AmplifyConsoleUrl`].OutputValue' \
  --output text)

echo ""
echo "✅ Amplify deployment successful!"
echo "🌐 App URL: $AMPLIFY_URL"
echo "🎛️  Console: $CONSOLE_URL"
echo ""
echo "📝 Next steps:"
echo "1. Push your code to the connected GitHub repository"
echo "2. Amplify will automatically build and deploy your frontend"
echo "3. Visit the app URL to see your deployed application"
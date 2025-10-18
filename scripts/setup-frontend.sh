#!/bin/bash

# Setup frontend development environment
set -e

echo "🚀 Setting up StratOpsAI Frontend..."

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
  echo "❌ Error: Please run this script from the StratOpsAI root directory"
  exit 1
fi

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Get API endpoint from Stack 2 if deployed
echo "🔍 Checking for deployed API endpoint..."
if aws cloudformation describe-stacks --stack-name stratopsai-ai-core >/dev/null 2>&1; then
  API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name stratopsai-ai-core \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
    --output text)
  
  if [ ! -z "$API_ENDPOINT" ]; then
    echo "✅ Found API endpoint: $API_ENDPOINT"
    echo "REACT_APP_API_URL=$API_ENDPOINT" > .env
    echo "📝 Updated .env file with API endpoint"
  else
    echo "⚠️  API endpoint not found in Stack 2 outputs"
  fi
else
  echo "⚠️  Stack 2 not deployed. Using placeholder API URL."
  echo "Please update frontend/.env with your actual API endpoint after deploying Stack 2."
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "🛠️  Development commands:"
echo "  npm run dev    - Start development server"
echo "  npm run build  - Build for production"
echo "  npm test       - Run tests"
echo ""
echo "🌐 To start development server:"
echo "  cd frontend && npm run dev"
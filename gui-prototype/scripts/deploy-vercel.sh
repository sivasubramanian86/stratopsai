#!/bin/bash

# StratOpsAI - Vercel Deployment Script
# Deploys React GUI to Vercel with zero configuration

set -e

echo "🚀 StratOpsAI Vercel Deployment"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from gui-prototype directory."
    exit 1
fi

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project
echo "🔨 Building React app..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "💡 Your app is now live on Vercel"
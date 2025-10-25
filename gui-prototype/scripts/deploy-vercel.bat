@echo off
REM StratOpsAI - Vercel Deployment Script (Windows)
REM Deploys React GUI to Vercel with zero configuration

echo 🚀 StratOpsAI Vercel Deployment
echo ================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Run this script from gui-prototype directory.
    exit /b 1
)

REM Install Vercel CLI if not present
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Build the project
echo 🔨 Building React app...
npm run build

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 💡 Your app is now live on Vercel
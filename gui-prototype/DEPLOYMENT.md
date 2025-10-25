# StratOpsAI GUI Deployment Guide

This guide covers deploying the StratOpsAI React frontend to Vercel - a modern, developer-friendly platform.

## Why Vercel?

- **Zero configuration** - Works out of the box with Vite
- **Free tier** - Generous limits for personal projects
- **Fast deployments** - Global CDN and edge functions
- **Git integration** - Auto-deploy on push
- **Custom domains** - Free SSL certificates

## Deployment Options

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy from gui-prototype directory:**
```bash
cd gui-prototype
npm install
npm run build
vercel --prod
```

3. **Follow prompts:**
   - Link to existing project or create new
   - Confirm build settings (auto-detected)
   - Get live URL instantly

### Option 2: GitHub Integration (Auto-deploy)

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Add StratOpsAI GUI"
git push origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Vite configuration
   - Deploy automatically

3. **Configure environment variables:**
   - In Vercel dashboard, go to Settings > Environment Variables
   - Add: `VITE_API_URL` = `your-api-gateway-url`

### Option 3: Automated Script

Use the provided deployment script:
```bash
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

## Cost Breakdown

### Vercel Free Tier
- **Bandwidth**: 100 GB/month
- **Build executions**: 6,000 minutes/month
- **Serverless functions**: 100 GB-hours/month
- **Projects**: Unlimited
- **Custom domains**: Unlimited with SSL

**Total monthly cost: $0** (very generous free tier)

### Pro Tier ($20/month)
- **Bandwidth**: 1 TB/month
- **Build executions**: 24,000 minutes/month
- **Advanced analytics**
- **Team collaboration**

## Build Configuration

Vercel auto-detects Vite projects with `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## Environment Variables

Set in Vercel Dashboard > Settings > Environment Variables:
- `VITE_API_URL`: Your API Gateway endpoint from Stack 2
- `NODE_VERSION`: `18` (optional)

## Custom Domain

1. In Vercel Dashboard, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-provisioned

## Performance Features

- **Global CDN**: 40+ edge locations
- **Automatic optimization**: Image optimization, compression
- **Analytics**: Core Web Vitals tracking
- **Preview deployments**: Every git push gets a URL

## Monitoring

- **Real-time logs**: Function logs and build logs
- **Analytics**: Traffic, performance metrics
- **Alerts**: Email notifications for deployments

## Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Verify Node.js version compatibility
- Ensure all dependencies are listed

### Environment Variables
- Must have VITE_ prefix for client-side
- Redeploy after adding variables

### CORS Issues
- Update API Gateway CORS settings
- Add Vercel domain to allowed origins

## Security

- HTTPS by default on all deployments
- DDoS protection included
- Security headers automatically applied
- Preview deployments are password-protected

---

**Quick Start:**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd gui-prototype
vercel --prod

# 3. Set environment variables in dashboard
# 4. Your app is live!
```
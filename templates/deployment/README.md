# Deployment Configuration Templates

This directory contains deployment configuration files for various hosting platforms.

## Supported Platforms

### 1. Vercel (Recommended for Next.js)
- **File**: `vercel.json`
- **Setup**:
  1. Install Vercel CLI: `npm i -g vercel`
  2. Run `vercel` in your site directory
  3. Follow prompts
- **Auto-deployment**: Connect GitHub repo for automatic deployments

### 2. Netlify
- **File**: `netlify.toml`
- **Setup**:
  1. Copy `netlify.toml` to your site root
  2. Connect site to Netlify via dashboard or CLI
  3. Push to deploy
- **Plugin**: Automatically uses `@netlify/plugin-nextjs`

### 3. Cloudflare Pages
- **File**: `cloudflare-pages.md`
- **Setup**: See instructions in the file
- **Best for**: Static export sites with global CDN

### 4. GitHub Pages
- **File**: `github-pages.yml`
- **Setup**:
  1. Copy to `.github/workflows/deploy.yml`
  2. Enable GitHub Pages in repo settings
  3. Push to main branch
- **Limitations**: Static export only, no server-side features

### 5. AWS (S3 + CloudFront)
- **Setup**:
  1. Build static export: `npm run build && npm run export`
  2. Upload `out/` directory to S3 bucket
  3. Configure CloudFront distribution
  4. Point custom domain

### 6. Oracle Cloud
- **Setup**:
  1. Create compute instance
  2. Install Node.js
  3. Clone repo and build
  4. Run with PM2: `pm2 start npm --name "site" -- start`

### 7. Cloudways
- **Setup**:
  1. Create application (Node.js)
  2. Clone repo via SSH
  3. Install dependencies
  4. Configure web server (Nginx/Apache)
  5. Set up SSL certificate

## Custom Domain Setup

### DNS Configuration
For all platforms, configure your DNS:

```
A Record:    @ → [Platform IP]
CNAME:       www → [Platform domain]
```

### SSL/HTTPS
- Vercel: Automatic
- Netlify: Automatic
- Cloudflare: Automatic
- Others: Use Let's Encrypt

## Environment Variables

Set these in your hosting platform:

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Performance Optimization

### Next.js Optimization
- Enable image optimization
- Use static generation where possible
- Minimize JavaScript bundles

### CDN Configuration
- Enable caching headers
- Compress assets (gzip/brotli)
- Use edge locations

## Monitoring

Recommended monitoring services:
- Vercel Analytics (built-in)
- Google Analytics
- Cloudflare Web Analytics
- New Relic
- Sentry (error tracking)

## CI/CD Pipeline

Example GitHub Actions workflow for multi-platform:

```yaml
name: Deploy to Multiple Platforms

on:
  push:
    branches: [main]

jobs:
  deploy-vercel:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-netlify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Troubleshooting

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for environment variable issues

### Deployment Issues
- Verify build output directory is correct
- Check platform-specific build commands
- Review deployment logs

### Performance Issues
- Enable caching
- Optimize images
- Minimize bundle size
- Use CDN

## Support

For platform-specific issues, refer to:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Cloudflare Docs](https://developers.cloudflare.com/pages)
- [GitHub Pages Docs](https://docs.github.com/pages)

# Cloudflare Pages Deployment

## Configuration

- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `npm run build && npm run export`
- **Build output directory**: `out`

## Environment Variables

Set these in Cloudflare Pages dashboard:
- `NODE_VERSION=18`

## Build Settings

Update `package.json`:

```json
{
  "scripts": {
    "export": "next export"
  }
}
```

Update `next.config.js`:

```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true
  }
}
```

## Deployment Steps

1. Connect your GitHub repository
2. Configure build settings as above
3. Deploy
4. Custom domain: Settings → Custom domains

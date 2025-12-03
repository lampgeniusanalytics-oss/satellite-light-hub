# Satellite Light Hub

Collection of satellite lighting websites, each focusing on specific product categories.

## Sites

### 1. Lighting and Lights UK
- **Location**: `sites/lightingandlightsuk/`
- **Category**: Ceiling Lights
- **Technology**: Next.js 15 + TypeScript
- **Status**: Ready to deploy

## Structure

Each site is a standalone Next.js application in its own directory:
```
sites/
├── lightingandlightsuk/    # Site #1 - Ceiling Lights
├── [site2]/                # Future sites...
└── [site3]/
```

## Deploying a Site

Each site can be deployed independently to Vercel:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this repository
3. Set **Root Directory** to the site path (e.g., `sites/lightingandlightsuk`)
4. Deploy

## Development

To work on a specific site locally:

```bash
cd sites/[site-name]
npm install
npm run dev
```

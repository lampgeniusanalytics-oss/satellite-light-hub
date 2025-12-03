# Vercel Setup Instructions

## Required Environment Variables

You **MUST** set these environment variables in your Vercel project settings:

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard → Your Project → Settings → Environment Variables

### 2. Add These Variables

#### NEXTAUTH_URL
```
NEXTAUTH_URL=https://your-deployment-url.vercel.app
```
**Replace with your actual Vercel deployment URL**

#### NEXTAUTH_SECRET
```
NEXTAUTH_SECRET=your-random-secret-here
```

**Generate a random secret:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use this website:
# https://generate-secret.vercel.app/32
```

### 3. Redeploy

After adding environment variables, redeploy your app:
```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

---

## Troubleshooting

### "Server error" on login page

**Cause**: Missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL`

**Fix**: Add both environment variables and redeploy

### Database resets on every deployment

**Expected behavior** - SQLite on Vercel is ephemeral.

**Solution for production**: Migrate to Vercel Postgres (see VERCEL_DEPLOYMENT.md)

### Check Logs

View real-time logs on Vercel:
1. Go to your project dashboard
2. Click "Deployments"
3. Click on latest deployment
4. Click "View Function Logs"

Look for:
- `🚀 Running on Vercel, auto-initializing database...`
- `✅ Database initialized successfully`
- `🔐 Attempting authentication...`

---

## Quick Test

After setup, test the login:
1. Go to your Vercel URL
2. Login with:
   - Username: `admin`
   - Password: `James1234`
3. Should redirect to dashboard

If you see errors, check the Function Logs on Vercel!

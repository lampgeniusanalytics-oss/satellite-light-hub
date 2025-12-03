# Vercel Deployment Notes

## ⚠️ Important: Database Limitations on Vercel

The current implementation uses **SQLite**, which has limitations on Vercel's serverless platform:

### Current Behavior
- ✅ Works on Vercel with auto-initialization
- ⚠️ Database stored in `/tmp` (ephemeral storage)
- ⚠️ Data resets on each deployment
- ⚠️ Data may reset during cold starts

### What This Means
1. **Login works** - Default admin user is auto-created
2. **Sites you create will be lost** on redeployment
3. **RSS feeds need reconfiguration** after resets
4. **This is OK for testing/demo** but not for production

### For Production Use

Choose one of these database solutions:

#### Option 1: Vercel Postgres (Recommended)
```bash
# Install Vercel Postgres
npm install @vercel/postgres

# Add to your project
vercel postgres create
```

Then update `lib/database/schema.ts` to use Postgres instead of SQLite.

#### Option 2: PlanetScale (MySQL)
- Free tier available
- Good performance
- Easy Vercel integration

#### Option 3: Supabase (Postgres)
- Free tier available
- Includes authentication
- Real-time features

#### Option 4: MongoDB Atlas
- Free tier available
- NoSQL flexibility
- Good for this use case

### Recommended Setup Steps

1. **Development**: Use SQLite (current setup)
2. **Demo/Testing**: Deploy to Vercel with ephemeral SQLite
3. **Production**: Migrate to Vercel Postgres or PlanetScale

### How to Migrate to Vercel Postgres

1. Create a Vercel Postgres database:
   ```bash
   vercel postgres create satellite-hub-db
   ```

2. Get connection string from Vercel dashboard

3. Update `lib/database/schema.ts` to use Postgres:
   ```typescript
   import { sql } from '@vercel/postgres';
   ```

4. Convert SQLite schema to Postgres (we can help with this)

5. Redeploy

### Current Default Credentials

On every deployment/restart:
- **Username**: admin
- **Password**: James1234

These are automatically created on first access.

### Local Development

For local development, SQLite works perfectly:
```bash
npm run init-db  # One-time setup
npm run dev
```

Data persists in `database/satellite-hub.db` locally.

---

**Need help migrating to a persistent database?** Let me know and I can help set up Vercel Postgres or another solution.

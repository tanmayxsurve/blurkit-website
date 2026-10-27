# 🚀 Cloudflare Pages Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Install Wrangler CLI (if not already installed)
```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare
```bash
wrangler login
```

### Step 3: Deploy to Cloudflare Pages

**Option A: Via Wrangler CLI (Recommended)**
```bash
# First, build the project for Cloudflare Pages
npx @cloudflare/next-on-pages

# Deploy to Cloudflare Pages
wrangler pages deploy .vercel/output/static --project-name=blurkit
```

**Option B: Via Cloudflare Dashboard (Easier for first time)**
1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** > **Create application** > **Pages**
3. Connect your GitHub account
4. Select repository: `tanmayxsurve/blurkit-website`
5. Use these build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/` (leave empty)
   - **Node version**: `20`

### Step 4: Set Environment Variables

In Cloudflare dashboard (Settings > Environment variables):

```
DATABASE_URL = postgresql://user:password@host.neon.tech/blurkit?sslmode=require
RESEND_API_KEY = re_xxxxxxxxxxxxx
DODO_PAYMENTS_SECRET = your_dodo_payments_secret_key
NEXT_PUBLIC_APP_URL = https://blurkit.pages.dev
```

**How to get these values:**
- `DATABASE_URL`: From your Neon dashboard (https://console.neon.tech)
- `RESEND_API_KEY`: From Resend dashboard (https://resend.com/api-keys)
- `DODO_PAYMENTS_SECRET`: From Dodo Payments dashboard
- `NEXT_PUBLIC_APP_URL`: Your Cloudflare Pages URL (shown after first deploy)

### Step 5: Run Database Migration

After deployment, run the SQL migration in your Neon console:

```sql
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS device_id VARCHAR(64);
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS activated_at TIMESTAMP;
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_licenses_device_id ON licenses(device_id);
CREATE INDEX IF NOT EXISTS idx_licenses_key_device ON licenses(key, device_id);
```

Location: `migrations/001_add_device_binding.sql`

---

## 🌐 Your Cloudflare Pages URL

After deployment, you'll get a URL like:
```
https://blurkit.pages.dev
```

Or with random suffix:
```
https://blurkit-abc.pages.dev
```

**Use this URL in your extension!**

---

## 🔧 Update Extension URLs

Once deployed, update your extension to use the Cloudflare Pages URL:

**File**: `blurkit-wxt/utils/license-manager.ts`

**Lines 193 and 271**, replace with:
```typescript
const ACTIVATION_URL = 'https://blurkit.pages.dev/api/license/activate';
const VALIDATION_URL = 'https://blurkit.pages.dev/api/license/validate';
```

Then rebuild the extension:
```bash
cd ../blurkit-wxt
npm run build
```

---

## 🧪 Testing

### Test Payment Flow
1. Visit: `https://blurkit.pages.dev`
2. Click "Get BlurKit"
3. Complete test payment (use test card if available)
4. Check email for license key
5. Enter key in extension
6. Verify activation works

### Test API Endpoints

**Activation:**
```bash
curl -X POST https://blurkit.pages.dev/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "BLURKIT-XXXX-XXXX-XXXX-XXXX",
    "deviceId": "test-device-123"
  }'
```

**Validation:**
```bash
curl -X POST https://blurkit.pages.dev/api/license/validate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "BLURKIT-XXXX-XXXX-XXXX-XXXX",
    "deviceId": "test-device-123"
  }'
```

---

## 🔄 Redeploy / Update

### Automatic (via GitHub)
Push to the `main` branch:
```bash
git push origin main
```
Cloudflare automatically rebuilds and deploys!

### Manual (via Wrangler)
```bash
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static --project-name=blurkit
```

---

## 🎯 Custom Domain (Later)

When you buy a domain:

1. Go to Cloudflare Pages project settings
2. Click **Custom domains**
3. Add your domain (e.g., `blurkit.com`)
4. Update DNS records as shown
5. Update `NEXT_PUBLIC_APP_URL` environment variable
6. Update extension URLs
7. Rebuild extension

---

## 📊 Monitoring

**Check deployment status:**
- Dashboard: https://dash.cloudflare.com
- Deployment logs: In project > Deployments tab
- Analytics: In project > Analytics tab

**Check API health:**
```bash
curl https://blurkit.pages.dev/api/license/activate
# Should return 405 (Method Not Allowed) - means endpoint exists
```

---

## ⚠️ Common Issues

### Build fails with "Module not found"
**Solution**: Make sure all dependencies are in `dependencies`, not `devDependencies`

### Database connection fails
**Solution**: 
1. Check `DATABASE_URL` is set correctly
2. Ensure connection string includes `?sslmode=require`
3. Verify Neon database is accessible

### API returns 500 errors
**Solution**:
1. Check Cloudflare Functions logs
2. Verify all environment variables are set
3. Check database migration was run

### Extension can't connect
**Solution**:
1. Verify URL in extension matches deployed URL
2. Check CORS settings (should work by default)
3. Look at browser console for errors

---

## 🎉 Success Checklist

- [ ] Website deployed to Cloudflare Pages
- [ ] Environment variables configured
- [ ] Database migration executed
- [ ] API endpoints responding
- [ ] Extension URLs updated
- [ ] Extension rebuilt
- [ ] End-to-end payment flow tested
- [ ] License activation tested
- [ ] Device binding verified

---

## 📞 Useful Links

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Next.js on Pages Docs**: https://developers.cloudflare.com/pages/framework-guides/nextjs/
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **Neon Console**: https://console.neon.tech
- **Resend Dashboard**: https://resend.com/api-keys

---

**Estimated deployment time**: 5-10 minutes  
**Free tier limits**: 500 builds/month, unlimited requests  
**Cost**: $0 (Free forever for most projects)

🚀 **Ready to deploy!**

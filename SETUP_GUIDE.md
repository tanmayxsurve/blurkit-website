# 🚀 BlurKit Website - Complete Setup Guide

**Last Updated**: October 27, 2026  
**Status**: Ready for Deployment  
**Estimated Setup Time**: 20-30 minutes

---

## 📋 Prerequisites

Before starting, you'll need:
- [ ] Neon PostgreSQL account (https://console.neon.tech)
- [ ] Dodo Payments account (https://dodopayments.com)
- [ ] Resend email account (https://resend.com)
- [ ] Cloudflare account (https://dash.cloudflare.com)
- [ ] GitHub account with access to this repo

---

## 🗄️ Step 1: Database Setup (5 minutes)

### 1.1 Create Neon Database

1. Go to https://console.neon.tech
2. Create new project or use existing one
3. Note your database credentials:
   - **Host**: `xxxxx.neon.tech`
   - **Database**: `blurkit`
   - **User**: `postgres` or your username
   - **Password**: Your password

### 1.2 Initialize Schema

1. In Neon console, click **SQL Editor**
2. Copy entire contents of `migrations/000_initial_schema.sql`
3. Paste into the SQL Editor
4. Click **Execute**
5. ✅ Verify all 3 tables were created:
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('orders', 'licenses', 'webhook_events');
   ```

### 1.3 Run Device Binding Migration

1. Copy contents of `migrations/001_add_device_binding.sql`
2. Paste into Neon SQL Editor
3. Click **Execute**
4. ✅ Verify new columns exist:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'licenses' 
   ORDER BY ordinal_position;
   ```

### 1.4 Get Connection String

1. In Neon console, go to **Connection string**
2. Select **Connection string** tab
3. Copy the full connection string
4. Should look like:
   ```
   postgresql://user:password@xxxxx.neon.tech/blurkit?sslmode=require
   ```
5. Save this for Step 3

---

## 💳 Step 2: Payment Setup (5 minutes)

### 2.1 Dodo Payments Configuration

1. Go to https://dashboard.dodopayments.com
2. Navigate to **Settings → API Keys**
3. Copy **Secret Key** (starts with `dodo_sk_`)
4. Copy **Webhook Secret**
5. Save both for Step 3

### 2.2 Create Product/Plan

1. In Dodo dashboard, go to **Products**
2. Create product: "BlurKit Pro"
3. Create two prices:
   - **Monthly**: $19.99/month (Plan ID: `pro_monthly`)
   - **Lifetime**: $99.99 one-time (Plan ID: `pro_lifetime`)
4. Note the Plan IDs for your frontend

### 2.3 Configure Webhooks

1. In Dodo dashboard, go to **Webhooks**
2. Add new webhook endpoint:
   - **URL**: `https://your-domain.pages.dev/api/payment/webhook`
   - **Events**: Select `payment.completed`
3. Copy the **Webhook Secret** (you'll need this in Step 3)
4. Save webhook

---

## 📧 Step 3: Email Setup (3 minutes)

### 3.1 Resend Configuration

1. Go to https://resend.com
2. Navigate to **API Keys**
3. Create new API key (or copy existing)
4. Save the API key (starts with `re_`)

### 3.2 Verify Sender Email

1. Go to **Sender Identities** in Resend
2. Add your sender email (e.g., `hello@blurkit.dev`)
3. Verify the email (Resend will send verification link)
4. Wait for verification
5. Use verified email as `RESEND_FROM_EMAIL`

---

## 🔧 Step 4: Environment Variables (5 minutes)

### 4.1 Create Local .env File

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your values:
   ```bash
   DATABASE_URL=postgresql://user:pass@xxxxx.neon.tech/blurkit?sslmode=require
   DODO_SECRET_KEY=dodo_sk_live_xxxxxxxxxxxxx
   DODO_WEBHOOK_SECRET=dodo_webhook_secret_xxxxxxxxxxxxx
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=BlurKit <hello@blurkit.dev>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_CHROME_STORE_URL=https://chrome.google.com/webstore/detail/blurkit/YOUR_EXTENSION_ID
   ```

3. ⚠️ **Never commit this file to git** (it's in `.gitignore`)

---

## 🧪 Step 5: Local Testing (10 minutes)

### 5.1 Install Dependencies

```bash
cd /home/tanmay/Projects/blurkit-website
npm install
```

### 5.2 Run Development Server

```bash
npm run dev
```

Expected output:
```
▲ Next.js 16.4.3
- Local:        http://localhost:3000
- Environments: .env.local
```

### 5.3 Test Landing Page

1. Open http://localhost:3000 in browser
2. ✅ Verify page loads without errors
3. ✅ Check console for any errors (F12)
4. ✅ Click "Get BlurKit" button

### 5.4 Test Checkout Flow

1. Click "Get BlurKit" button
2. Should redirect to Dodo checkout
3. Enter test payment details (Dodo provides test cards)
4. Complete "payment"
5. Check your email for license key
6. ✅ License key should arrive within 1 minute

### 5.5 Test API Endpoints

**Test License Activation:**
```bash
curl -X POST http://localhost:3000/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "BLURKIT-1234-5678-9ABC-DEF0",
    "deviceId": "test-device-123"
  }'
```

Expected response:
```json
{
  "success": false,
  "error": "Invalid license key"
}
```
(Because it's a fake key - that's OK, it proves the endpoint works)

---

## 🚀 Step 6: Deploy to Cloudflare Pages (5 minutes)

### 6.1 Connect to GitHub

1. Go to https://dash.cloudflare.com
2. Click **Workers & Pages**
3. Click **Create application** → **Pages** → **Connect to Git**
4. Select **GitHub**
5. Select repository: `tanmayxsurve/blurkit-website`
6. Authorize if needed

### 6.2 Configure Build Settings

1. **Framework preset**: Next.js
2. **Build command**: `npm run build`
3. **Build output directory**: `.next`
4. **Root directory**: `/` (leave blank)
5. **Node version**: 20

### 6.3 Set Environment Variables

1. Click **Settings** in your Pages project
2. Go to **Environment variables**
3. Add each variable from your `.env`:
   - `DATABASE_URL`
   - `DODO_SECRET_KEY`
   - `DODO_WEBHOOK_SECRET`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `NEXT_PUBLIC_APP_URL` = `https://your-project.pages.dev`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-project.pages.dev`
   - `NEXT_PUBLIC_CHROME_STORE_URL`

4. Click **Save**

### 6.4 Deploy

1. Click **Create production deployment** or push to GitHub
2. Wait for build to complete (3-5 minutes)
3. Get your URL: `https://blurkit-xxxxx.pages.dev`

### 6.5 Update Webhook URL

1. Go back to Dodo dashboard
2. Update webhook URL to production:
   ```
   https://blurkit-xxxxx.pages.dev/api/payment/webhook
   ```
3. Save

---

## 🔄 Step 7: Update Extension URLs (2 minutes)

Once you have your Cloudflare Pages URL:

1. Open `blurkit-wxt/utils/license-manager.ts`
2. Find lines 193 and 271
3. Replace:
   ```typescript
   // OLD
   https://blurkit.vercel.app/api/activate-license
   https://blurkit.vercel.app/api/validate-license
   
   // NEW
   https://blurkit-xxxxx.pages.dev/api/license/activate
   https://blurkit-xxxxx.pages.dev/api/license/validate
   ```

4. Rebuild extension:
   ```bash
   cd ../blurkit-wxt
   npm run build
   ```

---

## ✅ Complete Checklist

### Database
- [ ] Neon database created
- [ ] Initial schema (000) executed
- [ ] Device binding migration (001) executed
- [ ] All 3 tables verified to exist
- [ ] All indexes created

### Integrations
- [ ] Dodo Payments account configured
- [ ] Payment webhooks set up
- [ ] Resend email service configured
- [ ] Sender email verified
- [ ] API keys saved securely

### Local Setup
- [ ] `.env` file created with all credentials
- [ ] `npm install` completed
- [ ] `npm run dev` works
- [ ] Landing page loads
- [ ] API endpoints respond

### Testing
- [ ] Checkout flow tested (or at least attempted)
- [ ] License activation endpoint works
- [ ] License validation endpoint works
- [ ] Email sending verified

### Deployment
- [ ] GitHub integration connected
- [ ] Environment variables set in Cloudflare
- [ ] Website deployed to Cloudflare Pages
- [ ] Production URL obtained
- [ ] Webhook URL updated to production
- [ ] Extension URLs updated
- [ ] Extension rebuilt

### Final
- [ ] End-to-end payment flow tested on production
- [ ] License email received
- [ ] License key activated on extension
- [ ] Ready to launch! 🚀

---

## 🆘 Troubleshooting

### "DATABASE_URL is not set"
- **Issue**: Environment variables not loaded
- **Fix**: Verify `.env` file exists and has correct format
- **Local**: Restart `npm run dev`
- **Production**: Check Cloudflare dashboard environment variables

### "Failed to create checkout session"
- **Issue**: Dodo Payments API key invalid
- **Fix**: 
  1. Verify `DODO_SECRET_KEY` is correct
  2. Check it starts with `dodo_sk_`
  3. Verify it's in production Cloudflare env vars

### "Invalid webhook signature"
- **Issue**: Webhook secret mismatch
- **Fix**:
  1. Copy `DODO_WEBHOOK_SECRET` exactly from Dodo dashboard
  2. Make sure it matches in Cloudflare env vars
  3. Redeploy Cloudflare Pages

### "License key email not received"
- **Issue**: Resend email not sending
- **Fix**:
  1. Check `RESEND_API_KEY` is correct
  2. Verify sender email is verified in Resend
  3. Check spam/promotions folder
  4. Check Resend dashboard logs

### "License activation fails with 'tables don't exist'"
- **Issue**: Migration not executed
- **Fix**: Run `migrations/000_initial_schema.sql` in Neon console

---

## 📞 Support Resources

- **Neon Docs**: https://neon.tech/docs
- **Dodo Payments Docs**: https://dodopayments.com/docs
- **Resend Docs**: https://resend.com/docs
- **Cloudflare Pages**: https://developers.cloudflare.com/pages
- **Next.js Docs**: https://nextjs.org/docs

---

## 🎯 Summary

You now have everything needed to:
1. ✅ Set up your database
2. ✅ Configure payments
3. ✅ Set up email delivery
4. ✅ Test locally
5. ✅ Deploy to production
6. ✅ Launch BlurKit! 🚀

**Estimated total time**: 20-30 minutes

**Next steps**: Follow the checklist above in order. You've got this! 💪

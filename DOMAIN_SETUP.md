# Moving BlurKit Website to Custom Domain

## Current Status
- **Project Name:** blurkit-website
- **Current URL:** https://blurkit-website.pages.dev
- **Target Domain:** blurkit.app
- **DNS Provider:** Cloudflare

## Steps to Add Custom Domain

### Via Cloudflare Dashboard (Recommended)

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com

2. **Navigate to Pages Project**
   - Left sidebar → Pages
   - Click "blurkit-website" project

3. **Add Custom Domain**
   - Go to "Custom Domains" tab
   - Click "Set up a custom domain"
   - Enter: `blurkit.app`
   - Click "Continue"

4. **DNS Configuration**
   - Cloudflare will show you the required DNS records
   - Since blurkit.app is already on Cloudflare nameservers, records may auto-configure
   - If not, add/update:
     - **Type:** CNAME
     - **Name:** @ (or leave blank for root)
     - **Target:** blurkit-website.pages.dev
     - **TTL:** Auto (or 3600)

5. **Verify Domain**
   - Wait for DNS propagation (usually 1-2 minutes)
   - Cloudflare will auto-verify once DNS is configured

### Update Application Configuration

Once domain is active, update these files:

#### 1. .env
```bash
NEXT_PUBLIC_SITE_URL=https://blurkit.app
RESEND_FROM_EMAIL=BlurKit <noreply@blurkit.app>
```

#### 2. workers/payment-api/wrangler.toml
```toml
[vars]
NEXT_PUBLIC_SITE_URL = "https://blurkit.app"
```

#### 3. Redeploy Worker
```bash
cd workers/payment-api
wrangler deploy
```

#### 4. Git Commit
```bash
git add -A
git commit -m "Update site URLs for blurkit.app domain"
git push origin main
```

### Verify Setup
- [ ] Website loads at https://blurkit.app
- [ ] Checkout flow works (verify Dodo webhook URL)
- [ ] License emails send correctly to noreply@blurkit.app
- [ ] SSL certificate shows as valid
- [ ] blurkit-website.pages.dev redirects to blurkit.app (optional, can set up)

### SSL/TLS
- Cloudflare Pages automatically provisions SSL certificates
- Should be active within minutes of domain verification

### Email Sender Domain Update
Once domain is verified, update Resend:
1. Go to https://dashboard.resend.com
2. Add blurkit.app as verified domain
3. Add SPF/DKIM records to your Cloudflare DNS settings per Resend's instructions
4. Verify domain in Resend (may take 24-48 hours for DNS propagation)
5. Update RESEND_FROM_EMAIL to use your domain instead of onboarding@resend.dev

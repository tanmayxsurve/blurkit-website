# BlurKit Payment API Worker

This Cloudflare Worker handles payment checkout API calls for the BlurKit website.

## Setup

1. **Install dependencies:**
   ```bash
   cd workers/payment-api
   npm install
   ```

2. **Set up secrets:**
   ```bash
   # Set your Dodo Payments secret key
   npx wrangler secret put DODO_SECRET_KEY
   # When prompted, paste your Dodo test secret key
   ```

3. **Test locally:**
   ```bash
   npm run dev
   ```

4. **Deploy to Cloudflare:**
   ```bash
   npm run deploy
   ```

## After Deployment

After deploying, you'll get a Worker URL like:
`https://blurkit-payment-api.YOUR_SUBDOMAIN.workers.dev`

**Update the frontend:**

1. Add this environment variable to Cloudflare Pages (Settings → Environment variables):
   ```
   NEXT_PUBLIC_PAYMENT_WORKER_URL=https://blurkit-payment-api.YOUR_SUBDOMAIN.workers.dev
   ```

2. Redeploy the Pages site

## Testing the Worker

Test with curl:
```bash
curl -X POST https://blurkit-payment-api.YOUR_SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"planId": "pdt_0NqhQec3BvgM8158TvkbE"}'
```

Should return:
```json
{
  "checkoutUrl": "https://test.checkout.dodopayments.com/session/...",
  "sessionId": "cks_..."
}
```

## Environment Variables

The worker needs:
- `DODO_SECRET_KEY` (secret) - Your Dodo Payments API key (set via `wrangler secret put`)
- `NEXT_PUBLIC_SITE_URL` (plain text in wrangler.toml) - Your website URL for CORS and redirects

## CORS Configuration

The worker automatically allows CORS requests from your site URL configured in `NEXT_PUBLIC_SITE_URL`.


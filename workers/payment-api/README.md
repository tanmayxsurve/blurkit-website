# BlurKit Payment API Worker

This Cloudflare Worker handles payment checkout API calls and webhook events for the BlurKit website. It integrates with Dodo Payments, Resend for emails, and Neon for license storage.

## Setup

### 1. Install dependencies
```bash
cd workers/payment-api
npm install
```

### 2. Set up database (Neon)

1. Create a Neon project at https://console.neon.tech
2. Get your database connection string
3. Run the schema:
   ```bash
   psql "YOUR_DATABASE_URL" < schema.sql
   ```

### 3. Set up secrets

Set all required secrets using wrangler:

```bash
# Dodo Payments secret key
wrangler secret put DODO_SECRET_KEY
# Paste your Dodo test secret key when prompted

# Dodo webhook secret (for signature verification)
wrangler secret put DODO_WEBHOOK_SECRET
# Paste a random string or your Dodo webhook secret

# Resend API key (for sending emails)
wrangler secret put RESEND_API_KEY
# Paste your Resend API key

# Neon database URL
wrangler secret put DATABASE_URL
# Paste your Neon connection string
```

### 4. Test locally

```bash
npm run dev
```

Test the endpoints:
```bash
# Test checkout endpoint
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{"planId": "pdt_0NqhQec3BvgM8158TvkbE", "email": "test@example.com"}'

# Test webhook endpoint
curl -X POST http://localhost:8787/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.completed",
    "data": {
      "session_id": "cks_test123",
      "status": "completed",
      "customer": {"email": "user@example.com"},
      "metadata": {"plan": "pdt_0NqhQec3BvgM8158TvkbE"},
      "product_cart": [{"product_id": "pdt_0NqhQec3BvgM8158TvkbE", "quantity": 1}]
    }
  }'
```

### 5. Deploy to Cloudflare

```bash
npm run deploy
```

You'll get a Worker URL like:
```
https://blurkit-payment-api.YOUR_SUBDOMAIN.workers.dev
```

## Configuration

### Frontend Update

Add environment variable to Cloudflare Pages:

```
NEXT_PUBLIC_PAYMENT_WORKER_URL=https://blurkit-payment-api.YOUR_SUBDOMAIN.workers.dev
```

Then redeploy the Pages site.

### Dodo Payments Webhook

1. Go to your Dodo dashboard: https://dashboard.dodopayments.com
2. Settings → Webhooks
3. Add webhook URL:
   ```
   https://blurkit-payment-api.YOUR_SUBDOMAIN.workers.dev/webhook
   ```
4. Select event: `checkout.completed`
5. Copy the webhook secret and run:
   ```bash
   wrangler secret put DODO_WEBHOOK_SECRET
   ```

## API Endpoints

### POST / - Create Checkout

**Request:**
```json
{
  "planId": "pdt_0NqhQec3BvgM8158TvkbE",
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://test.checkout.dodopayments.com/session/...",
  "sessionId": "cks_..."
}
```

### POST /webhook - Payment Webhook

Receives payment completion events from Dodo. Automatically:
1. Generates a license key
2. Saves to Neon database
3. Sends license email via Resend

## Email Template

When a payment succeeds, the customer receives an email with:
- Their unique license key (format: `BLURKIT-XXXX-XXXX-XXXX-XXXX`)
- Instructions on how to use the license
- Support contact information

## Database Schema

**licenses table:**
- `id` - Primary key
- `email` - Customer email
- `license_key` - Unique license key
- `plan_id` - Purchased plan ID
- `session_id` - Dodo session ID
- `created_at` - Purchase timestamp

**license_validations table (optional):**
- Track license usage and validation

## Environment Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `DODO_SECRET_KEY` | Secret | Yes | Dodo Payments API key |
| `DODO_WEBHOOK_SECRET` | Secret | Yes | Webhook signature secret |
| `RESEND_API_KEY` | Secret | Yes | Resend email API key |
| `DATABASE_URL` | Secret | Yes | Neon PostgreSQL connection |
| `NEXT_PUBLIC_SITE_URL` | Var | Yes | Website URL for CORS |

## Troubleshooting

**No email after payment?**
- Check Resend API key is correct
- Verify email domain is verified in Resend
- Check Worker logs in Cloudflare dashboard

**Webhook not triggering?**
- Verify webhook URL in Dodo dashboard
- Check webhook logs in Dodo dashboard
- Ensure `checkout.completed` event is selected

**License not in database?**
- Verify DATABASE_URL is correct
- Check Neon dashboard for connection errors
- Run schema.sql if table doesn't exist

## Support

For issues, check:
- Cloudflare Worker logs: https://dash.cloudflare.com → Workers → Logs
- Dodo dashboard: https://dashboard.dodopayments.com → Webhooks/Logs
- Resend dashboard: https://resend.com/emails



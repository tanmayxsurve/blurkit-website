# 🚀 BlurKit - Dodo Payments License Management Setup

**Last Updated**: October 30, 2026  
**Status**: Dodo Payments Direct Integration  
**Setup Time**: 15-20 minutes

---

## 📋 What Needs Setup in Dodo

Dodo Payments handles **most things automatically**, but you need to configure ONE thing:

### The One Thing: License Key Entitlement

When a customer purchases, Dodo needs to:
1. ✅ Generate a unique license key (automatic)
2. ✅ Send email with the key (automatic)
3. ✅ Track device activations (automatic via API)
4. ✅ Enforce one-device-per-key limit (automatic)

**You need to configure this in Dodo dashboard.**

---

## 🔧 Setup Steps

### Step 1: Access Dodo Dashboard
1. Go to https://console.dodopayments.com
2. Log in with your account

### Step 2: Create/Edit Product
1. Navigate to **Products**
2. Select or create your BlurKit product
3. Under the product, look for **Entitlements** section

### Step 3: Add License Key Entitlement
1. Click **Add Entitlement**
2. Configure:
   - **Name**: `BlurKit License`
   - **Type**: `License Key` (or `Entitlement → License Key`)
   - **Fulfillment Mode**: `Automatic` ✅ (Dodo generates keys)
   - **Activation Limit**: `1` ✅ (one device per key)
   - **License Duration**: 
     - If one-time purchase: `Never Expires`
     - If subscription: `Subscription Duration` or `1 Year`

### Step 4: Email Template (Optional)
1. In the License Key Entitlement settings, look for **Email Template**
2. You can customize the email that gets sent with the license key:
   - Add your logo
   - Add activation instructions
   - Customize the message
3. Or use Dodo's default template (they include the license key)

### Step 5: Verify Webhook
1. Go to **Webhooks**
2. Verify your webhook endpoint is set:
   ```
   https://your-domain.pages.dev/api/payment/webhook
   ```
3. Events should include: `payment.succeeded` or `payment.completed`

---

## ✅ Testing the Full Flow

### Test Purchase (Dodo Test Mode)

1. **Use Dodo test card:**
   - Card: `4111 1111 1111 1111`
   - Expiry: `12/25`
   - CVC: `123`

2. **Go through checkout:**
   - Visit your pricing page
   - Click "Buy" or "Get Started"
   - You'll be redirected to Dodo checkout
   - Enter test card details
   - Complete purchase

3. **Check for license email:**
   - Check your inbox (within 1 minute)
   - Dodo sends email with the generated license key
   - Should look like: `prod_xxxxxxxxxxxxx` (Dodo's format)

4. **Test license activation:**
   - Copy the license key from email
   - Open your BlurKit extension (in test/dev mode)
   - Go to License tab
   - Paste the key and click Activate
   - Extension should validate with Dodo and show ✅ Licensed

5. **Test on second device:**
   - Try same key on different browser/device
   - Dodo should return error: "activation limit reached"
   - Extension shows: "License already in use on another device"

### Database Check
After purchase, your backend should show:
```sql
SELECT * FROM orders WHERE email = 'your-test-email@example.com';
-- Should show 1 record with your purchase
```

---

## 🎯 What Happens Automatically

### When Customer Buys
```
1. Customer completes Dodo checkout
2. Dodo generates unique license key automatically
3. Dodo sends email with key to customer automatically
4. Your webhook receives notification
5. Your backend records order in `orders` table
```

### When Customer Activates License
```
1. Customer enters license key in extension
2. Extension calls Dodo API directly (not your backend)
3. Dodo validates the key
4. Dodo creates device activation (UUID v4 identifier)
5. Extension stores key locally (no validation state cached)
6. Every 24 hours: Extension re-validates with Dodo
```

### When Customer Uses Second Device
```
1. Customer enters same key on Device B
2. Extension calls Dodo API
3. Dodo checks: "Is this key already active elsewhere?"
4. Dodo returns: "Activation limit reached" (422 error)
5. Extension shows: "License already in use. Deactivate on other device first."
```

---

## 🚫 What Does NOT Happen Anymore

❌ Your backend does NOT generate license keys
❌ Your backend does NOT send emails with keys
❌ Your backend does NOT validate licenses
❌ Your backend does NOT track device activations
❌ Your backend does NOT enforce device limits

**All of that is 100% Dodo.**

---

## 📊 Your Backend's Job Now

**ONLY TWO THINGS:**

1. **Webhook Handler** - `/api/payment/webhook`
   - Receives: Payment completed notification from Dodo
   - Does: Records order in database
   - Sends to: Nothing (Dodo already sent email)

2. **Order Tracking** - `orders` table
   - Tracks who bought what
   - Useful for analytics, refunds, support

**That's it!**

---

## 🔑 License Key Format

**Old (deleted)**: `BK-XXXXX-XXXXX-XXXXX-XXXXX`
**New (Dodo)**: `prod_xxxxxxxxxxxxx` or similar (Dodo's format)

Extension accepts any format - it just passes it to Dodo API.

---

## 🧪 Pre-Launch Checklist

### Dodo Dashboard
- [ ] License Key Entitlement created
- [ ] Activation Limit set to `1`
- [ ] Fulfillment Mode set to `Automatic`
- [ ] Webhook configured for `payment.succeeded` events
- [ ] Webhook URL correct (production URL)

### Local Testing
- [ ] Test purchase with Dodo test card
- [ ] Received license email from Dodo
- [ ] License key activated in extension
- [ ] Multi-device conflict tested (second device error)
- [ ] Database shows order record

### Database
- [ ] `orders` table exists
- [ ] `webhook_events` table exists
- [ ] Can connect to Neon

### Environment Variables
- [ ] `DODO_SECRET_KEY` set
- [ ] `DODO_WEBHOOK_SECRET` set
- [ ] `DATABASE_URL` set
- [ ] Webhook secret matches Dodo dashboard

---

## 🆘 Troubleshooting

### "License email not received after purchase"
1. Check: Did Dodo process the payment?
2. Check: Is License Key Entitlement configured in Dodo?
3. Check: Is Fulfillment Mode set to "Automatic"?
4. Fix: Go to Dodo dashboard → Products → Edit Entitlement → Enable automatic generation

### "License key format invalid"
- Old format `BK-XXXXX` is no longer supported
- Extension now accepts Dodo's format
- Update extension code if you see BK-format validation errors

### "Activation limit error on first device"
- Dodo is correctly enforcing the limit
- Customer tried to activate on device they already used
- They must deactivate first (or Dodo shows error as expected)

### "Order not in database"
- Check: Did webhook receive the payment event?
- Check: Webhook secret matches Dodo dashboard exactly
- Fix: Copy webhook secret from Dodo console again, character by character

### "Extension shows 'offline' after purchase"
- This is normal - extension validates every 24 hours
- Extension validates immediately when popup opens
- After first validation, it shows licensed status

---

## 📞 Important Links

- **Dodo Payments Console**: https://console.dodopayments.com
- **Dodo License Key Setup**: See "Entitlements" in your product settings
- **Your Webhook URL**: `/api/payment/webhook` in your deployed app
- **Extension License Logic**: `blurkit-wxt/utils/license.ts`

---

## ✨ You're Ready!

Once you:
1. ✅ Configure License Key Entitlement in Dodo
2. ✅ Test purchase flow
3. ✅ Test license activation

Everything else happens automatically. Dodo handles it all! 🚀

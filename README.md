# BlurKit Website

A professional marketing website for BlurKit, the privacy-focused Chrome extension that automatically detects and blurs sensitive data.

## 🎯 Project Overview

This is a Next.js 15+ website with integrated payment processing (Dodo Payments), license key management, and automatic email delivery. Built for deployment on Cloudflare Pages.

**Live Demo**: [Coming Soon]
**Chrome Extension**: [Chrome Web Store Link]

## ✨ Features

- **Landing Page**: Hero section, features showcase, pricing preview, use cases
- **Pricing Page**: Interactive pricing with Dodo Payments checkout integration
- **Features Page**: Detailed feature breakdown with PII types, blur styles, keyboard shortcuts
- **Success Page**: Post-payment confirmation with license key display
- **Legal Pages**: Privacy Policy and Terms of Service
- **Payment Integration**: Full Dodo Payments webhook handling
- **Email Automation**: Automatic license key delivery via Resend
- **License Generation**: Unique key generation with format `BLURKIT-XXXX-XXXX-XXXX-XXXX`
- **Database**: PostgreSQL via Neon for orders and licenses
- **Dark Theme**: BlurKit brand colors (Lime Green #a3f73c on Dark #111111)
- **Responsive Design**: Mobile-first, works on all screen sizes
- **SEO Optimized**: Meta tags, sitemap, Open Graph, Twitter Cards

## 🛠️ Tech Stack

- **Framework**: Next.js 16.4.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Payment**: Dodo Payments API
- **Database**: PostgreSQL (Neon serverless)
- **Email**: Resend
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd blurkit-website
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure your `.env.local`**:
   ```bash
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=BlurKit

   # Dodo Payments
   NEXT_PUBLIC_DODO_PUBLIC_KEY=pk_test_xxxxx
   DODO_SECRET_KEY=sk_test_xxxxx
   DODO_WEBHOOK_SECRET=whsec_xxxxx

   # Database (Neon PostgreSQL)
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

   # Email (Resend)
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM_EMAIL=hello@blurkit.dev

   # Chrome Web Store
   NEXT_PUBLIC_CHROME_STORE_URL=https://chrome.google.com/webstore/detail/blurkit/xxxxx
   ```

5. **Set up the database**:
   ```sql
   -- Run these SQL commands in your PostgreSQL database

   -- Orders table
   CREATE TABLE orders (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     dodo_session_id VARCHAR UNIQUE NOT NULL,
     email VARCHAR NOT NULL,
     plan_id VARCHAR NOT NULL,
     amount DECIMAL NOT NULL,
     status VARCHAR NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     completed_at TIMESTAMP
   );

   -- License keys table
   CREATE TABLE licenses (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     order_id UUID REFERENCES orders(id),
     key VARCHAR UNIQUE NOT NULL,
     email VARCHAR NOT NULL,
     plan VARCHAR NOT NULL,
     status VARCHAR NOT NULL,
     expires_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Webhook idempotency tracking
   CREATE TABLE webhook_events (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     event_id VARCHAR UNIQUE NOT NULL,
     event_type VARCHAR NOT NULL,
     processed_at TIMESTAMP DEFAULT NOW()
   );
   ```

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## 🚀 Deployment

### Cloudflare Pages

1. **Connect your GitHub repository** to Cloudflare Pages

2. **Configure build settings**:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`
   - **Node version**: 20 or 22

3. **Add environment variables** in Cloudflare Pages dashboard:
   - All variables from `.env.example`
   - Set production values for `DODO_SECRET_KEY`, `DATABASE_URL`, `RESEND_API_KEY`

4. **Push to main branch** → auto-deploy

### Webhook Setup (Dodo Payments)

1. Go to Dodo Payments dashboard
2. Navigate to Webhooks settings
3. Add webhook endpoint: `https://your-domain.com/api/payment/webhook`
4. Select events: `payment.completed`
5. Copy the webhook secret to `DODO_WEBHOOK_SECRET`

## 📁 Project Structure

```
blurkit-website/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── pricing/           # Pricing page
│   │   ├── features/          # Features page
│   │   ├── success/           # Payment success page
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of service
│   │   └── api/
│   │       └── payment/
│   │           ├── checkout/  # Create checkout session
│   │           └── webhook/   # Handle payment webhooks
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── Header.tsx     # Navigation header
│   │       └── Footer.tsx     # Footer
│   │
│   ├── lib/
│   │   ├── dodo-payments.ts   # Dodo Payments client
│   │   ├── license-generator.ts # License key generation
│   │   ├── email.ts           # Email service (Resend)
│   │   └── db.ts              # Database client (Neon)
│   │
│   └── types/
│       └── payment.ts         # TypeScript types
│
├── config/
│   ├── site.config.ts         # Site metadata & URLs
│   └── pricing.config.ts      # Pricing tiers
│
├── public/                    # Static assets
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── package.json
```

## 🎨 Brand Identity

**Colors**:
- Primary: Lime Green `#a3f73c`
- Background: Dark `#111111`
- Text: White `#ffffff`

**Logo**: 3×3 grid of dots with selective blur effect

**Tagline**: "Protect Your Privacy While Sharing Your Screen"

## 💰 Pricing

- **Free**: 5 basic PII types, manual blur, basic style
- **Pro Monthly**: $4.99/month - All features
- **Pro Lifetime**: $19.99 one-time - All features forever

## 🔐 Security

- All payment processing via Dodo Payments (PCI compliant)
- Webhook signature verification
- Environment variables for sensitive data
- HTTPS encryption
- Database encryption at rest
- Idempotent webhook handling

## 📧 Email Templates

License key emails are automatically sent via Resend with:
- Professional HTML template
- License key in prominent format
- Step-by-step activation instructions
- Support contact information

## 🧪 Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Test payment flow (use Dodo test cards)
# Visit http://localhost:3000/pricing
```

### Webhook Testing

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Expose localhost with ngrok
ngrok http 3000

# Use ngrok URL in Dodo webhook settings
# https://abc123.ngrok.io/api/payment/webhook
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔧 Customization

### Update Pricing

Edit `config/pricing.config.ts`:

```typescript
export const pricingConfig = {
  proMonthly: {
    id: 'pro-monthly',
    price: 4.99,  // Change price here
    // ...
  },
  // ...
}
```

### Update Site Content

Edit `config/site.config.ts`:

```typescript
export const siteConfig = {
  name: 'BlurKit',
  tagline: 'Your tagline here',
  description: 'Your description',
  // ...
}
```

### Update Colors

Edit `tailwind.config.ts` and `src/app/globals.css`

## 📊 Analytics

To add analytics:

1. Install your analytics provider:
   ```bash
   npm install @vercel/analytics
   # or
   npm install plausible-tracker
   ```

2. Add to `src/app/layout.tsx`

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Neon connection pooling settings
- Ensure database tables are created

### Webhook Not Receiving Events

- Check Dodo webhook URL is correct
- Verify webhook signature secret matches
- Check server logs for errors
- Test with ngrok for local development

## 📄 License

Copyright © 2026 BlurKit. All rights reserved.

## 🤝 Support

- **Email**: survextanmay@gmail.com
- **GitHub**: https://github.com/tanmayxsurve/blur

## 🚀 Next Steps

1. ✅ Website MVP complete
2. [ ] Set up production database (Neon)
3. [ ] Configure Dodo Payments production keys
4. [ ] Set up Resend email service
5. [ ] Deploy to Cloudflare Pages
6. [ ] Configure custom domain
7. [ ] Submit Chrome extension to Web Store
8. [ ] Launch marketing campaign
9. [ ] Set up analytics tracking
10. [ ] Create blog content

---

Built with ❤️ for privacy-conscious professionals

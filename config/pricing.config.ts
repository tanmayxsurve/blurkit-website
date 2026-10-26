export const pricingConfig = {
  free: {
    name: 'Free',
    price: 0,
    interval: null,
    features: [
      '5 basic PII types',
      'Manual blur mode',
      'Basic blur style',
      'Chrome Web Store download',
    ],
    limitations: [
      'No Demo Mode',
      'Limited PII detection',
      'Single blur style',
    ],
    cta: 'Download Free',
    ctaUrl: process.env.NEXT_PUBLIC_CHROME_STORE_URL || '#',
    popular: false,
  },

  proMonthly: {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: 4.99,
    interval: 'month',
    features: [
      'All 11 PII detection types',
      'One-click Demo Mode',
      'All 3 blur styles',
      'Custom keywords & regex',
      'Tab title blurring',
      'Priority support',
    ],
    cta: 'Buy Pro',
    popular: false,
  },

  proLifetime: {
    id: 'pro-lifetime',
    name: 'Pro Lifetime',
    price: 19.99,
    interval: 'once',
    features: [
      'All 11 PII detection types',
      'One-click Demo Mode',
      'All 3 blur styles',
      'Custom keywords & regex',
      'Tab title blurring',
      'Priority support',
      'Lifetime updates',
      'One-time payment',
    ],
    badge: 'Best Value',
    cta: 'Buy Lifetime',
    popular: true,
  },
} as const

export type PricingTier = keyof typeof pricingConfig
export type PricingPlan = typeof pricingConfig[PricingTier]

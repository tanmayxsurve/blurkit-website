export const siteConfig = {
  name: 'BlurKit',
  tagline: 'Protect Your Privacy While Sharing Your Screen',
  description: 'BlurKit automatically detects and blurs 11 types of sensitive data in real-time. Perfect for screen sharing, demos, and presentations.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://blurkit.dev',
  chromeStoreUrl: process.env.NEXT_PUBLIC_CHROME_STORE_URL || '#',
  github: 'https://github.com/tanmayxsurve/blur',
  support: 'survextanmay@gmail.com',

  brand: {
    primaryColor: '#a3f73c', // Lime green
    darkBackground: '#111111',
    lightText: '#ffffff',
  },

  features: [
    '11 types of PII detected automatically',
    'One-click Demo Mode for full-page blur',
    '3 blur styles: blur, redact, hide',
    '100% local processing - no data collection',
    'Custom keywords with regex support',
    'Tab title and favicon blurring',
  ],

  useCases: [
    'Screen sharing in meetings',
    'Recording tutorials',
    'Live demonstrations',
    'Public presentations',
    'Support calls with sensitive data',
  ],

  piiTypes: [
    { name: 'Email addresses', icon: 'Mail' },
    { name: 'Phone numbers', icon: 'Phone' },
    { name: 'Social Security Numbers', icon: 'ShieldAlert' },
    { name: 'Credit card numbers', icon: 'CreditCard' },
    { name: 'Passwords', icon: 'Key' },
    { name: 'API keys & tokens', icon: 'Code' },
    { name: 'Money amounts', icon: 'DollarSign' },
    { name: 'Crypto wallet addresses', icon: 'Wallet' },
    { name: 'Bank account numbers', icon: 'Building' },
    { name: 'Dates of birth', icon: 'Calendar' },
    { name: 'Physical addresses', icon: 'MapPin' },
  ],
} as const

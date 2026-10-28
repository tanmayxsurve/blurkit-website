/**
 * Cloudflare Worker for BlurKit Payment API
 * Handles Dodo Payments checkout creation and webhook events
 */

interface Env {
  DODO_SECRET_KEY: string
  DODO_WEBHOOK_SECRET: string
  RESEND_API_KEY: string
  DATABASE_URL: string
  NEXT_PUBLIC_SITE_URL: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // Route webhook requests
    if (path === '/webhook' && request.method === 'POST') {
      return handleWebhook(request, env)
    }

    // Route checkout requests
    if (path === '/' && request.method === 'POST') {
      return handleCheckout(request, env)
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': env.NEXT_PUBLIC_SITE_URL || 'https://blurkit-website.pages.dev',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
      return new Response(null, { headers: corsHeaders })
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    )
  },
}

async function handleCheckout(request: Request, env: Env): Promise<Response> {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': env.NEXT_PUBLIC_SITE_URL || 'https://blurkit-website.pages.dev',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { planId, email } = await request.json()

    if (!planId) {
      return new Response(
        JSON.stringify({ error: 'planId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const secretKey = env.DODO_SECRET_KEY
    if (!secretKey) {
      return new Response(
        JSON.stringify({ error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://blurkit-website.pages.dev'
    const baseUrl = secretKey.startsWith('dodo_test_')
      ? 'https://test.dodopayments.com'
      : 'https://live.dodopayments.com'

    // Call Dodo Payments API
    const response = await fetch(`${baseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_cart: [
          {
            product_id: planId,
            quantity: 1
          }
        ],
        customer: email ? { email } : undefined,
        return_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/pricing`,
        metadata: {
          plan: planId,
          timestamp: new Date().toISOString(),
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: 'Failed to create checkout',
          details: data.message || 'Unknown error'
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        checkoutUrl: data.checkout_url,
        sessionId: data.session_id || data.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Payment API error:', error)

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.text()
    const payload = JSON.parse(body)

    // Only handle successful payments
    if (payload.type !== 'checkout.completed' || payload.data?.status !== 'completed') {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const email = payload.data.customer?.email
    const planId = payload.data.metadata?.plan || payload.data.product_cart?.[0]?.product_id
    const sessionId = payload.data.session_id

    if (!email || !planId) {
      return new Response(
        JSON.stringify({ error: 'Missing email or plan ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate license key
    const licenseKey = await generateLicenseKey(email, planId)

    // Save to database
    await saveLicenseToDatabase(env.DATABASE_URL, {
      email,
      licenseKey,
      planId,
      sessionId,
      createdAt: new Date().toISOString(),
    })

    // Send email with license key
    await sendLicenseEmail(env.RESEND_API_KEY, email, licenseKey)

    return new Response(
      JSON.stringify({ success: true, message: 'License sent' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

async function generateLicenseKey(email: string, planId: string): Promise<string> {
  const timestamp = Date.now()

  // Generate random bytes using Web Crypto API
  const randomBytes = new Uint8Array(8)
  crypto.getRandomValues(randomBytes)
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Create hash using Web Crypto API
  const encoder = new TextEncoder()
  const data = encoder.encode(`${email}${planId}${timestamp}${randomHex}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 16)
    .toUpperCase()

  // Format: BLURKIT-XXXX-XXXX-XXXX-XXXX
  const parts = hash.match(/.{1,4}/g) || []
  return `BLURKIT-${parts.join('-')}`
}

async function saveLicenseToDatabase(
  databaseUrl: string,
  licenseData: {
    email: string
    licenseKey: string
    planId: string
    sessionId: string
    createdAt: string
  }
): Promise<void> {
  // Using Neon serverless client
  const query = `
    INSERT INTO licenses (email, license_key, plan_id, session_id, created_at)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (license_key) DO NOTHING
  `

  const params = [
    licenseData.email,
    licenseData.licenseKey,
    licenseData.planId,
    licenseData.sessionId,
    licenseData.createdAt,
  ]

  try {
    const response = await fetch(new URL('/sql', databaseUrl).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, params }),
    })

    if (!response.ok) {
      throw new Error(`Database error: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Database save error:', error)
    throw error
  }
}

async function sendLicenseEmail(
  resendApiKey: string,
  email: string,
  licenseKey: string
): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BlurKit <onboarding@resend.dev>',
      to: email,
      subject: '🎉 Your BlurKit License Key',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to BlurKit! 🎉</h1>

          <p style="color: #666; font-size: 16px;">
            Thank you for purchasing BlurKit! Here's your exclusive license key:
          </p>

          <div style="
            background: #f5f5f5;
            border: 2px solid #6366f1;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            text-align: center;
          ">
            <p style="color: #999; margin: 0 0 10px 0; font-size: 12px;">LICENSE KEY</p>
            <code style="
              font-size: 24px;
              font-weight: bold;
              color: #6366f1;
              letter-spacing: 2px;
              font-family: 'Courier New', monospace;
            ">${licenseKey}</code>
          </div>

          <h2 style="color: #333; margin-top: 30px;">How to Use:</h2>
          <ol style="color: #666; line-height: 1.8;">
            <li>Install the BlurKit Chrome Extension</li>
            <li>Open the extension and paste your license key</li>
            <li>Activate and start blurring! 🚀</li>
          </ol>

          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If you have any questions, reply to this email or visit our support page.
          </p>

          <p style="color: #999; font-size: 12px;">
            © 2026 BlurKit. All rights reserved.
          </p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

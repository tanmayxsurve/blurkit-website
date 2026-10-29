/**
 * Cloudflare Worker for BlurKit Payment API
 * Handles Dodo Payments checkout creation and webhook events
 */

import { Client } from '@neondatabase/serverless'

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

    // Route validation requests
    if (path === '/validate' && request.method === 'POST') {
      return handleValidation(request, env)
    }

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
        'Access-Control-Allow-Origin': '*',
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
  // CORS headers - allow both www and non-www
  const origin = request.headers.get('Origin') || ''
  const allowedOrigins = ['https://blurkit.app', 'https://www.blurkit.app']
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://blurkit.app'

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
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

    const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://blurkit.app'
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
    console.log('=== WEBHOOK RECEIVED ===')
    console.log('Raw body:', body)

    const payload = JSON.parse(body)
    console.log('Parsed payload type:', payload.type)
    console.log('Full payload:', JSON.stringify(payload, null, 2))

    // Log data details
    console.log('Data:', payload.data)
    console.log('Data status:', payload.data?.status)
    console.log('Data customer:', payload.data?.customer)
    console.log('Data metadata:', payload.data?.metadata)
    console.log('Data product_cart:', payload.data?.product_cart)

    // Only handle successful payments - check what Dodo actually sends
    const isPaymentSuccess =
      (payload.type === 'payment.succeeded' && payload.data?.status === 'succeeded') ||
      (payload.type === 'checkout.completed' && payload.data?.status === 'completed')

    if (!isPaymentSuccess) {
      console.log('Skipping webhook - event type:', payload.type, 'status:', payload.data?.status)
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: 'Not a payment completion event' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const email = payload.data.customer?.email
    const planId = payload.data.metadata?.plan || payload.data.product_cart?.[0]?.product_id
    const sessionId = payload.data.checkout_session_id || payload.data.session_id || payload.data.payment_id

    console.log('Processing payment for:', { email, planId, sessionId })

    if (!email || !planId) {
      console.error('Missing email or planId:', { email, planId })
      return new Response(
        JSON.stringify({ error: 'Missing email or plan ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate license key
    console.log('Generating license key...')
    const licenseKey = await generateLicenseKey(email, planId)
    console.log('Generated license key:', licenseKey)

    // Save to database
    console.log('Saving to database...')
    await saveLicenseToDatabase(env.DATABASE_URL, {
      email,
      licenseKey,
      planId,
      sessionId,
      createdAt: new Date().toISOString(),
    })

    // Send email with license key
    console.log('Sending email to:', email)
    await sendLicenseEmail(env.RESEND_API_KEY, email, licenseKey)

    console.log('Webhook processed successfully')
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
  const randomBytes = new Uint8Array(12)
  crypto.getRandomValues(randomBytes)
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Create hash using Web Crypto API
  const encoder = new TextEncoder()
  const data = encoder.encode(`${email}${planId}${timestamp}${randomHex}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // Convert to base32-like format (alphanumeric uppercase, no confusing chars)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No O, I, 0, 1
  let result = ''
  for (let i = 0; i < 20; i++) {
    result += chars[hashArray[i] % chars.length]
  }

  // Format: BK-XXXXX-XXXXX-XXXXX-XXXXX
  return `BK-${result.slice(0, 5)}-${result.slice(5, 10)}-${result.slice(10, 15)}-${result.slice(15, 20)}`
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
  try {
    const client = new Client({ connectionString: databaseUrl })
    await client.connect()

    // Use correct column names: key (not license_key), plan (not plan_id)
    // Note: device_id is left NULL - device binding happens on activation
    const insertQuery = `
      INSERT INTO licenses (email, key, plan, status)
      VALUES ($1, $2, $3, 'active')
      ON CONFLICT (key) DO NOTHING
    `

    const result = await client.query(insertQuery, [
      licenseData.email,
      licenseData.licenseKey,
      licenseData.planId,
    ])

    console.log('License saved to database:', licenseData.licenseKey)
    await client.end()
  } catch (error) {
    console.error('Database save error:', error)
    throw new Error(`Failed to save license: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
      from: 'BlurKit <noreply@blurkit.app>',
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
    console.error('Resend error response:', error)
    throw new Error(`Failed to send email: ${error.message || response.statusText}`)
  }

  const result = await response.json()
  console.log('Email sent successfully:', result.id)
}

async function handleValidation(request: Request, env: Env): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const { licenseKey } = await request.json()

    if (!licenseKey) {
      return new Response(
        JSON.stringify({ valid: false, error: 'License key is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate format first (BK-XXXXX-XXXXX-XXXXX-XXXXX)
    const formatPattern = /^BK-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/
    if (!formatPattern.test(licenseKey)) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid license key format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Query database
    const client = new Client({ connectionString: env.DATABASE_URL })
    await client.connect()

    const result = await client.query(
      `SELECT
        email,
        license_key,
        plan_id,
        created_at,
        session_id
       FROM licenses
       WHERE license_key = $1`,
      [licenseKey]
    )

    await client.end()

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: 'License key not found'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const license = result.rows[0]

    // Log validation for analytics
    console.log('License validated:', {
      licenseKey,
      email: license.email,
      planId: license.plan_id,
    })

    // Optionally: track validation in a separate table for analytics
    try {
      const trackClient = new Client({ connectionString: env.DATABASE_URL })
      await trackClient.connect()
      await trackClient.query(
        `INSERT INTO license_validations (license_key, validated_at)
         VALUES ($1, NOW())`,
        [licenseKey]
      )
      await trackClient.end()
    } catch (trackError) {
      // Don't fail validation if tracking fails
      console.error('Failed to track validation:', trackError)
    }

    return new Response(
      JSON.stringify({
        valid: true,
        license: {
          key: license.license_key,
          plan: license.plan_id,
          purchasedAt: license.created_at,
          email: license.email.substring(0, 3) + '***' // Partial email for privacy
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Validation error:', error)
    return new Response(
      JSON.stringify({
        valid: false,
        error: 'Validation service error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

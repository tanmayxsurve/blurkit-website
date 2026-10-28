/**
 * Dodo Payments Webhook Handler
 * Receives payment success events and sends license key via email
 */

import { generateLicenseKey } from '../../src/lib/license-generator'

interface DodoWebhookPayload {
  type: string
  data: {
    session_id: string
    status: string
    customer?: {
      email: string
    }
    product_cart?: Array<{
      product_id: string
      quantity: number
    }>
    metadata?: {
      plan: string
    }
  }
}

interface Env {
  DODO_WEBHOOK_SECRET: string
  RESEND_API_KEY: string
  DATABASE_URL: string
  NEXT_PUBLIC_SITE_URL: string
}

export async function handleWebhook(request: Request, env: Env): Promise<Response> {
  // Verify webhook signature
  const signature = request.headers.get('x-dodo-signature')
  const body = await request.text()

  if (!signature || !verifySignature(body, signature, env.DODO_WEBHOOK_SECRET)) {
    return new Response(
      JSON.stringify({ error: 'Invalid signature' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const payload: DodoWebhookPayload = JSON.parse(body)

    // Only handle successful payments
    if (payload.type !== 'checkout.completed' || payload.data.status !== 'completed') {
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

function verifySignature(body: string, signature: string, secret: string): boolean {
  // TODO: Implement Dodo signature verification
  // For now, accept all (implement based on Dodo docs)
  return true
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

import { NextRequest, NextResponse } from 'next/server'

// Removed: export const runtime = 'edge'
// Use default Node.js runtime for better environment variable support

/**
 * POST /api/payment/checkout
 * Creates a Dodo Payments checkout session
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { planId, email } = body

    if (!planId) {
      return NextResponse.json(
        { error: 'planId is required' },
        { status: 400 }
      )
    }

    // Access environment variables directly
    const secretKey = process.env.DODO_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json(
        { error: 'DODO_SECRET_KEY not configured' },
        { status: 500 }
      )
    }

    // Get site URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                    process.env.NEXT_PUBLIC_APP_URL ||
                    req.headers.get('origin') ||
                    'https://blurkit-website.pages.dev'

    const baseUrl = secretKey.startsWith('dodo_test_')
      ? 'https://test.dodopayments.com'
      : 'https://live.dodopayments.com'

    const payload = {
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
    }

    const response = await fetch(`${baseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let error
      try {
        error = JSON.parse(errorText)
      } catch {
        error = { message: errorText }
      }
      throw new Error(error.message || 'Failed to create checkout session')
    }

    const data = await response.json()

    return NextResponse.json({
      checkoutUrl: data.checkout_url,
      sessionId: data.session_id || data.id,
    })
  } catch (error) {
    console.error('Checkout error:', error instanceof Error ? error.message : 'Unknown error')

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

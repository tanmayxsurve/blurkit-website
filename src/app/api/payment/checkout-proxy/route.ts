import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/payment/checkout-proxy
 * Non-edge endpoint to handle Dodo Payments checkout
 * This runs on Node.js runtime which has proper env var access
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

    const secretKey = process.env.DODO_SECRET_KEY
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blurkit-website.pages.dev'

    if (!secretKey) {
      throw new Error('DODO_SECRET_KEY not configured')
    }

    const baseUrl = secretKey.startsWith('dodo_test_')
      ? 'https://test.dodopayments.com'
      : 'https://live.dodopayments.com'

    const response = await fetch(`${baseUrl}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_cart: [{ product_id: planId, quantity: 1 }],
        customer: email ? { email } : undefined,
        return_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/pricing`,
        metadata: { plan: planId, timestamp: new Date().toISOString() },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Dodo API error')
    }

    return NextResponse.json({
      checkoutUrl: data.checkout_url,
      sessionId: data.session_id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

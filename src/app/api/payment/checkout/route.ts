import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { planId, email } = await req.json()

    if (!planId) {
      return NextResponse.json({ error: 'planId required' }, { status: 400 })
    }

    // Get secrets from environment
    const SECRET_KEY = process.env.DODO_SECRET_KEY
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blurkit.app'

    if (!SECRET_KEY) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    // Call Dodo API
    const res = await fetch(
      SECRET_KEY.startsWith('dodo_test_')
        ? 'https://test.dodopayments.com/checkouts'
        : 'https://live.dodopayments.com/checkouts',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_cart: [{ product_id: planId, quantity: 1 }],
          customer: email ? { email } : undefined,
          return_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${SITE_URL}/pricing`,
          metadata: { plan: planId },
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Checkout failed' },
        { status: res.status }
      )
    }

    return NextResponse.json({
      checkoutUrl: data.checkout_url,
      sessionId: data.session_id,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}


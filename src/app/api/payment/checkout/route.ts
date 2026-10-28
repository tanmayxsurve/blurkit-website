import { NextRequest, NextResponse } from 'next/server'
import { getDodoClient } from '@/lib/dodo-payments'

export const runtime = 'edge'

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const dodo = getDodoClient()

    const session = await dodo.createCheckoutSession({
      planId,
      email,
      successUrl: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/pricing`,
      metadata: {
        plan: planId,
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      checkoutUrl: session.checkoutUrl,
      sessionId: session.sessionId,
    })
  } catch (error) {
    console.error('Checkout error:', error)

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

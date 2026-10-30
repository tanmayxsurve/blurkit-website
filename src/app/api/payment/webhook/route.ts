import { NextRequest, NextResponse } from 'next/server'
import { getDodoClient } from '@/lib/dodo-payments'
import { query } from '@/lib/db'

export const runtime = 'edge'

/**
 * POST /api/payment/webhook
 * Handles Dodo Payments webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    const signature = req.headers.get('x-dodo-signature')

    console.log('=== WEBHOOK RECEIVED ===')
    console.log('Signature:', signature ? '✓ Present' : '✗ Missing')

    const event = JSON.parse(payload)
    console.log('Event type:', event.type || event.event)
    console.log('Event data:', JSON.stringify(event.data, null, 2))

    if (!signature) {
      console.error('Missing webhook signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    const dodo = getDodoClient()

    // Verify webhook signature
    const isValid = await dodo.verifyWebhookSignature(payload, signature)
    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    console.log('✓ Webhook signature verified')

    // Handle payment success events (Dodo can send either payment.succeeded or payment.completed)
    const eventType = event.type || event.event
    const isPaymentSuccess =
      eventType === 'payment.succeeded' ||
      eventType === 'payment.completed' ||
      (eventType === 'checkout.completed' && event.data?.status === 'completed')

    if (!isPaymentSuccess) {
      console.log('Skipping non-payment event:', eventType)
      return NextResponse.json({ received: true })
    }

    // Extract email and planId - handle different Dodo response formats
    const eventData = event.data
    const email = eventData.customer?.email || eventData.customer_email || eventData.email
    const sessionId = eventData.session_id || eventData.checkout_session_id || eventData.payment_id
    const amount = eventData.amount || 0

    // Get plan from metadata or product_cart
    let planId = eventData.metadata?.plan
    if (!planId && eventData.product_cart?.[0]) {
      planId = eventData.product_cart[0].product_id
    }
    planId = planId || 'unknown'

    console.log('Extracted data:', { email, sessionId, planId, amount })

    if (!email || !sessionId) {
      console.error('Missing required fields:', { email, sessionId })
      return NextResponse.json({ received: true }) // Return 200 to not retry
    }

    // Check if this event was already processed (idempotency)
    const existingEvent = await query(
      'SELECT id FROM webhook_events WHERE event_id = $1',
      [event.id]
    )

    if (existingEvent.rows.length > 0) {
      console.log('Event already processed:', event.id)
      return NextResponse.json({ received: true })
    }

    // Create order record
    // Dodo Payments now handles license key generation and delivery automatically
    console.log('Creating order...')
    const orderResult = await query(
      `INSERT INTO orders (dodo_session_id, email, plan_id, amount, status, completed_at)
       VALUES ($1, $2, $3, $4, 'completed', NOW())
       RETURNING id`,
      [sessionId, email, planId, amount]
    )

    const orderId = orderResult.rows[0].id
    console.log('✓ Order created:', orderId)

    // Mark webhook as processed
    console.log('Recording webhook event...')
    await query(
      'INSERT INTO webhook_events (event_id, event_type) VALUES ($1, $2)',
      [event.id, eventType]
    )

    console.log('✓ Webhook processed successfully')
    console.log('Payment processed:', {
      orderId,
      email,
      plan: planId,
      note: 'License key generated and sent by Dodo Payments',
    })

    return NextResponse.json({ received: true, success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')

    // Return 200 to prevent Dodo from retrying on our internal errors
    // Log the error for manual investigation
    return NextResponse.json(
      {
        received: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 200 }
    )
  }
}

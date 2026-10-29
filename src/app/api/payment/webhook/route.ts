import { NextRequest, NextResponse } from 'next/server'
import { getDodoClient } from '@/lib/dodo-payments'
import { generateLicenseKey } from '@/lib/license-generator'
import { sendLicenseEmail } from '@/lib/email'
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
    console.log('Creating order...')
    const orderResult = await query(
      `INSERT INTO orders (dodo_session_id, email, plan_id, amount, status, completed_at)
       VALUES ($1, $2, $3, $4, 'completed', NOW())
       RETURNING id`,
      [sessionId, email, planId, amount]
    )

    const orderId = orderResult.rows[0].id
    console.log('✓ Order created:', orderId)

    // Generate license key
    console.log('Generating license key...')
    const licenseKey = await generateLicenseKey(email, planId)
    console.log('✓ License key generated:', licenseKey)

    // Store license key in simplified schema
    console.log('Storing license in database...')
    await query(
      `INSERT INTO licenses (email, license_key, plan_id, session_id, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (license_key) DO NOTHING`,
      [email, licenseKey, planId, sessionId]
    )
    console.log('✓ License stored')

    // Send license key via email
    console.log('Sending email to:', email)
    const emailResult = await sendLicenseEmail({
      email,
      licenseKey,
      plan: planId,
    })

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error)
      // Continue processing - license key is still stored
    } else {
      console.log('✓ Email sent successfully')
    }

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
      licenseKey,
      emailSent: emailResult.success,
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

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

    const event = JSON.parse(payload)

    console.log('Received webhook event:', event.event, 'ID:', event.id)

    // Handle payment completed event
    if (event.event === 'payment.completed') {
      const {
        session_id: sessionId,
        customer_email: email,
        amount,
        metadata
      } = event.data

      const planId = metadata?.plan || 'unknown'

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
      const orderResult = await query(
        `INSERT INTO orders (dodo_session_id, email, plan_id, amount, status, completed_at)
         VALUES ($1, $2, $3, $4, 'completed', NOW())
         RETURNING id`,
        [sessionId, email, planId, amount]
      )

      const orderId = orderResult.rows[0].id

      // Generate license key
      const licenseKey = await generateLicenseKey(email, planId)

      // Determine expiration date (null for lifetime)
      const expiresAt = planId.includes('lifetime')
        ? null
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

      // Store license key
      await query(
        `INSERT INTO licenses (order_id, key, email, plan, status, expires_at)
         VALUES ($1, $2, $3, $4, 'active', $5)`,
        [orderId, licenseKey, email, planId, expiresAt]
      )

      // Send license key via email
      const emailResult = await sendLicenseEmail({
        email,
        licenseKey,
        plan: planId,
      })

      if (!emailResult.success) {
        console.error('Failed to send email:', emailResult.error)
        // Continue processing - license key is still stored
      }

      // Mark webhook as processed
      await query(
        'INSERT INTO webhook_events (event_id, event_type) VALUES ($1, $2)',
        [event.id, event.event]
      )

      console.log('Payment processed successfully:', {
        orderId,
        email,
        licenseKey,
        emailSent: emailResult.success,
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)

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

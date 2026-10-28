import crypto from 'crypto'

/**
 * Dodo Payments API Client
 * Wrapper for interacting with Dodo Payments API
 */
export class DodoPayments {
  private secretKey: string
  private baseUrl: string

  constructor(secretKey: string) {
    this.secretKey = secretKey
    // Use test or live endpoint based on key prefix
    this.baseUrl = secretKey.startsWith('dodo_test_')
      ? 'https://test.dodopayments.com'
      : 'https://live.dodopayments.com'
  }

  /**
   * Create a checkout session
   */
  async createCheckoutSession(params: {
    planId: string
    email?: string
    successUrl: string
    cancelUrl: string
    metadata?: Record<string, string>
  }): Promise<{ sessionId: string; checkoutUrl: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_cart: [
            {
              product_id: params.planId,
              quantity: 1
            }
          ],
          customer: {
            email: params.email
          },
          return_url: params.successUrl,
          metadata: params.metadata,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create checkout session')
      }

      const data = await response.json()

      return {
        sessionId: data.id,
        checkoutUrl: data.checkout_url,
      }
    } catch (error) {
      console.error('Dodo Payments error:', error)
      throw error
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const webhookSecret = process.env.DODO_WEBHOOK_SECRET

      if (!webhookSecret) {
        throw new Error('DODO_WEBHOOK_SECRET is not configured')
      }

      // Create HMAC signature
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex')

      // Compare signatures (constant-time comparison)
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return false
    }
  }

  /**
   * Retrieve checkout session details
   */
  async getCheckoutSession(sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/checkout/${sessionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to retrieve checkout session')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get checkout session:', error)
      throw error
    }
  }
}

/**
 * Get Dodo Payments client instance
 */
export function getDodoClient(): DodoPayments {
  const secretKey = process.env.DODO_SECRET_KEY

  if (!secretKey) {
    throw new Error('DODO_SECRET_KEY is not configured')
  }

  return new DodoPayments(secretKey)
}

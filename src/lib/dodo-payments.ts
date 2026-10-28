/**
 * Dodo Payments API Client
 * Wrapper for interacting with Dodo Payments API
 * Uses Web Crypto API for edge runtime compatibility
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
   * Verify webhook signature using Web Crypto API
   */
  async verifyWebhookSignature(payload: string, signature: string): Promise<boolean> {
    try {
      const webhookSecret = process.env.DODO_WEBHOOK_SECRET

      if (!webhookSecret) {
        throw new Error('DODO_WEBHOOK_SECRET is not configured')
      }

      // Import the key for HMAC
      const encoder = new TextEncoder()
      const keyData = encoder.encode(webhookSecret)
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )

      // Create HMAC signature
      const payloadData = encoder.encode(payload)
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, payloadData)
      const signatureArray = Array.from(new Uint8Array(signatureBuffer))
      const expectedSignature = signatureArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      // Constant-time comparison
      return this.timingSafeEqual(signature, expectedSignature)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return false
    }
  }

  /**
   * Constant-time string comparison
   */
  private timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return result === 0
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

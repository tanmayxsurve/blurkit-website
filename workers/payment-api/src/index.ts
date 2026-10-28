/**
 * Cloudflare Worker for BlurKit Payment API
 * Handles Dodo Payments checkout creation
 */

interface Env {
  DODO_SECRET_KEY: string
  NEXT_PUBLIC_SITE_URL: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.NEXT_PUBLIC_SITE_URL || 'https://blurkit-website.pages.dev',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    try {
      const { planId, email } = await request.json()

      if (!planId) {
        return new Response(
          JSON.stringify({ error: 'planId is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const secretKey = env.DODO_SECRET_KEY
      if (!secretKey) {
        return new Response(
          JSON.stringify({ error: 'Payment service not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const siteUrl = env.NEXT_PUBLIC_SITE_URL || 'https://blurkit-website.pages.dev'
      const baseUrl = secretKey.startsWith('dodo_test_')
        ? 'https://test.dodopayments.com'
        : 'https://live.dodopayments.com'

      // Call Dodo Payments API
      const response = await fetch(`${baseUrl}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error: 'Failed to create checkout',
            details: data.message || 'Unknown error'
          }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({
          checkoutUrl: data.checkout_url,
          sessionId: data.session_id || data.id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Payment API error:', error)

      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  },
}

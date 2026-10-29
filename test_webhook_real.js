import { config } from 'dotenv'

config()

const webhookUrl = 'https://blurkit-payment-api.survextanmay.workers.dev/webhook'

// Simulate a payment.succeeded webhook from Dodo with real email
const testPayload = {
  type: 'payment.succeeded',
  data: {
    status: 'succeeded',
    payment_id: 'test_payment_456',
    checkout_session_id: 'test_session_456',
    customer: {
      email: 'survextanmay@gmail.com'
    },
    metadata: {
      plan: 'prod_test_plan'
    },
    product_cart: [
      {
        product_id: 'prod_test_plan'
      }
    ]
  }
}

console.log('Testing webhook endpoint:', webhookUrl)
console.log('Email:', testPayload.data.customer.email)

try {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(testPayload)
  })

  const result = await response.json()
  console.log('\n✅ Response status:', response.status)
  console.log('Response:', JSON.stringify(result, null, 2))
} catch (error) {
  console.error('❌ Error:', error.message)
}

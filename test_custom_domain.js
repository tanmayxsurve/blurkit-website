import { config } from 'dotenv'

config()

// New custom domain URL
const webhookUrl = 'https://api.blurkit.app/webhook'

// Simulate a payment.succeeded webhook from Dodo
const testPayload = {
  type: 'payment.succeeded',
  data: {
    status: 'succeeded',
    payment_id: 'test_payment_789',
    checkout_session_id: 'test_session_789',
    customer: {
      email: 'survextanmay@gmail.com'
    },
    metadata: {
      plan: 'prod_monthly'
    },
    product_cart: [
      {
        product_id: 'prod_monthly'
      }
    ]
  }
}

console.log('Testing webhook on custom domain:', webhookUrl)

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
  
  if (response.status === 200) {
    console.log('\n✨ Custom domain webhook is working!')
  }
} catch (error) {
  console.error('❌ Error:', error.message)
}

import { Resend } from 'resend'
import { config } from 'dotenv'

config()

const resend = new Resend(process.env.RESEND_API_KEY)

const testEmails = [
  'survextanmay@gmail.com',
  'test@gmail.com',
  'another@yahoo.com',
  'random@example.com'
]

console.log('Testing Resend email sending to different recipients...\n')

for (const email of testEmails) {
  try {
    const response = await resend.emails.send({
      from: 'BlurKit <noreply@blurkit.app>',
      to: email,
      subject: 'Test Email',
      html: '<p>Test email to verify Resend restrictions</p>'
    })
    
    if (response.error) {
      console.log(`❌ ${email}: ${response.error.message}`)
    } else {
      console.log(`✅ ${email}: Sent successfully (ID: ${response.data.id})`)
    }
  } catch (error) {
    console.log(`❌ ${email}: ${error.message}`)
  }
}

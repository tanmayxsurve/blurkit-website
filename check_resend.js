import { config } from 'dotenv'

config()

const apiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL

console.log('Resend Configuration:')
console.log('API Key:', apiKey ? '✅ Set' : '❌ Missing')
console.log('From Email:', fromEmail)
console.log('\nResend Email Restrictions:')
console.log('- Free/trial plans can only send to verified email addresses')
console.log('- Default: only noreply@resend.dev and your account email work')
console.log('- Need to verify domain (blurkit.app) to send to any email')
console.log('\nCurrent setup:')
console.log('- From: BlurKit <noreply@blurkit.app>')
console.log('- Domain: blurkit.app')
console.log('\nYou said domain is verified, so let me test sending to different emails...')

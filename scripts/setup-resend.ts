#!/usr/bin/env npx ts-node
/**
 * Resend Email Service Setup & Verification Script
 * This script helps you:
 * 1. Verify your Resend API key
 * 2. Test email sending
 * 3. Verify sender identity
 */

import https from 'https'
import readline from 'readline'

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const log = {
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg: string) => console.log(`\n${colors.cyan}━━━ ${msg} ━━━${colors.reset}\n`),
}

interface ResendResponse {
  statusCode: number
  body: string
}

/**
 * Make HTTPS request to Resend API
 */
function resendRequest(
  method: string,
  path: string,
  apiKey: string,
  body?: string
): Promise<ResendResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.resend.com',
      port: 443,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'BlurKit-Setup/1.0',
      } as Record<string, string | number>,
    }

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(body)
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 500,
          body: data,
        })
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    if (body) {
      req.write(body)
    }

    req.end()
  })
}

/**
 * Verify API key validity
 */
async function verifyApiKey(apiKey: string): Promise<boolean> {
  try {
    log.info('Verifying API key...')

    const response = await resendRequest('GET', '/emails', apiKey)

    if (response.statusCode === 200) {
      log.success('API key is valid!')
      return true
    } else if (response.statusCode === 401) {
      log.error('API key is invalid or expired')
      return false
    } else {
      log.error(`Unexpected response: ${response.statusCode}`)
      return false
    }
  } catch (error) {
    log.error(`Failed to verify API key: ${error}`)
    return false
  }
}

/**
 * Get list of verified sender identities
 */
async function listSenderIdentities(apiKey: string): Promise<any[]> {
  try {
    log.info('Fetching verified senders...')

    const response = await resendRequest('GET', '/domains', apiKey)

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body)
      return data.data || []
    }

    return []
  } catch (error) {
    log.error(`Failed to list senders: ${error}`)
    return []
  }
}

/**
 * Test sending an email
 */
async function testEmailSend(
  apiKey: string,
  toEmail: string,
  fromEmail: string
): Promise<boolean> {
  try {
    log.info(`Sending test email to ${toEmail}...`)

    const emailBody = JSON.stringify({
      from: fromEmail,
      to: toEmail,
      subject: 'BlurKit - Resend Setup Test',
      html: `
        <h1>Resend Setup Successful! 🎉</h1>
        <p>If you're reading this, your Resend email service is properly configured.</p>
        <p>You can now receive license key emails from BlurKit.</p>
        <hr/>
        <p style="color: #999; font-size: 12px;">
          This is a test email from your BlurKit website setup.
        </p>
      `,
    })

    const response = await resendRequest('POST', '/emails', apiKey, emailBody)

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body)
      log.success(`Test email sent! ID: ${data.id}`)
      log.info(`Check your inbox at ${toEmail}`)
      return true
    } else {
      const errorData = JSON.parse(response.body)
      log.error(`Failed to send email: ${errorData.message}`)
      return false
    }
  } catch (error) {
    log.error(`Error sending test email: ${error}`)
    return false
  }
}

/**
 * Interactive CLI for user input
 */
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

/**
 * Main setup flow
 */
async function main() {
  console.log(`
${colors.cyan}╔══════════════════════════════════════╗${colors.reset}
${colors.cyan}║  Resend Email Service Setup & Test   ║${colors.reset}
${colors.cyan}╚══════════════════════════════════════╝${colors.reset}
  `)

  log.section('Step 1: API Key')
  console.log('Get your API key from: https://resend.com/api-keys\n')

  const apiKey = await prompt('Enter your Resend API key (re_...): ')

  if (!apiKey.startsWith('re_')) {
    log.error('Invalid API key format. Should start with "re_"')
    process.exit(1)
  }

  // Verify API key
  log.section('Step 2: Verify API Key')
  const isValid = await verifyApiKey(apiKey)

  if (!isValid) {
    log.error('Please check your API key and try again')
    process.exit(1)
  }

  // List sender identities
  log.section('Step 3: Verified Senders')
  const senders = await listSenderIdentities(apiKey)

  if (senders.length === 0) {
    log.warn('No verified sender identities found!')
    log.info('Go to https://resend.com/senders and add a sender email')
    console.log()
  } else {
    console.log('Verified sender domains/emails:\n')
    senders.forEach((sender: any) => {
      const status = sender.status === 'verified' ? `${colors.green}✓${colors.reset}` : `${colors.yellow}⏳${colors.reset}`
      console.log(`  ${status} ${sender.name || sender.domain}`)
    })
    console.log()
  }

  // Test email sending
  log.section('Step 4: Test Email')

  const toEmail = await prompt('Enter email to send test message to: ')
  const fromEmail = await prompt('Enter verified sender email (e.g., hello@blurkit.dev): ')

  const sendSuccess = await testEmailSend(apiKey, toEmail, fromEmail)

  if (!sendSuccess) {
    log.error('Failed to send test email. Check:')
    console.log('  1. Sender email is verified in Resend')
    console.log('  2. API key has email sending permissions')
    process.exit(1)
  }

  // Final setup instructions
  log.section('✅ Setup Complete!')

  console.log('Add to your .env file:\n')
  console.log(`${colors.yellow}RESEND_API_KEY=${apiKey}${colors.reset}`)
  console.log(`${colors.yellow}RESEND_FROM_EMAIL=${fromEmail}${colors.reset}\n`)

  console.log('Then test your application:')
  console.log(`${colors.cyan}npm run dev${colors.reset}\n`)

  log.success('Resend is now ready to send emails from your BlurKit website!')
}

// Run the setup
main().catch((error) => {
  log.error(`Setup failed: ${error.message}`)
  process.exit(1)
})

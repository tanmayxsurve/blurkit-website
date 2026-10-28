#!/usr/bin/env node
/**
 * Resend Email Service Setup & Verification Script (Non-Interactive)
 * Usage:
 *   RESEND_API_KEY=re_xxx RESEND_FROM_EMAIL=hello@blurkit.dev TEST_EMAIL=you@example.com node scripts/setup-resend-auto.js
 */

const https = require('https')
require('dotenv').config()

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
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}━━━ ${msg} ━━━${colors.reset}\n`),
}

/**
 * Make HTTPS request to Resend API
 */
function resendRequest(method, path, apiKey, body) {
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
      },
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
async function verifyApiKey(apiKey) {
  try {
    log.info('Verifying API key...')

    const response = await resendRequest('GET', '/emails', apiKey)

    if (response.statusCode === 200) {
      log.success('API key is valid!')
      return true
    } else if (response.statusCode === 401) {
      log.error('API key is invalid or expired')
      log.info('Response:', response.body)
      return false
    } else {
      log.error(`Unexpected response: ${response.statusCode}`)
      log.info('Response:', response.body)
      return false
    }
  } catch (error) {
    log.error(`Failed to verify API key: ${error.message}`)
    return false
  }
}

/**
 * Get list of verified sender identities
 */
async function listSenderIdentities(apiKey) {
  try {
    log.info('Fetching verified domains...')

    const response = await resendRequest('GET', '/domains', apiKey)

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body)
      return data.data || []
    } else if (response.statusCode === 200) {
      // Try alternative endpoint
      const altResponse = await resendRequest('GET', '/senders', apiKey)
      if (altResponse.statusCode === 200) {
        const data = JSON.parse(altResponse.body)
        return data.data || []
      }
    }

    return []
  } catch (error) {
    log.error(`Failed to list senders: ${error.message}`)
    return []
  }
}

/**
 * Test sending an email
 */
async function testEmailSend(apiKey, toEmail, fromEmail) {
  try {
    log.info(`Sending test email to ${toEmail}...`)

    const emailBody = JSON.stringify({
      from: fromEmail,
      to: toEmail,
      subject: '🎉 BlurKit - Resend Setup Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h1>✅ Resend Setup Successful!</h1>
          <p>If you're reading this, your Resend email service is properly configured.</p>
          <p>You can now receive license key emails from <strong>BlurKit</strong>.</p>
          <hr/>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This is a test email from your BlurKit website setup.<br/>
            Sent from: <code>${fromEmail}</code>
          </p>
        </div>
      `,
    })

    const response = await resendRequest('POST', '/emails', apiKey, emailBody)

    if (response.statusCode === 200) {
      const data = JSON.parse(response.body)
      log.success(`Test email sent! Email ID: ${data.id}`)
      log.info(`✉️  Check your inbox at ${toEmail}`)
      return true
    } else {
      try {
        const errorData = JSON.parse(response.body)
        log.error(`Failed to send email: ${errorData.message || response.body}`)
      } catch {
        log.error(`Failed to send email (Status ${response.statusCode}): ${response.body}`)
      }
      return false
    }
  } catch (error) {
    log.error(`Error sending test email: ${error.message}`)
    return false
  }
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

  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const toEmail = process.env.TEST_EMAIL

  log.section('Configuration')

  if (!apiKey) {
    log.error('RESEND_API_KEY not set')
    console.log('\nUsage:')
    console.log('  RESEND_API_KEY=re_xxx RESEND_FROM_EMAIL=hello@blurkit.dev TEST_EMAIL=you@example.com node scripts/setup-resend-auto.js')
    process.exit(1)
  }

  if (!apiKey.startsWith('re_')) {
    log.error('Invalid API key format. Should start with "re_"')
    process.exit(1)
  }

  console.log(`API Key: ${apiKey.slice(0, 10)}...${apiKey.slice(-5)}`)
  if (fromEmail) console.log(`From Email: ${fromEmail}`)
  if (toEmail) console.log(`Test Email: ${toEmail}`)
  console.log()

  // Verify API key
  log.section('Step 1: Verify API Key')
  const isValid = await verifyApiKey(apiKey)

  if (!isValid) {
    log.error('Please check your API key and try again')
    process.exit(1)
  }

  // List sender identities
  log.section('Step 2: Verified Senders/Domains')
  const senders = await listSenderIdentities(apiKey)

  if (senders.length === 0) {
    log.warn('No verified sender identities found')
    log.info('Go to https://resend.com and add a verified sender email/domain')
    console.log()
  } else {
    console.log('Verified senders:\n')
    senders.forEach((sender) => {
      const status = sender.status === 'verified' ? `${colors.green}✓${colors.reset}` : `${colors.yellow}⏳${colors.reset}`
      console.log(`  ${status} ${sender.name || sender.domain} (${sender.status})`)
    })
    console.log()
  }

  // Test email sending (optional)
  if (fromEmail && toEmail) {
    log.section('Step 3: Send Test Email')
    const sendSuccess = await testEmailSend(apiKey, toEmail, fromEmail)

    if (!sendSuccess) {
      log.error('Failed to send test email. Check:')
      console.log('  1. The sender email is verified in Resend')
      console.log('  2. API key has email sending permissions')
      process.exit(1)
    }
  } else {
    log.info('Skipping test email (set RESEND_FROM_EMAIL and TEST_EMAIL to test)')
  }

  // Final setup instructions
  log.section('✅ Setup Complete!')

  console.log('Your .env file should have:\n')
  console.log(`${colors.yellow}RESEND_API_KEY=${apiKey}${colors.reset}`)
  if (fromEmail) {
    console.log(`${colors.yellow}RESEND_FROM_EMAIL=${fromEmail}${colors.reset}`)
  }
  console.log()

  console.log('Next steps:')
  console.log(`  1. ${colors.cyan}npm install${colors.reset}  (if not done)`)
  console.log(`  2. ${colors.cyan}npm run dev${colors.reset}  (test locally)`)
  console.log()

  log.success('Resend is now ready to send emails from your BlurKit website!')
}

// Run the setup
main().catch((error) => {
  log.error(`Setup failed: ${error.message}`)
  process.exit(1)
})

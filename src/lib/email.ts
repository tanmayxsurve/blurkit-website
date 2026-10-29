import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

interface LicenseEmailParams {
  email: string
  licenseKey: string
  plan: string
}

/**
 * Sends license key email to customer
 */
export async function sendLicenseEmail(
  params: LicenseEmailParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const { email, licenseKey, plan } = params
    const resend = getResendClient()

    const planName = plan.includes('lifetime') ? 'Pro Lifetime' : 'Pro Monthly'

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'BlurKit <noreply@blurkit.app>',
      to: email,
      subject: 'Your BlurKit Pro License Key 🎉',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #111111;
      margin-bottom: 10px;
    }
    .tagline {
      color: #666;
      font-size: 14px;
    }
    .license-box {
      background: #f8f8f8;
      border: 2px solid #a3f73c;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .license-key {
      font-family: monospace;
      font-size: 18px;
      font-weight: bold;
      color: #111111;
      letter-spacing: 2px;
      word-break: break-all;
    }
    .steps {
      background: #f8f8f8;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .step {
      margin: 10px 0;
      padding-left: 30px;
      position: relative;
    }
    .step-number {
      position: absolute;
      left: 0;
      top: 0;
      background: #a3f73c;
      color: #111111;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    }
    .cta-button {
      display: inline-block;
      background: #a3f73c;
      color: #111111;
      padding: 12px 30px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">BlurKit</div>
      <div class="tagline">Protect Your Privacy While Sharing Your Screen</div>
    </div>

    <p>Hi there! 👋</p>

    <p>Thanks for purchasing <strong>BlurKit ${planName}</strong>! Here's your license key:</p>

    <div class="license-box">
      <div class="license-key">${licenseKey}</div>
    </div>

    <div class="steps">
      <h3 style="margin-top: 0;">How to activate:</h3>
      <div class="step">
        <div class="step-number">1</div>
        Install BlurKit from the Chrome Web Store (if not already installed)
      </div>
      <div class="step">
        <div class="step-number">2</div>
        Click the BlurKit icon in your browser toolbar
      </div>
      <div class="step">
        <div class="step-number">3</div>
        Go to <strong>Settings → About</strong>
      </div>
      <div class="step">
        <div class="step-number">4</div>
        Enter your license key
      </div>
      <div class="step">
        <div class="step-number">5</div>
        Click <strong>"Activate"</strong>
      </div>
    </div>

    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_CHROME_STORE_URL || '#'}" class="cta-button">
        Download BlurKit
      </a>
    </p>

    <p>Your Pro features are now unlocked! 🎉</p>

    <p>Enjoy features like:</p>
    <ul>
      <li>All 11 PII detection types</li>
      <li>One-click Demo Mode</li>
      <li>All 3 blur styles</li>
      <li>Custom keywords & regex patterns</li>
      <li>Priority support</li>
    </ul>

    <div class="footer">
      <p>Need help? Reply to this email or visit <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #a3f73c;">blurkit.dev</a></p>
      <p>Happy blurring!<br>- The BlurKit Team</p>
    </div>
  </div>
</body>
</html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send license email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

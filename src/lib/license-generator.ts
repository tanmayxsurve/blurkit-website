import crypto from 'crypto'

/**
 * Generates a unique BlurKit license key
 * Format: BLURKIT-XXXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(email: string, planId: string): string {
  const timestamp = Date.now()
  const randomBytes = crypto.randomBytes(8).toString('hex')
  const hash = crypto
    .createHash('sha256')
    .update(`${email}${planId}${timestamp}${randomBytes}`)
    .digest('hex')
    .substring(0, 16)
    .toUpperCase()

  // Format: BLURKIT-XXXX-XXXX-XXXX-XXXX
  const parts = hash.match(/.{1,4}/g) || []
  return `BLURKIT-${parts.join('-')}`
}

/**
 * Validates a BlurKit license key format
 */
export function validateLicenseKeyFormat(key: string): boolean {
  const pattern = /^BLURKIT-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/
  return pattern.test(key)
}

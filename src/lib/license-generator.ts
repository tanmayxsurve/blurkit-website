/**
 * Generates a unique BlurKit license key using Web Crypto API
 * Format: BLURKIT-XXXX-XXXX-XXXX-XXXX
 */
export async function generateLicenseKey(email: string, planId: string): Promise<string> {
  const timestamp = Date.now()

  // Generate random bytes using Web Crypto API
  const randomBytes = new Uint8Array(8)
  crypto.getRandomValues(randomBytes)
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Create hash using Web Crypto API
  const encoder = new TextEncoder()
  const data = encoder.encode(`${email}${planId}${timestamp}${randomHex}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
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

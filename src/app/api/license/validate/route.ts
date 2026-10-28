import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const runtime = 'edge'

/**
 * POST /api/license/validate
 * Validates a license key and checks device binding
 * Called periodically by extension to verify license is still valid on this device
 *
 * Request:
 * {
 *   "licenseKey": "BLURKIT-XXXX-XXXX-XXXX-XXXX",
 *   "deviceId": "device_fingerprint_hash"
 * }
 *
 * Response (Valid):
 * {
 *   "valid": true,
 *   "message": "License is valid on this device",
 *   "licenseKey": "BLURKIT-XXXX-XXXX-XXXX-XXXX",
 *   "deviceId": "device_fingerprint_hash"
 * }
 *
 * Response (Invalid/Mismatch):
 * {
 *   "valid": false,
 *   "error": "Device mismatch",
 *   "reason": "License is bound to a different device"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { licenseKey, deviceId } = body

    // Validate input
    if (!licenseKey || !deviceId) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid request',
          reason: 'licenseKey and deviceId are required',
        },
        { status: 400 }
      )
    }

    // Validate license key format
    const licenseKeyPattern = /^BLURKIT-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/
    if (!licenseKeyPattern.test(licenseKey)) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid license key format',
          reason: 'License key does not match expected format',
        },
        { status: 400 }
      )
    }

    // Check if license exists
    const licenseResult = await query(
      `SELECT id, key, email, plan, status, device_id, activated_at, last_validated_at, expires_at
       FROM licenses
       WHERE key = $1`,
      [licenseKey]
    )

    if (licenseResult.rows.length === 0) {
      return NextResponse.json(
        {
          valid: false,
          error: 'License not found',
          reason: 'This license key does not exist in our system',
        },
        { status: 404 }
      )
    }

    const license = licenseResult.rows[0]

    // Check license status
    if (license.status !== 'active') {
      return NextResponse.json(
        {
          valid: false,
          error: 'License inactive',
          reason: `License status is ${license.status}`,
        },
        { status: 403 }
      )
    }

    // Check if license has expired
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return NextResponse.json(
        {
          valid: false,
          error: 'License expired',
          reason: 'License expiration date has passed',
        },
        { status: 403 }
      )
    }

    // Check device binding
    if (!license.device_id) {
      // License not activated yet
      return NextResponse.json(
        {
          valid: false,
          error: 'License not activated',
          reason: 'License has not been activated on any device yet',
        },
        { status: 403 }
      )
    }

    if (license.device_id !== deviceId) {
      // Device mismatch - license bound to different device
      console.log('[BlurKit License] Device mismatch:', {
        licenseKey: licenseKey.substring(0, 15) + '...',
        expectedDevice: license.device_id.substring(0, 10) + '...',
        providedDevice: deviceId.substring(0, 10) + '...',
      })

      return NextResponse.json(
        {
          valid: false,
          error: 'Device mismatch',
          reason: 'License is bound to a different device',
        },
        { status: 403 }
      )
    }

    // All checks passed - license is valid on this device
    // Update last validated timestamp
    await query(
      `UPDATE licenses
       SET last_validated_at = NOW()
       WHERE key = $1`,
      [licenseKey]
    )

    console.log('[BlurKit License] Validation successful:', {
      licenseKey: licenseKey.substring(0, 15) + '...',
      deviceId: deviceId.substring(0, 10) + '...',
      email: license.email,
    })

    return NextResponse.json({
      valid: true,
      message: 'License is valid on this device',
      licenseKey,
      deviceId,
      plan: license.plan,
      activatedAt: license.activated_at,
    })
  } catch (error) {
    console.error('[BlurKit License] Validation error:', error)

    return NextResponse.json(
      {
        valid: false,
        error: 'Server error',
        reason: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

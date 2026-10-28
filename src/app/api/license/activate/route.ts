import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const runtime = 'edge'

/**
 * POST /api/license/activate
 * Activates a license key and binds it to a device
 *
 * Request:
 * {
 *   "licenseKey": "BLURKIT-XXXX-XXXX-XXXX-XXXX",
 *   "deviceId": "device_fingerprint_hash"
 * }
 *
 * Response (Success):
 * {
 *   "success": true,
 *   "message": "License activated on this device",
 *   "licenseKey": "BLURKIT-XXXX-XXXX-XXXX-XXXX",
 *   "deviceId": "device_fingerprint_hash"
 * }
 *
 * Response (Error):
 * {
 *   "success": false,
 *   "error": "License already activated on another device"
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
          success: false,
          error: 'licenseKey and deviceId are required',
        },
        { status: 400 }
      )
    }

    // Validate license key format
    const licenseKeyPattern = /^BLURKIT-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/
    if (!licenseKeyPattern.test(licenseKey)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid license key format',
        },
        { status: 400 }
      )
    }

    // Check if license exists
    const licenseResult = await query(
      `SELECT id, key, email, plan, status, device_id, activated_at
       FROM licenses
       WHERE key = $1`,
      [licenseKey]
    )

    if (licenseResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid license key',
        },
        { status: 404 }
      )
    }

    const license = licenseResult.rows[0]

    // Check license status
    if (license.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: `License is ${license.status}`,
        },
        { status: 403 }
      )
    }

    // Check if license is already activated
    if (license.device_id) {
      // License already activated on some device
      if (license.device_id === deviceId) {
        // Same device - allow (user reinstalling or clearing storage)
        return NextResponse.json({
          success: true,
          message: 'License already activated on this device',
          licenseKey,
          deviceId,
        })
      } else {
        // Different device - reject
        return NextResponse.json(
          {
            success: false,
            error: 'License already activated on another device',
            boundDevice: license.device_id,
          },
          { status: 403 }
        )
      }
    }

    // First activation - bind license to this device
    await query(
      `UPDATE licenses
       SET device_id = $1, activated_at = NOW(), last_validated_at = NOW()
       WHERE key = $2`,
      [deviceId, licenseKey]
    )

    console.log('[BlurKit License] Activated:', {
      licenseKey: licenseKey.substring(0, 15) + '...',
      deviceId: deviceId.substring(0, 10) + '...',
      email: license.email,
    })

    return NextResponse.json({
      success: true,
      message: 'License activated on this device',
      licenseKey,
      deviceId,
    })
  } catch (error) {
    console.error('[BlurKit License] Activation error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const runtime = 'edge'

/**
 * POST /api/license/validate
 * Validates a license key and checks if this browser instance is active
 * Called periodically by extension to verify license is still valid
 *
 * Request:
 * {
 *   "licenseKey": "BK-XXXXX-XXXXX-XXXXX-XXXXX",
 *   "browserInstanceId": "uuid-v4-generated-by-extension"
 * }
 *
 * Response (Valid):
 * {
 *   "status": "valid",
 *   "plan": "pro",
 *   "activatedAt": "2026-10-29T13:23:45Z"
 * }
 *
 * Response (Deactivated):
 * {
 *   "status": "error",
 *   "code": "LICENSE_DEACTIVATED",
 *   "message": "Your license is active on another device. Enter your key to reactivate here."
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { licenseKey, browserInstanceId } = body

    // Validate input
    if (!licenseKey || !browserInstanceId) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'INVALID_REQUEST',
          message: 'licenseKey and browserInstanceId are required',
        },
        { status: 400 }
      )
    }

    // Validate browserInstanceId is UUID v4 format
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidPattern.test(browserInstanceId)) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'INVALID_BROWSER_ID',
          message: 'browserInstanceId must be a valid UUID v4',
        },
        { status: 400 }
      )
    }

    // Validate license key format: BK-XXXXX-XXXXX-XXXXX-XXXXX
    const licenseKeyPattern = /^BK-[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}$/
    if (!licenseKeyPattern.test(licenseKey)) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'INVALID_LICENSE_FORMAT',
          message: 'Invalid license key format',
        },
        { status: 400 }
      )
    }

    // Check if license exists and is active
    const licenseResult = await query(
      `SELECT id, license_key, email, plan_id, status, expires_at
       FROM licenses
       WHERE license_key = $1`,
      [licenseKey]
    )

    if (licenseResult.rows.length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'INVALID_LICENSE',
          message: 'License key not found',
        },
        { status: 404 }
      )
    }

    const license = licenseResult.rows[0]

    // Check license status
    if (license.status !== 'active') {
      return NextResponse.json(
        {
          status: 'error',
          code: 'LICENSE_INACTIVE',
          message: `License is ${license.status}`,
        },
        { status: 403 }
      )
    }

    // Check if license has expired
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'LICENSE_EXPIRED',
          message: 'License has expired',
        },
        { status: 403 }
      )
    }

    // Check if this browser instance has an active registration
    const registrationResult = await query(
      `SELECT id, activated_at, deactivated_at
       FROM device_registrations
       WHERE license_id = $1 AND browser_instance_id = $2`,
      [license.id, browserInstanceId]
    )

    if (registrationResult.rows.length === 0) {
      // No registration for this browser instance
      return NextResponse.json(
        {
          status: 'error',
          code: 'LICENSE_DEACTIVATED',
          message: 'Your license is active on another device. Enter your key to reactivate here.',
        },
        { status: 403 }
      )
    }

    const registration = registrationResult.rows[0]

    // Check if this registration is deactivated
    if (registration.deactivated_at) {
      return NextResponse.json(
        {
          status: 'error',
          code: 'LICENSE_DEACTIVATED',
          message: 'Your license is active on another device. Enter your key to reactivate here.',
        },
        { status: 403 }
      )
    }

    // License is valid on this browser instance
    console.log('[BlurKit License] Validation successful:', {
      licenseKey: licenseKey.substring(0, 15) + '...',
      browserInstanceId: browserInstanceId.substring(0, 13) + '...',
      email: license.email,
      plan: license.plan,
    })

    return NextResponse.json({
      status: 'valid',
      plan: license.plan_id,
      activatedAt: registration.activated_at,
    })
  } catch (error) {
    console.error('[BlurKit License] Validation error:', error)

    return NextResponse.json(
      {
        status: 'error',
        code: 'SERVER_ERROR',
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

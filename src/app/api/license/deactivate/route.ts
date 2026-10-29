import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const runtime = 'edge'

/**
 * POST /api/license/deactivate
 * Manually deactivates a license on this browser instance
 * User can click "Deactivate License" in settings to trigger this
 *
 * Request:
 * {
 *   "licenseKey": "BK-XXXXX-XXXXX-XXXXX-XXXXX",
 *   "browserInstanceId": "uuid-v4-generated-by-extension"
 * }
 *
 * Response (Success):
 * {
 *   "status": "deactivated",
 *   "message": "License deactivated on this device"
 * }
 *
 * Response (Already Deactivated):
 * {
 *   "status": "warning",
 *   "message": "License is already deactivated on this device"
 * }
 *
 * Response (License Not Found):
 * {
 *   "status": "error",
 *   "code": "INVALID_LICENSE",
 *   "message": "License key not found"
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

    // Look up license
    const licenseResult = await query(
      `SELECT id, license_key, email, plan_id
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

    // Find device registration
    const registrationResult = await query(
      `SELECT id, deactivated_at
       FROM device_registrations
       WHERE license_id = $1 AND browser_instance_id = $2`,
      [license.id, browserInstanceId]
    )

    // If no registration exists, return warning (idempotent)
    if (registrationResult.rows.length === 0) {
      return NextResponse.json({
        status: 'warning',
        message: 'License is already deactivated on this device',
      })
    }

    const registration = registrationResult.rows[0]

    // If already deactivated, return warning (idempotent)
    if (registration.deactivated_at) {
      return NextResponse.json({
        status: 'warning',
        message: 'License is already deactivated on this device',
      })
    }

    // Deactivate this registration
    await query(
      `UPDATE device_registrations
       SET deactivated_at = NOW()
       WHERE id = $1`,
      [registration.id]
    )

    // Clear active_browser_instance_id if it matches this one
    await query(
      `UPDATE licenses
       SET active_browser_instance_id = NULL
       WHERE id = $1 AND active_browser_instance_id = $2`,
      [license.id, browserInstanceId]
    )

    console.log('[BlurKit License] Deactivated:', {
      licenseKey: licenseKey.substring(0, 15) + '...',
      browserInstanceId: browserInstanceId.substring(0, 13) + '...',
      email: license.email,
    })

    return NextResponse.json({
      status: 'deactivated',
      message: 'License deactivated on this device',
    })
  } catch (error) {
    console.error('[BlurKit License] Deactivation error:', error)

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

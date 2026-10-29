import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const runtime = 'edge'

/**
 * POST /api/license/activate
 * Activates a license key on a browser instance (latest activation wins)
 *
 * Request:
 * {
 *   "licenseKey": "BK-XXXXX-XXXXX-XXXXX-XXXXX",
 *   "browserInstanceId": "uuid-v4-generated-by-extension"
 * }
 *
 * Response (Success):
 * {
 *   "status": "activated",
 *   "plan": "pro",
 *   "activatedAt": "2026-10-29T13:23:45Z"
 * }
 *
 * Response (Error):
 * {
 *   "status": "error",
 *   "code": "INVALID_LICENSE",
 *   "message": "License key not found or expired"
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

    // Validate browserInstanceId is UUID v4 format (36 chars)
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

    // Validate license key format: BK-XXXXX-XXXXX-XXXXX-XXXXX (base32-like, no O, I, 0, 1)
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

    // Check expiration (if set)
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

    // Deactivate ALL other device registrations for this license
    await query(
      `UPDATE device_registrations
       SET deactivated_at = NOW()
       WHERE license_id = $1 AND deactivated_at IS NULL`,
      [license.id]
    )

    // Create new device registration (latest activation wins)
    await query(
      `INSERT INTO device_registrations (license_id, browser_instance_id, activated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (browser_instance_id)
       DO UPDATE SET activated_at = NOW(), deactivated_at = NULL`,
      [license.id, browserInstanceId]
    )

    // Optional: Update active_browser_instance_id on licenses table for quick lookup
    await query(
      `UPDATE licenses
       SET active_browser_instance_id = $1
       WHERE id = $2`,
      [browserInstanceId, license.id]
    )

    console.log('[BlurKit License] Activated:', {
      licenseKey: licenseKey.substring(0, 8) + '...',
      browserInstanceId: browserInstanceId.substring(0, 13) + '...',
      email: license.email,
      plan: license.plan_id,
    })

    return NextResponse.json({
      status: 'activated',
      plan: license.plan_id,
      activatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[BlurKit License] Activation error:', error)

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

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      env: {
        NODE_ENV: process.env.NODE_ENV,
        DODO_SECRET_KEY: process.env.DODO_SECRET_KEY ? 'SET' : 'NOT SET',
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      },
      origin: req.headers.get('origin'),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

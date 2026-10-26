'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { siteConfig } from '@/../config/site.config'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark to-dark-900 flex items-center justify-center py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Thank you for purchasing BlurKit Pro!
          </p>
        </div>

        <div className="bg-dark-100 rounded-lg border-2 border-primary p-8 mb-8">
          <div className="text-center mb-6">
            <p className="text-gray-400 mb-2">Your license key has been sent to your email</p>
            <p className="text-sm text-gray-500 mb-4">Check your inbox and spam folder</p>
          </div>

          {loading ? (
            <div className="bg-dark rounded-lg p-6 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
              <p className="text-gray-400 mt-3">Preparing your license...</p>
            </div>
          ) : (
            <div className="bg-dark rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm mb-3">Session ID: {sessionId || 'N/A'}</p>
              <p className="text-gray-500 text-xs">
                Your license key will be delivered shortly. If you don't receive it, please check your spam folder or contact us.
              </p>
            </div>
          )}
        </div>

        <div className="bg-dark-100 rounded-lg border border-gray-800 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Activate</h2>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-dark flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-white">Install BlurKit</p>
                <p className="text-gray-400 text-sm">
                  Get BlurKit from the{' '}
                  <a
                    href={siteConfig.chromeStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-400"
                  >
                    Chrome Web Store
                  </a>
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-dark flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-white">Click the BlurKit Icon</p>
                <p className="text-gray-400 text-sm">
                  Click the BlurKit icon in your Chrome toolbar to open the popup
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-dark flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-white">Go to Settings</p>
                <p className="text-gray-400 text-sm">
                  Click the settings icon and go to the "About" tab
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-dark flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-white">Enter License Key</p>
                <p className="text-gray-400 text-sm">
                  Paste your license key and click "Activate"
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-dark flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <p className="font-semibold text-white">Enjoy Pro Features!</p>
                <p className="text-gray-400 text-sm">
                  All features are now unlocked. Happy blurring!
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-3">What's Included in Pro</h3>
          <ul className="space-y-2 mb-6">
            {[
              'All 11 PII detection types',
              'One-click Demo Mode',
              'All 3 blur styles',
              'Custom keywords & regex patterns',
              'Tab title blurring',
              'Priority email support',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={siteConfig.chromeStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-dark hover:bg-primary-400 transition-colors"
          >
            Download BlurKit
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-base font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-2">Need help?</p>
          <a
            href={`mailto:${siteConfig.support}`}
            className="text-primary hover:text-primary-400 font-semibold"
          >
            Contact support
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-dark via-dark to-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

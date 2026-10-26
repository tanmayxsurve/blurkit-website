'use client'

import { useState } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/../config/site.config'
import LogoStrip from '@/components/LogoStrip'

const heroStyles = `
  .hero-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 100px 20px 80px;
    max-width: 1240px;
    margin: 0 auto;
  }

  .hero-heading {
    font-size: 56px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -1.5px;
    margin-bottom: 24px;
    color: #0f172a;
    max-width: 900px;
  }

  .hero-subheading {
    font-size: 18px;
    line-height: 1.6;
    color: #475569;
    max-width: 680px;
    margin-bottom: 40px;
    font-weight: 400;
  }

  .cta-container {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: #ffffff;
    color: #0f172a;
    text-decoration: none;
    font-size: 17px;
    font-weight: 600;
    padding: 0 32px;
    height: 56px;
    border-radius: 999px;
    border: 1px solid #e2e8f0;
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .btn-primary:hover {
    background-color: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  .btn-primary svg {
    width: 26px;
    height: 26px;
    flex-shrink: 0;
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #316bf4;
    color: #ffffff;
    text-decoration: none;
    font-size: 17px;
    font-weight: 600;
    padding: 0 32px;
    height: 56px;
    border-radius: 999px;
    border: 1px solid #316bf4;
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 12px rgba(49, 107, 244, 0.2);
  }

  .btn-secondary:hover {
    background-color: #2556d9;
    border-color: #2556d9;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(49, 107, 244, 0.3);
  }

  .btn-primary:focus-visible,
  .btn-secondary:focus-visible {
    outline: 3px solid #316bf4;
    outline-offset: 3px;
  }

  .trust-text {
    font-size: 14px;
    color: #94a3b8;
    margin-bottom: 56px;
    font-weight: 500;
  }

  .mockup-container {
    width: 100%;
    max-width: 1120px;
    position: relative;
  }

  .window-frame {
    background: #ffffff;
    border: 3px solid #0f172a;
    border-radius: 20px;
    padding: 10px;
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.08);
  }

  .window-content {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 10px;
    background: linear-gradient(135deg, #88a1ff 0%, #b58aff 45%, #ffb8d8 100%);
    position: relative;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .hero-section {
      padding: 60px 20px 40px;
    }

    .hero-heading {
      font-size: 40px;
    }

    .hero-subheading {
      font-size: 16px;
    }

    .cta-container {
      flex-direction: column;
      width: 100%;
    }

    .btn-primary, .btn-secondary {
      width: 100%;
    }
  }

  /* Pricing Styles */
  .pricing-section {
    background-color: #f8fafc;
    padding: 80px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pricing-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .pricing-title {
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 12px;
    color: #0f172a;
  }

  .pricing-subtitle {
    font-size: 18px;
    color: #64748b;
    font-weight: 500;
  }

  .pricing-card {
    display: flex;
    width: 100%;
    max-width: 960px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 20px 40px -12px rgba(16, 20, 43, 0.1);
    overflow: hidden;
  }

  .pricing-left {
    flex: 1;
    padding: 48px;
    background-color: #ffffff;
  }

  .pricing-left-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14px;
    line-height: 1.5;
    color: #334155;
    font-weight: 500;
  }

  .check-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .pricing-right {
    flex: 1;
    padding: 48px;
    background-color: #2F6BF6;
    color: #ffffff;
    display: flex;
    flex-direction: column;
  }

  .pricing-right-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #93B4FF;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  .price-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 24px;
  }

  .price-main {
    font-size: 56px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -2px;
  }

  .price-desc {
    font-size: 13px;
    color: #93B4FF;
    font-weight: 500;
  }

  .feature-item-light {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14px;
    line-height: 1.5;
    color: #ffffff;
    font-weight: 500;
  }

  .check-icon-light {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .buy-button-large {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    color: #10142b;
    text-decoration: none;
    font-size: 16px;
    font-weight: 700;
    height: 56px;
    border-radius: 999px;
    margin-top: 32px;
    margin-bottom: 24px;
    transition: transform 0.2s, box-shadow 0.2s;
    border: none;
    cursor: pointer;
    width: 100%;
  }

  .buy-button-large:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .buy-button-large:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .checkout-footer {
    font-size: 11px;
    color: #93B4FF;
    text-align: center;
    line-height: 1.5;
    margin-top: auto;
  }

  .checkout-footer a {
    color: #ffffff;
    text-decoration: underline;
  }

  .error-message {
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 16px;
  }

  /* Privacy Section */
  .privacy-section {
    background-color: #ffffff;
    padding: 80px 20px;
    color: #1f2937;
  }

  .privacy-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .privacy-title {
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 32px;
    color: #0f172a;
  }

  .privacy-content {
    line-height: 1.8;
    color: #4b5563;
  }

  .privacy-section-title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin-top: 32px;
    margin-bottom: 12px;
  }

  .privacy-section:first-of-type .privacy-section-title {
    margin-top: 0;
  }

  .privacy-content ul {
    list-style: disc;
    margin-left: 24px;
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .privacy-content li {
    margin-bottom: 8px;
  }

  .privacy-footer {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
  }

  @media (max-width: 768px) {
    .pricing-card {
      flex-direction: column;
    }

    .pricing-left, .pricing-right {
      padding: 32px 24px;
    }

    .pricing-title {
      font-size: 32px;
    }

    .price-main {
      font-size: 48px;
    }

    .privacy-title {
      font-size: 32px;
    }
  }
`;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'pro-lifetime' }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout')
      }

      const { checkoutUrl } = await response.json()
      window.location.href = checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white">
      <style dangerouslySetInnerHTML={{ __html: heroStyles }} />

      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <h1 className="hero-heading">
          Share your screen without sharing your secrets.
        </h1>

        <p className="hero-subheading">
          One click blurs names, emails and phone numbers on any web page. Built
          for live calls, demos and recordings.
        </p>

        <div className="cta-container">
          <a href={siteConfig.chromeStoreUrl} className="btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="#EA4335"
                d="M24 12.5H45.065A24 24 0 0 0 3.508 11.507L14.041 29.75A11.5 11.5 0 0 1 24 12.5Z"
              />
              <path
                fill="#FBBC05"
                d="M24 12.5H45.065A24 24 0 0 1 23.427 47.993L33.959 29.75A11.5 11.5 0 0 0 24 12.5Z"
              />
              <path
                fill="#34A853"
                d="M33.959 29.75L23.427 47.993A24 24 0 0 1 3.508 11.507L14.041 29.75A11.5 11.5 0 0 0 33.959 29.75Z"
              />
              <circle cx="24" cy="24" r="11.5" fill="#ffffff" />
              <circle cx="24" cy="24" r="9.2" fill="#4285F4" />
            </svg>
            Add to Chrome, it&apos;s free
          </a>

          <a href="#pricing" className="btn-secondary">
            Buy now — $19.99 Lifetime
          </a>
        </div>

        <div className="trust-text">
          100% local. Nothing leaves your browser.
        </div>

        <div className="mockup-container">
          <div className="window-frame">
            <div className="window-content"></div>
          </div>
        </div>
      </section>

      {/* Logo Strip */}
      <LogoStrip />

      {/* Features Section */}
      <section className="bg-white px-4 py-20 md:py-24" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful <span className="text-blue-600">Privacy</span> Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to share your screen safely
            </p>
          </div>

          {/* PII Detection */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">11 Types of PII Detection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Email Addresses',
                'Phone Numbers',
                'Credit Card Numbers',
                'Social Security Numbers',
                'Passwords & API Keys',
                'Cryptocurrency Wallets',
                'Bank Account Numbers',
                'Dates & Timestamps',
                'Mailing Addresses',
                'Dollar Amounts',
                'Custom Keywords'
              ].map((pii) => (
                <div key={pii} className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors">
                  <div className="text-3xl mb-3">🔍</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{pii}</h4>
                  <p className="text-gray-600 text-sm">
                    Automatically detected and blurred to protect your privacy
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Blur Styles */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">3 Blur Styles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Blur', desc: 'Smooth blur effect - looks natural and professional', icon: '🫨' },
                { name: 'Redact', desc: 'Black rectangle - completely blocks the sensitive data', icon: '⬛' },
                { name: 'Hide', desc: 'Completely hidden - removes the content entirely', icon: '👻' },
              ].map((style) => (
                <div key={style.name} className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center hover:border-blue-300 transition-colors">
                  <div className="text-5xl mb-4">{style.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{style.name}</h4>
                  <p className="text-gray-600">{style.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Mode */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-12 mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">✨ Demo Mode</h3>
            <p className="text-gray-700 text-lg mb-6">
              One-click full-page blur with a single keyboard shortcut. Perfect for presentations, demos, and screenshots where you want to show real websites without exposing sensitive data.
            </p>
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <p className="text-gray-600 text-sm mb-2">Keyboard Shortcut:</p>
              <code className="text-blue-600 font-mono text-lg">Alt + Shift + D</code>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { keys: 'Alt + Shift + D', action: 'Toggle Demo Mode (blur everything)' },
                { keys: 'Alt + Shift + A', action: 'Toggle Auto-Detection' },
                { keys: 'Alt + Shift + R', action: 'Remove all blurs' },
                { keys: 'Alt + Shift + T', action: 'Toggle toolbar' },
                { keys: 'Alt + Shift + B', action: 'Blur selected text' },
                { keys: 'Right-click', action: 'Blur selected text (context menu)' },
              ].map((shortcut) => (
                <div key={shortcut.keys} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                  <code className="text-blue-600 font-mono text-sm block mb-2">{shortcut.keys}</code>
                  <p className="text-gray-600">{shortcut.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Performance */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Privacy & Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🔒',
                  title: '100% Local Processing',
                  desc: 'All analysis happens in your browser. No data ever leaves your computer.',
                },
                {
                  icon: '🚫',
                  title: 'Zero Data Collection',
                  desc: 'We don\'t collect, store, or analyze any of your personal information.',
                },
                {
                  icon: '⚡',
                  title: 'Lightning Fast',
                  desc: 'Real-time detection with minimal CPU and memory overhead.',
                },
                {
                  icon: '🔄',
                  title: 'Works Everywhere',
                  desc: 'Detects and blurs data on every website you visit automatically.',
                },
                {
                  icon: '📱',
                  title: 'Tab Protection',
                  desc: 'Blur browser tab titles to keep your privacy even in screenshots.',
                },
                {
                  icon: '🎯',
                  title: 'Smart Detection',
                  desc: 'Advanced patterns catch real-world PII formats with minimal false positives.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="pricing-header">
          <h2 className="pricing-title">One price. Yours forever.</h2>
          <p className="pricing-subtitle">Pay once. No subscription.</p>
        </div>

        <div className="pricing-card">
          {/* Left Side: Everything Included */}
          <div className="pricing-left">
            <div className="pricing-left-title">Everything Included</div>
            <ul className="feature-list">
              <li className="feature-item">
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Auto-detect 11 types of PII (emails, phone numbers, credit cards, etc.)
              </li>
              <li className="feature-item">
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Demo Mode - Full page blur with one click (Alt+Shift+D)
              </li>
              <li className="feature-item">
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                3 blur styles (Blur, Redact, Hide) - customize per data type
              </li>
              <li className="feature-item">
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Keyboard shortcuts for power users
              </li>
              <li className="feature-item">
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Works on Chrome, Edge, Firefox, Brave
              </li>
              <li className="feature-item">
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                100% local processing - nothing leaves your browser
              </li>
              <li className="feature-item">
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Move your license to any of your computers
              </li>
            </ul>
          </div>

          {/* Right Side: Lifetime License */}
          <div className="pricing-right">
            <div className="pricing-right-title">Lifetime License</div>

            <div className="price-row">
              <span className="price-main">$19.99</span>
              <span className="price-desc">one-time payment</span>
            </div>

            <ul className="feature-list">
              <li className="feature-item-light">
                <svg className="check-icon-light" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span><strong>Pay once</strong>, no subscription</span>
              </li>
              <li className="feature-item-light">
                <svg className="check-icon-light" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span><strong>Every future update</strong> included</span>
              </li>
              <li className="feature-item-light">
                <svg className="check-icon-light" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span><strong>Move it</strong> to a new computer any time</span>
              </li>
              <li className="feature-item-light">
                <svg className="check-icon-light" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span><strong>30-day refund</strong> if it&apos;s not right for you</span>
              </li>
            </ul>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="buy-button-large"
            >
              {isLoading ? 'Processing...' : 'Buy now — $19.99 Lifetime'}
            </button>

            <div className="checkout-footer">
              Secure checkout by Dodo Payments. License key sent by email.<br />
              <a href="#privacy">Privacy policy</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white px-4 py-20 md:py-24" id="faq">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            {/* Left Side */}
            <div className="md:max-w-xs">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Questions</h2>
              <p className="text-gray-600">
                Something else? Write to <a href={`mailto:${siteConfig.support}`} className="text-blue-600 hover:underline">{siteConfig.support}</a>.
              </p>
            </div>

            {/* Right Side */}
            <div className="flex-1">
              {[
                {
                  question: "How do I get my license key?",
                  answer: "After payment, your license key will be sent to your email within seconds. Check your inbox and spam folder.",
                  defaultOpen: true,
                },
                {
                  question: "Does BlurKit record my screen?",
                  answer: "No. BlurKit only detects and blurs sensitive information on web pages. It doesn't record, screenshot, or capture anything. All processing happens locally in your browser.",
                },
                {
                  question: "Can I use the free version forever?",
                  answer: "Yes! The free version includes basic PII detection and is completely free. Upgrade to Pro anytime if you want all features.",
                },
                {
                  question: "Can I move my license to a new computer?",
                  answer: "Yes, you can deactivate your old computer and activate the license on a new one at any time.",
                },
                {
                  question: "Which browsers are supported?",
                  answer: "BlurKit works on Chrome, Edge, Firefox, and Brave. Simply install the extension from your browser's store.",
                },
                {
                  question: "Is there a refund policy?",
                  answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
                },
                {
                  question: "Do you collect my data?",
                  answer: "No. All processing happens locally in your browser. We never see, store, or collect your data. Only your email is stored for license management.",
                },
                {
                  question: "Can I use Pro on multiple devices?",
                  answer: "Yes, your license key works on any device where you have BlurKit installed.",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="border-b border-gray-200 py-6 first:pt-0 last:border-b-0 group"
                  open={faq.defaultOpen}
                >
                  <summary className="flex justify-between items-center font-semibold text-gray-900 cursor-pointer list-none select-none">
                    {faq.question}
                    <svg
                      className="w-5 h-5 text-blue-600 transition-transform group-open:rotate-45"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </summary>
                  <div className="mt-4 text-gray-600 leading-relaxed pr-8">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


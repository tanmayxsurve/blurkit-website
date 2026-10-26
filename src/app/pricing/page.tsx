'use client'

import { useState } from 'react'
import { siteConfig } from '@/../config/site.config'

const styles = `
  .pricing-section {
    background-color: #f8fafc;
    padding: 80px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    color: #10142b;
    -webkit-font-smoothing: antialiased;
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

  /* --- Left Column --- */
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

  /* --- Right Column --- */
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

  .price-old {
    font-size: 20px;
    text-decoration: line-through;
    color: #93B4FF;
    font-weight: 500;
  }

  .price-desc {
    font-size: 13px;
    color: #93B4FF;
    font-weight: 500;
  }

  .timer-badge {
    display: inline-flex;
    align-items: center;
    background-color: #FFD43B;
    color: #10142b;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 24px;
    width: fit-content;
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

  /* Buy Button */
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

  /* Responsive */
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
  }
`;

export default function PricingPage() {
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
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section className="pricing-section">
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
              <a href="/privacy">Privacy policy</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

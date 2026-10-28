'use client'

import { useState } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/config/site.config'
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

  /* FAQ Section Styles */
  .faq-section {
    max-width: 1100px;
    margin: 0 auto;
    padding: 100px 20px;
    display: flex;
    flex-direction: column;
    gap: 48px;
    font-family: 'Inter', sans-serif;
    color: #10142b;
    -webkit-font-smoothing: antialiased;
  }

  @media (min-width: 768px) {
    .faq-section {
      flex-direction: row;
      align-items: flex-start;
      gap: 80px;
    }
  }

  .faq-left {
    flex: 1;
    max-width: 320px;
  }

  .faq-title {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -1.5px;
    color: #0f172a;
    margin-bottom: 16px;
  }

  .faq-subtitle {
    font-size: 16px;
    color: #64748b;
    line-height: 1.6;
  }

  .faq-subtitle a {
    color: #2457e6;
    text-decoration: none;
  }

  .faq-subtitle a:hover {
    text-decoration: underline;
  }

  .faq-right {
    flex: 2;
    width: 100%;
  }

  .faq-item {
    border-bottom: 1px solid #e2e8f0;
    padding: 24px 0;
  }

  .faq-item:first-child {
    padding-top: 0;
  }

  .faq-item:last-child {
    border-bottom: none;
  }

  .faq-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    cursor: pointer;
    list-style: none;
    user-select: none;
  }

  .faq-summary::-webkit-details-marker {
    display: none;
  }

  .faq-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: #2457e6;
    transition: transform 0.2s ease;
  }

  .faq-item[open] .faq-icon {
    transform: rotate(45deg);
  }

  .faq-answer {
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
    margin-top: 16px;
    padding-right: 40px;
    animation: fadeIn 0.2s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Call Cloudflare Worker API instead of Pages API route
      const workerUrl = process.env.NEXT_PUBLIC_PAYMENT_WORKER_URL || 'https://blurkit-payment-api.YOUR_SUBDOMAIN.workers.dev'

      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'pdt_0NqhQec3BvgM8158TvkbE' }),
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
            Buy now — $49 Lifetime
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
      <section className="bg-[#f3f5f9] px-4 py-24" id="features">
        <style dangerouslySetInnerHTML={{ __html: `
          .features-container { max-width: 1120px; margin: 0 auto; }
          .sec-head { text-align: center; margin-bottom: 56px; }
          .eyebrow {
            display: inline-flex; align-items: center; gap: 8px;
            font-size: 13px; font-weight: 600; color: #316bf4;
            margin-bottom: 16px;
          }
          .eyebrow::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #316bf4; }
          .sec-head h2 {
            font-size: 52px; font-weight: 800; line-height: 1.08; letter-spacing: -1.5px; color: #0f172a;
          }
          .sec-head h2 span { color: #316bf4; }
          .sec-head p { margin-top: 18px; font-size: 17px; line-height: 1.6; color: #64748b; }

          .bento-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-areas: "a b" "a c";
            gap: 20px;
          }
          .bento-1 { grid-area: a; } .bento-2 { grid-area: b; } .bento-3 { grid-area: c; }

          .bento-card {
            background: #ffffff;
            border: 1px solid #e8ebf3;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
            display: flex; flex-direction: column;
            overflow: hidden;
            transition: transform .25s ease, box-shadow .25s ease;
          }
          .bento-card:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08); }

          .demo-area { flex: 1; padding: 30px; display: flex; flex-direction: column; gap: 28px; justify-content: center; }
          .meta-area { border-top: 1px solid #e8ebf3; padding: 20px 26px 24px; background: #fbfcfe; }
          .meta-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
          .card-num { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 600; color: #316bf4; }
          .meta-right { display: flex; align-items: center; gap: 10px; color: #94a3b8; }
          .meta-right svg { width: 18px; height: 18px; }
          .meta-area h3 { font-size: 17px; font-weight: 700; letter-spacing: -0.2px; margin-bottom: 6px; color: #0f172a; }
          .meta-area p { font-size: 14px; line-height: 1.55; color: #64748b; }

          .feat-tag {
            display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; font-weight: 600;
            letter-spacing: 0.8px; text-transform: uppercase;
            padding: 4px 9px; border-radius: 6px;
            background: #eaf0ff; color: #2556d9;
          }
          .feat-tag.off { background: transparent; color: #94a3b8; border: 1px solid #e8ebf3; }
          .feat-tag.pro { background: #0f172a; color: #fff; letter-spacing: 1px; }
          .feat-tag.on { background: #316bf4; color: #fff; }

          .blur-text { display: inline-block; filter: blur(5px); user-select: none; pointer-events: none; }

          .demo-name { font-size: 24px; font-weight: 700; letter-spacing: -0.4px; margin-bottom: 12px; color: #0f172a; }
          .demo-field {
            border: 1.5px solid #316bf4; border-radius: 10px; padding: 11px 14px;
            font-family: 'JetBrains Mono', monospace; font-size: 14px; background: #fff;
            box-shadow: 0 0 0 4px rgba(49, 107, 244, 0.1);
          }
          .demo-area-box {
            position: relative; border: 1.5px dashed #316bf4; border-radius: 12px;
            background: rgba(49, 107, 244, 0.05); padding: 18px 20px;
            font-family: 'JetBrains Mono', monospace; font-size: 15px; line-height: 1.8; max-width: 270px;
          }
          .cursor-icon { position: absolute; right: -18px; bottom: -16px; width: 26px; height: 26px; filter: drop-shadow(0 2px 3px rgba(15,23,42,.25)); }
          .demo-sentence { font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 2; color: #334155; }
          .highlight-text { background: #eaf0ff; border-radius: 5px; padding: 2px 4px; }

          .chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
          .demo-sample { font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 2; color: #334155; }
          .demo-sample em { font-style: normal; color: #94a3b8; }

          .regex-input {
            display: flex; align-items: center; gap: 2px;
            font-family: 'JetBrains Mono', monospace; font-size: 26px; font-weight: 500; letter-spacing: -0.5px;
            border: 1.5px solid #e8ebf3; border-radius: 12px; padding: 14px 18px; background: #fff;
          }
          .typing-caret { width: 2px; height: 28px; background: #316bf4; margin-left: 4px; animation: blink 1.1s steps(1) infinite; }
          @keyframes blink { 50% { opacity: 0; } }
          .match-list { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
          .match-item { background: #eaf0ff; border-radius: 6px; padding: 5px 9px; }

          @media (max-width: 860px) {
            .sec-head h2 { font-size: 36px; }
            .bento-grid { grid-template-columns: 1fr; grid-template-areas: "a" "b" "c"; }
            .demo-area { padding: 24px; }
            .regex-input { font-size: 20px; }
          }
        ` }} />

        <div className="features-container">
          <header className="sec-head">
            <div className="eyebrow">What&apos;s inside</div>
            <h2>
              Three ways to hide
              <br />
              <span>exactly what you mean to.</span>
            </h2>
            <p>From one-off clicks to rules that run on every page you open.</p>
          </header>

          <div className="bento-grid">
            {/* Card 1: Manual blur */}
            <article className="bento-card bento-1">
              <div className="demo-area">
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <span className="feat-tag">Element</span>
                  </div>
                  <div className="demo-name">Ben Affleck</div>
                  <div className="demo-field">
                    <span className="blur-text">ben@acme.com</span>
                  </div>
                </div>

                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <span className="feat-tag">Area</span>
                  </div>
                  <div className="demo-area-box">
                    <span className="blur-text">•••• 4242</span>
                    <br />
                    <span className="blur-text">$ 12,400</span>
                    <svg className="cursor-icon" viewBox="0 0 24 24">
                      <path
                        d="M5 3l14 8-6 2 4 7-3 1.5-4-7-5 4z"
                        fill="#0f172a"
                        stroke="#fff"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <span className="feat-tag">Words</span>
                  </div>
                  <p className="demo-sentence">
                    Wire{" "}
                    <span className="highlight-text">
                      <span className="blur-text">$ 12,400</span>
                    </span>{" "}
                    to{" "}
                    <span className="highlight-text">
                      <span className="blur-text">Acme Corp</span>
                    </span>
                    , ref{" "}
                    <span className="highlight-text">
                      <span className="blur-text">INV-2214</span>
                    </span>
                    , before Friday.
                  </p>
                </div>
              </div>
              <div className="meta-area">
                <div className="meta-top">
                  <span className="card-num">01</span>
                  <span className="meta-right">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 3l14 8-6 2 4 7-3 1.5-4-7-5 4z" />
                    </svg>
                  </span>
                </div>
                <h3>Manual blur: elements, areas &amp; words</h3>
                <p>
                  Click an element, drag a region, or pick specific words. Surgical
                  control when you need it.
                </p>
              </div>
            </article>

            {/* Card 2: Auto blur */}
            <article className="bento-card bento-2">
              <div className="demo-area">
                <div className="chip-group">
                  <span className="feat-tag on">Emails</span>
                  <span className="feat-tag on">Phones</span>
                  <span className="feat-tag on">Keys</span>
                  <span className="feat-tag off">Cards</span>
                </div>
                <div className="demo-sample">
                  From <span className="blur-text">jane@acme.com</span>
                  <br />
                  Call <span className="blur-text">+1 415 555 0142</span>
                  <br />
                  <span className="blur-text">sk_live_4eC39HqL</span> <em>|</em> Card ••••
                  4242
                </div>
              </div>
              <div className="meta-area">
                <div className="meta-top">
                  <span className="card-num">02</span>
                  <span className="meta-right">
                    <span className="feat-tag pro">Pro</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M9 12h6" />
                    </svg>
                  </span>
                </div>
                <h3>Auto-blur by category</h3>
                <p>
                  Toggle emails, phones, cards, secret keys, IBANs and crypto
                  wallets. Masked across the page automatically.
                </p>
              </div>
            </article>

            {/* Card 3: Regex */}
            <article className="bento-card bento-3">
              <div className="demo-area">
                <div style={{ margin: 0, marginBottom: '12px' }}>
                  <span className="feat-tag">Regex</span>
                </div>
                <div className="regex-input">
                  /[A-Z]{'{2,}'}-\d+/<span className="typing-caret"></span>
                </div>
                <div className="match-list">
                  <span className="match-item">
                    <span className="blur-text">ENG-1422</span>
                  </span>
                  <span className="match-item">
                    <span className="blur-text">OPS-318</span>
                  </span>
                  <span className="match-item">
                    <span className="blur-text">FIN-0814</span>
                  </span>
                  <span style={{ color: '#94a3b8' }}>+39</span>
                </div>
              </div>
              <div className="meta-area">
                <div className="meta-top">
                  <span className="card-num">03</span>
                  <span className="meta-right">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 5h18l-7 8v6l-4-2v-4z" />
                    </svg>
                  </span>
                </div>
                <h3>Blur list with regex</h3>
                <p>
                  Comma-separated words or regex. If it matches, it&apos;s hidden.
                  Everywhere. Three terms free, unlimited with Pro.
                </p>
              </div>
            </article>
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
              <span className="price-main">$49</span>
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
              {isLoading ? 'Processing...' : 'Buy now — $49 Lifetime'}
            </button>

            <div className="checkout-footer">
              Secure checkout by Dodo Payments. License key sent by email.<br />
              <a href="#privacy">Privacy policy</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white" id="faq">
        <div className="faq-section">
          {/* Left Side */}
          <div className="faq-left">
            <h2 className="faq-title">Questions</h2>
            <p className="faq-subtitle">
              Something else? Write to <a href={`mailto:${siteConfig.support}`}>{siteConfig.support}</a>.
            </p>
          </div>

          {/* Right Side */}
          <div className="faq-right">
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
                className="faq-item"
                open={faq.defaultOpen}
              >
                <summary className="faq-summary">
                  {faq.question}
                  <svg
                    className="faq-icon"
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
                <div className="faq-answer">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


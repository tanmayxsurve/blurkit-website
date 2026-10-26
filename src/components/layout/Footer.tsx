import React from "react";
import Link from "next/link";
import { siteConfig } from '@/../config/site.config'

const styles = `
  .footer {
    background-color: #f8fafc;
    border-top: 1px solid #e2e8f0;
    padding: 80px 20px 40px;
    font-family: 'Inter', sans-serif;
    color: #10142b;
    -webkit-font-smoothing: antialiased;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* --- Top Section: Columns --- */
  .footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }

  /* Brand Column */
  .footer-brand-col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .brand-logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .brand-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #4097ff, #3158ed);
    border-radius: 8px;
    color: white;
    box-shadow: 0 4px 12px rgba(49, 88, 237, 0.2);
  }

  .brand-name {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.5px;
  }

  .brand-desc {
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 24px;
    max-width: 320px;
  }

  .privacy-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
  }

  .privacy-badge svg {
    width: 16px;
    height: 16px;
    color: #22c55e;
  }

  /* Links Columns */
  .footer-links-col h4 {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 24px;
  }

  .footer-links-col ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0;
    margin: 0;
  }

  .footer-links-col a {
    font-size: 14px;
    font-weight: 500;
    color: #475569;
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-links-col a:hover {
    color: #0f172a;
  }

  /* --- Bottom Section --- */
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 24px;
    font-size: 14px;
    color: #64748b;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer-bottom-right {
    color: #64748b;
  }

  .footer-bottom-right strong {
    color: #0f172a;
    font-weight: 600;
  }

  /* --- Responsive --- */
  @media (max-width: 900px) {
    .footer-top {
      grid-template-columns: 1fr 1fr;
      gap: 48px;
    }
  }

  @media (max-width: 600px) {
    .footer-top {
      grid-template-columns: 1fr;
    }

    .footer-bottom {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export function Footer() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <footer className="footer">
        <div className="footer-container">

          {/* Top Grid */}
          <div className="footer-top">

            {/* Brand Col */}
            <div className="footer-brand-col">
              <div className="brand-logo-wrap">
                <div className="brand-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14l6-6 4 4 6-6"></path>
                    <circle cx="20" cy="6" r="2" fill="currentColor" stroke="none"></circle>
                  </svg>
                </div>
                <span className="brand-name">BlurKit</span>
              </div>

              <p className="brand-desc">
                Protect your privacy while sharing your screen. Auto-blur sensitive data with one click.
              </p>

              <div className="privacy-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Everything stays on your computer
              </div>
            </div>

            {/* Links Col 1 */}
            <div className="footer-links-col">
              <h4>Product</h4>
              <ul>
                <li><a href="/#features">Features</a></li>
                <li><a href="/#pricing">Pricing</a></li>
                <li><a href="/#faq">FAQ</a></li>
                <li><a href={siteConfig.chromeStoreUrl} target="_blank" rel="noopener noreferrer">Download</a></li>
              </ul>
            </div>

            {/* Links Col 2 */}
            <div className="footer-links-col">
              <h4>Browser Extension</h4>
              <ul>
                <li><a href={siteConfig.chromeStoreUrl} target="_blank" rel="noopener noreferrer">Chrome</a></li>
                <li><a href={siteConfig.chromeStoreUrl} target="_blank" rel="noopener noreferrer">Edge</a></li>
                <li><a href={siteConfig.chromeStoreUrl} target="_blank" rel="noopener noreferrer">Firefox</a></li>
                <li><a href={siteConfig.chromeStoreUrl} target="_blank" rel="noopener noreferrer">Brave</a></li>
              </ul>
            </div>

            {/* Links Col 3 */}
            <div className="footer-links-col">
              <h4>Help</h4>
              <ul>
                <li><a href={`mailto:${siteConfig.support}`}>Contact us</a></li>
                <li><a href={`mailto:${siteConfig.support}`}>{siteConfig.support}</a></li>
                <li><Link href="/privacy">Privacy policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              &copy; 2026 BlurKit. All rights reserved.
            </div>
            <div className="footer-bottom-right">
              Built with privacy in mind
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

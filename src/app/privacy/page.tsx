'use client'

import { siteConfig } from '@/config/site.config'

const styles = `
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
    .privacy-title {
      font-size: 32px;
    }
  }
`;

export default function PrivacyPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <section className="privacy-section">
        <div className="privacy-container">
          <h2 className="privacy-title">Privacy Policy</h2>

          <div className="privacy-content space-y-6">
            <section>
              <h3 className="privacy-section-title">1. Overview</h3>
              <p>
                BlurKit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h3 className="privacy-section-title">2. The Extension: 100% Local Processing</h3>
              <p>
                The BlurKit Chrome extension processes all data locally in your browser. We do not:
              </p>
              <ul>
                <li>Collect any of your personal information</li>
                <li>Track your browsing history</li>
                <li>Send data to our servers</li>
                <li>Use tracking cookies or analytics</li>
                <li>Share data with third parties</li>
                <li>Display advertisements</li>
              </ul>
              <p>
                All PII detection and blurring happens 100% on your device. Your data never leaves your browser.
              </p>
            </section>

            <section>
              <h3 className="privacy-section-title">3. Website Data Collection</h3>
              <p>
                When you visit blurkit.dev or purchase a license, we may collect:
              </p>
              <ul>
                <li>Email address (for license delivery and support)</li>
                <li>Payment information (processed by Dodo Payments)</li>
                <li>Basic analytics (page views, referrer source)</li>
                <li>Browser and device information</li>
              </ul>
            </section>

            <section>
              <h3 className="privacy-section-title">4. Payment Processing</h3>
              <p>
                We use Dodo Payments for payment processing. Your credit card information is never stored on our servers. Dodo Payments handles all payment data according to their own privacy policy.
              </p>
            </section>

            <section>
              <h3 className="privacy-section-title">5. License Key Management</h3>
              <p>
                We store license keys and associated email addresses in our database to:
              </p>
              <ul>
                <li>Deliver license keys via email</li>
                <li>Enable license key activation in the extension</li>
                <li>Provide support and troubleshooting</li>
                <li>Prevent duplicate licenses</li>
              </ul>
            </section>

            <section>
              <h3 className="privacy-section-title">6. Security</h3>
              <p>
                We implement industry-standard security measures to protect your data, including:
              </p>
              <ul>
                <li>HTTPS encryption for all website traffic</li>
                <li>Secure database encryption</li>
                <li>Regular security updates</li>
                <li>Limited access controls</li>
              </ul>
            </section>

            <section>
              <h3 className="privacy-section-title">7. Your Rights</h3>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Request access to your data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of communications</li>
                <li>Port your data in a portable format</li>
              </ul>
              <p>
                Contact us at {siteConfig.support} to exercise these rights.
              </p>
            </section>

            <section>
              <h3 className="privacy-section-title">8. GDPR & CCPA Compliance</h3>
              <p>
                BlurKit complies with GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act). We only collect necessary data and provide full transparency about how it's used.
              </p>
            </section>

            <section>
              <h3 className="privacy-section-title">9. Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy occasionally. We'll notify you of significant changes via email or by updating this page.
              </p>
            </section>

            <section>
              <h3 className="privacy-section-title">10. Contact Us</h3>
              <p>
                For privacy concerns or questions, contact us at:
              </p>
              <p className="font-semibold">
                Email: {siteConfig.support}
              </p>
            </section>

            <div className="privacy-footer">
              Last updated: October 26, 2026
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

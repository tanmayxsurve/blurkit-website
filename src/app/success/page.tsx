import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to BlurKit Pro",
  description: "Thank you for purchasing BlurKit Pro.",
};

const styles = `
  :root {
    --bg: #f8fafc;
    --surface: #ffffff;
    --text-main: #0f172a;
    --text-muted: #475569;
    --text-light: #94a3b8;
    --blue: #316bf4;
    --blue-dark: #2556d9;
    --blue-soft: #eaf0ff;
    --border: #e2e8f0;
    --green: #16a34a;
  }

  .welcome-page {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg);
    color: var(--text-main);
    -webkit-font-smoothing: antialiased;
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .welcome-page a {
    color: var(--blue);
    text-decoration: none;
    transition: color 0.2s;
  }

  .welcome-page a:hover {
    color: var(--blue-dark);
    text-decoration: underline;
  }

  /* --- Main Content --- */
  .main-container {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    padding: 80px 20px 80px;
    flex: 1;
  }

  /* Success Card */
  .success-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 48px;
    text-align: center;
    box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.05);
    margin-bottom: 24px;
  }

  .success-emoji {
    font-size: 48px;
    margin-bottom: 16px;
    display: inline-block;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .success-title {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 12px;
  }

  .success-desc {
    font-size: 16px;
    color: var(--text-muted);
    margin-bottom: 24px;
  }

  .notice-text {
    font-size: 14px;
    color: var(--text-light);
    max-width: 500px;
    margin: 0 auto;
  }

  /* Sections (Activation) */
  .section-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 40px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02);
  }

  /* Centered Activation Section */
  .activation-section {
    text-align: center;
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 32px;
    color: var(--text-main);
  }

  /* Steps Container */
  .steps-list {
    display: inline-flex;
    flex-direction: column;
    gap: 24px;
    text-align: left;
    max-width: 450px;
  }

  .step {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .step-num {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    background-color: var(--blue-soft);
    color: var(--blue);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
  }

  .step-content h4 {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .step-content p {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* --- Footer --- */
  .footer {
    background-color: var(--surface);
    border-top: 1px solid var(--border);
    padding: 60px 20px 40px;
  }

  .footer-container {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }

  .footer-brand p {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 12px;
    margin-bottom: 16px;
    max-width: 280px;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 800;
    color: var(--text-main);
    text-decoration: none !important;
  }

  .brand-icon {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: linear-gradient(135deg, #4097ff, #3158ed);
    color: white;
    font-size: 16px;
  }

  .privacy-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .privacy-badge svg {
    width: 14px;
    height: 14px;
    color: var(--green);
  }

  .footer-col h4 {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-main);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .footer-col ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0;
    margin: 0;
  }

  .footer-col a {
    font-size: 14px;
    color: var(--text-muted);
    text-decoration: none;
  }

  .footer-col a:hover {
    color: var(--blue);
  }

  .footer-bottom {
    max-width: 1000px;
    margin: 0 auto;
    border-top: 1px solid var(--border);
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: var(--text-light);
    flex-wrap: wrap;
    gap: 12px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .success-card, .section-card {
      padding: 32px 24px;
    }
    .footer-container {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .footer-container {
      grid-template-columns: 1fr;
    }
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }
`;

const steps = [
  {
    title: "Install BlurKit",
    desc: (
      <>
        Get BlurKit from the{" "}
        <a
          href="https://chromewebstore.google.com/detail/blurkit/mgkbgadmjmmokapanfiopeaddiebdjmn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chrome Web Store
        </a>
        .
      </>
    ),
  },
  {
    title: "Click the BlurKit Icon",
    desc: "Click the BlurKit icon in your Chrome toolbar to open the popup.",
  },
  {
    title: "Go to Settings",
    desc: "Click the settings icon and go to the \"About\" tab.",
  },
  {
    title: "Enter License Key",
    desc: "Paste your license key from the email and click \"Activate\".",
  },
  {
    title: "Enjoy Pro Features!",
    desc: "All features are now unlocked. Happy blurring!",
  },
];

export default function WelcomePage() {
  return (
    <div className={`welcome-page ${inter.className}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Main Content */}
      <main className="main-container">

        {/* Success Card */}
        <div className="success-card">
          <div className="success-emoji">🎉</div>
          <h1 className="success-title">Welcome</h1>
          <p className="success-desc">
            Thank you for purchasing <strong>BlurKit Pro!</strong>
          </p>

          <p className="notice-text">
            Your license key has been sent to your email. Please check your inbox and spam folder.
            If you don&apos;t receive it shortly, please contact support.
          </p>
        </div>

        {/* Activation Steps (Centered) */}
        <div className="section-card activation-section">
          <h2 className="section-title">How to Activate</h2>

          <div className="steps-list">
            {steps.map((step, index) => (
              <div className="step" key={index}>
                <div className="step-num">{index + 1}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">

          {/* Brand */}
          <div className="footer-brand">
            <a href="https://blurkit.app/" className="brand">
              <span className="brand-icon">↗</span>
              BlurKit
            </a>
            <p>Protect your privacy while sharing your screen. Auto-blur sensitive data with one click.</p>
            <div className="privacy-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Everything stays on your computer
            </div>
          </div>

          {/* Product */}
          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="https://blurkit.app/#features">Features</a></li>
              <li><a href="https://blurkit.app/#pricing">Pricing</a></li>
              <li><a href="https://blurkit.app/#faq">FAQ</a></li>
              <li><a href="https://chromewebstore.google.com/detail/blurkit/mgkbgadmjmmokapanfiopeaddiebdjmn">Download</a></li>
            </ul>
          </div>

          {/* Extension */}
          <div className="footer-col">
            <h4>Browser Extension</h4>
            <ul>
              <li><a href="https://chromewebstore.google.com/detail/blurkit/mgkbgadmjmmokapanfiopeaddiebdjmn">Chrome</a></li>
              <li><a href="https://chromewebstore.google.com/detail/blurkit/mgkbgadmjmmokapanfiopeaddiebdjmn">Edge</a></li>
              <li><a href="https://chromewebstore.google.com/detail/blurkit/mgkbgadmjmmokapanfiopeaddiebdjmn">Firefox</a></li>
              <li><a href="https://chromewebstore.google.com/detail/blurkit/mgkbgadmjmmokapanfiopeaddiebdjmn">Brave</a></li>
            </ul>
          </div>

          {/* Help */}
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><a href="mailto:survextanmay@gmail.com">Contact us</a></li>
              <li><a href="https://blurkit.app/privacy">Privacy policy</a></li>
              <li><a href="https://blurkit.app/terms">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <div>&copy; 2026 BlurKit. All rights reserved.</div>
          <div>Built with privacy in mind</div>
        </div>
      </footer>
    </div>
  );
}

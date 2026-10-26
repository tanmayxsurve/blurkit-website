import React from "react";

export default function LogoStrip() {
  const styles = `
    .marquee-wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }

    .marquee-title {
      color: #64748b;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 30px;
      font-weight: 600;
    }

    .marquee-track {
      display: flex;
      width: max-content;
      animation: scroll 35s linear infinite;
      will-change: transform;
    }

    .marquee-track:hover {
      animation-play-state: paused;
    }

    .marquee-group {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .logo-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #334155;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .logo-item svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .dot {
      color: #cbd5e1;
      margin: 0 32px;
      font-size: 18px;
      line-height: 1;
    }

    @keyframes scroll {
      from { transform: translate3d(0, 0, 0); }
      to { transform: translate3d(-33.333%, 0, 0); }
    }

    @media (max-width: 768px) {
      .dot {
        margin: 0 16px;
      }
      .logo-item {
        font-size: 11px;
      }
    }
  `;

  // Helper array to map over the logos to keep the JSX clean
  const logos = [
    {
      name: "Notion",
      svg: <svg viewBox="0 0 24 24" fill="#111827"><path d="M4 4v16h16V4H4zm12.5 12.5H16V9h-2v7.5h-2V9H10v7.5H7.5v-9h9v9z"/></svg>,
    },
    {
      name: "Linear",
      svg: <svg viewBox="0 0 24 24" fill="#5E6AD2"><path d="M2.1 12A9.9 9.9 0 0 1 12 2.1 9.9 9.9 0 0 1 21.9 12a9.9 9.9 0 0 1-9.9 9.9A9.9 9.9 0 0 1 2.1 12zm1.1 0a8.8 8.8 0 0 0 8.8 8.8v-1.1A7.7 7.7 0 0 1 4.3 12H3.2z"/></svg>,
    },
    {
      name: "HubSpot",
      svg: <svg viewBox="0 0 24 24" fill="#FF7A59"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>,
    },
    {
      name: "Salesforce",
      svg: <svg viewBox="0 0 24 24" fill="#00A1E0"><path d="M17.5 10a4.5 4.5 0 0 0-4-2.5c-1.3 0-2.5.5-3.4 1.4A5 5 0 0 0 5 13a5 5 0 0 0 5 5h8a4 4 0 0 0 4-4 4 4 0 0 0-4.5-4z"/></svg>,
    },
    {
      name: "Slack",
      svg: <svg viewBox="0 0 24 24" fill="#E01E5A"><path d="M5.5 15a2.5 2.5 0 0 1 0-5h2.5v2.5A2.5 2.5 0 0 1 5.5 15zm12.5-5a2.5 2.5 0 0 1 0 5h-2.5v-2.5A2.5 2.5 0 0 1 18 10zm-6-5a2.5 2.5 0 0 1 5 0v2.5h-2.5A2.5 2.5 0 0 1 12 5zm-5 6a2.5 2.5 0 0 1 0 5H4.5a2.5 2.5 0 0 1 0-5h2.5v2.5z"/></svg>,
    },
    {
      name: "Google Sheets",
      svg: <svg viewBox="0 0 24 24" fill="#0F9D58"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>,
    },
    {
      name: "Google Analytics",
      svg: <svg viewBox="0 0 24 24" fill="#F4B400"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14h-3v-6h3v6zm-4 0h-3v-4h3v4zm-4 0H6v-2h3v2z"/></svg>,
    },
    {
      name: "Intercom",
      svg: <svg viewBox="0 0 24 24" fill="#286EFA"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/></svg>,
    },
    {
      name: "Jira",
      svg: <svg viewBox="0 0 24 24" fill="#2684FF"><path d="M12 2L2 12l10 10 10-10L12 2zm0 3.5l6.5 6.5-6.5 6.5-6.5-6.5L12 5.5z"/></svg>,
    },
    {
      name: "Figma",
      svg: <svg viewBox="0 0 24 24" fill="#F24E1E"><path d="M12 2H8a3 3 0 0 0 0 6h4V2zm0 8H8a3 3 0 0 0 0 6h4v-6zm0 8H8a3 3 0 0 0 0 6h4v-6zm4-8a3 3 0 0 0 0-6h-4v6h4zm0 8a3 3 0 0 0 0-6h-4v6h4z"/></svg>,
    },
    {
      name: "Gmail",
      svg: <svg viewBox="0 0 24 24" fill="#EA4335"><path d="M22 6.5V18c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6.5l10 7.5 10-7.5zM2 5.5l10 7.5L22 5.5V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v.5z"/></svg>,
    },
    {
      name: "Stripe",
      svg: <svg viewBox="0 0 24 24" fill="#635BFF"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>,
    },
  ];

  // Render group function to prevent repeating JSX
  const renderGroup = () => (
    <div className="marquee-group">
      {logos.map((logo, index) => (
        <React.Fragment key={index}>
          <div className="logo-item">
            {logo.svg}
            {logo.name}
          </div>
          <span className="dot">•</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="marquee-wrapper">
        <div className="marquee-title">
          Protects your data on the tools you use daily
        </div>
        <div className="marquee-track">
          {renderGroup()}
          {renderGroup()}
          {renderGroup()}
        </div>
      </div>
    </>
  );
}

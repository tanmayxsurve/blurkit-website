'use client'

import Link from 'next/link'
import { siteConfig } from '@/config/site.config'

const styles = `
  .nav-wrap {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 11px 18px;
  }

  .navbar {
    position: fixed;
    top: 11px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 23px;
    min-height: 51px;
    padding: 7px 8px 7px 20px;
    background: #343b66;
    border-radius: 999px;
    box-shadow: 0 10px 24px rgba(28, 35, 66, 0.18);
    white-space: nowrap;
    z-index: 1000;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
    text-decoration: none;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .brand-icon {
    display: grid;
    place-items: center;
    width: 21px;
    height: 21px;
    border-radius: 5px;
    background: linear-gradient(135deg, #4097ff, #3158ed);
    color: #fff;
    font-size: 15px;
    box-shadow: 0 2px 6px #17224b55;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .nav-links a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #d0d3e2;
    text-decoration: none;
    font-size: 15px;
    font-weight: 400;
    transition: color 0.2s ease;
  }

  .nav-links a:hover {
    color: #fff;
  }

  .badge {
    padding: 2px 5px;
    border-radius: 5px;
    background: #22c879;
    color: #10243b;
    font-size: 12px;
    line-height: 1.2;
    font-weight: 800;
  }

  .buy-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    padding: 0 18px;
    border-radius: 999px;
    background: #fff;
    color: #141a35;
    text-decoration: none;
    font-size: 14px;
    font-weight: 750;
    transition: transform 0.2s ease;
  }

  .buy-button:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 760px) {
    .nav-wrap {
      padding: 10px;
    }

    .navbar {
      top: 10px;
      width: calc(100% - 20px);
      justify-content: space-between;
      gap: 12px;
      padding-left: 13px;
    }

    .nav-links {
      gap: 12px;
    }

    .nav-links a {
      font-size: 12px;
    }

    .nav-links a:nth-child(n + 3) {
      display: none;
    }

    .brand {
      font-size: 16px;
    }

    .buy-button {
      min-height: 34px;
      padding: 0 12px;
      font-size: 12px;
    }
  }

  @media (max-width: 420px) {
    .nav-links {
      display: none;
    }

    .navbar {
      min-height: 48px;
    }
  }
`;

export function Header() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <header className="w-full bg-[#f4f5f8]">
        <div className="nav-wrap">
          <nav className="navbar" aria-label="Main navigation">
            <Link href="/" className="brand">
              <span className="brand-icon" aria-hidden="true">
                ↗
              </span>
              <span>BlurKit</span>
            </Link>

            <div className="nav-links">
              <a href="/#features">Features</a>
              <a href="/#pricing">Pricing</a>
              <a href="/#faq">FAQ</a>
              <Link href="/privacy">Privacy</Link>
            </div>

            <a href="/#pricing" className="buy-button">
              Buy now — $49 Lifetime
            </a>
          </nav>
        </div>
      </header>
    </>
  )
}

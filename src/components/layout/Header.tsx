'use client'

import Link from 'next/link'
import { siteConfig } from '@/../config/site.config'

export function Header() {
  return (
    <header className="w-full py-3 px-4 md:px-6 bg-white">
      <div className="flex justify-center w-full">
        <nav
          className="flex items-center gap-5 px-6 py-2.5 bg-[#343b66] rounded-full shadow-md whitespace-nowrap"
          aria-label="Main navigation"
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 text-white no-underline text-base font-bold tracking-tight">
            <span
              className="grid place-items-center w-6 h-6 rounded-md bg-gradient-to-br from-[#4097ff] to-[#3158ed] text-white text-sm shadow-sm"
              aria-hidden="true"
            >
              ↗
            </span>
            <span>BlurKit</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-6">
            <a
              href="/#features"
              className="text-[#d0d3e2] no-underline text-sm font-normal transition-colors duration-200 hover:text-white"
            >
              Features
            </a>
            <a
              href="/#pricing"
              className="hidden md:inline text-[#d0d3e2] no-underline text-sm font-normal transition-colors duration-200 hover:text-white"
            >
              Pricing
            </a>
            <Link
              href="/privacy"
              className="hidden lg:inline text-[#d0d3e2] no-underline text-sm font-normal transition-colors duration-200 hover:text-white"
            >
              Privacy
            </Link>
          </div>

          {/* CTA Button */}
          <a
            href="/#pricing"
            className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-white text-[#141a35] no-underline text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5"
          >
            Buy — $19.99
          </a>
        </nav>
      </div>
    </header>
  )
}

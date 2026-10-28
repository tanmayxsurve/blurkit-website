'use client'

import { siteConfig } from '@/config/site.config'

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark to-dark-900 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful <span className="text-primary">Privacy</span> Features
          </h1>
          <p className="text-lg text-gray-300">
            Everything you need to share your screen safely
          </p>
        </div>

        {/* PII Detection */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">11 Types of PII Detection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteConfig.piiTypes.map((pii) => (
              <div key={pii.name} className="bg-dark-100 rounded-lg border border-gray-800 p-6 hover:border-primary/50 transition-colors">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-white mb-2">{pii.name}</h3>
                <p className="text-gray-400 text-sm">
                  Automatically detected and blurred to protect your privacy
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Blur Styles */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">3 Blur Styles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Blur',
                desc: 'Smooth blur effect - looks natural and professional',
                icon: '🫨',
              },
              {
                name: 'Redact',
                desc: 'Black rectangle - completely blocks the sensitive data',
                icon: '⬛',
              },
              {
                name: 'Hide',
                desc: 'Completely hidden - removes the content entirely',
                icon: '👻',
              },
            ].map((style) => (
              <div key={style.name} className="bg-dark-100 rounded-lg border border-gray-800 p-8 text-center hover:border-primary/50 transition-colors">
                <div className="text-5xl mb-4">{style.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{style.name}</h3>
                <p className="text-gray-400">{style.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Mode */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg border border-primary/30 p-12">
            <h2 className="text-3xl font-bold text-white mb-4">✨ Demo Mode</h2>
            <p className="text-gray-300 text-lg mb-6">
              One-click full-page blur with a single keyboard shortcut. Perfect for presentations, demos, and screenshots where you want to show real websites without exposing sensitive data.
            </p>
            <div className="bg-dark rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm mb-2">Keyboard Shortcut:</p>
              <code className="text-primary font-mono text-lg">Alt + Shift + D</code>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { keys: 'Alt + Shift + D', action: 'Toggle Demo Mode (blur everything)' },
              { keys: 'Alt + Shift + A', action: 'Toggle Auto-Detection' },
              { keys: 'Alt + Shift + R', action: 'Remove all blurs' },
              { keys: 'Alt + Shift + T', action: 'Toggle toolbar' },
              { keys: 'Alt + Shift + B', action: 'Blur selected text' },
              { keys: 'Right-click', action: 'Blur selected text (context menu)' },
            ].map((shortcut) => (
              <div key={shortcut.keys} className="bg-dark-100 rounded-lg border border-gray-800 p-6">
                <code className="text-primary font-mono text-sm block mb-2">{shortcut.keys}</code>
                <p className="text-gray-400">{shortcut.action}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Customization */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Fully Customizable</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Choose What to Detect',
                desc: 'Enable or disable each PII type individually. Only detect what you want.',
              },
              {
                title: 'Custom Keywords',
                desc: 'Add your own words and phrases to blur. Supports regex patterns for advanced users.',
              },
              {
                title: 'Pick Your Blur Style',
                desc: 'Choose blur, redact, or hide for each data type. Mix and match for perfect control.',
              },
              {
                title: 'Per-Type Configuration',
                desc: 'Different settings for emails, phone numbers, credit cards, and more.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-dark-100 rounded-lg border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy & Performance */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Privacy & Performance</h2>
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
                desc: 'Blur browser tab titles and favicons to keep your privacy even in screenshots.',
              },
              {
                icon: '🎯',
                title: 'Smart Detection',
                desc: 'Advanced patterns catch real-world PII formats with minimal false positives.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-dark-100 rounded-lg border border-gray-800 p-6 hover:border-primary/50 transition-colors">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

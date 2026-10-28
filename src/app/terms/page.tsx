import { siteConfig } from '@/config/site.config.ts'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark via-dark to-dark-900 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By using BlurKit, you agree to these Terms of Service. If you don't agree, please don't use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. License Grant</h2>
              <p>
                We grant you a non-exclusive, non-transferable license to use BlurKit:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>For personal, non-commercial use</li>
                <li>On devices where you have installed the extension</li>
                <li>Subject to these Terms and our Privacy Policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. License Key Terms</h2>
              <p>
                Each license key is:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal to the purchaser</li>
                <li>Non-transferable to other users</li>
                <li>Valid for the purchased plan duration</li>
                <li>Subject to revocation if misused</li>
              </ul>
              <p className="mt-3">
                <strong>Lifetime licenses</strong> include all future updates and features at no additional cost.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Refund Policy</h2>
              <p>
                We offer a 30-day money-back guarantee for Pro purchases. To request a refund:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact us within 30 days of purchase</li>
                <li>Include your order number or license key</li>
                <li>Explain your reason for requesting a refund</li>
              </ul>
              <p className="mt-3">
                Refunds are processed within 5-7 business days to the original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Acceptable Use</h2>
              <p>
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reverse engineer or decompile the extension</li>
                <li>Share license keys or sell access to others</li>
                <li>Use BlurKit for illegal activities</li>
                <li>Attempt to bypass license protections</li>
                <li>Modify or create derivative works</li>
                <li>Use the service to harm others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Limitation of Liability</h2>
              <p>
                BlurKit is provided "as-is" without warranties. We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Data loss or corruption</li>
                <li>Business interruption or lost profits</li>
                <li>Failure of the extension on specific websites</li>
                <li>False positives or false negatives in PII detection</li>
              </ul>
              <p className="mt-3">
                Our total liability is limited to the amount you paid for your purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. Disclaimer</h2>
              <p>
                BlurKit is a tool to help protect your privacy, but it is not a guarantee. While we strive for accuracy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Some sensitive data may not be detected</li>
                <li>Accidental data exposure is possible</li>
                <li>You remain responsible for your data</li>
                <li>Always review screens before sharing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">8. Intellectual Property</h2>
              <p>
                BlurKit and its content are protected by copyright and other intellectual property laws. You may not copy, distribute, or use our materials without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">9. Third-Party Services</h2>
              <p>
                BlurKit uses third-party services (Dodo Payments, Resend email). Their terms of service apply to your use of their services. We are not responsible for their actions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">10. Termination</h2>
              <p>
                We may terminate your license if you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate these Terms</li>
                <li>Share license keys</li>
                <li>Use the service for illegal purposes</li>
                <li>Attempt to reverse engineer the extension</li>
              </ul>
              <p className="mt-3">
                Upon termination, your right to use BlurKit ends immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">11. Modifications</h2>
              <p>
                We may modify BlurKit or these Terms at any time. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">12. Governing Law</h2>
              <p>
                These Terms are governed by applicable law. Any disputes are resolved through binding arbitration or small claims court.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">13. Contact Us</h2>
              <p>
                For questions about these Terms, contact:
              </p>
              <p className="font-semibold">
                Email: {siteConfig.support}
              </p>
            </section>

            <p className="text-gray-500 text-sm mt-8">
              Last updated: October 26, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

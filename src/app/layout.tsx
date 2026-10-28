import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from '@/config/site.config';

const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: ['privacy', 'pii', 'blur', 'screen sharing', 'data protection', 'privacy extension', 'chrome extension'],
  openGraph: {
    title: `${siteConfig.name} - Privacy Protection for Screen Sharing`,
    description: 'Auto-detect and blur sensitive data with one click',
    type: 'website',
    url: siteConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - Privacy Protection Made Simple`,
    description: 'Auto-blur 11 types of PII during screen sharing',
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-primary">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

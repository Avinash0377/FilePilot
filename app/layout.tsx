import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1e293b",
}

export const metadata: Metadata = {
  metadataBase: new URL('https://filepilot.online'),
  title: "FilePilot — Free File Converter | Convert PDF, Images, Video, Audio Instantly",
  description:
    "Convert files instantly with FilePilot. Free PDF converters, image tools, video converters, audio converters, archive tools, OCR, and more. Fast, secure, and no upload to servers.",
  keywords: [
    "file converter", "free file converter", "pdf converter", "image converter",
    "video converter", "audio converter", "ocr converter", "pdf to word",
    "word to pdf", "jpg to png", "png to jpg", "webp converter",
    "image compressor", "merge pdf", "split pdf", "compress pdf", "pdf to text",
    "mp3 to wav", "wav to mp3", "mp4 to webm", "webm to mp4",
    "zip and unzip tools", "secure file conversion", "no upload converter"
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FilePilot",
  },
  openGraph: {
    title: "FilePilot — Free File Converter",
    description: "Convert PDF, images, audio, and video files instantly. Free, private, and secure — all processing happens locally.",
    url: "https://filepilot.online",
    siteName: "FilePilot",
    images: [
      {
        url: "https://filepilot.online/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FilePilot - Free File Converter"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "FilePilot — Free File Converter",
    description: "Fast and secure conversion tools for PDF, images, videos, audio, and more.",
    images: ["https://filepilot.online/opengraph-image"]
  },
  alternates: {
    canonical: "https://filepilot.online",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "FilePilot - Free File Converter",
            "operatingSystem": "All",
            "applicationCategory": "Utility",
            "description": "Free online file converter with 18+ tools for PDF, images, video, audio, text, and archives.",
            "url": "https://filepilot.online",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "image": "https://filepilot.online/opengraph-image"
          })
        }} />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen antialiased`}>
        <ErrorBoundary>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  )
}

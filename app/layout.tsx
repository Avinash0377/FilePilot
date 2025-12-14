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
  title: "FilePilot — Free Online File Converter | PDF, Image, Video, Audio Tools",
  description:
    "FilePilot is a 100% free online file converter. Convert PDF to Word, compress images, merge PDFs, convert videos, and more. Fast, secure, no signup required. All processing happens in your browser.",
  keywords: [
    // Core terms
    "file converter", "free online file converter", "free converter", "online converter",
    // PDF tools
    "pdf converter", "pdf to word", "word to pdf", "pdf to docx", "merge pdf", "split pdf",
    "compress pdf", "pdf compressor", "pdf to png", "pdf to image", "pdf to text",
    "pdf to ppt", "powerpoint to pdf", "images to pdf", "convert pdf online free",
    // Image tools
    "image converter", "jpg to png", "png to jpg", "webp converter", "image to webp",
    "image compressor", "compress image online", "reduce image size", "background remover",
    "remove image background", "add background to image",
    // Video tools
    "video converter", "mp4 to webm", "webm to mp4", "video compressor", "compress video online",
    "convert video online free",
    // Audio tools
    "audio converter", "mp3 to wav", "wav to mp3", "audio file converter", "convert audio online",
    // Archive tools
    "zip files online", "unzip files online", "create zip file", "extract zip",
    // OCR
    "ocr online", "image to text", "extract text from image", "ocr converter free",
    // General
    "filepilot", "secure file conversion", "private file converter", "no upload converter",
    "browser-based converter", "free tools online"
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
    title: "FilePilot — Free Online File Converter",
    description: "Convert PDF, images, audio, and video files instantly. 22+ free tools. No signup, 100% private and secure.",
    url: "https://filepilot.online",
    siteName: "FilePilot",
    images: [
      {
        url: "https://filepilot.online/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FilePilot - Free Online File Converter with 22+ Tools"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "FilePilot — Free Online File Converter",
    description: "22+ free tools for PDF, images, videos, audio. No signup, 100% private.",
    images: ["https://filepilot.online/opengraph-image"],
    creator: "@avinashsudimalla"
  },
  alternates: {
    canonical: "https://filepilot.online",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
  category: 'utility',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Organization Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FilePilot",
            "url": "https://filepilot.online",
            "logo": "https://filepilot.online/logo.png",
            "sameAs": [],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "sudhimallaavinash07@gmail.com",
              "contactType": "customer support"
            }
          })
        }} />
        {/* WebApplication Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "FilePilot - Free Online File Converter",
            "operatingSystem": "All",
            "applicationCategory": "UtilitiesApplication",
            "description": "Free online file converter with 22+ tools for PDF, images, video, audio, text, and archives. No signup required.",
            "url": "https://filepilot.online",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "image": "https://filepilot.online/logo.png",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150",
              "bestRating": "5",
              "worstRating": "1"
            },
            "featureList": [
              "PDF to Word Converter",
              "Word to PDF Converter",
              "Image Compressor",
              "PDF Merger",
              "Video Converter",
              "Audio Converter",
              "Background Remover",
              "OCR Text Extraction"
            ]
          })
        }} />
        {/* BreadcrumbList Schema for better navigation in search results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://filepilot.online"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tools",
                "item": "https://filepilot.online/#tools"
              }
            ]
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

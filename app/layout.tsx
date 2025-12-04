import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["700", "800"] })

const APP_NAME = "VibEscrow"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://satoshinaka.farcaster.xyz"

export const metadata = {
  title: APP_NAME,
  description: "Secure NFT swap escrow on Base for Vibe.market collections",
  openGraph: {
    title: APP_NAME,
    description: "Secure NFT swap escrow on Base for Vibe.market collections",
    url: APP_URL,
    siteName: APP_NAME,
    images: [{ url: `${APP_URL}/api/og`, width: 1200, height: 630, alt: APP_NAME }],
    type: "website",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/flame-mascot-192.png", sizes: "192x192" },
      { url: "/icons/flame-mascot-512.png", sizes: "512x512" },
    ],
    apple: "/icons/flame-mascot-192.png",
  },
  other: {
    "fc:frame": "vNext",
    "og:type": "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.farcaster.xyz/miniapps.js" defer />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/flame-mascot-192.png" />
        <link rel="apple-touch-icon" href="/icons/flame-mascot-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ff7a1a" />
        <meta name="fc:frame" content="vNext" />
        <meta property="og:title" content="VibEscrow" />
        <meta property="og:description" content="Secure NFT swap escrow on Base for Vibe.market collections" />
        <meta property="og:image" content={`${APP_URL}/api/og`} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <div className="max-w-md mx-auto min-h-screen flex flex-col">{children}</div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

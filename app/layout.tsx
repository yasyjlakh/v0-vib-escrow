import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const APP_NAME = "VibEscrow"
const APP_URL = "https://satoshinaka.farcaster.xyz"

export const metadata = {
  title: APP_NAME,
  description: "Secure NFT swap escrow on Farcaster focused on Vibe.market collections.",
  openGraph: {
    title: APP_NAME,
    description: "Secure NFT swap escrow on Farcaster focused on Vibe.market collections.",
    url: APP_URL,
    siteName: APP_NAME,
    images: [{ url: `${APP_URL}/api/og`, width: 1200, height: 630, alt: APP_NAME }],
    type: "website",
  },
  other: {
    "fc:miniapp:name": APP_NAME,
    "fc:miniapp:version": "vNext",
    "fc:miniapp": "v1",
    "fc:frame": "vNext",
  },
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.farcaster.xyz/actions.js" defer />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/flame-mascot-192.png" />
        <link rel="apple-touch-icon" href="/icons/flame-mascot-192.png" />
        <meta name="theme-color" content="#ff7a1a" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:miniapp" content="v1" />
        <meta property="og:title" content="VibEscrow" />
        <meta
          property="og:description"
          content="Secure NFT swap escrow on Farcaster focused on Vibe.market collections."
        />
        <meta property="og:image" content={`${APP_URL}/api/og`} />
      </head>
      <body className="font-sans antialiased">
        <div className="max-w-md mx-auto min-h-screen flex flex-col">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}

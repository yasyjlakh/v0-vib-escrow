import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const APP_NAME = "VibEscrow"
const APP_URL = "https://your-vibescrow.vercel.app"

export const metadata = {
  title: APP_NAME,
  description: "Scambia NFT multipli in modo sicuro su Farcaster con escrow.",
  openGraph: {
    title: APP_NAME,
    description: "Scambia NFT multipli in modo sicuro su Farcaster con escrow.",
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
    <html lang="it" className="dark">
      <head>
        <script src="https://cdn.farcaster.xyz/actions.js" defer />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:miniapp" content="v1" />
        <meta property="og:title" content="VibEscrow" />
        <meta property="og:description" content="Scambia NFT multipli in modo sicuro su Farcaster con escrow." />
        <meta property="og:image" content={`${APP_URL}/api/og`} />
      </head>
      <body className="font-sans antialiased">
        <div className="max-w-md mx-auto min-h-screen flex flex-col">{children}</div>
        <Analytics />
      </body>
    </html>
  )
}

const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "https://v0-vib-escrow.vercel.app"

export const minikitConfig = {
  accountAssociation: {
    header:
      "eyJmaWQiOjIwMzc1NCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweGZDOTBGMUE1Q2Y1MmNlZTc1QkRmNDk2MTRhNkIxRjFhNUUxRDY1MDYifQ",
    payload: "eyJkb21haW4iOiJ2MC12aWItZXNjcm93LnZlcmNlbC5hcHAifQ",
    signature: "UPMJAodpfL9pdMF3CF8vr0EeshtZX/z7L4kEzTMWYM02r+NaYJDABveCAoH8jwBqgLtN68TyW6BVYvlDxNivTBw=",
  },
  miniapp: {
    version: "1",
    name: "VibEscrow",
    subtitle: "NFT Escrow Swaps",
    description: "Secure NFT escrow swap platform for Vibe.market collections on Base blockchain",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`, `${ROOT_URL}/screenshot-landscape.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/api/splash`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "defi",
    tags: ["nft", "escrow", "swap", "base", "vibe"],
    heroImageUrl: `${ROOT_URL}/hero-bg.png`,
    tagline: "Trade NFTs securely with smart contract escrow",
    ogTitle: "VibEscrow - NFT Escrow Swaps",
    ogDescription: "Secure NFT escrow swap platform for Vibe.market collections on Base blockchain",
    ogImageUrl: `${ROOT_URL}/api/og`,
  },
} as const

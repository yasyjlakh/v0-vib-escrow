const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || "https://v0-vib-escrow.vercel.app"

export const minikitConfig = {
  accountAssociation: {
    header: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_HEADER || "",
    payload: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_PAYLOAD || "",
    signature: process.env.NEXT_PUBLIC_ACCOUNT_ASSOCIATION_SIGNATURE || "",
  },
  miniapp: {
    version: "1",
    name: "VibEscrow",
    subtitle: "NFT Escrow Swaps",
    description: "Secure NFT escrow swap platform for Vibe.market collections on Base blockchain",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`, `${ROOT_URL}/screenshot-landscape.png`],
    iconUrl: `${ROOT_URL}/icons/flame-mascot-192.png`,
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

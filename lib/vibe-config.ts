// Your Vibe.Market Collection Configuration
export const VIBE_COLLECTION_CONFIG = {
  // Your collection's BoosterDrop contract (LTC - Liquid Trading Card)
  dropAddress: "0xcdc74eeedc5ede1ef6033f22e8f0401af5b561ea",

  // Your collection's Token contract
  tokenAddress: "0x2b068f4a6132db05541b1d78beffe1ab0a97e375",

  // Collection display name (will be fetched from contract)
  name: "Your Collection",

  // Whether to only show this collection in the game
  exclusiveMode: true,
} as const

// Export addresses for easy access
export const YOUR_DROP_ADDRESS = VIBE_COLLECTION_CONFIG.dropAddress
export const YOUR_TOKEN_ADDRESS = VIBE_COLLECTION_CONFIG.tokenAddress

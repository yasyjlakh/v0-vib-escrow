// Script to fetch all verified Vibe.Market collections
// Run with: npx ts-node scripts/fetch-vibe-collections.ts

const WIELD_API_KEY = "PRT6-Y244M-9GFA7-39PA"
const WIELD_BASE_URL = "https://build.wield.xyz/vibe/boosterbox"

interface VibeCollection {
  id: string
  name: string
  description?: string
  contractAddress?: string
  tokenAddress?: string
  imageUrl?: string
  createdAt?: string
  verified?: boolean
}

async function fetchVibeCollections(): Promise<void> {
  try {
    console.log("Fetching Vibe.Market collections...\n")

    const response = await fetch(`${WIELD_BASE_URL}/games`, {
      headers: {
        "API-KEY": WIELD_API_KEY,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    console.log("=== VIBE.MARKET VERIFIED COLLECTIONS ===\n")

    if (Array.isArray(data)) {
      data.forEach((collection: VibeCollection, index: number) => {
        console.log(`${index + 1}. ${collection.name || "Unknown"}`)
        console.log(`   ID: ${collection.id}`)
        if (collection.contractAddress) {
          console.log(`   NFT Contract: ${collection.contractAddress}`)
        }
        if (collection.tokenAddress) {
          console.log(`   Token Contract: ${collection.tokenAddress}`)
        }
        if (collection.description) {
          console.log(`   Description: ${collection.description.slice(0, 100)}...`)
        }
        console.log("")
      })

      console.log(`\nTotal collections: ${data.length}`)

      // Output as JSON for easy copy
      console.log("\n=== CONTRACT ADDRESSES (JSON) ===\n")
      const addresses = data
        .filter((c: VibeCollection) => c.contractAddress)
        .map((c: VibeCollection) => ({
          name: c.name,
          contract: c.contractAddress,
          token: c.tokenAddress,
        }))
      console.log(JSON.stringify(addresses, null, 2))
    } else if (data.games || data.packs || data.collections) {
      const collections = data.games || data.packs || data.collections
      console.log(JSON.stringify(collections, null, 2))
    } else {
      console.log("Response structure:")
      console.log(JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error("Error fetching collections:", error)
  }
}

fetchVibeCollections()

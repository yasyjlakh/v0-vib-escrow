// Card tracking service for Vibe.Market BoosterDrop NFTs
import { ethers } from "ethers"
import { BOOSTER_DROP_ABI, BASE_RPC_URL, CardRarity, RARITY_LABELS } from "./contract"

export interface VibeCard {
  tokenId: string
  contractAddress: string
  rarity: CardRarity
  rarityLabel: string
  randomValue: bigint
  tokenSpecificRandomness: string
  isOpened: boolean
  // Derived game attributes from randomness
  attackPower: number
  defense: number
  speed: number
  luck: number
  // Visual attributes
  wear: number // 0-100
  foilChance: number // percentage
}

export interface CardTrackingResult {
  cards: VibeCard[]
  totalCards: number
  legendaryCount: number
  mythicCount: number
  epicCount: number
  rareCount: number
  hasSpecialCards: boolean
}

// Calculate game attributes from randomness seed
function calculateCardAttributes(randomValue: bigint): {
  attackPower: number
  defense: number
  speed: number
  luck: number
  wear: number
  foilChance: number
} {
  const seed = Number(randomValue % BigInt(1000000))

  return {
    attackPower: 100 + (seed % 50),
    defense: 80 + ((seed >> 8) % 30),
    speed: 70 + ((seed >> 16) % 40),
    luck: 50 + ((seed >> 24) % 50),
    wear: seed % 100,
    foilChance: Math.min(100, Math.floor(seed / 10000)),
  }
}

// Track user's cards via transfer events
export async function trackUserCards(userAddress: string, contractAddress: string): Promise<VibeCard[]> {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL)
    const boosterDrop = new ethers.Contract(contractAddress, BOOSTER_DROP_ABI, provider)

    // Get transfer events to this user
    const transferFilter = boosterDrop.filters.Transfer(null, userAddress)
    const transferEvents = await boosterDrop.queryFilter(transferFilter)

    const userCards: VibeCard[] = []

    for (const event of transferEvents) {
      const tokenId = (event as ethers.EventLog).args?.tokenId?.toString()
      if (!tokenId) continue

      // Verify current ownership
      try {
        const currentOwner = await boosterDrop.ownerOf(tokenId)
        if (currentOwner.toLowerCase() !== userAddress.toLowerCase()) {
          continue // User no longer owns this card
        }
      } catch {
        continue
      }

      try {
        // Get card rarity info including randomness
        const rarityInfo = await boosterDrop.getTokenRarity(tokenId)
        const rarity = Number(rarityInfo.rarity) as CardRarity
        const randomValue = rarityInfo.randomValue
        const tokenSpecificRandomness = rarityInfo.tokenSpecificRandomness

        const attributes = calculateCardAttributes(randomValue)

        userCards.push({
          tokenId,
          contractAddress,
          rarity,
          rarityLabel: RARITY_LABELS[rarity] || "Unknown",
          randomValue,
          tokenSpecificRandomness,
          isOpened: true,
          ...attributes,
        })
      } catch {
        // Rarity not defined - pack hasn't been opened yet
        userCards.push({
          tokenId,
          contractAddress,
          rarity: CardRarity.Common,
          rarityLabel: "Unopened",
          randomValue: BigInt(0),
          tokenSpecificRandomness: "0x",
          isOpened: false,
          attackPower: 0,
          defense: 0,
          speed: 0,
          luck: 0,
          wear: 0,
          foilChance: 0,
        })
      }
    }

    return userCards
  } catch (error) {
    console.error("Error tracking user cards:", error)
    return []
  }
}

// Get comprehensive tracking result with counts
export async function getCardTrackingResult(
  userAddress: string,
  contractAddresses: string[],
): Promise<CardTrackingResult> {
  const allCards: VibeCard[] = []

  // Track cards from all provided contracts in parallel
  const results = await Promise.all(contractAddresses.map((addr) => trackUserCards(userAddress, addr)))

  results.forEach((cards) => allCards.push(...cards))

  const legendaryCount = allCards.filter((c) => c.rarity === CardRarity.Legendary).length
  const mythicCount = allCards.filter((c) => c.rarity === CardRarity.Mythic).length
  const epicCount = allCards.filter((c) => c.rarity === CardRarity.Epic).length
  const rareCount = allCards.filter((c) => c.rarity === CardRarity.Rare).length

  return {
    cards: allCards,
    totalCards: allCards.length,
    legendaryCount,
    mythicCount,
    epicCount,
    rareCount,
    hasSpecialCards: mythicCount > 0 || legendaryCount > 0,
  }
}

// Get single card details
export async function getCardDetails(contractAddress: string, tokenId: string): Promise<VibeCard | null> {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL)
    const boosterDrop = new ethers.Contract(contractAddress, BOOSTER_DROP_ABI, provider)

    const rarityInfo = await boosterDrop.getTokenRarity(tokenId)
    const rarity = Number(rarityInfo.rarity) as CardRarity
    const randomValue = rarityInfo.randomValue
    const tokenSpecificRandomness = rarityInfo.tokenSpecificRandomness

    const attributes = calculateCardAttributes(randomValue)

    return {
      tokenId,
      contractAddress,
      rarity,
      rarityLabel: RARITY_LABELS[rarity] || "Unknown",
      randomValue,
      tokenSpecificRandomness,
      isOpened: true,
      ...attributes,
    }
  } catch (error) {
    console.error("Error getting card details:", error)
    return null
  }
}

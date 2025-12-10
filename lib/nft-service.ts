// NFT fetching service using server API routes

export const BASE_RPC_URL = "https://mainnet.base.org"

// Vibe.Market collection interface
export interface VibeCollection {
  contractAddress: string
  name: string
  symbol: string
  image: string
  description?: string
  marketCap?: number
  floorPrice?: number
  totalSupply?: number
  isActive: boolean
  isFeatured?: boolean
}

export interface NFTMetadata {
  tokenId: string
  collection: string
  collectionName: string
  name: string
  image: string
  owner: string
  rarity?: number
  isVibeMarket?: boolean
}

export async function fetchVibeCollections(): Promise<VibeCollection[]> {
  try {
    const response = await fetch("/api/vibe?action=getPacks&limit=100", {
      headers: { accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch Vibe collections")
    }

    const data = await response.json()

    if (!data.success || !data.data) {
      return []
    }

    return data.data.map((pack: any) => ({
      contractAddress: pack.ltcContract || pack.contractAddress,
      name: pack.name || "Unknown Collection",
      symbol: pack.symbol || "",
      image: pack.image || pack.pfpUrl || "",
      description: pack.description || "",
      marketCap: pack.marketCap || 0,
      floorPrice: pack.floorPrice || 0,
      totalSupply: pack.totalSupply || 0,
      isActive: pack.isActive ?? true,
      isFeatured: pack.isFeatured ?? false,
    }))
  } catch (error) {
    console.error("Error fetching Vibe collections:", error)
    return []
  }
}

export async function fetchVibeFeaturedPacks(): Promise<VibeCollection[]> {
  try {
    const response = await fetch("/api/vibe?action=getFeaturedPacks&sortBy=trending", {
      headers: { accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch featured packs")
    }

    const data = await response.json()

    if (!data.success || !data.data) {
      return []
    }

    return data.data.map((pack: any) => ({
      contractAddress: pack.ltcContract || pack.contractAddress,
      name: pack.name || "Unknown Collection",
      symbol: pack.symbol || "",
      image: pack.image || pack.pfpUrl || "",
      description: pack.description || "",
      marketCap: pack.marketCap || 0,
      floorPrice: pack.floorPrice || 0,
      totalSupply: pack.totalSupply || 0,
      isActive: true,
      isFeatured: true,
    }))
  } catch (error) {
    console.error("Error fetching featured packs:", error)
    return []
  }
}

export async function fetchVibeNFTsByOwner(address: string): Promise<NFTMetadata[]> {
  try {
    const response = await fetch(
      `/api/vibe?action=getBoosterBoxesByOwner&owner=${address}&includeMetadata=true&includeContractDetails=true`,
      { headers: { accept: "application/json" } },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Vibe NFTs")
    }

    const data = await response.json()

    if (!data.success || !data.data) {
      return []
    }

    return data.data.map((nft: any) => ({
      tokenId: nft.tokenId?.toString() || "0",
      collection: nft.contractAddress || "",
      collectionName: nft.game?.name || nft.contractDetails?.name || "Vibe Collection",
      name: nft.metadata?.name || `#${nft.tokenId}`,
      image: nft.metadata?.image || nft.game?.image || "",
      owner: address,
      rarity: nft.rarity ?? 0,
      isVibeMarket: true,
    }))
  } catch (error) {
    console.error("Error fetching Vibe NFTs:", error)
    return []
  }
}

export async function fetchVibeContractInfo(contractAddress: string): Promise<VibeCollection | null> {
  try {
    const response = await fetch(`/api/vibe?action=getContractInfo&contractAddress=${contractAddress}`, {
      headers: { accept: "application/json" },
    })

    if (!response.ok) return null

    const data = await response.json()

    if (!data.success || !data.data) {
      return null
    }

    const info = data.data
    return {
      contractAddress: info.ltcContract || contractAddress,
      name: info.name || "Unknown",
      symbol: info.symbol || "",
      image: info.image || info.pfpUrl || "",
      description: info.description || "",
      marketCap: info.marketCap || 0,
      floorPrice: info.floorPrice || 0,
      totalSupply: info.totalSupply || 0,
      isActive: info.isActive ?? true,
      isFeatured: info.isFeatured ?? false,
    }
  } catch (error) {
    console.error("Error fetching Vibe contract info:", error)
    return null
  }
}

// Existing Alchemy-based functions for non-Vibe NFTs
export async function fetchWalletNFTs(address: string): Promise<NFTMetadata[]> {
  try {
    const response = await fetch(`/api/nft?action=getNFTsForOwner&owner=${address}`, {
      headers: { accept: "application/json" },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch NFTs from server")
    }

    const data = await response.json()

    return (
      data.ownedNfts?.map((nft: any) => {
        const metadata = nft.metadata || {}
        const media = nft.media?.[0] || {}

        return {
          tokenId: nft.tokenId || "0",
          collection: nft.contract?.address || "",
          collectionName: nft.contract?.name || nft.contract?.symbol || "Unknown Collection",
          name: metadata.name || `#${nft.tokenId}`,
          image: media.gateway || media.raw || metadata.image || "/digital-art-collection.png",
          owner: address,
          isVibeMarket: false,
        }
      }) || []
    )
  } catch (error) {
    console.error("Error fetching NFTs from server:", error)
    return []
  }
}

export async function fetchAllWalletNFTs(address: string): Promise<NFTMetadata[]> {
  try {
    // Fetch both Vibe and Alchemy NFTs in parallel
    const [vibeNFTs, alchemyNFTs] = await Promise.all([fetchVibeNFTsByOwner(address), fetchWalletNFTs(address)])

    // Mark Vibe NFTs and combine
    const vibeAddresses = new Set(vibeNFTs.map((nft) => nft.collection.toLowerCase()))

    // Filter out duplicates from Alchemy that are already in Vibe
    const filteredAlchemyNFTs = alchemyNFTs.filter((nft) => !vibeAddresses.has(nft.collection.toLowerCase()))

    // Return Vibe NFTs first, then others
    return [...vibeNFTs, ...filteredAlchemyNFTs]
  } catch (error) {
    console.error("Error fetching all NFTs:", error)
    return []
  }
}

export async function fetchCollectionInfo(collectionAddress: string): Promise<{ name: string; image: string } | null> {
  try {
    // First try Vibe.Market
    const vibeInfo = await fetchVibeContractInfo(collectionAddress)
    if (vibeInfo) {
      return { name: vibeInfo.name, image: vibeInfo.image }
    }

    // Fall back to Alchemy
    const response = await fetch(`/api/nft?action=getContractMetadata&contractAddress=${collectionAddress}`, {
      headers: { accept: "application/json" },
    })

    if (!response.ok) return null

    const data = await response.json()

    return {
      name: data.name || data.symbol || "Unknown",
      image: data.openSeaMetadata?.imageUrl || "",
    }
  } catch (error) {
    console.error("Error fetching collection from server:", error)
    return null
  }
}

export async function fetchNFTMetadata(collectionAddress: string, tokenId: string): Promise<NFTMetadata | null> {
  try {
    // First try Vibe.Market
    const vibeResponse = await fetch(
      `/api/vibe?action=getMetadata&contractAddress=${collectionAddress}&tokenId=${tokenId}`,
      { headers: { accept: "application/json" } },
    )

    if (vibeResponse.ok) {
      const vibeData = await vibeResponse.json()
      if (vibeData.success && vibeData.data) {
        const nft = vibeData.data
        return {
          tokenId: tokenId,
          collection: collectionAddress,
          collectionName: nft.game?.name || "Vibe Collection",
          name: nft.name || `#${tokenId}`,
          image: nft.image || "",
          owner: "",
          rarity: nft.rarity ?? 0,
          isVibeMarket: true,
        }
      }
    }

    // Fall back to Alchemy
    const response = await fetch(
      `/api/nft?action=getNFTMetadata&contractAddress=${collectionAddress}&tokenId=${tokenId}`,
      { headers: { accept: "application/json" } },
    )

    if (!response.ok) return null

    const nft = await response.json()
    const metadata = nft.metadata || {}
    const media = nft.media?.[0] || {}

    return {
      tokenId: nft.tokenId || tokenId,
      collection: collectionAddress,
      collectionName: nft.contract?.name || "Unknown",
      name: metadata.name || `#${tokenId}`,
      image: media.gateway || media.raw || metadata.image || "/digital-art-collection.png",
      owner: "",
      isVibeMarket: false,
    }
  } catch (error) {
    console.error("Error fetching NFT metadata from server:", error)
    return null
  }
}

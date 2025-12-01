// NFT fetching service using Alchemy API on Base
export const BASE_RPC_URL = "https://mainnet.base.org"
export const ALCHEMY_API_KEY = "yJxcTgiBZRrzHFQ235D_C"
export const ALCHEMY_BASE_URL = "https://base-mainnet.g.alchemy.com/v2/yJxcTgiBZRrzHFQ235D_C"

// Vibe.market known collections on Base
export const VIBE_COLLECTIONS = [
  { address: "0x...", name: "Vibe Collection 1" }, // TODO: Add actual Vibe.market addresses
]

export interface NFTMetadata {
  tokenId: string
  collection: string
  collectionName: string
  name: string
  image: string
  owner: string
}

// Fetch NFTs owned by address using Alchemy NFT API (Base)
export async function fetchWalletNFTs(address: string): Promise<NFTMetadata[]> {
  try {
    const response = await fetch(
      `${ALCHEMY_BASE_URL}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=100`,
      {
        headers: {
          accept: "application/json",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch NFTs from Alchemy")
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
        }
      }) || []
    )
  } catch (error) {
    console.error("Error fetching NFTs from Alchemy:", error)
    return []
  }
}

// Fetch collection info using Alchemy
export async function fetchCollectionInfo(collectionAddress: string): Promise<{ name: string; image: string } | null> {
  try {
    const response = await fetch(`${ALCHEMY_BASE_URL}/getContractMetadata?contractAddress=${collectionAddress}`, {
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) return null

    const data = await response.json()

    return {
      name: data.name || data.symbol || "Unknown",
      image: data.openSeaMetadata?.imageUrl || "",
    }
  } catch (error) {
    console.error("Error fetching collection from Alchemy:", error)
    return null
  }
}

// Fetch specific NFT metadata using Alchemy
export async function fetchNFTMetadata(collectionAddress: string, tokenId: string): Promise<NFTMetadata | null> {
  try {
    const response = await fetch(
      `${ALCHEMY_BASE_URL}/getNFTMetadata?contractAddress=${collectionAddress}&tokenId=${tokenId}&refreshCache=false`,
      {
        headers: {
          accept: "application/json",
        },
      },
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
    }
  } catch (error) {
    console.error("Error fetching NFT metadata from Alchemy:", error)
    return null
  }
}

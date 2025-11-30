// NFT fetching service using Base RPC and Reservoir API
export const BASE_RPC_URL = "https://mainnet.base.org"

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

// ERC721 ABI for basic metadata
const ERC721_METADATA_ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
]

// Fetch NFTs owned by address using Reservoir API (Base)
export async function fetchWalletNFTs(address: string): Promise<NFTMetadata[]> {
  try {
    // Use Reservoir API for Base
    const response = await fetch(`https://api-base.reservoir.tools/users/${address}/tokens/v10?limit=100`, {
      headers: {
        accept: "*/*",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch NFTs")
    }

    const data = await response.json()

    return (
      data.tokens?.map((item: any) => ({
        tokenId: item.token?.tokenId || "0",
        collection: item.token?.contract || "",
        collectionName: item.token?.collection?.name || "Unknown Collection",
        name: item.token?.name || `#${item.token?.tokenId}`,
        image: item.token?.image || item.token?.imageSmall || "/digital-art-collection.png",
        owner: address,
      })) || []
    )
  } catch (error) {
    console.error("Error fetching NFTs:", error)
    return []
  }
}

// Fetch collection info
export async function fetchCollectionInfo(collectionAddress: string): Promise<{ name: string; image: string } | null> {
  try {
    const response = await fetch(`https://api-base.reservoir.tools/collections/v7?id=${collectionAddress}`, {
      headers: {
        accept: "*/*",
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    const collection = data.collections?.[0]

    return {
      name: collection?.name || "Unknown",
      image: collection?.image || "",
    }
  } catch (error) {
    console.error("Error fetching collection:", error)
    return null
  }
}

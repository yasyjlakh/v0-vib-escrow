import { type NextRequest, NextResponse } from "next/server"

const VIBE_API_BASE = "https://build.wield.xyz/vibe/boosterbox"
const VIBE_API_KEY = process.env.WIELD_API_KEY || "PRT6-Y244M-9GFA7-39PA"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  const headers = {
    "API-KEY": VIBE_API_KEY,
    "Content-Type": "application/json",
  }

  try {
    switch (action) {
      case "getPacks": {
        // Get all packs/games on Vibe.Market
        const limit = searchParams.get("limit") || "100"
        const page = searchParams.get("page") || "1"
        const chainId = searchParams.get("chainId") || "8453" // Base mainnet

        const response = await fetch(
          `${VIBE_API_BASE}/games?limit=${limit}&page=${page}&chainId=${chainId}&isActive=true`,
          { headers },
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch packs: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
      }

      case "getFeaturedPacks": {
        // Get featured/trending packs
        const limit = searchParams.get("limit") || "12"
        const sortBy = searchParams.get("sortBy") || "trending"
        const chainId = searchParams.get("chainId") || "8453"

        const response = await fetch(`${VIBE_API_BASE}/featured?limit=${limit}&chainId=${chainId}&sortBy=${sortBy}`, {
          headers,
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch featured packs: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
      }

      case "getBoosterBoxesByOwner": {
        // Get NFTs owned by a specific address
        const owner = searchParams.get("owner")
        if (!owner) {
          return NextResponse.json({ error: "Owner address required" }, { status: 400 })
        }

        const limit = searchParams.get("limit") || "50"
        const page = searchParams.get("page") || "1"
        const chainId = searchParams.get("chainId") || "8453"
        const includeMetadata = searchParams.get("includeMetadata") || "true"
        const includeContractDetails = searchParams.get("includeContractDetails") || "true"

        const response = await fetch(
          `${VIBE_API_BASE}/owner/${owner}?limit=${limit}&page=${page}&chainId=${chainId}&includeMetadata=${includeMetadata}&includeContractDetails=${includeContractDetails}`,
          { headers },
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch owner NFTs: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
      }

      case "getContractInfo": {
        // Get info about a specific collection/contract
        const contractAddress = searchParams.get("contractAddress")
        if (!contractAddress) {
          return NextResponse.json({ error: "Contract address required" }, { status: 400 })
        }

        const response = await fetch(`${VIBE_API_BASE}/contractAddress/${contractAddress}`, { headers })

        if (!response.ok) {
          throw new Error(`Failed to fetch contract info: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
      }

      case "getMetadata": {
        // Get metadata for a specific token
        const contractAddress = searchParams.get("contractAddress")
        const tokenId = searchParams.get("tokenId")

        if (!contractAddress || !tokenId) {
          return NextResponse.json({ error: "Contract address and token ID required" }, { status: 400 })
        }

        const response = await fetch(`${VIBE_API_BASE}/metadata/${contractAddress}/${tokenId}`, { headers })

        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
      }

      case "getRecentBoosterBoxes": {
        // Get recently minted/opened BoosterBoxes
        const limit = searchParams.get("limit") || "20"
        const chainId = searchParams.get("chainId") || "8453"

        const response = await fetch(`${VIBE_API_BASE}/recent?limit=${limit}&chainId=${chainId}`, { headers })

        if (!response.ok) {
          throw new Error(`Failed to fetch recent boxes: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Vibe API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch from Vibe API" },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY environment variable is required")
}
const ALCHEMY_BASE_URL = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action")
  const owner = searchParams.get("owner")
  const contractAddress = searchParams.get("contractAddress")
  const tokenId = searchParams.get("tokenId")

  try {
    if (action === "getNFTsForOwner" && owner) {
      const response = await fetch(
        `${ALCHEMY_BASE_URL}/getNFTsForOwner?owner=${owner}&withMetadata=true&pageSize=100`,
        { headers: { accept: "application/json" } },
      )
      if (!response.ok) throw new Error("Failed to fetch NFTs")
      return NextResponse.json(await response.json())
    }

    if (action === "getContractMetadata" && contractAddress) {
      const response = await fetch(`${ALCHEMY_BASE_URL}/getContractMetadata?contractAddress=${contractAddress}`, {
        headers: { accept: "application/json" },
      })
      if (!response.ok) throw new Error("Failed to fetch contract metadata")
      return NextResponse.json(await response.json())
    }

    if (action === "getNFTMetadata" && contractAddress && tokenId) {
      const response = await fetch(
        `${ALCHEMY_BASE_URL}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}&refreshCache=false`,
        { headers: { accept: "application/json" } },
      )
      if (!response.ok) throw new Error("Failed to fetch NFT metadata")
      return NextResponse.json(await response.json())
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("NFT API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

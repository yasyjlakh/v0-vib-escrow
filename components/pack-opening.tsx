"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Sparkles } from "lucide-react"
import { fetchVibeNFTsByOwner } from "@/lib/nft-service"
import { useWallet } from "@/lib/wallet-context"
import { ethers } from "ethers"
import { BOOSTER_DROP_ABI, BASE_RPC_URL, CardRarity, RARITY_LABELS } from "@/lib/contract"
import Image from "next/image"

const RARITY_MULTIPLIERS: Record<CardRarity, number> = {
  [CardRarity.Common]: 1,
  [CardRarity.Uncommon]: 1.5,
  [CardRarity.Rare]: 2,
  [CardRarity.Epic]: 3,
  [CardRarity.Legendary]: 4,
  [CardRarity.Mythic]: 5,
}

const RARITY_COLORS = [
  "bg-gray-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-gradient-to-r from-pink-500 to-orange-500",
]

interface PackOpeningProps {
  onPackOpened: (rarity: number, multiplier: number) => void
}

export function PackOpening({ onPackOpened }: PackOpeningProps) {
  const { address } = useWallet()
  const [unopenedPacks, setUnopenedPacks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpening, setIsOpening] = useState(false)
  const [revealedCard, setRevealedCard] = useState<{
    rarity: CardRarity
    multiplier: number
    image: string
  } | null>(null)

  useEffect(() => {
    if (address) {
      loadUnopenedPacks()
    }
  }, [address])

  const loadUnopenedPacks = async () => {
    if (!address) return
    setIsLoading(true)
    try {
      const vibeNFTs = await fetchVibeNFTsByOwner(address)
      // Filter for unopened packs
      const unopened = vibeNFTs.filter((nft) => !nft.cardDetails?.isOpened)
      setUnopenedPacks(unopened)
    } catch (error) {
      console.error("Error loading unopened packs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openPack = async (pack: any) => {
    setIsOpening(true)
    try {
      // Simulate pack opening animation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Get card rarity from contract
      const provider = new ethers.JsonRpcProvider(BASE_RPC_URL)
      const contract = new ethers.Contract(pack.collection, BOOSTER_DROP_ABI, provider)

      try {
        const rarityInfo = await contract.getTokenRarity(pack.tokenId)
        const rarity = Number(rarityInfo.rarity) as CardRarity
        const multiplier = RARITY_MULTIPLIERS[rarity]

        setRevealedCard({
          rarity,
          multiplier,
          image: pack.image,
        })

        // Wait for reveal animation
        await new Promise((resolve) => setTimeout(resolve, 2000))

        onPackOpened(rarity, multiplier)
      } catch {
        // If pack hasn't been opened on-chain yet, use random rarity
        const randomRarity = Math.floor(Math.random() * 6) as CardRarity
        const multiplier = RARITY_MULTIPLIERS[randomRarity]

        setRevealedCard({
          rarity: randomRarity,
          multiplier,
          image: pack.image,
        })

        await new Promise((resolve) => setTimeout(resolve, 2000))
        onPackOpened(randomRarity, multiplier)
      }
    } catch (error) {
      console.error("Error opening pack:", error)
      setIsOpening(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-background/50 backdrop-blur border border-purple-500/30">
        <CardContent className="py-12 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-muted-foreground">Loading your packs...</p>
        </CardContent>
      </Card>
    )
  }

  if (revealedCard) {
    return (
      <Card className="bg-background/50 backdrop-blur border border-yellow-500/30 animate-in zoom-in">
        <CardContent className="py-8 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-yellow-400 mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-4">Card Revealed!</h2>

          <div className="relative w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden">
            <Image
              src={revealedCard.image || "/placeholder.svg"}
              alt="Revealed Card"
              fill
              className="object-cover animate-in fade-in"
              unoptimized
            />
          </div>

          <Badge className={`${RARITY_COLORS[revealedCard.rarity]} text-lg px-4 py-2 mb-2`}>
            {RARITY_LABELS[revealedCard.rarity]}
          </Badge>

          <p className="text-3xl font-black text-yellow-400 mt-4">{revealedCard.multiplier}x Multiplier!</p>
          <p className="text-sm text-muted-foreground mt-2">Your score will be boosted by {revealedCard.multiplier}x</p>
        </CardContent>
      </Card>
    )
  }

  if (isOpening) {
    return (
      <Card className="bg-background/50 backdrop-blur border border-purple-500/30">
        <CardContent className="py-12 text-center">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Package className="h-32 w-32 text-purple-400 animate-bounce" />
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Opening Pack...</h2>
          <p className="text-sm text-muted-foreground">Revealing your card</p>
        </CardContent>
      </Card>
    )
  }

  if (unopenedPacks.length === 0) {
    return (
      <Card className="bg-background/50 backdrop-blur border border-orange-500/30">
        <CardContent className="py-12 text-center">
          <Package className="h-16 w-16 mx-auto text-orange-400 mb-4 opacity-50" />
          <p className="text-foreground font-bold mb-2">No Unopened Packs</p>
          <p className="text-sm text-muted-foreground mb-4">Get packs from Vibe.Market to play!</p>
          <Button
            onClick={() => window.open("https://vibe.market", "_blank")}
            className="bg-gradient-to-r from-purple-500 to-pink-500"
          >
            Visit Vibe.Market
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-background/50 backdrop-blur border border-purple-500/30 p-4">
        <p className="text-sm text-center text-muted-foreground mb-2">
          Select a pack to open and get your score multiplier
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-purple-400">
          <span>Common: 1x</span>
          <span>Uncommon: 1.5x</span>
          <span>Rare: 2x</span>
          <span>Epic: 3x</span>
          <span>Legendary: 4x</span>
          <span>Mythic: 5x</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {unopenedPacks.map((pack) => (
          <Card
            key={`${pack.collection}-${pack.tokenId}`}
            className="bg-background/50 backdrop-blur border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer"
            onClick={() => openPack(pack)}
          >
            <CardContent className="p-3">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-muted mb-2">
                <Image
                  src={pack.image || "/placeholder.svg?height=200&width=200&query=pack"}
                  alt={pack.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <Badge className="bg-purple-600 text-[10px]">UNOPENED</Badge>
                </div>
              </div>
              <p className="text-xs font-bold truncate">{pack.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

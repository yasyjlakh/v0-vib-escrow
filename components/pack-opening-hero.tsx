"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Sparkles, ChevronRight, Gamepad2 } from "lucide-react"
import { trackYourCollectionCards } from "@/lib/card-tracking"
import { YOUR_DROP_ADDRESS } from "@/lib/vibe-config"
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

const RARITY_COLORS: Record<CardRarity, string> = {
  [CardRarity.Common]: "from-gray-500 to-gray-600",
  [CardRarity.Uncommon]: "from-green-500 to-emerald-600",
  [CardRarity.Rare]: "from-blue-500 to-cyan-600",
  [CardRarity.Epic]: "from-purple-500 to-violet-600",
  [CardRarity.Legendary]: "from-yellow-500 to-amber-600",
  [CardRarity.Mythic]: "from-pink-500 to-red-600",
}

export function PackOpeningHero() {
  const { address } = useWallet()
  const [unopenedPacks, setUnopenedPacks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpening, setIsOpening] = useState(false)
  const [gameState, setGameState] = useState<"select" | "opening" | "revealed" | "playing">("select")
  const [revealedCard, setRevealedCard] = useState<{
    rarity: CardRarity
    multiplier: number
    image: string
  } | null>(null)

  useEffect(() => {
    if (address) {
      loadUnopenedPacks()
    } else {
      setIsLoading(false)
    }
  }, [address])

  const loadUnopenedPacks = async () => {
    if (!address) return
    setIsLoading(true)
    try {
      const cards = await trackYourCollectionCards(address)
      const unopened = cards.filter(
        (card) => !card.isOpened || (card.rarity === CardRarity.Common && card.randomValue === BigInt(0)),
      )

      const packs = unopened.map((card) => ({
        tokenId: card.tokenId,
        collection: YOUR_DROP_ADDRESS,
        name: `Booster Pack #${card.tokenId}`,
        image: "/vibe-pack.jpg",
        cardDetails: card,
      }))
      setUnopenedPacks(packs)
    } catch (error) {
      console.error("[v0] Error loading unopened packs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openPack = async (pack: any) => {
    setGameState("opening")
    setIsOpening(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500))
      const provider = new ethers.JsonRpcProvider(BASE_RPC_URL)
      const contract = new ethers.Contract(YOUR_DROP_ADDRESS, BOOSTER_DROP_ABI, provider)

      try {
        const rarityInfo = await contract.getTokenRarity(pack.tokenId)
        const rarity = Number(rarityInfo.rarity) as CardRarity
        const multiplier = RARITY_MULTIPLIERS[rarity]

        setRevealedCard({
          rarity,
          multiplier,
          image: pack.image,
        })
        setGameState("revealed")
      } catch (error) {
        console.error("[v0] Error reading rarity from contract:", error)
        const randomRarity = Math.floor(Math.random() * 6) as CardRarity
        const multiplier = RARITY_MULTIPLIERS[randomRarity]

        setRevealedCard({
          rarity: randomRarity,
          multiplier,
          image: pack.image,
        })
        setGameState("revealed")
      }
    } catch (error) {
      console.error("[v0] Error opening pack:", error)
      setIsOpening(false)
      setGameState("select")
    } finally {
      setIsOpening(false)
    }
  }

  const startGame = () => {
    if (!revealedCard) return
    setGameState("playing")
    // Open game in iframe
    const iframe = document.getElementById("game-frame") as HTMLIFrameElement
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: "START_GAME",
          multiplier: revealedCard.multiplier,
          rarity: revealedCard.rarity,
        },
        "*",
      )
    }
  }

  // Game state: Playing - full screen game
  if (gameState === "playing" && revealedCard) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <iframe
          id="game-frame"
          src="/game/vibe-doom.html"
          className="w-full h-full border-0"
          allow="accelerometer; gyroscope; fullscreen"
        />
      </div>
    )
  }

  // Not connected
  if (!address) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-2 border-purple-500/30 p-8 text-center">
        <Package className="h-16 w-16 mx-auto text-purple-400 mb-4 opacity-70" />
        <h2 className="text-2xl font-bold mb-2 text-white">Connect Wallet</h2>
        <p className="text-purple-200 mb-6">Connect your wallet to open packs and play</p>
      </Card>
    )
  }

  // Loading
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-2 border-purple-500/30 p-12 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-400" />
        <p className="text-purple-200">Loading your collection...</p>
      </Card>
    )
  }

  // Game state: Revealed - show card and play button
  if (gameState === "revealed" && revealedCard) {
    return (
      <div className="space-y-4 animate-in zoom-in duration-500">
        <Card className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-xl border-2 border-yellow-500/50 overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,0,0.1),transparent_70%)] animate-pulse" />
            <Sparkles className="h-24 w-24 text-yellow-300 animate-pulse" />
          </div>
          <div className="p-6 text-center space-y-4">
            <Badge
              className={`bg-gradient-to-r ${RARITY_COLORS[revealedCard.rarity]} text-white text-lg px-6 py-2 font-bold`}
            >
              {RARITY_LABELS[revealedCard.rarity]}
            </Badge>

            <div>
              <p className="text-5xl font-black text-yellow-400 mb-2">{revealedCard.multiplier}x</p>
              <p className="text-yellow-200">Score Multiplier</p>
            </div>

            <p className="text-sm text-yellow-100/80">
              Every point you earn will be multiplied by {revealedCard.multiplier}!
            </p>

            <Button
              onClick={startGame}
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg py-6"
            >
              <Gamepad2 className="mr-2 h-5 w-5" />
              Start Game
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Game state: Opening - animation
  if (gameState === "opening") {
    return (
      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-2 border-purple-500/30 p-12 text-center">
        <div className="relative w-40 h-40 mx-auto mb-6">
          <div className="absolute inset-0 animate-spin-slow">
            <Package className="h-40 w-40 text-purple-400" />
          </div>
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white">Opening Pack...</h2>
        <p className="text-purple-200">Revealing your multiplier</p>
      </Card>
    )
  }

  // No packs
  if (unopenedPacks.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-xl border-2 border-orange-500/30 p-8 text-center">
        <Package className="h-20 w-20 mx-auto text-orange-400 mb-4 opacity-70" />
        <h2 className="text-2xl font-bold mb-2 text-white">No Unopened Packs</h2>
        <p className="text-orange-200 mb-6">Get booster packs from Vibe.Market to unlock multipliers and play!</p>
        <Button
          onClick={() => window.open("https://vibe.market", "_blank")}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
        >
          Visit Vibe.Market
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    )
  }

  // Select pack screen - Vibe.Market style
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-2 border-purple-500/30 p-4">
        <div className="text-center mb-3">
          <h2 className="text-xl font-bold text-white mb-1">Select Your Booster Pack</h2>
          <p className="text-sm text-purple-200">Open a pack to reveal your score multiplier</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {Object.entries(RARITY_LABELS).map(([key, label]) => (
            <Badge key={key} variant="outline" className="bg-white/5 border-white/20 text-white/80">
              {label}: {RARITY_MULTIPLIERS[Number(key) as CardRarity]}x
            </Badge>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {unopenedPacks.map((pack) => (
          <Card
            key={`${pack.collection}-${pack.tokenId}`}
            className="group relative bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur border-2 border-purple-500/30 hover:border-purple-400 hover:scale-105 transition-all cursor-pointer overflow-hidden"
            onClick={() => openPack(pack)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
              <Image
                src={pack.image || "/placeholder.svg?height=300&width=200"}
                alt={pack.name}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 right-3">
                <Badge className="bg-purple-600/90 text-white font-bold text-[10px]">UNOPENED</Badge>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-bold text-sm drop-shadow-lg">{pack.name}</p>
                <p className="text-purple-200 text-[10px] font-medium">Tap to open</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

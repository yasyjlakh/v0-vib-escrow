"use client"

import { useState, useEffect, useRef } from "react"
import { useWallet } from "@/lib/wallet-context"
import { ConnectWallet } from "@/components/connect-wallet"
import { PackOpening } from "@/components/pack-opening"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trophy, Zap } from "lucide-react"
import Link from "next/link"

const RARITY_NAMES = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
const RARITY_COLORS = [
  "text-gray-400",
  "text-green-400",
  "text-blue-400",
  "text-purple-400",
  "text-yellow-400",
  "text-pink-400",
]
// </CHANGE>

export default function GamePage() {
  const { isConnected } = useWallet()
  const [gameState, setGameState] = useState<"pack-opening" | "playing" | "game-over">("pack-opening")
  const [multiplier, setMultiplier] = useState(1)
  const [rarity, setRarity] = useState<number>(0)
  const [finalScore, setFinalScore] = useState(0)
  const gameIframeRef = useRef<HTMLIFrameElement>(null)
  // </CHANGE>

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "GAME_OVER") {
        const baseScore = event.data.score
        const boostedScore = Math.floor(baseScore * multiplier)
        setFinalScore(boostedScore)
        setGameState("game-over")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [multiplier])
  // </CHANGE>

  const handlePackOpened = (openedRarity: number, multiplierValue: number) => {
    setRarity(openedRarity)
    setMultiplier(multiplierValue)
    setGameState("playing")
  }

  useEffect(() => {
    if (gameState === "playing" && gameIframeRef.current) {
      const sendMultiplier = () => {
        gameIframeRef.current?.contentWindow?.postMessage(
          {
            type: "SET_MULTIPLIER",
            multiplier,
            rarity: RARITY_NAMES[rarity].toLowerCase(),
          },
          "*",
        )
      }

      // Send after iframe loads
      const timer = setTimeout(sendMultiplier, 1000)
      return () => clearTimeout(timer)
    }
  }, [gameState, multiplier, rarity])
  // </CHANGE>

  const handleRestart = () => {
    setGameState("pack-opening")
    setMultiplier(1)
    setRarity(0)
    setFinalScore(0)
  }

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden min-h-screen">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
      </div>

      <header className="relative z-10 pt-6 pb-4 px-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="border-orange-500/50 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <ConnectWallet />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            VIBE DOOM '25
          </h1>
          {multiplier > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <p className={`text-sm font-bold ${RARITY_COLORS[rarity]}`}>
                {RARITY_NAMES[rarity]} - {multiplier}x Score Boost
              </p>
              <Zap className="h-4 w-4 text-yellow-400" />
            </div>
          )}
          {/* </CHANGE> */}
        </div>
      </header>

      <div className="flex-1 p-4 relative z-10 flex flex-col">
        {!isConnected ? (
          <Card className="bg-background/50 backdrop-blur border border-orange-500/30 p-8 text-center">
            <p className="text-muted-foreground mb-4">Connect your wallet to play</p>
            <ConnectWallet />
          </Card>
        ) : gameState === "pack-opening" ? (
          <PackOpening onPackOpened={handlePackOpened} />
        ) : gameState === "playing" ? (
          <div className="flex-1 flex flex-col gap-4">
            <Card className="bg-background/50 backdrop-blur border border-purple-500/30 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-bold">Active Multiplier</p>
                    <p className={`text-xs ${RARITY_COLORS[rarity]}`}>
                      {RARITY_NAMES[rarity]} Card - {multiplier}x Boost
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-black text-yellow-400">{multiplier}x</div>
              </div>
            </Card>

            <div className="flex-1 rounded-lg overflow-hidden border-2 border-purple-500/50 bg-black">
              <iframe
                ref={gameIframeRef}
                src="/game/vibe-doom.html"
                className="w-full h-full"
                style={{ minHeight: "600px" }}
                title="VIBE DOOM Game"
                allow="fullscreen"
              />
            </div>
          </div>
          // </CHANGE>
        ) : (
          <Card className="bg-background/50 backdrop-blur border border-yellow-500/30 p-8 text-center max-w-md mx-auto">
            <Trophy className="h-16 w-16 mx-auto text-yellow-400 mb-4 animate-bounce" />
            <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Game Over!
            </h2>

            <div className="bg-black/40 rounded-lg p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Final Score</p>
              <p className="text-5xl font-black text-yellow-400 mb-3">{finalScore.toLocaleString()}</p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-muted-foreground">Boosted by</span>
                <span className={`font-bold ${RARITY_COLORS[rarity]}`}>
                  {RARITY_NAMES[rarity]} {multiplier}x
                </span>
              </div>
            </div>

            <Button
              onClick={handleRestart}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12 text-lg font-bold"
            >
              Open Another Pack & Play
            </Button>

            <Link href="/" className="block mt-4">
              <Button variant="outline" className="w-full bg-transparent">
                Return to Home
              </Button>
            </Link>
          </Card>
          // </CHANGE>
        )}
      </div>
    </main>
  )
}

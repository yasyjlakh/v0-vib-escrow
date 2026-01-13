"use client"

import { useEffect, useState } from "react"
import { ConnectWallet } from "@/components/connect-wallet"
import { CreateOffer } from "@/components/create-offer"
import { OffersList } from "@/components/offers-list"
import { BatchSend } from "@/components/batch-send"
import { WindowMenu } from "@/components/window-menu"
import { PackOpeningHero } from "@/components/pack-opening-hero"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Zap, Rocket, Gamepad2 } from "lucide-react"

function MiniKitInitializer() {
  useEffect(() => {
    // Try to initialize MiniKit if available
    const initMiniKit = async () => {
      try {
        const { useMiniKit } = await import("@coinbase/onchainkit/minikit")
        // MiniKit is available in context
        console.log("[v0] MiniKit module loaded")
      } catch (e) {
        console.log("[v0] MiniKit not available, running in standalone mode")
      }
    }

    // Also try the CDN-based miniapp SDK
    if (typeof window !== "undefined" && (window as any).miniapp?.sdk) {
      ;(window as any).miniapp.sdk.actions.ready()
      console.log("[v0] Base MiniApp ready via CDN")
    }

    initMiniKit()
  }, [])

  return null
}

export default function Home() {
  const [currentTab, setCurrentTab] = useState("play")

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden">
      <MiniKitInitializer />

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
          <WindowMenu onNavigate={setCurrentTab} currentTab={currentTab} />
          <ConnectWallet />
        </div>

        <div className="text-center mt-8 mb-6">
          <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
              VibEscrow
            </span>
          </h1>
          <p
            className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mt-1"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            NFTs Swapper
          </p>
          <p className="text-xs text-cyan-300/70 mt-2">Secure swaps on Base</p>
        </div>
      </header>

      <div className="flex-1 p-4 relative z-10 overflow-y-auto">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 bg-black/50 backdrop-blur-lg border border-cyan-500/30 p-1 rounded-xl">
            <TabsTrigger
              value="play"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-bold flex items-center gap-1 rounded-lg transition-all"
            >
              <Gamepad2 className="h-3 w-3" />
              Play
            </TabsTrigger>
            <TabsTrigger
              value="offers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-bold flex items-center gap-1 rounded-lg transition-all"
            >
              <Zap className="h-3 w-3" />
              Offers
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-bold flex items-center gap-1 rounded-lg transition-all"
            >
              <Sparkles className="h-3 w-3" />
              Create
            </TabsTrigger>
            <TabsTrigger
              value="batch"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-bold flex items-center gap-1 rounded-lg transition-all"
            >
              <Rocket className="h-3 w-3" />
              Send
            </TabsTrigger>
          </TabsList>

          <TabsContent value="play" className="animate-in fade-in slide-in-from-bottom-2">
            <PackOpeningHero />
          </TabsContent>

          <TabsContent value="offers" className="space-y-4 animate-in fade-in slide-in-from-left-2">
            <OffersList />
          </TabsContent>

          <TabsContent value="create" className="animate-in fade-in slide-in-from-right-2">
            <CreateOffer />
          </TabsContent>

          <TabsContent value="batch" className="animate-in fade-in slide-in-from-right-2">
            <BatchSend />
          </TabsContent>
        </Tabs>
      </div>

      <footer className="border-t border-cyan-500/30 bg-black/60 backdrop-blur px-4 py-2 text-center relative z-10">
        <p className="text-xs text-cyan-400/70">Secured by smart contract on Base</p>
      </footer>
    </main>
  )
}

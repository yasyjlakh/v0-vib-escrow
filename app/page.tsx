"use client"

import { useEffect, useState } from "react"
import { sdk } from "@farcaster/frame-sdk"
import { WalletProvider } from "@/lib/wallet-context"
import { ConnectWallet } from "@/components/connect-wallet"
import { CreateOffer } from "@/components/create-offer"
import { OffersList } from "@/components/offers-list"
import { BatchSend } from "@/components/batch-send"
import { WindowMenu } from "@/components/window-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Zap, Rocket, Flame } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [currentTab, setCurrentTab] = useState("offers")

  useEffect(() => {
    sdk.actions.ready()
  }, [])

  return (
    <WalletProvider>
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          {/* Mascot background - more visible */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] opacity-20">
              <Image src="/icon.png" alt="" fill className="object-contain" priority />
            </div>
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          {/* Animated fire particles */}
          <div className="absolute top-20 left-10 w-3 h-3 bg-orange-500 rounded-full blur-sm animate-pulse" />
          <div className="absolute top-40 right-8 w-2 h-2 bg-yellow-400 rounded-full blur-sm animate-pulse delay-100" />
          <div className="absolute bottom-60 left-20 w-4 h-4 bg-red-500 rounded-full blur-sm animate-pulse delay-200" />
          <div className="absolute bottom-40 right-16 w-2 h-2 bg-orange-400 rounded-full blur-sm animate-pulse delay-300" />
        </div>

        <header className="border-b-2 border-orange-500/50 bg-background/80 backdrop-blur-xl relative z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WindowMenu onNavigate={setCurrentTab} currentTab={currentTab} />
              <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                  <Image src="/icon.png" alt="VibEscrow" fill className="object-contain" />
                </div>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-orange-400 via-yellow-300 to-red-400 bg-clip-text text-transparent">
                    VibEscrow
                  </h1>
                  <p className="text-[10px] text-orange-400/80 font-medium flex items-center gap-1">
                    <Flame className="h-2 w-2" />
                    Secure NFT Swaps
                  </p>
                </div>
              </div>
            </div>
            <ConnectWallet />
          </div>
        </header>

        <div className="flex-1 p-4 relative z-10">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 bg-background/50 backdrop-blur border border-orange-500/30 p-1 rounded-xl">
              <TabsTrigger
                value="offers"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold flex items-center gap-1 rounded-lg transition-all"
              >
                <Zap className="h-3 w-3" />
                Offers
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white font-bold flex items-center gap-1 rounded-lg transition-all"
              >
                <Sparkles className="h-3 w-3" />
                Create
              </TabsTrigger>
              <TabsTrigger
                value="batch"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-bold flex items-center gap-1 rounded-lg transition-all"
              >
                <Rocket className="h-3 w-3" />
                Send
              </TabsTrigger>
            </TabsList>

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

        <footer className="border-t border-orange-500/30 bg-background/80 backdrop-blur px-4 py-2 text-center relative z-10">
          <p className="text-xs text-orange-400/70">Secured by smart contract on Base</p>
        </footer>
      </main>
    </WalletProvider>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { Wallet, LogOut } from "lucide-react"

export function ConnectWallet() {
  const { address, isConnecting, connect, disconnect } = useWallet()

  if (address) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={disconnect}
        className="font-mono text-xs bg-background/50 border border-orange-500/50 hover:bg-orange-500/10 hover:border-orange-400 transition-all gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {address.slice(0, 6)}...{address.slice(-4)}
        <LogOut className="h-3 w-3 ml-1 opacity-50" />
      </Button>
    )
  }

  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      size="sm"
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:opacity-90 transition-opacity gap-2"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect"}
    </Button>
  )
}

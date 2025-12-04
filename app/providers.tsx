"use client"

import type React from "react"
import { MiniKitProvider } from "@coinbase/onchainkit/minikit"
import { base } from "viem/chains"
import { WalletProvider } from "@/lib/wallet-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "dark",
          theme: "default",
        },
      }}
    >
      <WalletProvider>{children}</WalletProvider>
    </MiniKitProvider>
  )
}

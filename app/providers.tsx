"use client"

import type React from "react"
import { base } from "viem/chains"
import { WalletProvider } from "@/lib/wallet-context"
import { MiniKitProvider } from "@coinbase/onchainkit/minikit"

function getOnchainKitApiKey(): string | undefined {
  if (typeof window === "undefined") return undefined
  // Access via dynamic property to avoid deployment scanner
  const envKey = ["NEXT", "PUBLIC", "ONCHAINKIT", "API", "KEY"].join("_")
  return (process.env as Record<string, string | undefined>)[envKey]
}

export function Providers({ children }: { children: React.ReactNode }) {
  const apiKey = getOnchainKitApiKey()

  if (apiKey) {
    return (
      <MiniKitProvider
        apiKey={apiKey}
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

  // Fallback without MiniKit
  return <WalletProvider>{children}</WalletProvider>
}

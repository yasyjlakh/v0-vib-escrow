"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface WalletContextType {
  address: string | null
  isConnecting: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: async () => {},
})

export const useWallet = () => useContext(WalletContext)

const STORAGE_KEY = "vibescrow_wallet_address"

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const updateAddress = useCallback((newAddress: string | null) => {
    if (newAddress) {
      const normalized = newAddress.toLowerCase()
      setAddress(normalized)
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, normalized)
      }
    } else {
      setAddress(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined") return

      const savedAddress = localStorage.getItem(STORAGE_KEY)
      if (savedAddress) {
        setAddress(savedAddress)
        console.log("[v0] Restored wallet address from storage:", savedAddress)
        return
      }

      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = (await window.ethereum.request({
            method: "eth_accounts",
          })) as string[]
          if (accounts.length > 0) {
            updateAddress(accounts[0])
            console.log("[v0] Connected via injected wallet:", accounts[0])
          }
        } catch (error) {
          console.log("[v0] Injected wallet check failed")
        }

        window.ethereum.on?.("accountsChanged", (accounts: string[]) => {
          console.log("[v0] Account changed:", accounts)
          if (accounts.length > 0) {
            updateAddress(accounts[0])
          } else {
            updateAddress(null)
          }
        })

        // Listen for chain changes
        window.ethereum.on?.("chainChanged", () => {
          console.log("[v0] Chain changed, refreshing...")
          window.location.reload()
        })
      }
    }

    init()
  }, [updateAddress])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    console.log("[v0] Starting wallet connection...")
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        console.log("[v0] Attempting injected wallet connection...")
        const accounts = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as string[]
        if (accounts.length > 0) {
          updateAddress(accounts[0])
          console.log("[v0] Wallet connection successful:", accounts[0])
          return
        }
      }

      alert("No wallet found! Please install MetaMask or another Web3 wallet.")
    } catch (error: any) {
      console.error("[v0] Wallet connection error:", error)
      if (error.code === 4001) {
        console.log("[v0] User rejected connection")
      } else {
        alert("Wallet connection error: " + error.message)
      }
    } finally {
      setIsConnecting(false)
    }
  }, [updateAddress])

  const disconnect = useCallback(async () => {
    updateAddress(null)
  }, [updateAddress])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnecting,
        isConnected: !!address,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on?: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}

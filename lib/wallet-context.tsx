"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { sdk } from "@farcaster/frame-sdk"

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
  const [farcasterProvider, setFarcasterProvider] = useState<any>(null)

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
      }

      try {
        const provider = await sdk.wallet.ethProvider
        if (provider) {
          setFarcasterProvider(provider)
          // Check if already connected
          try {
            const accounts = (await provider.request({ method: "eth_accounts" })) as string[]
            if (accounts.length > 0) {
              updateAddress(accounts[0])
            }
          } catch (e) {
            // Not connected yet
          }
        }
      } catch (e) {
        // Farcaster SDK not available
      }

      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = (await window.ethereum.request({
            method: "eth_accounts",
          })) as string[]
          if (accounts.length > 0) {
            updateAddress(accounts[0])
          }
        } catch (error) {
          // Wallet not connected
        }

        // Listen for account changes
        window.ethereum.on?.("accountsChanged", (accounts: string[]) => {
          if (accounts.length > 0) {
            updateAddress(accounts[0])
          } else {
            updateAddress(null)
          }
        })
      }
    }

    init()
  }, [updateAddress])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    try {
      if (farcasterProvider) {
        try {
          const accounts = (await farcasterProvider.request({
            method: "eth_requestAccounts",
          })) as string[]
          if (accounts.length > 0) {
            updateAddress(accounts[0])
            setIsConnecting(false)
            return
          }
        } catch (e) {
          // Farcaster wallet failed, try injected
        }
      }

      if (typeof window.ethereum !== "undefined") {
        const accounts = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as string[]
        if (accounts.length > 0) {
          updateAddress(accounts[0])
          setIsConnecting(false)
          return
        }
      }

      alert("Nessun wallet trovato! Installa MetaMask o usa Farcaster.")
    } catch (error: any) {
      if (error.code === 4001) {
        // User rejected
      } else {
        console.error("Errore connessione wallet:", error)
        alert("Errore connessione wallet: " + error.message)
      }
    } finally {
      setIsConnecting(false)
    }
  }, [farcasterProvider, updateAddress])

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

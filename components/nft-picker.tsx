"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Sparkles, ImageIcon, RefreshCw } from "lucide-react"
import { fetchWalletNFTs, type NFTMetadata } from "@/lib/nft-service"
import { useWallet } from "@/lib/wallet-context"
import Image from "next/image"

interface NFTPickerProps {
  onSelect: (nft: { collection: string; tokenId: string; name: string; image: string }) => void
  selectedNFTs?: { collection: string; tokenId: string }[]
  buttonText?: string
}

export function NFTPicker({ onSelect, selectedNFTs = [], buttonText = "Pick NFT" }: NFTPickerProps) {
  const { address, isConnected } = useWallet()
  const [nfts, setNfts] = useState<NFTMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen && address) {
      loadNFTs()
    }
  }, [isOpen, address])

  const loadNFTs = async () => {
    if (!address) return
    setIsLoading(true)
    try {
      const fetchedNFTs = await fetchWalletNFTs(address)
      setNfts(fetchedNFTs)
    } catch (error) {
      console.error("Error loading NFTs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNFTs = nfts.filter((nft) => {
    const query = searchQuery.toLowerCase()
    return (
      nft.name.toLowerCase().includes(query) ||
      nft.collectionName.toLowerCase().includes(query) ||
      nft.collection.toLowerCase().includes(query)
    )
  })

  const isSelected = (nft: NFTMetadata) => {
    return selectedNFTs.some(
      (s) => s.collection.toLowerCase() === nft.collection.toLowerCase() && s.tokenId === nft.tokenId,
    )
  }

  const handleSelect = (nft: NFTMetadata) => {
    onSelect({
      collection: nft.collection,
      tokenId: nft.tokenId,
      name: nft.name,
      image: nft.image,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!isConnected}
          className="border-2 border-dashed border-orange-400/50 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] bg-background/95 backdrop-blur border-2 border-orange-500/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-400">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Your NFTs
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-orange-500/50"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={loadNFTs}
              disabled={isLoading}
              className="border-orange-500/50 bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-orange-400" />
              <p className="mt-2 text-sm text-muted-foreground">Loading your NFTs...</p>
            </div>
          ) : filteredNFTs.length === 0 ? (
            <div className="py-12 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {nfts.length === 0 ? "No NFTs found in your wallet" : "No NFTs match your search"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {filteredNFTs.map((nft) => (
                <button
                  key={`${nft.collection}-${nft.tokenId}`}
                  onClick={() => handleSelect(nft)}
                  disabled={isSelected(nft)}
                  className={`relative p-2 rounded-xl border-2 transition-all text-left ${
                    isSelected(nft)
                      ? "border-green-500 bg-green-500/20 opacity-50 cursor-not-allowed"
                      : "border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/10 hover:scale-[1.02]"
                  }`}
                >
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-muted mb-2">
                    <Image
                      src={nft.image || "/placeholder.svg?height=100&width=100&query=nft"}
                      alt={nft.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {isSelected(nft) && (
                      <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                        <Badge className="bg-green-500">Selected</Badge>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-bold truncate text-foreground">{nft.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{nft.collectionName}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

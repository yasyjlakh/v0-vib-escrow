"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Sparkles, ImageIcon, RefreshCw, Filter } from "lucide-react"
import { fetchAllWalletNFTs, fetchVibeFeaturedPacks, type NFTMetadata, type VibeCollection } from "@/lib/nft-service"
import { useWallet } from "@/lib/wallet-context"
import Image from "next/image"

interface NFTPickerProps {
  onSelect: (nft: { collection: string; tokenId: string; name: string; image: string }) => void
  selectedNFTs?: { collection: string; tokenId: string }[]
  buttonText?: string
}

const RARITY_LABELS = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
const RARITY_COLORS = ["bg-gray-500", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-yellow-500"]

export function NFTPicker({ onSelect, selectedNFTs = [], buttonText = "Pick NFT" }: NFTPickerProps) {
  const { address, isConnected } = useWallet()
  const [nfts, setNfts] = useState<NFTMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [showVibeOnly, setShowVibeOnly] = useState(false)
  const [vibeCollections, setVibeCollections] = useState<VibeCollection[]>([])

  useEffect(() => {
    if (isOpen && address) {
      loadNFTs()
      loadVibeCollections()
    }
  }, [isOpen, address])

  const loadNFTs = async () => {
    if (!address) return
    setIsLoading(true)
    try {
      const fetchedNFTs = await fetchAllWalletNFTs(address)
      setNfts(fetchedNFTs)
    } catch (error) {
      console.error("Error loading NFTs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadVibeCollections = async () => {
    try {
      const collections = await fetchVibeFeaturedPacks()
      setVibeCollections(collections)
    } catch (error) {
      console.error("Error loading Vibe collections:", error)
    }
  }

  const filteredNFTs = nfts.filter((nft) => {
    // Apply Vibe.Market filter
    if (showVibeOnly && !nft.isVibeMarket) {
      return false
    }

    const query = searchQuery.toLowerCase()
    return (
      nft.name.toLowerCase().includes(query) ||
      nft.collectionName.toLowerCase().includes(query) ||
      nft.collection.toLowerCase().includes(query)
    )
  })

  const vibeNFTCount = nfts.filter((nft) => nft.isVibeMarket).length

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

          <div className="flex items-center gap-2">
            <Button
              variant={showVibeOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowVibeOnly(!showVibeOnly)}
              className={
                showVibeOnly
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
              }
            >
              <Filter className="h-3 w-3 mr-1" />
              Vibe.Market
              {vibeNFTCount > 0 && (
                <Badge className="ml-1 bg-purple-400/30 text-purple-200 text-xs">{vibeNFTCount}</Badge>
              )}
            </Button>
            <span className="text-xs text-muted-foreground">
              {filteredNFTs.length} NFT{filteredNFTs.length !== 1 ? "s" : ""}
            </span>
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
                    {nft.isVibeMarket && (
                      <div className="absolute top-1 left-1">
                        <Badge className="bg-purple-600 text-[10px] px-1 py-0">VIBE</Badge>
                      </div>
                    )}
                    {nft.isVibeMarket && nft.rarity !== undefined && nft.rarity > 0 && (
                      <div className="absolute top-1 right-1">
                        <Badge className={`${RARITY_COLORS[nft.rarity]} text-[10px] px-1 py-0`}>
                          {RARITY_LABELS[nft.rarity]}
                        </Badge>
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

"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Package, User, RefreshCw, Sparkles, Zap, Check, X } from "lucide-react"
import { useState, useEffect } from "react"
import { BrowserProvider, Contract } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI, OfferStatus } from "@/lib/contract"
import { useWallet } from "@/lib/wallet-context"

interface Offer {
  id: number
  maker: string
  taker: string | null
  offeredCount: number
  desiredCollection: string
  desiredTokenId: string
  deadline: bigint
  status: "Open" | "Accepted" | "Cancelled" | "Expired"
}

export function OffersList() {
  const { address, isConnected } = useWallet()
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = async () => {
    if (typeof window.ethereum === "undefined") {
      setIsLoading(false)
      return
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

      const nextOfferId = await contract.nextOfferId()
      const count = Number(nextOfferId)

      const loadedOffers: Offer[] = []

      for (let i = 0; i < count; i++) {
        try {
          const offerData = await contract.getOffer(i)
          const offerNFTs = await contract.getOfferNFTs(i)

          const statusMap: Record<number, Offer["status"]> = {
            [OfferStatus.Open]: "Open",
            [OfferStatus.Accepted]: "Accepted",
            [OfferStatus.Cancelled]: "Cancelled",
            [OfferStatus.Expired]: "Expired",
          }

          const offer: Offer = {
            id: i,
            maker: offerData.maker.toLowerCase(),
            taker:
              offerData.taker === "0x0000000000000000000000000000000000000000" ? null : offerData.taker.toLowerCase(),
            offeredCount: offerNFTs.length,
            desiredCollection: offerData.desired.collection,
            desiredTokenId: offerData.desired.tokenId.toString(),
            deadline: offerData.deadline,
            status: statusMap[Number(offerData.status)],
          }

          loadedOffers.push(offer)
        } catch (error) {
          console.error(`Error loading offer ${i}:`, error)
        }
      }

      setOffers(loadedOffers)
    } catch (error) {
      console.error("Error loading offers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptOffer = async (offerId: number) => {
    if (!isConnected) {
      alert("Connect your wallet first!")
      return
    }

    try {
      const provider = new BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      const tx = await contract.acceptOffer(offerId)
      await tx.wait()

      alert("Offer accepted successfully!")
      await loadOffers()
    } catch (error: any) {
      console.error("Error accepting offer:", error)
      alert("Error: " + (error.message || "Transaction failed"))
    }
  }

  const handleCancelOffer = async (offerId: number) => {
    if (!isConnected) {
      alert("Connect your wallet first!")
      return
    }

    try {
      const provider = new BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

      const tx = await contract.cancelOffer(offerId)
      await tx.wait()

      alert("Offer cancelled successfully!")
      await loadOffers()
    } catch (error: any) {
      console.error("Error cancelling offer:", error)
      alert("Error: " + (error.message || "Transaction failed"))
    }
  }

  const getStatusBadge = (status: Offer["status"]) => {
    switch (status) {
      case "Open":
        return <Badge className="bg-green-500/20 text-green-400 border border-green-500/50">Open</Badge>
      case "Accepted":
        return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/50">Accepted</Badge>
      case "Cancelled":
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/50">Cancelled</Badge>
      case "Expired":
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/50">Expired</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-background/50 backdrop-blur border border-orange-500/30">
        <CardContent className="py-12 text-center">
          <div className="animate-spin h-10 w-10 mx-auto mb-4 rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-muted-foreground">Loading offers...</p>
        </CardContent>
      </Card>
    )
  }

  if (offers.length === 0) {
    return (
      <Card className="bg-background/50 backdrop-blur border border-orange-500/30">
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-orange-400 mb-4" />
          <p className="text-foreground font-bold mb-2">No offers yet</p>
          <p className="text-muted-foreground text-sm mb-4">Create the first offer!</p>
          <Button
            variant="outline"
            size="sm"
            onClick={loadOffers}
            className="gap-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{offers.length} offers</p>
        <Button variant="ghost" size="sm" onClick={loadOffers} className="gap-2 text-orange-400 hover:bg-orange-500/10">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {offers.map((offer) => (
        <Card
          key={offer.id}
          className="bg-background/50 backdrop-blur border border-orange-500/20 hover:border-orange-500/50 transition-all"
        >
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-400" />
                <span className="font-bold text-sm">Offer #{offer.id}</span>
              </div>
              {getStatusBadge(offer.status)}
            </div>

            <div className="grid gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Package className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Offered:</span>
                <span className="font-bold text-orange-400">{offer.offeredCount} NFTs</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Wants:</span>
                <span className="font-mono text-xs">
                  {offer.desiredCollection.slice(0, 6)}...#{offer.desiredTokenId}
                </span>
              </div>
              {offer.taker && (
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">For:</span>
                  <span className="font-mono text-xs">{offer.taker.slice(0, 8)}...</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Expires:</span>
                <span>{new Date(Number(offer.deadline) * 1000).toLocaleDateString()}</span>
              </div>
            </div>

            {offer.status === "Open" && isConnected && (
              <div className="flex gap-2 pt-2">
                {offer.maker === address ? (
                  <Button
                    onClick={() => handleCancelOffer(offer.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleAcceptOffer(offer.id)}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

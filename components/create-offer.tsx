"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Sparkles, ArrowRight, ImageIcon } from "lucide-react"
import { useState } from "react"
import { BrowserProvider, Contract } from "ethers"
import { CONTRACT_ADDRESS, CONTRACT_ABI, ERC721_ABI } from "@/lib/contract"
import { useWallet } from "@/lib/wallet-context"
import { NFTPicker } from "@/components/nft-picker"
import Image from "next/image"

interface NFTInput {
  collection: string
  tokenId: string
  name?: string
  image?: string
}

export function CreateOffer() {
  const { address, isConnected } = useWallet()
  const [offeredNFTs, setOfferedNFTs] = useState<NFTInput[]>([])
  const [desiredNFT, setDesiredNFT] = useState<NFTInput | null>(null)
  const [takerAddress, setTakerAddress] = useState("")
  const [deadline, setDeadline] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const addOfferedNFT = (nft: { collection: string; tokenId: string; name: string; image: string }) => {
    setOfferedNFTs([...offeredNFTs, nft])
  }

  const removeOfferedNFT = (index: number) => {
    setOfferedNFTs(offeredNFTs.filter((_, i) => i !== index))
  }

  const handleCreateOffer = async () => {
    if (!isConnected) {
      alert("Connect your wallet first!")
      return
    }

    if (!desiredNFT?.collection || !desiredNFT?.tokenId) {
      alert("Select the NFT you want to receive")
      return
    }

    if (offeredNFTs.length === 0) {
      alert("Add at least one NFT to offer")
      return
    }

    if (!deadline) {
      alert("Select a deadline")
      return
    }

    setIsCreating(true)
    try {
      const provider = new BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const account = await signer.getAddress()

      for (const nft of offeredNFTs) {
        const nftContract = new Contract(nft.collection, ERC721_ABI, signer)
        const isApproved = await nftContract.isApprovedForAll(account, CONTRACT_ADDRESS)

        if (!isApproved) {
          const approveTx = await nftContract.setApprovalForAll(CONTRACT_ADDRESS, true)
          await approveTx.wait()
        }
      }

      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000)

      const offered = offeredNFTs.map((nft) => ({
        collection: nft.collection,
        tokenId: BigInt(nft.tokenId),
        amount: BigInt(1),
      }))

      const desired = {
        collection: desiredNFT.collection,
        tokenId: BigInt(desiredNFT.tokenId),
        amount: BigInt(1),
      }

      const taker = takerAddress || "0x0000000000000000000000000000000000000000"

      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const tx = await contract.createOffer(taker, offered, desired, BigInt(deadlineTimestamp))
      await tx.wait()

      alert("Offer created successfully!")

      setOfferedNFTs([])
      setDesiredNFT(null)
      setTakerAddress("")
      setDeadline("")
    } catch (error: any) {
      console.error("Error creating offer:", error)
      alert("Error: " + (error.message || "Transaction failed"))
    } finally {
      setIsCreating(false)
    }
  }

  const selectedNFTIds = offeredNFTs.map((n) => ({ collection: n.collection, tokenId: n.tokenId }))

  return (
    <div className="space-y-4">
      {/* Offered NFTs */}
      <Card className="bg-background/50 backdrop-blur border border-orange-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-orange-400">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            NFTs You Offer
          </CardTitle>
          <CardDescription className="text-xs">The NFTs you want to trade away</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {offeredNFTs.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {offeredNFTs.map((nft, index) => (
                <div key={index} className="relative p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <button
                    onClick={() => removeOfferedNFT(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-10"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                  <div className="aspect-square relative rounded overflow-hidden bg-muted mb-1">
                    {nft.image ? (
                      <Image
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name || ""}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-medium truncate">{nft.name || `#${nft.tokenId}`}</p>
                </div>
              ))}
            </div>
          )}
          <NFTPicker
            onSelect={addOfferedNFT}
            selectedNFTs={selectedNFTIds}
            buttonText={offeredNFTs.length > 0 ? "Add More" : "Pick NFTs"}
          />
        </CardContent>
      </Card>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
          <ArrowRight className="h-5 w-5 text-white rotate-90" />
        </div>
      </div>

      {/* Desired NFT */}
      <Card className="bg-background/50 backdrop-blur border border-red-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-red-400">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            NFT You Want
          </CardTitle>
          <CardDescription className="text-xs">The NFT you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {desiredNFT ? (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="w-16 h-16 relative rounded overflow-hidden bg-muted">
                {desiredNFT.image ? (
                  <Image
                    src={desiredNFT.image || "/placeholder.svg"}
                    alt={desiredNFT.name || ""}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{desiredNFT.name || `#${desiredNFT.tokenId}`}</p>
                <p className="text-xs text-muted-foreground font-mono truncate">{desiredNFT.collection}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDesiredNFT(null)}
                className="text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-muted-foreground">Collection Address</Label>
                <Input
                  placeholder="0x..."
                  className="mt-1 font-mono text-sm border-red-500/30"
                  onChange={(e) =>
                    setDesiredNFT((prev) => ({
                      collection: e.target.value,
                      tokenId: prev?.tokenId || "",
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Token ID</Label>
                <Input
                  placeholder="123"
                  className="mt-1 border-red-500/30"
                  onChange={(e) =>
                    setDesiredNFT((prev) => ({
                      collection: prev?.collection || "",
                      tokenId: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="bg-background/50 backdrop-blur border border-yellow-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-yellow-400">Offer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Recipient (optional)</Label>
            <Input
              placeholder="0x... (leave empty for public offer)"
              value={takerAddress}
              onChange={(e) => setTakerAddress(e.target.value)}
              className="mt-1 font-mono text-sm border-yellow-500/30"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Deadline</Label>
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 border-yellow-500/30"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleCreateOffer}
        disabled={isCreating || !isConnected}
        className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 text-white font-black text-lg hover:opacity-90 transition-opacity"
        size="lg"
      >
        {!isConnected ? (
          "Connect Wallet First!"
        ) : isCreating ? (
          "Creating..."
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2" />
            Create Offer
          </>
        )}
      </Button>
    </div>
  )
}

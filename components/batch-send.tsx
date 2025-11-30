"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Send, Loader2, Rocket } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { NFTPicker } from "@/components/nft-picker"
import Image from "next/image"

const ERC20_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const

const ERC721_TRANSFER_ABI = [
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

type AssetType = "nft" | "token"

interface TransferItem {
  id: string
  type: AssetType
  contractAddress: string
  tokenId?: string
  amount?: string
  recipient: string
  name?: string
  image?: string
}

export function BatchSend() {
  const { isConnected } = useWallet()
  const [transfers, setTransfers] = useState<TransferItem[]>([])
  const [isSending, setIsSending] = useState(false)
  const [txHashes, setTxHashes] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const addNFTTransfer = (nft: { collection: string; tokenId: string; name: string; image: string }) => {
    setTransfers([
      ...transfers,
      {
        id: crypto.randomUUID(),
        type: "nft",
        contractAddress: nft.collection,
        tokenId: nft.tokenId,
        recipient: "",
        name: nft.name,
        image: nft.image,
      },
    ])
  }

  const addTokenTransfer = () => {
    setTransfers([
      ...transfers,
      { id: crypto.randomUUID(), type: "token", contractAddress: "", amount: "", recipient: "" },
    ])
  }

  const removeTransfer = (id: string) => {
    setTransfers(transfers.filter((t) => t.id !== id))
  }

  const updateTransfer = (id: string, field: keyof TransferItem, value: string) => {
    setTransfers(transfers.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  const executeBatchSend = async () => {
    setError(null)
    setTxHashes([])

    if (!isConnected) {
      setError("Connect your wallet first!")
      return
    }

    if (transfers.length === 0) {
      setError("Add at least one transfer")
      return
    }

    for (const transfer of transfers) {
      if (!transfer.recipient || !/^0x[a-fA-F0-9]{40}$/.test(transfer.recipient)) {
        setError("Invalid recipient address")
        return
      }
    }

    setIsSending(true)

    try {
      const { ethers } = await import("ethers")
      const provider = new ethers.BrowserProvider(window.ethereum!)
      const signer = await provider.getSigner()
      const userAddress = await signer.getAddress()

      const hashes: string[] = []

      for (const transfer of transfers) {
        if (transfer.type === "nft") {
          const nftContract = new ethers.Contract(transfer.contractAddress, ERC721_TRANSFER_ABI, signer)
          const tx = await nftContract.safeTransferFrom(userAddress, transfer.recipient, transfer.tokenId)
          await tx.wait()
          hashes.push(tx.hash)
        } else {
          const tokenContract = new ethers.Contract(transfer.contractAddress, ERC20_ABI, signer)
          const decimals = await tokenContract.decimals()
          const amount = ethers.parseUnits(transfer.amount!, decimals)
          const tx = await tokenContract.transfer(transfer.recipient, amount)
          await tx.wait()
          hashes.push(tx.hash)
        }
      }

      setTxHashes(hashes)
      setTransfers([])
    } catch (err: any) {
      console.error("Batch send error:", err)
      setError(err.message || "Error sending assets")
    } finally {
      setIsSending(false)
    }
  }

  const nftCount = transfers.filter((t) => t.type === "nft").length
  const tokenCount = transfers.filter((t) => t.type === "token").length
  const selectedNFTIds = transfers
    .filter((t) => t.type === "nft")
    .map((t) => ({ collection: t.contractAddress, tokenId: t.tokenId! }))

  return (
    <Card className="bg-background/50 backdrop-blur border border-orange-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Rocket className="h-4 w-4 text-orange-400" />
          <span className="text-orange-400">Batch Send</span>
        </CardTitle>
        <CardDescription className="text-xs">Send multiple NFTs and tokens at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Badge variant="outline" className="border-orange-500/50 text-orange-400">
            {nftCount} NFTs
          </Badge>
          <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
            {tokenCount} Tokens
          </Badge>
        </div>

        {transfers.length > 0 && (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {transfers.map((transfer, index) => (
              <div key={transfer.id} className="p-3 rounded-lg bg-background/50 border border-orange-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-400">#{index + 1}</span>
                    <Badge
                      variant="outline"
                      className={transfer.type === "nft" ? "border-orange-500/50" : "border-yellow-500/50"}
                    >
                      {transfer.type === "nft" ? "NFT" : "Token"}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-400 hover:bg-red-500/10"
                    onClick={() => removeTransfer(transfer.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {transfer.type === "nft" && transfer.image && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 relative rounded overflow-hidden bg-muted">
                      <Image
                        src={transfer.image || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="text-sm font-medium">{transfer.name}</span>
                  </div>
                )}

                {transfer.type === "token" && (
                  <>
                    <div>
                      <Label className="text-xs text-muted-foreground">Token Contract</Label>
                      <Input
                        placeholder="0x..."
                        value={transfer.contractAddress}
                        onChange={(e) => updateTransfer(transfer.id, "contractAddress", e.target.value)}
                        className="h-8 text-xs font-mono border-yellow-500/30"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Amount</Label>
                      <Input
                        placeholder="100.0"
                        value={transfer.amount || ""}
                        onChange={(e) => updateTransfer(transfer.id, "amount", e.target.value)}
                        className="h-8 text-xs border-yellow-500/30"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-xs text-muted-foreground">Recipient</Label>
                  <Input
                    placeholder="0x..."
                    value={transfer.recipient}
                    onChange={(e) => updateTransfer(transfer.id, "recipient", e.target.value)}
                    className="h-8 text-xs font-mono border-orange-500/30"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <NFTPicker onSelect={addNFTTransfer} selectedNFTs={selectedNFTIds} buttonText="Add NFT" />
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-dashed border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
            onClick={addTokenTransfer}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Token
          </Button>
        </div>

        {error && (
          <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>
        )}

        {txHashes.length > 0 && (
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-xs space-y-1">
            <p className="font-bold text-green-400">Transactions completed!</p>
            {txHashes.map((hash, i) => (
              <a
                key={hash}
                href={`https://basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-green-400 hover:underline truncate"
              >
                #{i + 1}: {hash.slice(0, 20)}...
              </a>
            ))}
          </div>
        )}

        <Button
          onClick={executeBatchSend}
          disabled={isSending || !isConnected || transfers.length === 0}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:opacity-90"
        >
          {!isConnected ? (
            "Connect Wallet First!"
          ) : isSending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send {transfers.length} Assets
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

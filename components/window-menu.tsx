"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Plus, Send, List, HelpCircle, ExternalLink, Flame } from "lucide-react"

interface WindowMenuProps {
  onNavigate: (tab: string) => void
  currentTab: string
}

export function WindowMenu({ onNavigate, currentTab }: WindowMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: "offers", label: "View Offers", icon: List, description: "Browse active swaps" },
    { id: "create", label: "Create Offer", icon: Plus, description: "Start a new swap" },
    { id: "batch", label: "Batch Send", icon: Send, description: "Send multiple assets" },
    { id: "game", label: "Play Game", icon: Flame, description: "Open packs & play", link: "/game" },
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-2 border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20 hover:border-orange-400 transition-all"
        >
          <Menu className="h-5 w-5 text-orange-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur border-2 border-orange-500/50">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-bold">
            VibEscrow Menu
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-orange-500/30" />

        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => {
              if (item.link) {
                window.location.href = item.link
              } else {
                onNavigate(item.id)
              }
              setIsOpen(false)
            }}
            className={`cursor-pointer ${
              currentTab === item.id ? "bg-orange-500/20 text-orange-400" : "hover:bg-orange-500/10"
            }`}
          >
            <item.icon className="h-4 w-4 mr-2" />
            <div className="flex flex-col">
              <span className="font-medium">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-orange-500/30" />

        <DropdownMenuItem asChild>
          <a
            href="https://vibe.market"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:bg-orange-500/10"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Vibe.market
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:bg-orange-500/10"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            BaseScan
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-orange-500/30" />

        <DropdownMenuItem className="cursor-pointer hover:bg-orange-500/10">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help & Support
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

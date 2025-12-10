// Contract configuration and ABIs for NFTSwapEscrow
export const CONTRACT_ADDRESS = "0x..." // TODO: Add your deployed contract address

export const BASE_RPC_URL = "https://mainnet.base.org"
export const BASE_CHAIN_ID = 8453

export const CONTRACT_ABI = [
  {
    inputs: [
      { name: "taker", type: "address" },
      {
        name: "offered",
        type: "tuple[]",
        components: [
          { name: "collection", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
      {
        name: "desired",
        type: "tuple",
        components: [
          { name: "collection", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
      { name: "deadline", type: "uint256" },
    ],
    name: "createOffer",
    outputs: [{ name: "offerId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "offerId", type: "uint256" }],
    name: "acceptOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "offerId", type: "uint256" }],
    name: "cancelOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "offerId", type: "uint256" }],
    name: "expireOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "offerId", type: "uint256" }],
    name: "getOffer",
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "maker", type: "address" },
          { name: "taker", type: "address" },
          { name: "offered", type: "tuple[]", components: [] },
          {
            name: "desired",
            type: "tuple",
            components: [
              { name: "collection", type: "address" },
              { name: "tokenId", type: "uint256" },
              { name: "amount", type: "uint256" },
            ],
          },
          { name: "deadline", type: "uint256" },
          { name: "status", type: "uint8" },
        ],
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "offerId", type: "uint256" }],
    name: "getOfferNFTs",
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "collection", type: "address" },
          { name: "tokenId", type: "uint256" },
          { name: "amount", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextOfferId",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "offerId", type: "uint256" },
      { indexed: true, name: "maker", type: "address" },
      { indexed: true, name: "taker", type: "address" },
      { indexed: false, name: "deadline", type: "uint256" },
    ],
    name: "OfferCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "offerId", type: "uint256" },
      { indexed: true, name: "taker", type: "address" },
    ],
    name: "OfferAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "offerId", type: "uint256" }],
    name: "OfferCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "offerId", type: "uint256" }],
    name: "OfferExpired",
    type: "event",
  },
] as const

export const ERC721_ABI = [
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "operator", type: "address" },
      { name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

// BoosterDrop ABI for Vibe.Market card tracking
export const BOOSTER_DROP_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "getTokenRarity",
    outputs: [
      { name: "rarity", type: "uint8" },
      { name: "randomValue", type: "uint256" },
      { name: "tokenSpecificRandomness", type: "bytes32" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export const BOOSTER_CARD_SEED_UTILS_ADDRESS = "0x002aaaa42354bf8f09f9924977bf0c531933f999"

export enum CardRarity {
  Common = 0,
  Uncommon = 1,
  Rare = 2,
  Epic = 3,
  Legendary = 4,
  Mythic = 5,
}

export const RARITY_LABELS: Record<CardRarity, string> = {
  [CardRarity.Common]: "Common",
  [CardRarity.Uncommon]: "Uncommon",
  [CardRarity.Rare]: "Rare",
  [CardRarity.Epic]: "Epic",
  [CardRarity.Legendary]: "Legendary",
  [CardRarity.Mythic]: "Mythic",
}

export const RARITY_COLORS: Record<CardRarity, string> = {
  [CardRarity.Common]: "bg-gray-500",
  [CardRarity.Uncommon]: "bg-green-500",
  [CardRarity.Rare]: "bg-blue-500",
  [CardRarity.Epic]: "bg-purple-500",
  [CardRarity.Legendary]: "bg-yellow-500",
  [CardRarity.Mythic]: "bg-gradient-to-r from-pink-500 to-orange-500",
}

export enum OfferStatus {
  Open = 0,
  Accepted = 1,
  Cancelled = 2,
  Expired = 3,
}

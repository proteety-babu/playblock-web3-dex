import { NetworkConfig, SupportedChainId } from "../types";

export const PLAYBLOCK_CHAIN_ID: SupportedChainId = 1829;
export const DEFAULT_PLAYBLOCK_RPC = "https://rpc.playblock.io";
export const DEFAULT_G_COIN_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

// Minimal ERC-20 ABI for standard token interactions & G Coin
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint amount) returns (bool)",
  "function transferFrom(address from, address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint amount)"
];

// Minimal ERC-721 ABI for NFT
export const ERC721_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function safeTransferFrom(address from, address to, uint256 tokenId) returns ()",
  "function approve(address to, uint256 tokenId) returns ()",
  "function setApprovalForAll(address operator, bool approved) returns ()",
  "function isApprovedForAll(address owner, address operator) view returns (bool)"
];

export const SUPPORTED_NETWORKS: Record<SupportedChainId, NetworkConfig> = {
  1829: {
    id: 1829,
    name: "PlayBlock Mainnet",
    shortName: "PlayBlock",
    nativeCurrency: {
      name: "PlayBlock Token",
      symbol: "PB",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.playblock.io", "https://playblock-rpc.gamefi.org"],
    blockExplorerUrls: ["https://explorer.playblock.io"],
    icon: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=64&h=64&fit=crop",
    color: "emerald",
    gasPriceGwei: 0.1,
  },
  1: {
    id: 1,
    name: "Ethereum Mainnet",
    shortName: "Ethereum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://cloudflare-eth.com", "https://rpc.ankr.com/eth"],
    blockExplorerUrls: ["https://etherscan.io"],
    icon: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=64&h=64&fit=crop",
    color: "blue",
    gasPriceGwei: 15,
  },
  137: {
    id: 137,
    name: "Polygon PoS",
    shortName: "Polygon",
    nativeCurrency: {
      name: "POL",
      symbol: "POL",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com", "https://rpc.ankr.com/polygon"],
    blockExplorerUrls: ["https://polygonscan.com"],
    icon: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=64&h=64&fit=crop",
    color: "purple",
    gasPriceGwei: 30,
  },
  42161: {
    id: 42161,
    name: "Arbitrum One",
    shortName: "Arbitrum",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
    icon: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=64&h=64&fit=crop",
    color: "cyan",
    gasPriceGwei: 0.05,
  },
  56: {
    id: 56,
    name: "BNB Smart Chain",
    shortName: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    icon: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=64&h=64&fit=crop",
    color: "amber",
    gasPriceGwei: 3,
  },
  8453: {
    id: 8453,
    name: "Base Mainnet",
    shortName: "Base",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
    icon: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop",
    color: "indigo",
    gasPriceGwei: 0.02,
  },
  11155111: {
    id: 11155111,
    name: "Sepolia Testnet",
    shortName: "Sepolia",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "SepoliaETH",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    icon: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop",
    isTestnet: true,
    color: "rose",
    gasPriceGwei: 1.5,
  },
};

import { NFTItem, Token, TokenAllowance, MarketCandle, OrderBookEntry } from "../types";

export const INITIAL_TOKENS: Token[] = [
  {
    id: "g-coin-1829",
    symbol: "G",
    name: "PlayBlock G-Coin",
    decimals: 18,
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    chainId: 1829,
    balance: "1250.00",
    priceUsd: 1.48,
    change24h: 8.42,
    icon: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=64&h=64&fit=crop",
    isGCoin: true,
  },
  {
    id: "pb-native-1829",
    symbol: "PB",
    name: "PlayBlock Native",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000",
    chainId: 1829,
    balance: "45.80",
    priceUsd: 2.15,
    change24h: 3.12,
    icon: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=64&h=64&fit=crop",
    isNative: true,
  },
  {
    id: "eth-1",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    balance: "1.42",
    priceUsd: 3480.50,
    change24h: 2.74,
    icon: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=64&h=64&fit=crop",
    isNative: true,
  },
  {
    id: "usdt-1829",
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    chainId: 1829,
    balance: "3500.00",
    priceUsd: 1.00,
    change24h: 0.01,
    icon: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=64&h=64&fit=crop",
  },
  {
    id: "usdc-1829",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    chainId: 1829,
    balance: "1200.50",
    priceUsd: 1.00,
    change24h: -0.02,
    icon: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=64&h=64&fit=crop",
  },
  {
    id: "matic-137",
    symbol: "POL",
    name: "Polygon Ecosystem",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000",
    chainId: 137,
    balance: "680.00",
    priceUsd: 0.54,
    change24h: -1.85,
    icon: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop",
    isNative: true,
  },
  {
    id: "bnb-56",
    symbol: "BNB",
    name: "BNB Chain",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000",
    chainId: 56,
    balance: "2.10",
    priceUsd: 592.30,
    change24h: 1.45,
    icon: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=64&h=64&fit=crop",
    isNative: true,
  },
  {
    id: "btc-1",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    chainId: 1,
    balance: "0.12",
    priceUsd: 68450.00,
    change24h: 4.15,
    icon: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop",
  }
];

export const INITIAL_NFTS: NFTItem[] = [
  {
    id: "nft-01",
    tokenId: 1042,
    name: "Cyber Samurai #1042",
    collection: "PlayBlock CyberPunks",
    collectionId: "cyberpunk",
    creator: "0x3A21...7e91",
    owner: "0x71C...4e89",
    price: 450,
    currency: "G",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop",
    description: "Legendary cybernetic warrior with dark titanium armor and dual plasma katanas. Level 99 in PlayBlock Metaverse arena.",
    attributes: [
      { trait_type: "Class", value: "Shinobi Warrior", rarityPercentage: 3.2 },
      { trait_type: "Weapon", value: "Dual Plasma Katana", rarityPercentage: 1.5 },
      { trait_type: "Armor", value: "Obsidian Plated", rarityPercentage: 6.8 },
      { trait_type: "Power Level", value: 9800, rarityPercentage: 0.9 },
    ],
    isListed: true,
    highestBid: 420,
    lastSoldPrice: 380,
    chainId: 1829,
    verifiedCreator: true,
    likes: 142,
    history: [
      {
        id: "h1",
        event: "LIST",
        from: "0x71C...4e89",
        to: "Marketplace",
        price: 450,
        currency: "G",
        timestamp: Date.now() - 3600000 * 4,
        txHash: "0x391e...90af",
      },
      {
        id: "h2",
        event: "SALE",
        from: "0x3A21...7e91",
        to: "0x71C...4e89",
        price: 380,
        currency: "G",
        timestamp: Date.now() - 86400000 * 3,
        txHash: "0x82b1...14ca",
      },
    ],
  },
  {
    id: "nft-02",
    tokenId: 201,
    name: "Genesis Beast Alpha #201",
    collection: "Genesis Beasts",
    collectionId: "genesis",
    creator: "0x98F4...21a0",
    owner: "0x42E...998b",
    price: 850,
    currency: "G",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&h=600&fit=crop",
    description: "An ancient mythical beast resurrected inside the neural grid. Grants 2.5x staking boost in PlayBlock DAO vaults.",
    attributes: [
      { trait_type: "Species", value: "Hydra Chimera", rarityPercentage: 2.1 },
      { trait_type: "Element", value: "Neon Thunder", rarityPercentage: 4.5 },
      { trait_type: "Staking APY Boost", value: "+250%", rarityPercentage: 1.1 },
    ],
    isListed: true,
    highestBid: 800,
    lastSoldPrice: 720,
    chainId: 1829,
    verifiedCreator: true,
    likes: 218,
    history: [
      {
        id: "h3",
        event: "LIST",
        from: "0x42E...998b",
        to: "Marketplace",
        price: 850,
        currency: "G",
        timestamp: Date.now() - 3600000 * 8,
        txHash: "0x47b2...99ee",
      },
    ],
  },
  {
    id: "nft-03",
    tokenId: 88,
    name: "Metaverse Penthouse Parcel #88",
    collection: "Metaverse Real Estate",
    collectionId: "metaverse",
    creator: "0xPlayBlockLand",
    owner: "0x111...7777",
    price: 1500,
    currency: "G",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop",
    description: "Prime sky-district virtual penthouse overlooking Neo-Tokyo with interactive streaming lounge and NFT art gallery.",
    attributes: [
      { trait_type: "District", value: "Skyline Sector 01", rarityPercentage: 1.0 },
      { trait_type: "Floor Area", value: "1,200 sq m", rarityPercentage: 5.0 },
      { trait_type: "Revenue Share", value: "3.5% Land Tax", rarityPercentage: 2.0 },
    ],
    isListed: true,
    highestBid: 1400,
    lastSoldPrice: 1250,
    chainId: 1829,
    verifiedCreator: true,
    likes: 389,
    history: [],
  },
  {
    id: "nft-04",
    tokenId: 704,
    name: "Neon Mech Dreadnought #704",
    collection: "GameFi Weapons",
    collectionId: "gamefi",
    creator: "0xMechStudio",
    owner: "0x89A...33ff",
    price: 320,
    currency: "G",
    image: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=600&h=600&fit=crop",
    description: "Heavy assault mech armed with railgun and electromagnetic pulse shield. Fully playable in PvP battlegrounds.",
    attributes: [
      { trait_type: "Class", value: "Heavy Titan", rarityPercentage: 4.8 },
      { trait_type: "Firepower", value: "480 DPS", rarityPercentage: 3.5 },
      { trait_type: "Shield Capacity", value: "10,000 HP", rarityPercentage: 2.9 },
    ],
    isListed: true,
    highestBid: 290,
    lastSoldPrice: 280,
    chainId: 1829,
    verifiedCreator: true,
    likes: 95,
    history: [],
  }
];

export const INITIAL_ALLOWANCES: TokenAllowance[] = [
  {
    id: "al-1",
    tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    tokenSymbol: "USDT",
    tokenName: "Tether USD",
    spenderAddress: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    spenderName: "Uniswap V3 Router",
    allowance: "Unlimited",
    riskLevel: "SAFE",
    riskReason: "Verified official Uniswap DEX contract with audited immutable proxy.",
    lastUpdated: "2 days ago",
  },
  {
    id: "al-2",
    tokenAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    tokenSymbol: "G",
    tokenName: "PlayBlock G-Coin",
    spenderAddress: "0x1829DeaD00000000000000000000000000000000",
    spenderName: "PlayBlock Official DEX Pool",
    allowance: "Unlimited",
    riskLevel: "SAFE",
    riskReason: "PlayBlock native liquidity pool contract.",
    lastUpdated: "5 hours ago",
  },
  {
    id: "al-3",
    tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    tokenSymbol: "USDC",
    tokenName: "USD Coin",
    spenderAddress: "0x98A942F1e56b4f73D92857Cbf1517f4219bEbF9c",
    spenderName: "Unknown NFT Minting Contract",
    allowance: "Unlimited ($50,000 max)",
    riskLevel: "CRITICAL",
    riskReason: "Unverified third-party contract with unverified source code and drainer signature patterns!",
    lastUpdated: "18 days ago",
  }
];

export const SAMPLE_CONTRACTS = {
  vulnerableBank: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title VulnerableEtherBank
 * @notice WARNING: Contains critical Reentrancy and Unchecked Call vulnerabilities for demonstration
 */
contract VulnerableEtherBank {
    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    function deposit() external payable {
        require(msg.value > 0, "Zero deposit");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // CRITICAL: Reentrancy vulnerability (SWC-107) - State updated AFTER external call
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient funds");

        // Vulnerable external raw call before zeroing balance
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // State update happens too late!
        balances[msg.sender] -= amount;
        emit Withdraw(msg.sender, amount);
    }

    // Vulnerable tx.origin check for owner authorization (SWC-115)
    address public owner;
    function emergencyDrain() external {
        require(tx.origin == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }
}`,

  safeERC20: `// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PlayBlockSafeToken
 * @notice Audited production-grade ERC-20 token implementation with capped supply and reentrancy protection
 */
contract PlayBlockSafeToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M Max
    
    event TokensMinted(address indexed to, uint256 amount);

    constructor(address initialOwner) ERC20("PlayBlock Ecosystem", "PBG") Ownable(initialOwner) {
        _mint(initialOwner, 10_000_000 * 10**18); // 10% Initial circulating
    }

    function mint(address to, uint256 amount) external onlyOwner nonReentrant {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max cap");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
}`,

  honeypot: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MaliciousHoneypot
 * @notice WARNING: Scam token pattern with hidden sell fee and transfer block
 */
contract MaliciousHoneypot {
    string public name = "100x Moon Token";
    string public symbol = "MOON";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    
    address private deployer;
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) private blacklist;
    bool private tradingEnabled = true;

    constructor() {
        deployer = msg.sender;
        balanceOf[msg.sender] = totalSupply;
    }

    // Hidden Honeypot trap: Buyers can buy, but nobody except deployer can transfer or sell!
    function transfer(address to, uint256 amount) public returns (bool) {
        require(!blacklist[msg.sender], "Address blocked");
        if (msg.sender != deployer) {
            revert("Slippage error: Trading paused by admin");
        }
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}`
};

export const INITIAL_CANDLES: MarketCandle[] = [
  { timestamp: Date.now() - 3600000 * 24, time: "00:00", open: 1.32, high: 1.38, low: 1.30, close: 1.36, volume: 420000 },
  { timestamp: Date.now() - 3600000 * 20, time: "04:00", open: 1.36, high: 1.41, low: 1.34, close: 1.39, volume: 580000 },
  { timestamp: Date.now() - 3600000 * 16, time: "08:00", open: 1.39, high: 1.45, low: 1.37, close: 1.42, volume: 890000 },
  { timestamp: Date.now() - 3600000 * 12, time: "12:00", open: 1.42, high: 1.49, low: 1.40, close: 1.44, volume: 1250000 },
  { timestamp: Date.now() - 3600000 * 8, time: "16:00", open: 1.44, high: 1.52, low: 1.43, close: 1.49, volume: 1620000 },
  { timestamp: Date.now() - 3600000 * 4, time: "20:00", open: 1.49, high: 1.55, low: 1.46, close: 1.47, volume: 940000 },
  { timestamp: Date.now(), time: "Now", open: 1.47, high: 1.51, low: 1.45, close: 1.48, volume: 780000 },
];

export const INITIAL_ORDERBOOK: { bids: OrderBookEntry[]; asks: OrderBookEntry[] } = {
  bids: [
    { price: 1.478, amount: 14200, total: 20987.6 },
    { price: 1.475, amount: 28500, total: 42037.5 },
    { price: 1.470, amount: 55000, total: 80850.0 },
    { price: 1.465, amount: 92400, total: 135366.0 },
    { price: 1.460, amount: 140000, total: 204400.0 },
  ],
  asks: [
    { price: 1.482, amount: 18500, total: 27417.0 },
    { price: 1.485, amount: 32000, total: 47520.0 },
    { price: 1.490, amount: 64100, total: 95509.0 },
    { price: 1.495, amount: 89000, total: 133055.0 },
    { price: 1.500, amount: 185000, total: 277500.0 },
  ],
};

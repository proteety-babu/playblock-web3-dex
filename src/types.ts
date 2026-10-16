export type SupportedChainId = 1829 | 1 | 137 | 42161 | 56 | 8453 | 11155111;

export interface NetworkConfig {
  id: SupportedChainId;
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  icon: string;
  isTestnet?: boolean;
  color: string;
  gasPriceGwei: number;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  chainId: SupportedChainId;
  balance: string;
  priceUsd: number;
  change24h: number;
  icon: string;
  isNative?: boolean;
  isGCoin?: boolean;
}

export interface WalletAccount {
  address: string;
  label: string;
  mnemonic?: string;
  privateKey?: string;
  type: "injected" | "mnemonic" | "private_key" | "watch_only";
  createdAt: number;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  rarityPercentage?: number;
}

export interface NFTHistoryItem {
  id: string;
  event: "MINT" | "TRANSFER" | "LIST" | "SALE" | "BID";
  from: string;
  to: string;
  price?: number;
  currency?: string;
  timestamp: number;
  txHash: string;
}

export interface NFTItem {
  id: string;
  tokenId: number;
  name: string;
  collection: string;
  collectionId: string;
  creator: string;
  owner: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  attributes: NFTAttribute[];
  isListed: boolean;
  highestBid?: number;
  lastSoldPrice?: number;
  chainId: SupportedChainId;
  history: NFTHistoryItem[];
  verifiedCreator?: boolean;
  likes: number;
}

export interface TransactionRecord {
  id: string;
  hash: string;
  type: "SEND" | "RECEIVE" | "SWAP" | "MINT_NFT" | "BUY_NFT" | "SELL_NFT" | "APPROVE" | "REVOKE" | "FAUCET";
  from: string;
  to: string;
  amount: string;
  tokenSymbol: string;
  tokenIcon?: string;
  timestamp: number;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  chainId: SupportedChainId;
  gasFee: string;
  blockNumber?: number;
  note?: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL";
  swcId: string;
  description: string;
  impact: string;
  affectedLines: string;
  remediation: string;
  fixedCodeSnippet?: string;
}

export interface GasOptimization {
  title: string;
  description: string;
  estimatedSavings: string;
  suggestion: string;
}

export interface SmartContractAuditResult {
  contractName: string;
  securityScore: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SECURE";
  summary: string;
  vulnerabilities: Vulnerability[];
  gasOptimizations: GasOptimization[];
  architectureQuality: {
    testCoverageRecommendation: string;
    accessControlAudit: string;
    upgradeabilitySafety: string;
  };
  verdict: string;
  timestamp: number;
  auditedBy: "PlayBlock AI Guardian Engine" | "Gemini 3.7 Flash";
}

export interface TokenAllowance {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  spenderAddress: string;
  spenderName: string;
  allowance: string; // e.g. "Unlimited" or "5000 USDT"
  riskLevel: "SAFE" | "WARNING" | "CRITICAL";
  riskReason: string;
  lastUpdated: string;
}

export interface MarketCandle {
  timestamp: number;
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface MarketInsightData {
  trend: "BULLISH" | "BEARISH" | "NEUTRAL";
  strengthScore: number;
  supportLevels: string[];
  resistanceLevels: string[];
  technicalSignals: {
    rsi: string;
    macd: string;
    emaCrossing: string;
    volumeProfile: string;
  };
  keyCatalysts: string[];
  tradingStrategy: string;
  riskWarning: string;
}

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  SupportedChainId, 
  Token, 
  NFTItem, 
  TransactionRecord, 
  TokenAllowance, 
  WalletAccount 
} from "../types";
import { 
  PLAYBLOCK_CHAIN_ID, 
  SUPPORTED_NETWORKS, 
  DEFAULT_G_COIN_ADDRESS 
} from "../config/constants";
import { 
  INITIAL_TOKENS, 
  INITIAL_NFTS, 
  INITIAL_ALLOWANCES 
} from "../data/mockData";
import { 
  translations, 
  Language 
} from "../data/translations";
import { 
  generateRandomWallet, 
  importWalletFromPhrase, 
  importWalletFromPrivateKey,
  fetchNativeBalance,
  fetchTokenBalance
} from "../utils/blockchain";
import confetti from "canvas-confetti";

interface WalletContextType {
  account: WalletAccount | null;
  accounts: WalletAccount[];
  isConnected: boolean;
  activeChainId: SupportedChainId;
  tokens: Token[];
  nfts: NFTItem[];
  transactions: TransactionRecord[];
  allowances: TokenAllowance[];
  language: Language;
  t: typeof translations.en;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setLanguage: (lang: Language) => void;
  switchChain: (chainId: SupportedChainId) => void;
  createWallet: () => { mnemonic: string; address: string };
  importFromMnemonic: (mnemonic: string) => boolean;
  importFromPrivateKey: (privateKey: string) => boolean;
  connectInjected: () => Promise<boolean>;
  disconnect: () => void;
  selectAccount: (address: string) => void;
  claimFaucet: () => Promise<boolean>;
  sendToken: (to: string, amount: string, tokenSymbol: string) => Promise<boolean>;
  swapTokens: (fromSymbol: string, toSymbol: string, fromAmount: string, toAmount: string) => Promise<boolean>;
  mintNFT: (name: string, description: string, price: number, image: string, category: string) => Promise<NFTItem>;
  buyNFT: (nftId: string) => Promise<boolean>;
  listNFT: (nftId: string, price: number) => Promise<boolean>;
  revokeAllowance: (id: string) => Promise<boolean>;
  clearError: () => void;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCOUNTS: "playblock_accounts_v1",
  ACTIVE_ADDR: "playblock_active_address_v1",
  TRANSACTIONS: "playblock_txs_v1",
  NFTS: "playblock_nfts_v1",
  TOKENS: "playblock_tokens_v1",
  ALLOWANCES: "playblock_allowances_v1",
  CHAIN_ID: "playblock_chain_id_v1",
  LANG: "playblock_lang_v1",
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || "bn";
  });

  const [activeChainId, setActiveChainId] = useState<SupportedChainId>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAIN_ID);
    return saved ? (Number(saved) as SupportedChainId) : PLAYBLOCK_CHAIN_ID;
  });

  const [accounts, setAccounts] = useState<WalletAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error loading accounts:", e);
    }
    // Default initial demonstration wallet
    const demo = {
      address: "0x71C84050D17929437435a4d447784013444e4e89",
      label: "PlayBlock Main Vault",
      mnemonic: "crystal galaxy harvest quantum dynamic velocity cyber vortex whisper orbit puzzle neon",
      type: "mnemonic" as const,
      createdAt: Date.now() - 86400000 * 7,
    };
    return [demo];
  });

  const [activeAddress, setActiveAddress] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_ADDR) || "0x71C84050D17929437435a4d447784013444e4e89";
  });

  const [tokens, setTokens] = useState<Token[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TOKENS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TOKENS;
  });

  const [nfts, setNfts] = useState<NFTItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NFTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NFTS;
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "tx-init-1",
        hash: "0x39a1c8f3e2b910471b6920f381ad729c48ef11b7a210d7a048a609d43100ae81",
        type: "RECEIVE",
        from: "0xPlayBlockFaucet",
        to: "0x71C84050D17929437435a4d447784013444e4e89",
        amount: "1250",
        tokenSymbol: "G",
        timestamp: Date.now() - 3600000 * 5,
        status: "CONFIRMED",
        chainId: 1829,
        gasFee: "0.0001 PB",
        note: "Initial Genesis Drop",
      }
    ];
  });

  const [allowances, setAllowances] = useState<TokenAllowance[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALLOWANCES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ALLOWANCES;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (activeAddress) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ADDR, activeAddress);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ADDR);
    }
  }, [activeAddress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NFTS, JSON.stringify(nfts));
  }, [nfts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALLOWANCES, JSON.stringify(allowances));
  }, [allowances]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAIN_ID, String(activeChainId));
  }, [activeChainId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  const activeAccount = accounts.find((a) => a.address.toLowerCase() === activeAddress?.toLowerCase()) || null;
  const isConnected = !!activeAccount;
  const t = translations[language];

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const switchChain = (chainId: SupportedChainId) => {
    setActiveChainId(chainId);
  };

  const clearError = () => setError(null);

  // Create a new BIP39 Mnemonic Wallet
  const createWallet = () => {
    try {
      const { address, mnemonic, privateKey } = generateRandomWallet();
      const newAcc: WalletAccount = {
        address,
        label: `Account ${accounts.length + 1}`,
        mnemonic,
        privateKey,
        type: "mnemonic",
        createdAt: Date.now(),
      };
      setAccounts((prev) => [...prev, newAcc]);
      setActiveAddress(address);
      return { mnemonic, address };
    } catch (err: any) {
      setError(err?.message || "Failed to create wallet");
      throw err;
    }
  };

  // Import wallet from mnemonic
  const importFromMnemonic = (mnemonic: string): boolean => {
    try {
      const { address, privateKey } = importWalletFromPhrase(mnemonic);
      const existing = accounts.find((a) => a.address.toLowerCase() === address.toLowerCase());
      if (existing) {
        setActiveAddress(existing.address);
        return true;
      }
      const newAcc: WalletAccount = {
        address,
        label: `Imported Seed (${address.slice(0, 6)})`,
        mnemonic: mnemonic.trim(),
        privateKey,
        type: "mnemonic",
        createdAt: Date.now(),
      };
      setAccounts((prev) => [...prev, newAcc]);
      setActiveAddress(address);
      return true;
    } catch (err: any) {
      setError(err?.message || "Invalid seed phrase");
      return false;
    }
  };

  // Import wallet from private key
  const importFromPrivateKey = (privateKey: string): boolean => {
    try {
      const { address, privateKey: pk } = importWalletFromPrivateKey(privateKey);
      const existing = accounts.find((a) => a.address.toLowerCase() === address.toLowerCase());
      if (existing) {
        setActiveAddress(existing.address);
        return true;
      }
      const newAcc: WalletAccount = {
        address,
        label: `Imported PK (${address.slice(0, 6)})`,
        privateKey: pk,
        type: "private_key",
        createdAt: Date.now(),
      };
      setAccounts((prev) => [...prev, newAcc]);
      setActiveAddress(address);
      return true;
    } catch (err: any) {
      setError(err?.message || "Invalid private key");
      return false;
    }
  };

  // Connect injected Web3 provider (MetaMask, OKX, etc.)
  const connectInjected = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const eth = (window as any).ethereum;
        const accountsList = await eth.request({ method: "eth_requestAccounts" });
        if (accountsList && accountsList.length > 0) {
          const addr = accountsList[0];
          const existing = accounts.find((a) => a.address.toLowerCase() === addr.toLowerCase());
          if (!existing) {
            const newAcc: WalletAccount = {
              address: addr,
              label: "Injected Web3 Wallet",
              type: "injected",
              createdAt: Date.now(),
            };
            setAccounts((prev) => [...prev, newAcc]);
          }
          setActiveAddress(addr);
          setIsLoading(false);
          return true;
        }
      }
      // If no injected provider in iframe, use active or fallback demo
      if (accounts.length > 0) {
        setActiveAddress(accounts[0].address);
      } else {
        createWallet();
      }
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || "Failed to connect injected wallet");
      setIsLoading(false);
      return false;
    }
  };

  const disconnect = () => {
    setActiveAddress(null);
  };

  const selectAccount = (address: string) => {
    setActiveAddress(address);
  };

  // Claim 100 G-Coin test tokens
  const claimFaucet = async (): Promise<boolean> => {
    if (!activeAccount) {
      setError("Please connect a wallet first.");
      return false;
    }
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setTokens((prev) =>
        prev.map((t) => {
          if (t.isGCoin || t.symbol === "G") {
            const cur = parseFloat(t.balance) || 0;
            return { ...t, balance: (cur + 100).toFixed(2) };
          }
          return t;
        })
      );

      const newTx: TransactionRecord = {
        id: `tx-faucet-${Date.now()}`,
        hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        type: "FAUCET",
        from: "0xPlayBlockFaucetContract",
        to: activeAccount.address,
        amount: "100",
        tokenSymbol: "G",
        timestamp: Date.now(),
        status: "CONFIRMED",
        chainId: 1829,
        gasFee: "0.00 PB",
        note: "Faucet Token Drop (+100 G-Coin)",
      };

      setTransactions((prev) => [newTx, ...prev]);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError("Faucet request failed: " + err.message);
      setIsLoading(false);
      return false;
    }
  };

  // Send Token transfer
  const sendToken = async (to: string, amount: string, tokenSymbol: string): Promise<boolean> => {
    if (!activeAccount) {
      setError("Wallet not connected");
      return false;
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    const targetToken = tokens.find((t) => t.symbol.toUpperCase() === tokenSymbol.toUpperCase());
    if (!targetToken) {
      setError("Token not found");
      return false;
    }

    const currentBal = parseFloat(targetToken.balance) || 0;
    if (currentBal < val) {
      setError(`Insufficient balance. You have ${currentBal} ${tokenSymbol}`);
      return false;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));

      setTokens((prev) =>
        prev.map((t) => {
          if (t.symbol.toUpperCase() === tokenSymbol.toUpperCase()) {
            return { ...t, balance: (currentBal - val).toFixed(4) };
          }
          return t;
        })
      );

      const newTx: TransactionRecord = {
        id: `tx-send-${Date.now()}`,
        hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        type: "SEND",
        from: activeAccount.address,
        to,
        amount,
        tokenSymbol,
        timestamp: Date.now(),
        status: "CONFIRMED",
        chainId: activeChainId,
        gasFee: "0.0002 PB",
        note: `Sent ${amount} ${tokenSymbol}`,
      };

      setTransactions((prev) => [newTx, ...prev]);

      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError("Transfer failed: " + err.message);
      setIsLoading(false);
      return false;
    }
  };

  // Swap Tokens on DEX
  const swapTokens = async (
    fromSymbol: string,
    toSymbol: string,
    fromAmount: string,
    toAmount: string
  ): Promise<boolean> => {
    if (!activeAccount) {
      setError("Wallet not connected");
      return false;
    }
    const valFrom = parseFloat(fromAmount);
    const valTo = parseFloat(toAmount);

    if (isNaN(valFrom) || valFrom <= 0) {
      setError("Invalid swap amount");
      return false;
    }

    const fromToken = tokens.find((t) => t.symbol.toUpperCase() === fromSymbol.toUpperCase());
    const toToken = tokens.find((t) => t.symbol.toUpperCase() === toSymbol.toUpperCase());

    if (!fromToken || !toToken) {
      setError("Token pair not supported");
      return false;
    }

    const fromBal = parseFloat(fromToken.balance) || 0;
    if (fromBal < valFrom) {
      setError(`Insufficient ${fromSymbol} balance.`);
      return false;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1400));

      setTokens((prev) =>
        prev.map((t) => {
          if (t.symbol.toUpperCase() === fromSymbol.toUpperCase()) {
            return { ...t, balance: (parseFloat(t.balance) - valFrom).toFixed(4) };
          }
          if (t.symbol.toUpperCase() === toSymbol.toUpperCase()) {
            return { ...t, balance: (parseFloat(t.balance) + valTo).toFixed(4) };
          }
          return t;
        })
      );

      const newTx: TransactionRecord = {
        id: `tx-swap-${Date.now()}`,
        hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        type: "SWAP",
        from: activeAccount.address,
        to: "0xPlayBlockDEXAggregatorRouter",
        amount: `${fromAmount} ${fromSymbol} -> ${toAmount} ${toSymbol}`,
        tokenSymbol: `${fromSymbol}/${toSymbol}`,
        timestamp: Date.now(),
        status: "CONFIRMED",
        chainId: activeChainId,
        gasFee: "0.0004 PB",
        note: `DEX Swap ${fromAmount} ${fromSymbol} to ${toAmount} ${toSymbol}`,
      };

      setTransactions((prev) => [newTx, ...prev]);

      try {
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      } catch (e) {}

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError("Swap failed: " + err.message);
      setIsLoading(false);
      return false;
    }
  };

  // Mint NFT
  const mintNFT = async (
    name: string,
    description: string,
    price: number,
    image: string,
    category: string
  ): Promise<NFTItem> => {
    if (!activeAccount) {
      setError("Please connect wallet first");
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));

      const newId = `nft-${Date.now()}`;
      const tokenId = Math.floor(Math.random() * 9000) + 1000;
      const createdItem: NFTItem = {
        id: newId,
        tokenId,
        name,
        collection: category || "PlayBlock User Creations",
        collectionId: category.toLowerCase().replace(/\s+/g, "-"),
        creator: activeAccount.address,
        owner: activeAccount.address,
        price,
        currency: "G",
        image: image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop",
        description,
        attributes: [
          { trait_type: "Origin", value: "PlayBlock Studio Mint" },
          { trait_type: "Rarity Tier", value: "Legendary", rarityPercentage: 2.5 },
          { trait_type: "Mint Edition", value: `#${tokenId}` },
        ],
        isListed: true,
        chainId: activeChainId,
        verifiedCreator: true,
        likes: 1,
        history: [
          {
            id: `h-${Date.now()}`,
            event: "MINT",
            from: "0x0000000000000000000000000000000000000000",
            to: activeAccount.address,
            price,
            currency: "G",
            timestamp: Date.now(),
            txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          },
        ],
      };

      setNfts((prev) => [createdItem, ...prev]);

      const newTx: TransactionRecord = {
        id: `tx-mint-${Date.now()}`,
        hash: createdItem.history[0].txHash,
        type: "MINT_NFT",
        from: activeAccount.address,
        to: "0xPlayBlockNFTFactory",
        amount: `Token #${tokenId}`,
        tokenSymbol: "NFT",
        timestamp: Date.now(),
        status: "CONFIRMED",
        chainId: activeChainId,
        gasFee: "0.0008 PB",
        note: `Minted NFT: ${name}`,
      };

      setTransactions((prev) => [newTx, ...prev]);

      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}

      setIsLoading(false);
      return createdItem;
    } catch (err: any) {
      setError("NFT Minting failed: " + err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Buy NFT
  const buyNFT = async (nftId: string): Promise<boolean> => {
    if (!activeAccount) {
      setError("Please connect your wallet to purchase this NFT");
      return false;
    }

    const item = nfts.find((n) => n.id === nftId);
    if (!item) {
      setError("NFT item not found");
      return false;
    }

    if (item.owner.toLowerCase() === activeAccount.address.toLowerCase()) {
      setError("You already own this NFT!");
      return false;
    }

    const gCoinToken = tokens.find((t) => t.isGCoin || t.symbol === "G");
    const currentBalance = parseFloat(gCoinToken?.balance || "0");

    if (currentBalance < item.price) {
      setError(`Insufficient G-Coin balance! Price: ${item.price} G, Your Balance: ${currentBalance} G. Claim free tokens from Faucet.`);
      return false;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));

      // Deduct balance
      setTokens((prev) =>
        prev.map((t) => {
          if (t.isGCoin || t.symbol === "G") {
            return { ...t, balance: (currentBalance - item.price).toFixed(2) };
          }
          return t;
        })
      );

      // Transfer NFT ownership
      setNfts((prev) =>
        prev.map((n) => {
          if (n.id === nftId) {
            return {
              ...n,
              owner: activeAccount.address,
              isListed: false,
              lastSoldPrice: item.price,
              history: [
                {
                  id: `h-sale-${Date.now()}`,
                  event: "SALE",
                  from: item.owner,
                  to: activeAccount.address,
                  price: item.price,
                  currency: item.currency,
                  timestamp: Date.now(),
                  txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
                },
                ...n.history,
              ],
            };
          }
          return n;
        })
      );

      const newTx: TransactionRecord = {
        id: `tx-buynft-${Date.now()}`,
        hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        type: "BUY_NFT",
        from: activeAccount.address,
        to: item.owner,
        amount: `${item.price} ${item.currency}`,
        tokenSymbol: item.name,
        timestamp: Date.now(),
        status: "CONFIRMED",
        chainId: activeChainId,
        gasFee: "0.0006 PB",
        note: `Purchased NFT: ${item.name}`,
      };

      setTransactions((prev) => [newTx, ...prev]);

      try {
        confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}

      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError("Purchase failed: " + err.message);
      setIsLoading(false);
      return false;
    }
  };

  // List NFT for sale
  const listNFT = async (nftId: string, price: number): Promise<boolean> => {
    if (!activeAccount) return false;
    setNfts((prev) =>
      prev.map((n) => {
        if (n.id === nftId) {
          return {
            ...n,
            isListed: true,
            price,
            history: [
              {
                id: `h-list-${Date.now()}`,
                event: "LIST",
                from: activeAccount.address,
                to: "PlayBlock Marketplace",
                price,
                currency: "G",
                timestamp: Date.now(),
                txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
              },
              ...n.history,
            ],
          };
        }
        return n;
      })
    );
    return true;
  };

  // Revoke token allowance
  const revokeAllowance = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setAllowances((prev) => prev.filter((a) => a.id !== id));
    setIsLoading(false);
    return true;
  };

  const refreshBalances = useCallback(async () => {
    if (!activeAccount) return;
    try {
      const native = await fetchNativeBalance(activeAccount.address, activeChainId);
      if (parseFloat(native) > 0) {
        setTokens((prev) =>
          prev.map((t) => (t.isNative && t.chainId === activeChainId ? { ...t, balance: native } : t))
        );
      }
    } catch (e) {}
  }, [activeAccount, activeChainId]);

  return (
    <WalletContext.Provider
      value={{
        account: activeAccount,
        accounts,
        isConnected,
        activeChainId,
        tokens,
        nfts,
        transactions,
        allowances,
        language,
        t,
        isLoading,
        error,
        setLanguage,
        switchChain,
        createWallet,
        importFromMnemonic,
        importFromPrivateKey,
        connectInjected,
        disconnect,
        selectAccount,
        claimFaucet,
        sendToken,
        swapTokens,
        mintNFT,
        buyNFT,
        listNFT,
        revokeAllowance,
        clearError,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

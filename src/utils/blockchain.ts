import { JsonRpcProvider, Wallet, Contract, formatUnits, parseUnits, isAddress } from "ethers";
import { DEFAULT_G_COIN_ADDRESS, ERC20_ABI, SUPPORTED_NETWORKS } from "../config/constants";
import { SupportedChainId } from "../types";

export const getProvider = (chainId: SupportedChainId = 1829): JsonRpcProvider => {
  const config = SUPPORTED_NETWORKS[chainId] || SUPPORTED_NETWORKS[1829];
  const rpcUrl = config.rpcUrls[0] || "https://rpc.playblock.io";
  return new JsonRpcProvider(rpcUrl, {
    chainId: config.id,
    name: config.shortName,
  });
};

export const fetchNativeBalance = async (address: string, chainId: SupportedChainId = 1829): Promise<string> => {
  try {
    if (!isAddress(address)) return "0.00";
    const provider = getProvider(chainId);
    const rawBalance = await provider.getBalance(address);
    return formatUnits(rawBalance, 18);
  } catch (error) {
    console.warn("Native balance fetch fallback:", error);
    return "0.00";
  }
};

export const fetchTokenBalance = async (
  tokenAddress: string,
  walletAddress: string,
  chainId: SupportedChainId = 1829
): Promise<{ balance: string; decimals: number; symbol: string }> => {
  try {
    if (!isAddress(walletAddress) || !isAddress(tokenAddress)) {
      return { balance: "0.00", decimals: 18, symbol: "G" };
    }
    const provider = getProvider(chainId);
    const contract = new Contract(tokenAddress, ERC20_ABI, provider);

    const [rawBalance, decimals, symbol] = await Promise.all([
      contract.balanceOf(walletAddress).catch(() => 0n),
      contract.decimals().catch(() => 18),
      contract.symbol().catch(() => "G"),
    ]);

    return {
      balance: formatUnits(rawBalance, decimals),
      decimals: Number(decimals),
      symbol: String(symbol),
    };
  } catch (error) {
    console.warn("Token balance fetch fallback:", error);
    return { balance: "0.00", decimals: 18, symbol: "G" };
  }
};

export const generateRandomWallet = () => {
  const wallet = Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || "",
  };
};

export const importWalletFromPhrase = (phrase: string) => {
  const wallet = Wallet.fromPhrase(phrase.trim());
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || phrase.trim(),
  };
};

export const importWalletFromPrivateKey = (key: string) => {
  const formattedKey = key.trim().startsWith("0x") ? key.trim() : `0x${key.trim()}`;
  const wallet = new Wallet(formattedKey);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};

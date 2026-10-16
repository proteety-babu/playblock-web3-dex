import React from "react";
import { useWallet } from "../../context/WalletContext";
import { SUPPORTED_NETWORKS } from "../../config/constants";
import { formatUSD, formatCrypto, shortenAddress, formatTimestamp } from "../../utils/formatters";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Wallet, 
  ExternalLink,
  CodeXml,
  ChevronRight
} from "lucide-react";

interface DashboardViewProps {
  onOpenSendReceive: (mode: "send" | "receive", tokenSymbol?: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenWalletModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenSendReceive,
  onNavigateTab,
  onOpenWalletModal,
}) => {
  const { 
    account, 
    isConnected, 
    tokens, 
    nfts, 
    transactions, 
    activeChainId, 
    claimFaucet, 
    isLoading, 
    t 
  } = useWallet();

  const currentNetwork = SUPPORTED_NETWORKS[activeChainId] || SUPPORTED_NETWORKS[1829];

  // Calculate total portfolio USD value
  const totalPortfolioUSD = tokens.reduce((acc, tk) => {
    const bal = parseFloat(tk.balance) || 0;
    return acc + bal * tk.priceUsd;
  }, 0);

  const ownedNFTsCount = nfts.filter(
    (n) => account && n.owner.toLowerCase() === account.address.toLowerCase()
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Portfolio Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {t.wallet.balance}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {currentNetwork.name}
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
                {formatUSD(totalPortfolioUSD)}
              </h1>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+5.42% (24h)</span>
              </div>
            </div>

            {isConnected && account ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                <span>Active Address:</span>
                <span className="font-mono font-medium text-zinc-200">
                  {shortenAddress(account.address, 6)}
                </span>
                <span className="text-zinc-600">•</span>
                <span>{ownedNFTsCount} NFTs Collected</span>
              </div>
            ) : (
              <p className="mt-2 text-xs text-zinc-400">
                Connect your Web3 wallet or create a new PlayBlock vault to trade and transfer assets.
              </p>
            )}
          </div>

          {/* Action Button Strip */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {isConnected ? (
              <>
                <button
                  id="dashboard-send-btn"
                  onClick={() => onOpenSendReceive("send")}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  <span>{t.wallet.send}</span>
                </button>

                <button
                  id="dashboard-receive-btn"
                  onClick={() => onOpenSendReceive("receive")}
                  className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/90 px-4 py-2.5 text-xs font-bold text-zinc-100 hover:bg-zinc-700 transition-all"
                >
                  <ArrowDownLeft className="h-4 w-4" />
                  <span>{t.wallet.receive}</span>
                </button>

                <button
                  id="dashboard-swap-btn"
                  onClick={() => onNavigateTab("swap")}
                  className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/90 px-4 py-2.5 text-xs font-bold text-zinc-100 hover:bg-zinc-700 transition-all"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>{t.wallet.swap}</span>
                </button>

                <button
                  id="dashboard-faucet-btn"
                  onClick={claimFaucet}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40 transition-all"
                >
                  <Flame className="h-4 w-4 text-emerald-400" />
                  <span>+100 G</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenWalletModal}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:brightness-110"
              >
                <Wallet className="h-4 w-4" />
                <span>{t.wallet.connect}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Navigation Highlights Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Swap */}
        <div
          onClick={() => onNavigateTab("swap")}
          className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-emerald-500/40 hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-emerald-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-zinc-100">{t.swap.title}</h3>
          <p className="mt-1 text-xs text-zinc-400">Zero slippage PlayBlock DEX aggregator & router</p>
        </div>

        {/* Card 2: NFT Market */}
        <div
          onClick={() => onNavigateTab("nft")}
          className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-emerald-500/40 hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-zinc-100">{t.nft.title}</h3>
          <p className="mt-1 text-xs text-zinc-400">Trade rare GameFi avatars, land & collectibles</p>
        </div>

        {/* Card 3: Smart Contract Audit */}
        <div
          onClick={() => onNavigateTab("audit")}
          className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-emerald-500/40 hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <CodeXml className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-bold text-purple-300">
                AI SCAN
              </span>
              <ChevronRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-purple-400" />
            </div>
          </div>
          <h3 className="mt-4 text-sm font-semibold text-zinc-100">{t.audit.title}</h3>
          <p className="mt-1 text-xs text-zinc-400">Gemini 3.7 Flash powered vulnerability checker</p>
        </div>

        {/* Card 4: Security Shield */}
        <div
          onClick={() => onNavigateTab("security")}
          className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:border-emerald-500/40 hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-blue-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-zinc-100">{t.security.title}</h3>
          <p className="mt-1 text-xs text-zinc-400">Manage token approvals & revoke risky spenders</p>
        </div>
      </div>

      {/* Main Content Split: Token Balances Table & Recent Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Token Balances List (2 Cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Asset Balances</h2>
              <p className="text-xs text-zinc-400">Tokens held on PlayBlock & Multi-Chain Vault</p>
            </div>
            <button
              onClick={() => onNavigateTab("market")}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              View Market Rates →
            </button>
          </div>

          <div className="mt-4 divide-y divide-zinc-800/60">
            {tokens.map((tk) => {
              const balNum = parseFloat(tk.balance) || 0;
              const valUSD = balNum * tk.priceUsd;
              return (
                <div
                  key={tk.id}
                  className="flex items-center justify-between py-3.5 transition-colors hover:bg-zinc-900/40 rounded-xl px-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={tk.icon}
                      alt={tk.symbol}
                      className="h-10 w-10 rounded-full bg-zinc-800 object-cover ring-1 ring-zinc-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-100">{tk.name}</span>
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                          {tk.symbol}
                        </span>
                        {tk.isGCoin && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            Official Ecosystem
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span>{formatUSD(tk.priceUsd)}</span>
                        <span
                          className={`flex items-center text-[11px] font-semibold ${
                            tk.change24h >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {tk.change24h >= 0 ? "+" : ""}
                          {tk.change24h}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-zinc-100">
                        {tk.balance} {tk.symbol}
                      </div>
                      <div className="text-xs text-zinc-400">{formatUSD(valUSD)}</div>
                    </div>

                    <div className="hidden sm:flex gap-1.5">
                      <button
                        onClick={() => onOpenSendReceive("send", tk.symbol)}
                        className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                      >
                        Send
                      </button>
                      <button
                        onClick={() => onNavigateTab("swap")}
                        className="rounded-lg bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-zinc-700"
                      >
                        Swap
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions & Activity (1 Col) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">{t.wallet.history}</h2>
              <p className="text-xs text-zinc-400">Recent on-chain activities</p>
            </div>
            <Clock className="h-4 w-4 text-zinc-500" />
          </div>

          <div className="mt-4 space-y-3">
            {transactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                No transactions recorded yet.
              </div>
            ) : (
              transactions.slice(0, 6).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        tx.type === "SEND"
                          ? "bg-red-500/10 text-red-400"
                          : tx.type === "RECEIVE" || tx.type === "FAUCET"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : tx.type === "SWAP"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-purple-500/10 text-purple-400"
                      }`}
                    >
                      {tx.type === "SEND" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : tx.type === "RECEIVE" || tx.type === "FAUCET" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowLeftRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-zinc-200">
                          {tx.type} {tx.tokenSymbol}
                        </span>
                        <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[9px] font-semibold text-emerald-400">
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {shortenAddress(tx.hash, 4)} • {formatTimestamp(tx.timestamp)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs font-bold text-zinc-200">
                    {tx.type === "SEND" ? `-${tx.amount}` : `+${tx.amount}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

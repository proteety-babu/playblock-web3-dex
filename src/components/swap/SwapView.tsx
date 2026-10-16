import React, { useState, useEffect } from "react";
import { useWallet } from "../../context/WalletContext";
import { Token } from "../../types";
import { formatUSD, formatCrypto } from "../../utils/formatters";
import { 
  ArrowUpDown, 
  Settings2, 
  Zap, 
  ShieldCheck, 
  Info, 
  Check, 
  AlertCircle,
  RefreshCw,
  Layers
} from "lucide-react";

export const SwapView: React.FC = () => {
  const { 
    tokens, 
    isConnected, 
    swapTokens, 
    isLoading, 
    error, 
    clearError, 
    t 
  } = useWallet();

  const [fromTokenSymbol, setFromTokenSymbol] = useState("G");
  const [toTokenSymbol, setToTokenSymbol] = useState("USDT");
  const [fromAmount, setFromAmount] = useState("100");
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fromToken = tokens.find((t) => t.symbol === fromTokenSymbol) || tokens[0];
  const toToken = tokens.find((t) => t.symbol === toTokenSymbol) || tokens[3] || tokens[1];

  // Calculate rate
  const exchangeRate = fromToken && toToken && toToken.priceUsd > 0
    ? fromToken.priceUsd / toToken.priceUsd
    : 1;

  const toAmount = fromAmount && !isNaN(parseFloat(fromAmount))
    ? (parseFloat(fromAmount) * exchangeRate).toFixed(4)
    : "0.00";

  const priceImpact = 0.04; // 0.04% low price impact
  const minReceived = (parseFloat(toAmount || "0") * (1 - parseFloat(slippage) / 100)).toFixed(4);

  const handleFlip = () => {
    setFromTokenSymbol(toTokenSymbol);
    setToTokenSymbol(fromTokenSymbol);
  };

  const handleSetPercent = (pct: number) => {
    if (!fromToken) return;
    const bal = parseFloat(fromToken.balance) || 0;
    const calculated = (bal * pct).toFixed(4);
    setFromAmount(calculated);
  };

  const handleExecuteSwap = async () => {
    clearError();
    setSuccessMessage(null);
    const success = await swapTokens(fromToken.symbol, toToken.symbol, fromAmount, toAmount);
    if (success) {
      setSuccessMessage(`Successfully swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Title & Description */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
          {t.swap.title}
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          {t.swap.subtitle}
        </p>
      </div>

      {/* Main Swap Box */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header Controls */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-300">PlayBlock AMM DEX Aggregator</span>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>

        {/* Slippage Settings Drawer */}
        {showSettings && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/90 p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
              <span>{t.swap.slippage}</span>
              <span className="font-mono text-emerald-400">{slippage}%</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["0.1", "0.5", "1.0", "2.0"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={`rounded-lg py-1.5 text-xs font-semibold ${
                    slippage === s
                      ? "bg-emerald-500 text-zinc-950"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error / Success Banners */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-400 border border-emerald-500/20">
            <Check className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FROM CARD */}
        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{t.swap.youPay}</span>
            <div className="flex items-center gap-1.5">
              <span>Balance:</span>
              <span className="font-mono font-bold text-zinc-200">
                {fromToken.balance} {fromToken.symbol}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <input
              type="number"
              step="any"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl font-extrabold text-zinc-100 placeholder-zinc-600 focus:outline-none"
            />

            <select
              value={fromTokenSymbol}
              onChange={(e) => setFromTokenSymbol(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-100 focus:outline-none cursor-pointer"
            >
              {tokens.map((tk) => (
                <option key={tk.id} value={tk.symbol} className="bg-zinc-900 text-zinc-100">
                  {tk.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              ≈ {formatUSD(parseFloat(fromAmount || "0") * fromToken.priceUsd)}
            </span>
            <div className="flex gap-1">
              {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handleSetPercent(pct)}
                  className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 hover:bg-zinc-700 hover:text-emerald-400"
                >
                  {pct === 1.0 ? "MAX" : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Swap Flip Button */}
        <div className="relative my-2 flex justify-center">
          <button
            onClick={handleFlip}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-emerald-400 shadow-md hover:bg-zinc-700 transition-transform active:rotate-180"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>

        {/* TO CARD */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{t.swap.youReceive}</span>
            <div className="flex items-center gap-1.5">
              <span>Balance:</span>
              <span className="font-mono font-bold text-zinc-200">
                {toToken.balance} {toToken.symbol}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <input
              type="text"
              readOnly
              value={toAmount}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl font-extrabold text-emerald-400 placeholder-zinc-600 focus:outline-none"
            />

            <select
              value={toTokenSymbol}
              onChange={(e) => setToTokenSymbol(e.target.value)}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-100 focus:outline-none cursor-pointer"
            >
              {tokens.map((tk) => (
                <option key={tk.id} value={tk.symbol} className="bg-zinc-900 text-zinc-100">
                  {tk.symbol}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 text-left">
            <span className="text-[11px] text-zinc-500">
              ≈ {formatUSD(parseFloat(toAmount || "0") * toToken.priceUsd)}
            </span>
          </div>
        </div>

        {/* Rate & Route Details */}
        <div className="mt-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Rate</span>
            <span className="font-mono font-medium text-zinc-200">
              1 {fromToken.symbol} = {exchangeRate.toFixed(4)} {toToken.symbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span>{t.swap.priceImpact}</span>
            <span className="font-semibold text-emerald-400">&lt; 0.05% (Optimal)</span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span>{t.swap.minimumReceived}</span>
            <span className="font-mono text-zinc-200">
              {minReceived} {toToken.symbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <span>{t.swap.route}</span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-cyan-400">
              <span>{fromToken.symbol}</span>
              <span>→</span>
              <span className="text-emerald-400">PlayBlock DEX V3</span>
              <span>→</span>
              <span>{toToken.symbol}</span>
            </span>
          </div>
        </div>

        {/* Execute Button */}
        <button
          onClick={handleExecuteSwap}
          disabled={isLoading || !fromAmount || parseFloat(fromAmount) <= 0}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Routing Liquidity on PlayBlock...</span>
            </div>
          ) : (
            <span>
              {t.swap.swapNow} ({fromToken.symbol} → {toToken.symbol})
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

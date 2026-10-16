import React, { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { SUPPORTED_NETWORKS } from "../../config/constants";
import { shortenAddress, formatCrypto } from "../../utils/formatters";
import { validateAddress } from "../../utils/security";
import { 
  Send, 
  QrCode, 
  Copy, 
  Check, 
  AlertCircle, 
  X, 
  ArrowUpRight, 
  Zap, 
  ExternalLink,
  Flame,
  CheckCircle2
} from "lucide-react";

interface SendReceiveModalProps {
  isOpen: boolean;
  mode: "send" | "receive";
  onClose: () => void;
  defaultTokenSymbol?: string;
}

export const SendReceiveModal: React.FC<SendReceiveModalProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  defaultTokenSymbol,
}) => {
  const { 
    account, 
    tokens, 
    activeChainId, 
    sendToken, 
    isLoading, 
    error, 
    clearError, 
    claimFaucet, 
    t 
  } = useWallet();

  const [mode, setMode] = useState<"send" | "receive">(initialMode);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(defaultTokenSymbol || "G");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [gasSpeed, setGasSpeed] = useState<"standard" | "fast" | "instant">("fast");
  const [copied, setCopied] = useState(false);
  const [txSuccessHash, setTxSuccessHash] = useState<string | null>(null);

  React.useEffect(() => {
    setMode(initialMode);
    setTxSuccessHash(null);
    clearError();
  }, [initialMode, isOpen]);

  if (!isOpen || !account) return null;

  const currentNetwork = SUPPORTED_NETWORKS[activeChainId] || SUPPORTED_NETWORKS[1829];
  const activeToken = tokens.find((t) => t.symbol.toUpperCase() === selectedTokenSymbol.toUpperCase()) || tokens[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetMax = () => {
    if (activeToken) {
      setAmount(activeToken.balance);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress(recipient)) {
      alert("Please enter a valid 0x EVM recipient address");
      return;
    }
    const success = await sendToken(recipient, amount, activeToken.symbol);
    if (success) {
      setTxSuccessHash(`0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header with Mode Toggle */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-1 rounded-xl bg-zinc-900 p-1 border border-zinc-800">
            <button
              onClick={() => {
                setMode("send");
                setTxSuccessHash(null);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                mode === "send" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
            <button
              onClick={() => {
                setMode("receive");
                setTxSuccessHash(null);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                mode === "receive" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span>Receive</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SEND MODE */}
        {mode === "send" && !txSuccessHash && (
          <form onSubmit={handleSend} className="mt-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Token Selector */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">Select Asset</label>
              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-2.5">
                <select
                  value={selectedTokenSymbol}
                  onChange={(e) => setSelectedTokenSymbol(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-zinc-100 focus:outline-none cursor-pointer"
                >
                  {tokens.map((tk) => (
                    <option key={tk.id} value={tk.symbol} className="bg-zinc-900 text-zinc-100">
                      {tk.name} ({tk.symbol})
                    </option>
                  ))}
                </select>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block">Available</span>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    {activeToken.balance} {activeToken.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipient Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300">Recipient Address</label>
                <button
                  type="button"
                  onClick={() => setRecipient("0x98A942F1e56b4f73D92857Cbf1517f4219bEbF9c")}
                  className="text-[10px] text-emerald-400 hover:underline"
                >
                  Paste Sample Address
                </button>
              </div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x... EVM address"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300">Amount</label>
                <button
                  type="button"
                  onClick={handleSetMax}
                  className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 hover:bg-zinc-700"
                >
                  MAX
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 pr-16 text-sm font-semibold text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-zinc-400">
                  {activeToken.symbol}
                </span>
              </div>
              {amount && (
                <div className="mt-1 text-right text-[11px] text-zinc-400">
                  ≈ ${(parseFloat(amount || "0") * activeToken.priceUsd).toFixed(2)} USD
                </div>
              )}
            </div>

            {/* Gas Speed Presets */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">Estimated Gas Speed</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGasSpeed("standard")}
                  className={`rounded-lg border p-2 text-center text-xs transition-colors ${
                    gasSpeed === "standard"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <div className="font-semibold">Standard</div>
                  <div className="text-[10px] text-zinc-500">~15s (0.0001 PB)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setGasSpeed("fast")}
                  className={`rounded-lg border p-2 text-center text-xs transition-colors ${
                    gasSpeed === "fast"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <div className="font-semibold">Fast ⚡</div>
                  <div className="text-[10px] text-zinc-500">~5s (0.0002 PB)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setGasSpeed("instant")}
                  className={`rounded-lg border p-2 text-center text-xs transition-colors ${
                    gasSpeed === "instant"
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <div className="font-semibold">Instant 🚀</div>
                  <div className="text-[10px] text-zinc-500">~1s (0.0004 PB)</div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Broadcasting to {currentNetwork.shortName}...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send {amount ? `${amount} ${activeToken.symbol}` : "Transaction"}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* SEND SUCCESS RECEIPT */}
        {mode === "send" && txSuccessHash && (
          <div className="mt-5 space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">Transaction Confirmed!</h3>
              <p className="text-xs text-zinc-400">
                Successfully sent {amount} {activeToken.symbol} to {shortenAddress(recipient, 4)}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 text-left">
              <div className="text-[10px] uppercase text-zinc-500 font-semibold">Transaction Hash</div>
              <div className="font-mono text-xs text-emerald-400 break-all">{txSuccessHash}</div>
              <div className="mt-2 flex justify-between text-xs text-zinc-400">
                <span>Network:</span>
                <span className="text-zinc-200">{currentNetwork.name}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTxSuccessHash(null);
                  setAmount("");
                  setRecipient("");
                }}
                className="flex-1 rounded-xl border border-zinc-800 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-900"
              >
                Send Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* RECEIVE MODE */}
        {mode === "receive" && (
          <div className="mt-5 space-y-5 text-center">
            {/* Visual QR Code Representation */}
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-500/40 bg-zinc-900/90 p-4 shadow-inner">
              <div className="grid grid-cols-6 gap-1.5 p-2 bg-zinc-950 rounded-xl">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-4 w-4 rounded-xs ${
                      (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                        ? "bg-emerald-400"
                        : i % 4 === 0
                        ? "bg-teal-500"
                        : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Your {currentNetwork.shortName} Address
              </div>
              <div className="mt-1 flex items-center justify-center gap-2 font-mono text-xs font-bold text-zinc-100 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
                <span className="break-all">{account.address}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Address Copied!" : "Copy Address"}</span>
              </button>
              <button
                onClick={claimFaucet}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/40"
              >
                <Flame className="h-4 w-4 text-emerald-400" />
                <span>+100 G</span>
              </button>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-left text-xs text-zinc-400">
              <p>
                Send only <strong>PlayBlock native tokens, G-Coin, or compatible ERC-20 assets</strong> to this address. Sending unsupported tokens may result in permanent loss.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

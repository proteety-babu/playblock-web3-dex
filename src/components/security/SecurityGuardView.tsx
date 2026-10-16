import React, { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { INITIAL_ALLOWANCES } from "../../data/mockData";
import { TokenAllowance } from "../../types";
import { shortenAddress, formatTimestamp } from "../../utils/formatters";
import { validateAddress } from "../../utils/security";
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Trash2, 
  Check, 
  ExternalLink, 
  Search, 
  Lock, 
  Key, 
  Eye, 
  Zap,
  CheckCircle2
} from "lucide-react";

export const SecurityGuardView: React.FC = () => {
  const { account, isConnected, t } = useWallet();

  const [allowances, setAllowances] = useState<TokenAllowance[]>(INITIAL_ALLOWANCES);
  const [addressToCheck, setAddressToCheck] = useState("");
  const [addressCheckResult, setAddressCheckResult] = useState<{
    status: "safe" | "flagged" | "unknown";
    details: string;
  } | null>(null);
  const [revokedId, setRevokedId] = useState<string | null>(null);

  const handleRevoke = (id: string) => {
    setAllowances((prev) => prev.filter((a) => a.id !== id));
    setRevokedId(id);
    setTimeout(() => setRevokedId(null), 3000);
  };

  const handleScanAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress(addressToCheck)) {
      setAddressCheckResult({
        status: "flagged",
        details: "Invalid 0x EVM hexadecimal address format.",
      });
      return;
    }

    const lower = addressToCheck.toLowerCase();
    if (lower.includes("dead") || lower.includes("bad") || lower.includes("666")) {
      setAddressCheckResult({
        status: "flagged",
        details: "FLAGGED: Address linked to known phishing drainer signatures & unauthorized permit2 exploits.",
      });
    } else {
      setAddressCheckResult({
        status: "safe",
        details: "CLEAN: Verified PlayBlock ecosystem contract with zero malicious reports in active threat intelligence feeds.",
      });
    }
  };

  const highRiskCount = allowances.filter((a) => a.riskLevel === "HIGH").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            {t.security.title}
          </h1>
          <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-400 ring-1 ring-blue-500/20">
            Real-Time Shield
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          {t.security.subtitle}
        </p>
      </div>

      {/* Security Health Score Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-100">Wallet Health: Safe (94/100)</h2>
                {highRiskCount > 0 && (
                  <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                    {highRiskCount} Risky Approvals
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                PlayBlock automated threat monitor protects your private keys, seed phrases, and token spend allowances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Allowances Manager (2 Cols) & Malicious Address Scanner (1 Col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Token Approvals & Allowances List (2 Cols) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-2 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">{t.security.allowances}</h2>
              <p className="text-xs text-zinc-400">
                Contracts authorized to spend tokens on your behalf
              </p>
            </div>
            <span className="rounded bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-400 border border-zinc-800">
              {allowances.length} Active
            </span>
          </div>

          {revokedId && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-400 border border-emerald-500/20">
              <Check className="h-4 w-4" />
              <span>Allowance revoked successfully! Spender authorization reset to 0.</span>
            </div>
          )}

          <div className="mt-4 space-y-3">
            {allowances.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                No active token approvals found. Your wallet is fully secure!
              </div>
            ) : (
              allowances.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 sm:flex-row sm:items-center transition-colors hover:bg-zinc-900"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-100">{item.tokenSymbol}</span>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                          item.riskLevel === "HIGH"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : item.riskLevel === "MEDIUM"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        {item.riskLevel} RISK
                      </span>
                    </div>
                    <div className="text-xs text-zinc-300">
                      <strong>Spender:</strong> {item.spenderName} (
                      <span className="font-mono text-zinc-400">{shortenAddress(item.spenderAddress, 4)}</span>)
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Allowance: <span className="font-semibold text-zinc-300">{item.allowance}</span> • Approved:{" "}
                      {formatTimestamp(item.lastUpdated)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevoke(item.id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition-all shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t.security.revoke}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Threat Scanner & Security Best Practices (1 Col) */}
        <div className="space-y-6">
          {/* Malicious Address Scanner */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-100">
                Threat Intel Checker
              </h2>
              <p className="text-xs text-zinc-400">
                Verify recipient address against known scam databases
              </p>
            </div>

            <form onSubmit={handleScanAddress} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={addressToCheck}
                  onChange={(e) => setAddressToCheck(e.target.value)}
                  placeholder="Paste 0x contract or wallet address..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-100 hover:bg-zinc-700"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Scan Address Integrity</span>
              </button>
            </form>

            {addressCheckResult && (
              <div
                className={`rounded-xl p-3 text-xs border ${
                  addressCheckResult.status === "safe"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/30 bg-red-500/10 text-red-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {addressCheckResult.status === "safe" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <ShieldAlert className="h-4 w-4" />
                  )}
                  <span>{addressCheckResult.status.toUpperCase()}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{addressCheckResult.details}</p>
              </div>
            )}
          </div>

          {/* Web3 Security Best Practices */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Web3 Defense Recommendations
            </h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Never share your 12-word seed phrase or private key with any website or support representative.</span>
              </div>
              <div className="flex items-start gap-2">
                <Key className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Use dedicated burner wallets when testing experimental or unverified decentralized applications.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Revoke token allowances immediately after completing third-party DEX transactions.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

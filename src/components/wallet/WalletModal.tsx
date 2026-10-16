import React, { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { shortenAddress } from "../../utils/formatters";
import { 
  Wallet, 
  Key, 
  FileText, 
  Copy, 
  Check, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  X, 
  Plus, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSendReceive: (mode: "send" | "receive") => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onOpenSendReceive }) => {
  const {
    account,
    accounts,
    isConnected,
    createWallet,
    importFromMnemonic,
    importFromPrivateKey,
    connectInjected,
    disconnect,
    selectAccount,
    t,
    tokens,
  } = useWallet();

  const [activeTab, setActiveTab] = useState<"accounts" | "create" | "import_seed" | "import_pk" | "backup">("accounts");
  const [newSeedPhrase, setNewSeedPhrase] = useState<string | null>(null);
  const [createdAddress, setCreatedAddress] = useState<string | null>(null);
  const [seedInput, setSeedInput] = useState("");
  const [pkInput, setPkInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [backupConfirmed, setBackupConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateNew = () => {
    try {
      const res = createWallet();
      setNewSeedPhrase(res.mnemonic);
      setCreatedAddress(res.address);
      setActiveTab("create");
      setBackupConfirmed(false);
      setErrorMsg("");
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to create wallet");
    }
  };

  const handleImportSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedInput.trim()) {
      setErrorMsg("Please enter a valid seed phrase");
      return;
    }
    const success = importFromMnemonic(seedInput);
    if (success) {
      setSeedInput("");
      setErrorMsg("");
      onClose();
    } else {
      setErrorMsg("Invalid seed phrase. Must be 12, 15, 18, or 24 valid words.");
    }
  };

  const handleImportPK = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkInput.trim()) {
      setErrorMsg("Please enter a valid private key");
      return;
    }
    const success = importFromPrivateKey(pkInput);
    if (success) {
      setPkInput("");
      setErrorMsg("");
      onClose();
    } else {
      setErrorMsg("Invalid 64-character hexadecimal private key.");
    }
  };

  const gCoinToken = tokens.find((t) => t.isGCoin || t.symbol === "G");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-100">
                {activeTab === "create"
                  ? "Save Your Recovery Phrase"
                  : activeTab === "import_seed"
                  ? "Import Mnemonic Seed"
                  : activeTab === "import_pk"
                  ? "Import Private Key"
                  : activeTab === "backup"
                  ? "Wallet Security Credentials"
                  : isConnected
                  ? "Multi-Wallet Management"
                  : "Connect / Create Web3 Wallet"}
              </h2>
              <p className="text-xs text-zinc-400">PlayBlock & EVM Compatible Key Vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* View 1: Main Accounts / Connect Options */}
        {activeTab === "accounts" && (
          <div className="mt-5 space-y-4">
            {isConnected && account && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-400">{account.label}</span>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-300">
                        {account.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-sm font-semibold text-zinc-100">
                      <span>{shortenAddress(account.address, 6)}</span>
                      <button
                        onClick={() => handleCopy(account.address)}
                        className="text-zinc-400 hover:text-emerald-400"
                        title="Copy full address"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Balance</div>
                    <div className="text-sm font-bold text-emerald-400">{gCoinToken?.balance || "0"} G</div>
                  </div>
                </div>

                {/* Quick actions inside wallet modal */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSendReceive("send");
                    }}
                    className="flex-1 rounded-lg bg-zinc-800 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSendReceive("receive");
                    }}
                    className="flex-1 rounded-lg bg-zinc-800 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
                  >
                    Receive
                  </button>
                  <button
                    onClick={() => setActiveTab("backup")}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
                  >
                    Export Key
                  </button>
                </div>
              </div>
            )}

            {/* Saved Accounts list */}
            {accounts.length > 1 && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Switch Saved Wallets ({accounts.length})
                </div>
                <div className="max-h-32 space-y-1.5 overflow-y-auto pr-1">
                  {accounts.map((acc) => {
                    const isCur = acc.address.toLowerCase() === account?.address.toLowerCase();
                    return (
                      <button
                        key={acc.address}
                        onClick={() => selectAccount(acc.address)}
                        className={`flex w-full items-center justify-between rounded-lg p-2.5 text-xs transition-colors ${
                          isCur
                            ? "border border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-400"
                            : "border border-zinc-800/80 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-left">
                          <div className="font-mono">{shortenAddress(acc.address, 5)}</div>
                          <span className="text-[10px] text-zinc-500">({acc.label})</span>
                        </div>
                        {isCur && <Check className="h-4 w-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Connect / Creation Options */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Wallet Connection Options
              </div>

              {/* Injected Browser Extension (MetaMask, OKX, etc.) */}
              <button
                onClick={async () => {
                  await connectInjected();
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs font-medium text-zinc-200 hover:border-emerald-500/50 hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-zinc-100">MetaMask / Injected Web3</div>
                    <div className="text-[10px] text-zinc-400">Auto-detect browser extensions & Web3 provider</div>
                  </div>
                </div>
                <span className="rounded bg-zinc-800 px-2 py-1 text-[10px] text-zinc-400">Browser</span>
              </button>

              {/* Create New Mnemonic Wallet */}
              <button
                onClick={handleCreateNew}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs font-medium text-zinc-200 hover:border-emerald-500/50 hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-zinc-100">Create New HD Wallet (12 Words)</div>
                    <div className="text-[10px] text-zinc-400">Generate fresh BIP39 seed phrase on PlayBlock</div>
                  </div>
                </div>
                <span className="rounded bg-emerald-500/20 px-2 py-1 text-[10px] text-emerald-400">Recommended</span>
              </button>

              {/* Import from Seed Phrase */}
              <button
                onClick={() => {
                  setErrorMsg("");
                  setActiveTab("import_seed");
                }}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs font-medium text-zinc-200 hover:border-emerald-500/50 hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-zinc-100">Import with Seed Phrase</div>
                    <div className="text-[10px] text-zinc-400">Restore using your 12 or 24-word recovery phrase</div>
                  </div>
                </div>
              </button>

              {/* Import with Private Key */}
              <button
                onClick={() => {
                  setErrorMsg("");
                  setActiveTab("import_pk");
                }}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs font-medium text-zinc-200 hover:border-emerald-500/50 hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Key className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-zinc-100">Import Private Key</div>
                    <div className="text-[10px] text-zinc-400">Directly load hex private key</div>
                  </div>
                </div>
              </button>
            </div>

            {isConnected && (
              <div className="pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    disconnect();
                    onClose();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.wallet.disconnect}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* View 2: Create Wallet Seed Display */}
        {activeTab === "create" && newSeedPhrase && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong>Write this phrase down on paper!</strong>
                <p className="mt-1 text-[11px] text-amber-400/90">
                  {t.wallet.saveSeedWarning}
                </p>
              </div>
            </div>

            <div className="relative rounded-xl border border-zinc-800 bg-zinc-900/90 p-4">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {newSeedPhrase.split(" ").map((word, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs font-mono"
                  >
                    <span className="text-[10px] text-zinc-500">{idx + 1}.</span>
                    <span className="font-medium text-emerald-400">{word}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleCopy(newSeedPhrase)}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Phrase"}</span>
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={backupConfirmed}
                onChange={(e) => setBackupConfirmed(e.target.checked)}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
              />
              <span>I have backed up my 12-word seed phrase securely. I understand nobody can recover my funds if lost.</span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveTab("accounts")}
                className="flex-1 rounded-xl border border-zinc-800 py-2.5 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
              >
                Back
              </button>
              <button
                disabled={!backupConfirmed}
                onClick={onClose}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-semibold text-zinc-950 disabled:opacity-50 hover:brightness-110"
              >
                Done & Open Wallet
              </button>
            </div>
          </div>
        )}

        {/* View 3: Import Mnemonic Form */}
        {activeTab === "import_seed" && (
          <form onSubmit={handleImportSeed} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                12 or 24-Word Recovery Phrase
              </label>
              <textarea
                rows={3}
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                placeholder="paste your secret words separated by spaces e.g. harvest quantum velocity..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("accounts")}
                className="flex-1 rounded-xl border border-zinc-800 py-2.5 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400"
              >
                Restore Wallet
              </button>
            </div>
          </form>
        )}

        {/* View 4: Import Private Key Form */}
        {activeTab === "import_pk" && (
          <form onSubmit={handleImportPK} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                Hexadecimal Private Key
              </label>
              <input
                type="password"
                value={pkInput}
                onChange={(e) => setPkInput(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("accounts")}
                className="flex-1 rounded-xl border border-zinc-800 py-2.5 text-xs font-semibold text-zinc-400 hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400"
              >
                Import Key
              </button>
            </div>
          </form>
        )}

        {/* View 5: Export / View Backup Credentials */}
        {activeTab === "backup" && account && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                <strong>Warning:</strong> Anyone who obtains your private key or seed phrase can permanently take full control of your assets.
              </span>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-300">
                <span>Secret Recovery Phrase / Key</span>
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200"
                >
                  {showSecret ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  <span>{showSecret ? "Hide" : "Reveal"}</span>
                </button>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs text-zinc-200">
                {showSecret ? (
                  account.mnemonic || account.privateKey || "No private credentials in session"
                ) : (
                  <span className="text-zinc-600">•••••••• •••••••• •••••••• ••••••••</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveTab("accounts")}
                className="w-full rounded-xl bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
              >
                Back to Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

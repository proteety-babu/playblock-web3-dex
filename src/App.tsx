import React, { useState } from "react";
import { WalletProvider, useWallet } from "./context/WalletContext";
import { Navbar } from "./components/layout/Navbar";
import { DashboardView } from "./components/dashboard/DashboardView";
import { SwapView } from "./components/swap/SwapView";
import { NFTMarketView } from "./components/nft/NFTMarketView";
import { ContractAuditView } from "./components/audit/ContractAuditView";
import { MarketAnalysisView } from "./components/market/MarketAnalysisView";
import { SecurityGuardView } from "./components/security/SecurityGuardView";
import { WalletModal } from "./components/wallet/WalletModal";
import { SendReceiveModal } from "./components/wallet/SendReceiveModal";
import { 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  ExternalLink, 
  Heart,
  Globe
} from "lucide-react";

const MainLayout: React.FC = () => {
  const { isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [sendReceiveState, setSendReceiveState] = useState<{
    isOpen: boolean;
    mode: "send" | "receive";
    tokenSymbol?: string;
  }>({
    isOpen: false,
    mode: "send",
  });

  const handleOpenSendReceive = (mode: "send" | "receive", tokenSymbol?: string) => {
    setSendReceiveState({
      isOpen: true,
      mode,
      tokenSymbol,
    });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950 font-sans antialiased">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      {/* Main App Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <DashboardView
            onOpenSendReceive={handleOpenSendReceive}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenWalletModal={() => setIsWalletModalOpen(true)}
          />
        )}

        {activeTab === "swap" && <SwapView />}

        {activeTab === "nft" && <NFTMarketView />}

        {activeTab === "audit" && <ContractAuditView />}

        {activeTab === "market" && <MarketAnalysisView />}

        {activeTab === "security" && <SecurityGuardView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-[10px]">
              PB
            </div>
            <span className="font-semibold text-zinc-300">PlayBlock Web3 Ecosystem</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-500">Chain ID: 1829</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>EVM Node Active (0.1 Gwei)</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Gemini 3.7 AI Security Guard</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Wallet Management Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onOpenSendReceive={handleOpenSendReceive}
      />

      {/* Send & Receive Modal */}
      <SendReceiveModal
        isOpen={sendReceiveState.isOpen}
        mode={sendReceiveState.mode}
        defaultTokenSymbol={sendReceiveState.tokenSymbol}
        onClose={() => setSendReceiveState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <MainLayout />
    </WalletProvider>
  );
}

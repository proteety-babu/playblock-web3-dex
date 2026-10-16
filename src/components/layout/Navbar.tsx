import React, { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { SUPPORTED_NETWORKS } from "../../config/constants";
import { shortenAddress } from "../../utils/formatters";
import { SupportedChainId } from "../../types";
import { 
  ShieldCheck, 
  Wallet, 
  ArrowLeftRight, 
  LayoutDashboard, 
  Sparkles, 
  Flame, 
  CodeXml, 
  LineChart, 
  Coins, 
  ChevronDown, 
  Check, 
  ExternalLink,
  Globe,
  Menu,
  X,
  Lock,
  Plus
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openWalletModal: () => void;
  openSendReceiveModal: (mode: "send" | "receive") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openWalletModal,
  openSendReceiveModal,
}) => {
  const { 
    account, 
    isConnected, 
    activeChainId, 
    switchChain, 
    tokens, 
    language, 
    setLanguage, 
    t, 
    claimFaucet, 
    isLoading 
  } = useWallet();

  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentNetwork = SUPPORTED_NETWORKS[activeChainId] || SUPPORTED_NETWORKS[1829];
  const gCoinToken = tokens.find((tk) => tk.isGCoin || tk.symbol === "G");

  const navItems = [
    { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { id: "swap", label: t.nav.trading, icon: ArrowLeftRight },
    { id: "nft", label: t.nav.nftMarket, icon: Sparkles },
    { id: "market", label: t.nav.marketAnalysis, icon: LineChart },
    { id: "audit", label: t.nav.contractAudit, icon: CodeXml, badge: "AI" },
    { id: "security", label: t.nav.security, icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-900/30">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
                <Coins className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white sm:text-lg">
                  PlayBlock <span className="text-emerald-400">Web3</span>
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
                  v2.4
                </span>
              </div>
              <p className="hidden text-xs text-zinc-400 sm:block">
                EVM & PlayBlock (1829)
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-zinc-800/90 text-emerald-400 shadow-sm ring-1 ring-zinc-700/50"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded bg-gradient-to-r from-cyan-500 to-emerald-500 px-1.5 py-0.2 text-[9px] font-bold text-zinc-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Faucet Button */}
          <button
            id="faucet-claim-btn"
            onClick={claimFaucet}
            disabled={isLoading}
            title={t.wallet.faucetClaim}
            className="hidden items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30 transition-all hover:bg-emerald-500/20 md:flex"
          >
            <Flame className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>+100 G-Coin</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              id="lang-toggle-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
            >
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <span>{language === "bn" ? "বাংলা" : "EN"}</span>
              <ChevronDown className="h-3 w-3 text-zinc-500" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-xl shadow-black/80">
                <button
                  onClick={() => {
                    setLanguage("bn");
                    setLangDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                    language === "bn" ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <span>বাংলা (Bengali)</span>
                  {language === "bn" && <Check className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage("en");
                    setLangDropdownOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                    language === "en" ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <span>English</span>
                  {language === "en" && <Check className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Network Switcher Dropdown */}
          <div className="relative">
            <button
              id="network-selector-btn"
              onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="max-w-[100px] truncate sm:max-w-[140px]">{currentNetwork.shortName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            </button>

            {networkDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl border border-zinc-800 bg-zinc-900/95 p-1.5 shadow-2xl backdrop-blur-xl">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Select Blockchain Network
                </div>
                {Object.values(SUPPORTED_NETWORKS).map((net) => {
                  const isCur = net.id === activeChainId;
                  return (
                    <button
                      key={net.id}
                      onClick={() => {
                        switchChain(net.id as SupportedChainId);
                        setNetworkDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                        isCur
                          ? "bg-emerald-500/10 font-semibold text-emerald-400"
                          : "text-zinc-300 hover:bg-zinc-800/80"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-bold text-zinc-300">
                          {net.shortName[0]}
                        </div>
                        <div className="text-left">
                          <div>{net.name}</div>
                          <div className="text-[10px] text-zinc-500">Chain ID: {net.id}</div>
                        </div>
                      </div>
                      {isCur && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Connect / Wallet Pill */}
          {isConnected && account ? (
            <button
              id="active-wallet-pill-btn"
              onClick={openWalletModal}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-900/30"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Wallet className="h-3 w-3" />
              </div>
              <div className="hidden text-left sm:block">
                <div className="font-semibold text-zinc-100">
                  {gCoinToken?.balance || "0"} G
                </div>
                <div className="text-[10px] text-emerald-400/80 font-mono">
                  {shortenAddress(account.address)}
                </div>
              </div>
              <span className="sm:hidden font-mono">{shortenAddress(account.address, 3)}</span>
            </button>
          ) : (
            <button
              id="connect-wallet-header-btn"
              onClick={openWalletModal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-500/20 hover:brightness-110"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>{t.wallet.connect}</span>
            </button>
          )}

          {/* Mobile menu hamburger */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 lg:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                      : "text-zinc-400 hover:bg-zinc-900 text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-3 flex gap-2 pt-3 border-t border-zinc-800">
            <button
              onClick={() => {
                claimFaucet();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 py-2 text-xs font-semibold text-emerald-400"
            >
              <Flame className="h-3.5 w-3.5" />
              <span>Claim +100 G-Coin</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

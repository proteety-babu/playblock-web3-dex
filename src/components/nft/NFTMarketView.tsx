import React, { useState } from "react";
import { useWallet } from "../../context/WalletContext";
import { NFTItem } from "../../types";
import { formatCrypto, formatUSD, shortenAddress, formatRelativeTime } from "../../utils/formatters";
import { 
  Sparkles, 
  Plus, 
  Heart, 
  ShoppingBag, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Tag, 
  User, 
  History, 
  X, 
  Check, 
  AlertCircle,
  Coins
} from "lucide-react";

export const NFTMarketView: React.FC = () => {
  const { 
    account, 
    isConnected, 
    nfts, 
    buyNFT, 
    mintNFT, 
    isLoading, 
    error, 
    clearError, 
    t 
  } = useWallet();

  const [activeTab, setActiveTab] = useState<"explore" | "mint" | "collected">("explore");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);

  // Mint Form State
  const [mintName, setMintName] = useState("");
  const [mintDesc, setMintDesc] = useState("");
  const [mintPrice, setMintPrice] = useState("350");
  const [mintCategory, setMintCategory] = useState("PlayBlock CyberPunks");
  const [mintImage, setMintImage] = useState(
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&h=600&fit=crop"
  );
  const [mintSuccessItem, setMintSuccessItem] = useState<NFTItem | null>(null);

  const presetImages = [
    { label: "Genesis Beast", url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&h=600&fit=crop" },
    { label: "Cyber Samurai", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop" },
    { label: "Sky Penthouse", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop" },
    { label: "Mech Titan", url: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=600&h=600&fit=crop" },
    { label: "Pixel Mage", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=600&fit=crop" },
  ];

  const filteredNFTs = nfts.filter((item) => {
    if (activeTab === "collected") {
      return account && item.owner.toLowerCase() === account.address.toLowerCase();
    }
    if (selectedCategory === "all") return true;
    return item.collectionId === selectedCategory;
  });

  const handleBuy = async (item: NFTItem) => {
    clearError();
    const success = await buyNFT(item.id);
    if (success) {
      setSelectedNFT(null);
    }
  };

  const handleMintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      const created = await mintNFT(
        mintName || "PlayBlock Genesis Avatar",
        mintDesc || "Rare algorithmic collectible on PlayBlock network",
        parseFloat(mintPrice) || 100,
        mintImage,
        mintCategory
      );
      setMintSuccessItem(created);
      setMintName("");
      setMintDesc("");
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation Tabs */}
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            {t.nft.title}
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {t.nft.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-zinc-900 p-1 border border-zinc-800">
          <button
            onClick={() => setActiveTab("explore")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "explore" ? "bg-emerald-500 text-zinc-950 shadow-md" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.nft.explore}
          </button>
          <button
            onClick={() => setActiveTab("mint")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "mint" ? "bg-emerald-500 text-zinc-950 shadow-md" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.nft.mint}</span>
          </button>
          <button
            onClick={() => setActiveTab("collected")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "collected" ? "bg-emerald-500 text-zinc-950 shadow-md" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.nft.myCollected}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* EXPLORE OR MY COLLECTED VIEW */}
      {(activeTab === "explore" || activeTab === "collected") && (
        <div className="space-y-6">
          {/* Category Filter Pills (only in explore mode) */}
          {activeTab === "explore" && (
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: t.nft.filterAll },
                { id: "cyberpunk", label: t.nft.filterCyberpunk },
                { id: "genesis", label: t.nft.filterGenesis },
                { id: "metaverse", label: t.nft.filterMetaverse },
                { id: "gamefi", label: t.nft.filterGameFi },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-zinc-100 text-zinc-950"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* NFT Card Grid */}
          {filteredNFTs.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-12 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-zinc-600" />
              <h3 className="mt-3 text-sm font-semibold text-zinc-200">No NFTs found in this view</h3>
              <p className="mt-1 text-xs text-zinc-500">
                {activeTab === "collected"
                  ? "You have not purchased or minted any NFTs yet. Explore the marketplace to trade!"
                  : "Try selecting a different collection category filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredNFTs.map((item) => {
                const isOwner = account && item.owner.toLowerCase() === account.address.toLowerCase();
                return (
                  <div
                    key={item.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition-all hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-zinc-900">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-zinc-950/70 px-2 py-1 text-[11px] font-semibold text-zinc-200 backdrop-blur-md">
                        <Heart className="h-3 w-3 text-red-400 fill-red-400" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="absolute left-2.5 top-2.5 rounded-full bg-emerald-950/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 backdrop-blur-md ring-1 ring-emerald-500/30">
                        PlayBlock 1829
                      </div>
                    </div>

                    {/* Metadata Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="text-[11px] font-semibold text-emerald-400">{item.collection}</div>
                        <h3 className="text-sm font-bold text-zinc-100 truncate">{item.name}</h3>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                        <div>
                          <div className="text-[10px] text-zinc-500 uppercase">{t.nft.price}</div>
                          <div className="text-sm font-extrabold text-zinc-100 flex items-center gap-1">
                            <Coins className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{item.price} G</span>
                          </div>
                        </div>

                        {item.highestBid && (
                          <div className="text-right">
                            <div className="text-[10px] text-zinc-500 uppercase">{t.nft.highestBid}</div>
                            <div className="text-xs font-semibold text-zinc-300">{item.highestBid} G</div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setSelectedNFT(item)}
                          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
                        >
                          View Details
                        </button>

                        {item.isListed && !isOwner ? (
                          <button
                            onClick={() => handleBuy(item)}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-bold text-zinc-950 hover:brightness-110 shadow-md shadow-emerald-500/20"
                          >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Buy</span>
                          </button>
                        ) : isOwner ? (
                          <span className="flex items-center justify-center rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400">
                            Owned
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MINT CUSTOM NFT STUDIO VIEW */}
      {activeTab === "mint" && (
        <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
          <div className="border-b border-zinc-800/80 pb-4">
            <h2 className="text-lg font-bold text-zinc-100">{t.nft.mintTitle}</h2>
            <p className="text-xs text-zinc-400">{t.nft.mintDesc}</p>
          </div>

          {mintSuccessItem && (
            <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-500/10 p-4 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <img
                  src={mintSuccessItem.image}
                  alt={mintSuccessItem.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-emerald-400">NFT Minted Successfully!</div>
                  <div className="text-xs text-zinc-200">{mintSuccessItem.name} (Token #{mintSuccessItem.tokenId})</div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("collected")}
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-zinc-950"
              >
                View in Portfolio
              </button>
            </div>
          )}

          <form onSubmit={handleMintSubmit} className="mt-6 space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                NFT Asset Name *
              </label>
              <input
                type="text"
                value={mintName}
                onChange={(e) => setMintName(e.target.value)}
                placeholder={t.nft.namePlaceholder}
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                Description & In-Game Utility
              </label>
              <textarea
                rows={3}
                value={mintDesc}
                onChange={(e) => setMintDesc(e.target.value)}
                placeholder={t.nft.descPlaceholder}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Collection Category & Price */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Target Collection
                </label>
                <select
                  value={mintCategory}
                  onChange={(e) => setMintCategory(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="PlayBlock CyberPunks">PlayBlock CyberPunks</option>
                  <option value="Genesis Beasts">Genesis Beasts</option>
                  <option value="Metaverse Real Estate">Metaverse Real Estate</option>
                  <option value="GameFi Weapons">GameFi Weapons</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                  Listing Price (G-Coin) *
                </label>
                <input
                  type="number"
                  step="any"
                  value={mintPrice}
                  onChange={(e) => setMintPrice(e.target.value)}
                  placeholder="350"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Visual Artwork Preset Selector */}
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-300">
                Select Artwork Style / Artwork URL
              </label>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                {presetImages.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setMintImage(p.url)}
                    className={`relative overflow-hidden rounded-xl border p-1 text-center transition-all ${
                      mintImage === p.url
                        ? "border-emerald-500 ring-2 ring-emerald-500/40 bg-zinc-900"
                        : "border-zinc-800 bg-zinc-950 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="h-16 w-full rounded-lg object-cover" />
                    <span className="mt-1 block text-[10px] font-semibold text-zinc-300 truncate">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image URL fallback */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Or Custom Image / IPFS URL
              </label>
              <input
                type="url"
                value={mintImage}
                onChange={(e) => setMintImage(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {/* Mint Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isConnected}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isLoading ? "Deploying Smart Contract to PlayBlock..." : t.nft.mintButton}</span>
            </button>
          </form>
        </div>
      )}

      {/* NFT DETAIL MODAL */}
      {selectedNFT && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <button
              onClick={() => setSelectedNFT(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-400">{selectedNFT.collection}</span>
                  <h2 className="text-xl font-bold text-zinc-100">{selectedNFT.name}</h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                    <span>Owner:</span>
                    <span className="font-mono text-zinc-200">{shortenAddress(selectedNFT.owner, 5)}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5">
                  <div className="text-xs text-zinc-400">Current Price</div>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    {selectedNFT.price} {selectedNFT.currency}
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    ≈ {formatUSD(selectedNFT.price * 1.48)}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedNFT.description}
                </p>

                {/* Attributes Grid */}
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.nft.traits}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedNFT.attributes.map((attr, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 text-xs"
                      >
                        <div className="text-[10px] text-zinc-500 uppercase">{attr.trait_type}</div>
                        <div className="font-semibold text-zinc-200 truncate">{attr.value}</div>
                        {attr.rarityPercentage && (
                          <div className="text-[9px] text-emerald-400 font-mono">
                            {attr.rarityPercentage}% Rarity
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Button in Modal */}
                {selectedNFT.isListed && (
                  <button
                    onClick={() => handleBuy(selectedNFT)}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:brightness-110"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Buy NFT for {selectedNFT.price} G</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

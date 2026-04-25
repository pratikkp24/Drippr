"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Check } from "lucide-react";

function DiscoverCard({ item }: { item: any }) {
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  async function addToCloset(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (added || busy) return;
    setBusy(true);
    const res = await fetch("/api/closet/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.name,
        brand: item.brand,
        image: item.primaryPhoto,
        price: item.purchasePrice,
        sourceUrl: item.sourceUrl,
        category: item.category
      })
    });
    setBusy(false);
    if (res.ok) setAdded(true);
  }

  return (
    <Link
      href={`/profile/${item.user.username}`}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-lg shadow-sm">
        <Image
          src={item.primaryPhoto}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"

        />
        <button
          onClick={addToCloset}
          disabled={added || busy}
          className={`absolute top-md right-md w-[36px] h-[36px] rounded-full backdrop-blur-md flex items-center justify-center shadow-sm transition-all ${
            added
              ? "bg-primary text-bg opacity-100"
              : "bg-white/90 text-text-1 opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110"
          }`}
          aria-label={added ? "Added to closet" : "Add to closet"}
          title={added ? "Added to your closet" : "Add to your closet"}
        >
          {added ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex items-start justify-between px-sm">
        <div className="space-y-0.5 max-w-[70%]">
          <h4 className="font-sans font-medium text-[15px] text-text-1 truncate">{item.name}</h4>
          <p className="font-sans font-light text-[13px] text-text-3 truncate">by @{item.user.username}</p>
        </div>
        {item.partner && (
          <div className="bg-surface border border-border px-1.5 py-0.5 rounded text-[10px] font-bold text-text-3">
            {item.partner.name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </Link>
  );
}

const CATEGORIES = [
  "Minimal", "Street-luxe", "Occasion", "Casual", "Elevated basics", "Workwear", "Travel", "Party"
];

const DISCOVER_ITEMS = [
  { id: "1", title: "Ivory Linen Co-ord", price: "5,600", tag: "MN", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { id: "2", title: "Autumn Forest Layers", price: "8,900", tag: "ZA", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80" },
  { id: "3", title: "Desert Silk Scarf", price: "2,400", tag: "AJ", image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80" },
  { id: "4", title: "Nebula Runner X", price: "12,000", tag: "NF", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" }
];

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [pieces, setPieces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPieces() {
      setLoading(true);
      try {
        const catParam = activeCategory === "All" ? "" : `?category=${activeCategory.toUpperCase()}`;
        const res = await fetch(`/api/discover/pieces${catParam}`);
        if (res.ok) {
          const data = await res.json();
          setPieces(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPieces();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="h-[80px] flex items-center justify-between px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <h1 className="fraunces text-[28px] font-semibold text-text-1">Discover</h1>
        <div className="relative">
          <Link href="/search">
            <Search className="w-5 h-5 text-text-3 cursor-pointer hover:text-primary transition-colors" />
          </Link>
        </div>
      </header>

      <div className="p-xl space-y-xl max-w-[1400px] mx-auto">
        {/* Category Filter */}
        <div className="flex items-center space-x-sm overflow-x-auto pb-md scrollbar-hide no-scrollbar">
          {["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-xl h-[40px] rounded-full font-sans font-medium text-[14px] whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? "bg-primary text-bg border-primary"
                  : "bg-surface text-text-2 border-border hover:border-text-3"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-xl animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-surface rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-xl">
            {pieces.map((item) => (
              <DiscoverCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

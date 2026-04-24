"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

const CATEGORIES = ["All", "Tops", "Bottoms", "Layers", "Dresses", "Sets", "Acc."];

const CLOSET_PIECES = [
  { id: "1", name: "White Linen Shirt", stats: "14 wears • 2 days ago", tag: "MN", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80" },
  { id: "2", name: "Straight Leg Jeans", stats: "22 wears • 5 days ago", tag: "AJ", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80" },
  { id: "3", name: "Beige Blazer", stats: "6 wears • 3 weeks ago", tag: "ZA", image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80" },
  { id: "4", name: "Slip Dress (Charcoal)", stats: "3 wears • 1 month ago", tag: "NF", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" },
  { id: "5", name: "Oversized Knit", stats: "11 wears • Yesterday", tag: "UQ", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" },
  { id: "6", name: "Chelsea Boots", stats: "45 wears • 1 day ago", tag: "MN", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80" }
];

export default function ClosetPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="h-[80px] flex items-center justify-between px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <h1 className="fraunces text-[28px] font-semibold text-text-1">My Closet</h1>
        <div className="flex items-center space-x-md">
          <button className="h-[36px] px-lg border border-border rounded-full font-sans font-medium text-[13px] text-text-1 hover:bg-surface transition-colors flex items-center">
            Build a drop
          </button>
          <button className="w-[36px] h-[36px] bg-primary text-bg rounded-md flex items-center justify-center hover:bg-primary-hover transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <Link href="/search">
            <Search className="w-5 h-5 text-text-3 cursor-pointer hover:text-primary transition-colors ml-sm" />
          </Link>
        </div>
      </header>

      <div className="p-xl space-y-xl max-w-[1400px] mx-auto">
        {/* Category Filter */}
        <div className="flex items-center space-x-sm overflow-x-auto pb-md scrollbar-hide no-scrollbar">
          {CATEGORIES.map((cat) => (
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

        {/* Closet Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
          {CLOSET_PIECES.map((piece) => (
            <div key={piece.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-lg shadow-sm bg-surface">
                <Image
                  src={piece.image}
                  alt={piece.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-md left-md bg-white/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-text-1">
                  {piece.tag}
                </div>
              </div>
              
              <div className="px-sm space-y-1">
                <h4 className="font-sans font-medium text-[16px] text-text-1 truncate">{piece.name}</h4>
                <p className="font-sans font-light text-[13px] text-text-3 italic">{piece.stats}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

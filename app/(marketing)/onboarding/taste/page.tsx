"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const VIBES = [
  { id: "minimal", label: "Minimal", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80" },
  { id: "elevated-basics", label: "Elevated basics", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
  { id: "street-luxe", label: "Street-luxe", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80" },
  { id: "workwear", label: "Workwear", image: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&q=80" },
  { id: "weekend", label: "Weekend", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80" },
  { id: "monsoon", label: "Monsoon", image: "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=400&q=80" },
  { id: "occasion", label: "Occasion", image: "https://images.unsplash.com/photo-1589465885857-44edb59bbff2?w=400&q=80" },
  { id: "layering", label: "Layering", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80" },
  { id: "travel", label: "Travel", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  { id: "party", label: "Party", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80" },
  { id: "festive", label: "Festive", image: "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=400&q=80" },
  { id: "casual", label: "Casual", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80" },
];

export default function OnboardingTastePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleVibe = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  async function handleContinue() {
    if (selected.size < 5) return;
    setLoading(true);
    const res = await fetch("/api/onboarding/taste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vibes: Array.from(selected) })
    });
    
    setLoading(false);
    if (res.ok) {
      router.push("/onboarding/follow");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save taste profile");
    }
  }

  function handleSkip() {
    router.push("/onboarding/follow");
  }

  return (
    <main className="min-h-screen bg-bg flex flex-col items-center py-xl px-lg">
      <div className="w-full max-w-[600px] animate-slideUp">
        <h1 className="fraunces text-[44px] leading-[1.05] text-text-1 mb-xs">
          Show us your <em className="italic">taste.</em>
        </h1>
        <p className="font-light text-[15px] text-text-2 mb-xl">
          Pick 5 or more vibes. This shapes your feed.
        </p>

        <div className="grid grid-cols-3 gap-md mb-2xl">
          {VIBES.map((vibe) => {
            const isSelected = selected.has(vibe.id);
            return (
              <button
                key={vibe.id}
                type="button"
                onClick={() => toggleVibe(vibe.id)}
                className="relative aspect-square rounded-lg overflow-hidden flex flex-col items-center justify-center group"
              >
                <Image
                  src={vibe.image}
                  alt={vibe.label}
                  fill
                  sizes="(max-width: 768px) 33vw, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                
                {/* Always-visible overlay for the text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                <span className="absolute bottom-sm left-sm right-sm text-[12px] font-sans font-medium text-white text-left leading-tight z-10 pointer-events-none">
                  {vibe.label}
                </span>

                {/* Selected Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/30 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {error && <p className="text-[13px] text-error mb-sm text-center">{error}</p>}

        <div className="flex flex-col items-center space-y-md">
          <button
            onClick={handleContinue}
            disabled={selected.size < 5 || loading}
            className="w-full max-w-[320px] h-[54px] bg-primary text-bg font-sans font-medium text-[15px] rounded-md hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:hover:bg-primary"
          >
            {loading ? "Saving..." : `Continue (${selected.size}/5)`}
          </button>

          <button
            onClick={handleSkip}
            className="text-[14px] text-text-2 hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </main>
  );
}

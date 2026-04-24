"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Link2, Camera, ArrowLeft, Loader2, Sparkles, Plus, X } from "lucide-react";
import Image from "next/image";

type Mode = "link" | "upload";

export default function AddPiecePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") as Mode) || "link";
  
  const [mode, setMode] = useState<Mode>(initialMode);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Scraped/Upload Result
  const [pieceData, setPieceData] = useState<{
    name: string;
    brand: string;
    image: string;
    price?: number;
    sourceUrl?: string;
    category: string;
  } | null>(null);
  const [partial, setPartial] = useState(false);

  async function handleScrape() {
    if (!url) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/closet/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to extract");
      }

      const data = await res.json();
      setPieceData({
        name: data.title || "",
        brand: data.brand || "",
        image: data.image || "",
        price: data.price ?? undefined,
        sourceUrl: url,
        category: data.category || "TOPS"
      });
      setPartial(Boolean(data.partial));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function skipToManual() {
    setPartial(true);
    setPieceData({
      name: "",
      brand: "",
      image: "",
      price: undefined,
      sourceUrl: url || undefined,
      category: "TOPS"
    });
  }

  async function handleSave() {
    if (!pieceData) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/closet/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pieceData)
      });
      
      if (res.ok) {
        router.push("/closet");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save piece");
      }
    } catch (err) {
      setError("Failed to save piece");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="h-[80px] flex items-center px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <button onClick={() => router.back()} className="mr-md text-text-3 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="fraunces text-[24px] font-semibold text-text-1">Add to Closet</h1>
      </header>

      <main className="max-w-[600px] mx-auto p-xl py-2xl space-y-2xl">
        {!pieceData ? (
          <section className="space-y-xl">
            {/* Mode Toggle */}
            <div className="flex p-1 bg-surface border border-border rounded-xl">
              <button
                onClick={() => setMode("link")}
                className={`flex-1 flex items-center justify-center space-x-2 h-[44px] rounded-lg font-sans font-medium text-[14px] transition-all ${
                  mode === "link" ? "bg-bg text-primary shadow-sm" : "text-text-3 hover:text-text-1"
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span>Product Link</span>
              </button>
              <button
                onClick={() => setMode("upload")}
                className={`flex-1 flex items-center justify-center space-x-2 h-[44px] rounded-lg font-sans font-medium text-[14px] transition-all ${
                  mode === "upload" ? "bg-bg text-primary shadow-sm" : "text-text-3 hover:text-text-1"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>

            {mode === "link" ? (
              <div className="space-y-md animate-slideUp">
                <div className="space-y-xs">
                  <label className="text-[13px] font-sans font-medium text-text-3 uppercase tracking-wider">Paste URL</label>
                  <input
                    type="url"
                    placeholder="https://www.zara.com/..."
                    className="input-field w-full h-[54px] bg-surface border border-border rounded-xl px-md text-[15px] text-text-1 focus:outline-none focus:border-primary transition-all"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-[12px] text-text-3 font-sans mt-xs">
                    Works with Myntra, Ajio, Zara, Uniqlo & 50+ more.
                  </p>
                </div>
                
                {error && <p className="text-[13px] text-error">{error}</p>}

                <button
                  onClick={handleScrape}
                  disabled={loading || !url}
                  className="w-full h-[54px] bg-primary text-bg font-sans font-medium text-[15px] rounded-xl flex items-center justify-center space-x-2 hover:bg-primary-hover transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <span>Extract details</span>
                    </>
                  )}
                </button>

                <button
                  onClick={skipToManual}
                  type="button"
                  className="w-full text-center text-[13px] text-text-2 hover:text-primary underline-offset-4 hover:underline"
                >
                  Enter details manually
                </button>
              </div>
            ) : (
              <div className="animate-slideUp">
                <div className="border-2 border-dashed border-border rounded-2xl bg-surface p-2xl flex flex-col items-center justify-center space-y-md cursor-pointer hover:border-primary transition-colors group">
                  <div className="w-16 h-16 rounded-full bg-border/50 flex items-center justify-center text-text-3 group-hover:text-primary transition-colors">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-sans font-medium text-text-1">Choose a photo</p>
                    <p className="font-sans font-light text-[13px] text-text-3 mt-1">or drag and drop here</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
                <p className="mt-md text-center text-[12px] text-text-3 font-sans italic">
                  Tip: Clean photos with minimal backgrounds work best.
                </p>
              </div>
            )}
          </section>
        ) : (
          <section className="space-y-xl animate-scaleIn">
            {partial && (
              <div className="bg-surface border border-border rounded-lg px-md py-sm">
                <p className="text-[13px] text-text-2">
                  We couldn’t get everything from that page. Fill in the gaps below and we’ll save it.
                </p>
              </div>
            )}
            <div className="flex items-start space-x-xl">
              <div className="relative w-48 h-64 rounded-2xl overflow-hidden bg-surface border border-border group">
                {pieceData.image ? (
                  <Image src={pieceData.image} alt="Preview" fill className="object-cover" unoptimized />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-sm text-center text-[12px] text-text-3">
                    No photo yet.<br />Paste an image URL below.
                  </div>
                )}
                <button
                  onClick={() => {
                    setPieceData(null);
                    setPartial(false);
                  }}
                  className="absolute top-sm right-sm w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 space-y-lg">
                <div>
                  <label className="text-[12px] text-text-3 uppercase tracking-widest font-medium mb-xs block">Item name</label>
                  <input
                    placeholder="White linen shirt"
                    className="w-full bg-transparent border-b border-border py-1 text-[18px] text-text-1 focus:border-primary transition-colors outline-none placeholder:text-text-3"
                    value={pieceData.name}
                    onChange={(e) => setPieceData({ ...pieceData, name: e.target.value })}
                  />
                </div>
                {partial && !pieceData.image && (
                  <div>
                    <label className="text-[12px] text-text-3 uppercase tracking-widest font-medium mb-xs block">Image URL</label>
                    <input
                      placeholder="Paste image URL"
                      className="w-full bg-transparent border-b border-border py-1 text-[14px] text-text-1 focus:border-primary transition-colors outline-none placeholder:text-text-3"
                      onChange={(e) => setPieceData({ ...pieceData, image: e.target.value })}
                    />
                  </div>
                )}
                <div>
                  <label className="text-[12px] text-text-3 uppercase tracking-widest font-medium mb-xs block">Brand</label>
                  <input
                    className="w-full bg-transparent border-b border-border py-1 text-[16px] text-text-1 focus:border-primary transition-colors outline-none"
                    value={pieceData.brand}
                    onChange={(e) => setPieceData({ ...pieceData, brand: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-md">
                   <div>
                    <label className="text-[12px] text-text-3 uppercase tracking-widest font-medium mb-xs block">Category</label>
                    <select
                      className="w-full bg-transparent border-b border-border py-1 text-[14px] text-text-1 focus:border-primary outline-none"
                      value={pieceData.category}
                      onChange={(e) => setPieceData({ ...pieceData, category: e.target.value })}
                    >
                      <option value="TOPS">Tops</option>
                      <option value="BOTTOMS">Bottoms</option>
                      <option value="LAYERS">Layers</option>
                      <option value="DRESSES">Dresses</option>
                      <option value="FOOTWEAR">Footwear</option>
                      <option value="ACCESSORIES">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] text-text-3 uppercase tracking-widest font-medium mb-xs block">Price (est.)</label>
                    <input
                      className="w-full bg-transparent border-b border-border py-1 text-[16px] text-text-1 focus:border-primary outline-none"
                      value={pieceData.price || ""}
                      type="number"
                      onChange={(e) => setPieceData({ ...pieceData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading || !pieceData.name || !pieceData.image}
              className="w-full h-[60px] bg-primary text-bg font-sans font-medium text-[16px] rounded-2xl flex items-center justify-center hover:bg-primary-hover transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : !pieceData.name || !pieceData.image ? (
                "Add a name and image to save"
              ) : (
                "Save to closet"
              )}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

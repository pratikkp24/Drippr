"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Camera, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";

type Piece = {
  id: string;
  name: string;
  primaryPhoto: string;
  brand?: string;
};

export default function CreateDropPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingPieces, setFetchingPieces] = useState(true);
  const [closetPieces, setClosetPieces] = useState<Piece[]>([]);
  
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [selectedPieceIds, setSelectedPieceIds] = useState<Set<string>>(new Set());
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCloset() {
      try {
        const res = await fetch("/api/user/pieces");
        if (res.ok) {
          const data = await res.json();
          setClosetPieces(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingPieces(false);
      }
    }
    fetchCloset();
  }, []);

  const togglePiece = (id: string) => {
    setSelectedPieceIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  async function handleCreate() {
    if (!title || selectedPieceIds.size === 0) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/drops/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          story,
          pieceIds: Array.from(selectedPieceIds),
          coverImage: coverImage || (selectedPieceIds.size > 0 ? closetPieces.find(p => p.id === Array.from(selectedPieceIds)[0])?.primaryPhoto : null)
        })
      });
      
      if (res.ok) {
        router.push("/drops");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg pb-2xl">
      <header className="h-[80px] flex items-center justify-between px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-md text-text-3 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="fraunces text-[24px] font-semibold text-text-1">Build a drop</h1>
        </div>
        <button
          onClick={handleCreate}
          disabled={loading || !title || selectedPieceIds.size === 0}
          className="h-[44px] px-xl bg-primary text-bg font-sans font-medium text-[14px] rounded-full hover:bg-primary-hover transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Drop"}
        </button>
      </header>

      <main className="max-w-[1000px] mx-auto p-xl grid lg:grid-cols-2 gap-2xl">
        {/* Left Side: Metadata */}
        <section className="space-y-2xl">
          <div className="space-y-xl">
             <div className="aspect-[16/9] w-full rounded-2xl bg-surface border border-border flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
              {coverImage ? (
                <Image src={coverImage} alt="Cover" fill className="object-cover" />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-text-3 mb-sm group-hover:text-primary transition-colors" />
                  <p className="font-sans text-[13px] text-text-2">Set cover image</p>
                </>
              )}
            </div>

            <div className="space-y-md">
              <input
                type="text"
                placeholder="Name your drop..."
                className="w-full bg-transparent border-none text-[40px] fraunces text-text-1 placeholder:text-text-3 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Tell the story behind these pieces..."
                className="w-full bg-transparent border-none text-[18px] font-sans font-light text-text-2 placeholder:text-text-3 outline-none resize-none min-h-[120px]"
                value={story}
                onChange={(e) => setStory(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-lg">
            <h3 className="font-sans font-medium text-[12px] text-text-3 uppercase tracking-widest flex items-center">
              Selected Pieces <span className="ml-2 bg-surface px-2 py-0.5 rounded-full border border-border text-primary">{selectedPieceIds.size}</span>
            </h3>
            <div className="grid grid-cols-3 gap-md">
              {closetPieces.filter(p => selectedPieceIds.has(p.id)).map(piece => (
                <div key={piece.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border group">
                  <Image src={piece.primaryPhoto} alt={piece.name} fill className="object-cover" />
                  <button 
                    onClick={() => togglePiece(piece.id)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Pieces Picker */}
        <section className="bg-surface border border-border rounded-2xl flex flex-col h-[calc(100vh-140px)]">
          <div className="p-lg border-b border-border">
            <h3 className="font-sans font-medium text-[16px] text-text-1">Select from Closet</h3>
            <p className="font-sans font-light text-[13px] text-text-3 mt-1">Tap pieces to toggle them in your drop.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-lg no-scrollbar">
            {fetchingPieces ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-text-3" />
              </div>
            ) : closetPieces.length === 0 ? (
              <div className="text-center py-xl">
                 <p className="text-text-3 text-[14px]">Your closet is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-md">
                {closetPieces.map(piece => {
                  const isSelected = selectedPieceIds.has(piece.id);
                  return (
                    <button
                      key={piece.id}
                      onClick={() => togglePiece(piece.id)}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected ? "border-primary scale-[1.02]" : "border-transparent opacity-80"
                      }`}
                    >
                      <Image src={piece.primaryPhoto} alt={piece.name} fill className="object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-bg flex items-center justify-center">
                            <Plus className="w-5 h-5 rotate-45" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon, ArrowLeft, Loader2, User, Droplets, Shirt } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery) {
        setResults(null);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-bg">
      <header className="h-[80px] flex items-center px-xl border-b border-border bg-bg/80 backdrop-blur-md sticky top-0 z-20">
        <button onClick={() => router.back()} className="mr-md text-text-3 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="w-5 h-5 text-text-3 absolute left-md top-1/2 -translate-y-1/2" />
          <input
            autoFocus
            type="text"
            placeholder="Search creators, drops, or pieces..."
            className="w-full h-[48px] bg-surface border border-border rounded-xl pl-12 pr-md text-[16px] text-text-1 focus:outline-none focus:border-primary transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-[800px] mx-auto p-xl space-y-2xl">
        {loading && (
          <div className="flex justify-center py-xl">
            <Loader2 className="w-8 h-8 animate-spin text-text-3" />
          </div>
        )}

        {!loading && results && (
          <>
            {/* Users */}
            {results.users.length > 0 && (
              <section className="space-y-md">
                <h3 className="font-sans font-medium text-[12px] text-text-3 uppercase tracking-widest flex items-center">
                  <User className="w-4 h-4 mr-2" /> Creators
                </h3>
                <div className="space-y-sm">
                  {results.users.map((u: any) => (
                    <Link 
                      key={u.id} 
                      href={`/profile/${u.username}`}
                      className="flex items-center p-md bg-surface border border-border rounded-xl hover:border-primary transition-colors"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-md">
                        <Image src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.displayName}`} alt={u.displayName} fill />
                      </div>
                      <div>
                        <p className="font-sans font-medium text-text-1 text-[15px]">{u.displayName}</p>
                        <p className="font-sans font-light text-text-3 text-[13px]">@{u.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Drops */}
            {results.drops.length > 0 && (
              <section className="space-y-md">
                <h3 className="font-sans font-medium text-[12px] text-text-3 uppercase tracking-widest flex items-center">
                  <Droplets className="w-4 h-4 mr-2" /> Drops
                </h3>
                 <div className="space-y-sm">
                  {results.drops.map((d: any) => (
                    <Link 
                      key={d.id} 
                      href={`/drops/${d.slug}`}
                      className="flex items-center p-md bg-surface border border-border rounded-xl hover:border-primary transition-colors"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-md">
                        <Image src={d.coverImage} alt={d.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-sans font-medium text-text-1 text-[15px]">{d.name}</p>
                        <p className="font-sans font-light text-text-3 text-[13px]">by @{d.user.username}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Pieces */}
            {results.pieces.length > 0 && (
              <section className="space-y-md">
                <h3 className="font-sans font-medium text-[12px] text-text-3 uppercase tracking-widest flex items-center">
                   <Shirt className="w-4 h-4 mr-2" /> Pieces
                </h3>
                <div className="grid grid-cols-2 gap-md">
                  {results.pieces.map((p: any) => (
                    <Link 
                      key={p.id} 
                      href={`/closet/piece/${p.id}`} // Dummy link for now
                      className="group"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-border mb-sm">
                        <Image src={p.primaryPhoto} alt={p.name} fill className="object-cover" />
                      </div>
                      <p className="font-sans font-medium text-text-1 text-[14px] truncate">{p.name}</p>
                      <p className="font-sans font-light text-text-3 text-[12px]">@{p.user.username}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {!results.users.length && !results.drops.length && !results.pieces.length && (
              <div className="text-center py-2xl">
                <p className="text-text-3">No results found for "{debouncedQuery}"</p>
              </div>
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-2xl space-y-md">
            <h2 className="fraunces text-text-3 text-[24px]">Find your inspiration.</h2>
            <p className="font-sans text-text-3 text-[14px]">Search for curators or specific pieces.</p>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, TrendingUp, Sparkles, Calendar as CalendarIcon } from "lucide-react";

type Insights = {
  range: { from: string; to: string };
  totals: {
    totalWears: number;
    daysLogged: number;
    daysInRange: number;
    totalPieces: number;
    streak: number;
  };
  occasionBreakdown: { occasion: string; count: number }[];
  topPieces: { id: string; name: string; primaryPhoto: string | null; brand: string | null; wears: number }[];
  dormantPieces: { id: string; name: string; primaryPhoto: string | null; category: string }[];
};

function humanize(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
}

export function InsightsPanel({ monthAnchor }: { monthAnchor: Date }) {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let abort = false;
    async function load() {
      setLoading(true);
      const from = `${monthAnchor.getFullYear()}-${String(monthAnchor.getMonth() + 1).padStart(2, "0")}-01`;
      const end = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 0);
      const to = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
      try {
        const res = await fetch(`/api/closet/insights?from=${from}&to=${to}`);
        if (res.ok && !abort) {
          setData(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => {
      abort = true;
    };
  }, [monthAnchor]);

  if (loading || !data) {
    return (
      <section className="pt-2xl border-t border-border">
        <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-md">Insights</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[92px] bg-surface rounded-lg border border-border animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const { totals, occasionBreakdown, topPieces, dormantPieces } = data;
  const coverageRate = totals.daysInRange
    ? Math.round((totals.daysLogged / totals.daysInRange) * 100)
    : 0;
  const monthLabel = monthAnchor.toLocaleString("en-US", { month: "long" });

  // Top occasion
  const topOccasion = [...occasionBreakdown].sort((a, b) => b.count - a.count)[0];
  const occasionTotal = occasionBreakdown.reduce((n, o) => n + o.count, 0);

  return (
    <section className="pt-2xl border-t border-border space-y-xl">
      <div>
        <p className="text-[11px] tracking-[2px] uppercase text-text-3">Insights · {monthLabel}</p>
        <h2 className="fraunces text-[28px] text-text-1 mt-xs">
          How you’ve been <em className="italic">wearing.</em>
        </h2>
      </div>

      {/* Top-line stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          label="Streak"
          value={totals.streak > 0 ? `${totals.streak} ${totals.streak === 1 ? "day" : "days"}` : "—"}
          hint={totals.streak > 0 ? "keep going" : "log today to start"}
        />
        <StatCard
          icon={<CalendarIcon className="w-4 h-4" />}
          label="Days logged"
          value={`${totals.daysLogged}/${totals.daysInRange}`}
          hint={`${coverageRate}% of the month`}
        />
        <StatCard
          icon={<Sparkles className="w-4 h-4" />}
          label="Total wears"
          value={String(totals.totalWears)}
          hint={totals.totalPieces > 0 ? `across ${totals.totalPieces} pieces` : "add pieces first"}
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Top occasion"
          value={topOccasion ? humanize(topOccasion.occasion) : "—"}
          hint={topOccasion ? `${Math.round((topOccasion.count / occasionTotal) * 100)}% of logs` : "no tags yet"}
        />
      </div>

      {/* Top worn this month */}
      {topPieces.length > 0 && (
        <div>
          <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">Most worn this month</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-sm">
            {topPieces.map((p, idx) => (
              <Link
                key={p.id}
                href={`/closet/${p.id}`}
                className="group bg-surface border border-border rounded-lg p-2 hover:border-primary transition-colors"
              >
                <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-bg mb-2">
                  {p.primaryPhoto ? (
                    <Image src={p.primaryPhoto} alt={p.name} fill className="object-cover" unoptimized />
                  ) : null}
                  <div className="absolute top-1 left-1 bg-primary text-bg text-[10px] font-medium px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </div>
                </div>
                <p className="text-[12px] font-medium text-text-1 truncate">{p.name}</p>
                <p className="text-[11px] font-light text-text-3">
                  {p.wears} {p.wears === 1 ? "wear" : "wears"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Occasion breakdown */}
      {occasionBreakdown.length > 0 && (
        <div>
          <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">Occasion mix</p>
          <div className="bg-surface border border-border rounded-lg p-md space-y-sm">
            {occasionBreakdown
              .sort((a, b) => b.count - a.count)
              .map((o) => {
                const pct = Math.round((o.count / occasionTotal) * 100);
                return (
                  <div key={o.occasion} className="flex items-center gap-md">
                    <span className="text-[12px] text-text-2 w-20 shrink-0">{humanize(o.occasion)}</span>
                    <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-light text-text-3 w-12 text-right">
                      {pct}% · {o.count}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Dormant pieces */}
      {dormantPieces.length > 0 && (
        <div>
          <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">
            Not worn in 60 days
          </p>
          <p className="text-[13px] font-light text-text-2 italic mb-sm">
            Your closet has pieces waiting for a rerun.
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-sm">
            {dormantPieces.map((p) => (
              <Link
                key={p.id}
                href={`/closet/${p.id}`}
                className="relative aspect-[4/5] rounded-md overflow-hidden bg-surface border border-border hover:border-primary transition-colors group"
                title={p.name}
              >
                {p.primaryPhoto ? (
                  <Image src={p.primaryPhoto} alt={p.name} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" unoptimized />
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}

      {totals.totalWears === 0 && totalsEmptyHint(totals.totalPieces)}
    </section>
  );
}

function totalsEmptyHint(totalPieces: number) {
  if (totalPieces === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-lg text-center">
        <h3 className="fraunces text-[22px] mb-xs">Your closet is empty.</h3>
        <p className="text-[13px] font-light text-text-2 mb-md">
          Add pieces before you can see insights.
        </p>
        <Link
          href="/closet/add"
          className="inline-flex h-[40px] px-lg bg-primary text-bg rounded-md font-medium text-[13px] items-center hover:bg-primary-hover"
        >
          Add your first piece
        </Link>
      </div>
    );
  }
  return (
    <div className="bg-surface border border-border rounded-lg p-lg text-center">
      <h3 className="fraunces text-[22px] mb-xs">Nothing logged yet.</h3>
      <p className="text-[13px] font-light text-text-2">
        Log what you wore today to see patterns emerge.
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-lg p-md">
      <div className="flex items-center gap-1.5 text-text-3 text-[11px] tracking-widest uppercase mb-xs">
        {icon}
        {label}
      </div>
      <p className="fraunces text-[24px] text-text-1 leading-none">{value}</p>
      <p className="text-[11px] font-light text-text-3 mt-1 truncate">{hint}</p>
    </div>
  );
}

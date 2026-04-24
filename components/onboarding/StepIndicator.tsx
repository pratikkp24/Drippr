const STEPS: { key: string; label: string; href: string }[] = [
  { key: "profile", label: "Handle", href: "/onboarding/profile" },
  { key: "taste", label: "Taste", href: "/onboarding/taste" },
  { key: "follow", label: "Follow", href: "/onboarding/follow" },
  { key: "closet-seed", label: "Closet", href: "/onboarding/closet-seed" }
];

export function StepIndicator({ current }: { current: "profile" | "taste" | "follow" | "closet-seed" }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="w-full max-w-[480px] mx-auto mb-xl">
      <div className="flex items-center gap-1.5">
        {STEPS.map((s, i) => {
          const passed = i <= currentIdx;
          return (
            <div
              key={s.key}
              className={`flex-1 h-1 rounded-full transition-colors ${
                passed ? "bg-primary" : "bg-border"
              }`}
            />
          );
        })}
      </div>
      <p className="text-[11px] tracking-[2px] uppercase text-text-3 mt-sm">
        Step {currentIdx + 1} of {STEPS.length} · {STEPS[currentIdx]?.label}
      </p>
    </div>
  );
}

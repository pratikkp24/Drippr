"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

type SignupOverlayProps = {
  children: React.ReactNode;
  variant: "save" | "follow" | "shop";
};

export function SignupOverlay({ children, variant }: SignupOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const headlines = {
    save: { text: "Love it? ", italic: "Save it." },
    follow: { text: "Follow ", italic: "back." },
    shop: { text: "Want it? ", italic: "Shop it." }
  };

  const currentHeadline = headlines[variant];

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-md animate-[fadeIn_180ms_ease-out]"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-[440px] bg-bg rounded-xl p-xl shadow-2xl overflow-hidden animate-slideUp">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-md right-md p-xs text-text-3 hover:text-text-1 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="text-center py-lg">
              <h2 className="fraunces text-[clamp(32px,6vw,44px)] leading-tight text-text-1 mb-md">
                {currentHeadline.text}
                <em className="italic">{currentHeadline.italic}</em>
              </h2>
              <p className="text-text-2 text-[16px] mb-xl font-light">
                Make an account to keep going. Takes 20 seconds.
              </p>

              <div className="flex flex-col gap-sm">
                <Link
                  href="/signup"
                  className="h-[54px] rounded-md bg-primary text-bg font-medium flex items-center justify-center hover:bg-primary-hover transition-colors"
                >
                  Create account
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-[54px] rounded-md border border-border text-text-1 font-medium flex items-center justify-center hover:border-accent transition-colors"
                >
                  Keep exploring
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

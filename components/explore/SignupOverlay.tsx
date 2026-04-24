"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type SignupOverlayProps = {
  children: React.ReactNode;
  variant: "save" | "follow" | "shop";
};

export function SignupOverlay({ children, variant }: SignupOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const headlines = {
    save: { text: "Love it? ", italic: "Save it." },
    follow: { text: "Follow ", italic: "back." },
    shop: { text: "Want it? ", italic: "Shop it." },
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

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[440px] bg-bg rounded-xl p-xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-md right-md p-xs text-text-3 hover:text-text-1 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center py-lg">
                <h2 className="fraunces text-[44px] leading-tight text-text-1 mb-md">
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

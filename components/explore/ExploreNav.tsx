"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function ExploreNav() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Explore", href: "/explore" },
    { name: "Creators", href: "/explore?tab=creators" }, // Keeping it simple for now as home has creator section
    { name: "Drops", href: "/explore/discover" },
  ];

  return (
    <header className="h-[72px] bg-bg border-b border-border flex items-center px-lg sm:px-xl sticky top-0 z-50">
      <div className="flex-1 flex items-center justify-between max-w-[1200px] mx-auto w-full">
        <Link href="/explore" className="text-[22px] font-semibold text-primary">
          Drippr.
        </Link>

        <nav className="hidden md:flex items-center gap-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-[14px] font-medium transition-colors",
                pathname === link.href ? "text-primary" : "text-text-2 hover:text-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-md">
          <Link
            href="/signin"
            className="text-[14px] text-text-2 hover:text-primary transition-colors hidden sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="h-10 px-lg inline-flex items-center rounded-pill bg-primary text-bg text-[14px] font-medium hover:bg-primary-hover transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

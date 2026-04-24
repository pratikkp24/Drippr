import {
  Home,
  Compass,
  Droplets,
  Shirt,
  User as UserIcon,
  LayoutGrid,
  Plus
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/drops", label: "Drops", icon: Droplets },
  { href: "/closet", label: "Closet", icon: Shirt },
  { href: "/profile/me", label: "Profile", icon: UserIcon }
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/signin");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (!dbUser) redirect("/onboarding/profile");

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-col bg-surface border-r border-border sticky top-0 h-screen">
        <div className="px-xl py-2xl text-[24px] font-semibold text-primary tracking-tight">
          Drippr.
        </div>

        <nav className="flex-1 px-md space-y-xs">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-md px-md py-sm rounded-lg text-[15px] font-medium text-text-2 hover:text-primary hover:bg-bg transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="pt-xl mt-xl border-t border-border px-md">
            <Link
              href="/drops/me"
              className="flex items-center space-x-md px-md py-sm rounded-lg text-[15px] font-medium text-text-2 hover:text-primary hover:bg-bg transition-all group"
            >
              <LayoutGrid className="w-5 h-5" />
              <span>My Drops</span>
            </Link>
          </div>
        </nav>

        <div className="p-lg border-t border-border space-y-lg">
          <div className="flex items-center space-x-md px-sm">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-border shrink-0">
              <Image
                src={dbUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser.displayName)}&bg=E6DDCF&color=1F3D2B`}
                alt={dbUser.displayName}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-sans font-medium text-[14px] text-text-1 truncate">{dbUser.displayName}</p>
              <p className="font-sans font-light text-[12px] text-text-3 truncate">@{dbUser.username}</p>
            </div>
          </div>

          <Link
            href="/drops/create"
            className="flex items-center justify-center space-x-2 w-full h-[48px] bg-primary text-bg font-sans font-medium text-[14px] rounded-md hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Build a drop</span>
          </Link>
          
          <div className="text-center pt-sm">
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-[72px] lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 h-16 bg-surface border-t border-border flex items-center justify-around z-50 px-md">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center space-y-1 text-text-3 hover:text-primary transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

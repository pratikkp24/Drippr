import { GuestBanner } from "@/components/explore/GuestBanner";
import { ExploreNav } from "@/components/explore/ExploreNav";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <GuestBanner />
      <ExploreNav />
      <main className="max-w-[1200px] mx-auto px-lg pb-3xl w-full">
        {children}
      </main>
    </div>
  );
}

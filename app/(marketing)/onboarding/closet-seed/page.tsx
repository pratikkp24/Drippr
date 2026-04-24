import Link from "next/link";
import { ArrowRight, Link2, Camera } from "lucide-react";
import { StepIndicator } from "@/components/onboarding/StepIndicator";

export default function OnboardingClosetSeedPage() {
  return (
    <main className="min-h-screen bg-bg flex flex-col items-center justify-center p-lg sm:p-xl">
      <div className="w-full max-w-[420px] animate-slideUp">
        <StepIndicator current="closet-seed" />
        <h1 className="fraunces text-[44px] leading-[1.05] text-text-1 mb-sm">
          Start your <em className="italic">closet.</em>
        </h1>
        <p className="font-light text-[15px] text-text-2 mb-2xl">
          Paste a link, upload a photo, or skip and explore first.
        </p>

        <div className="space-y-md mb-2xl">
          <Link
            href="/closet/add?mode=link"
            className="block w-full p-lg bg-surface border border-border rounded-xl hover:border-primary transition-colors group relative"
          >
            <div className="flex items-center space-x-md">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Link2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-sans font-medium text-[16px] text-text-1">
                  Paste a link
                </h3>
                <p className="font-sans font-light text-[13px] text-text-2 mt-0.5">
                  Myntra, Ajio, Zara, & more.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-text-3 group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <Link
            href="/closet/add?mode=upload"
            className="block w-full p-lg bg-surface border border-border rounded-xl hover:border-primary transition-colors group relative"
          >
            <div className="flex items-center space-x-md">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Camera className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-sans font-medium text-[16px] text-text-1">
                  Upload a photo
                </h3>
                <p className="font-sans font-light text-[13px] text-text-2 mt-0.5">
                  We'll automatically remove the background.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-text-3 group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>

        <div className="flex flex-col items-center space-y-md">
          <Link
            href="/home"
            className="w-full flex items-center justify-center h-[54px] bg-primary text-bg font-sans font-medium text-[15px] rounded-md hover:bg-primary-hover transition-colors"
          >
            Take me home
          </Link>
          <Link
            href="/home"
            className="text-[14px] text-text-2 hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Explore first
          </Link>
        </div>
      </div>
    </main>
  );
}

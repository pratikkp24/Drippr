import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-lg">
      <div className="max-w-[440px] text-center animate-slideUp">
        <p className="text-[11px] tracking-[2px] uppercase text-text-3 mb-sm">404</p>
        <h1 className="fraunces text-[40px] leading-[1.05] mb-md">
          We can’t find <em className="italic">that.</em>
        </h1>
        <p className="font-light text-[15px] text-text-2 mb-xl">
          The page might have moved, or it never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-sm justify-center">
          <Link
            href="/home"
            className="h-[48px] px-lg rounded-md bg-primary text-bg font-medium text-[14px] flex items-center justify-center hover:bg-primary-hover transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/explore"
            className="h-[48px] px-lg rounded-md border border-border text-text-1 font-medium text-[14px] flex items-center justify-center hover:border-primary transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </main>
  );
}

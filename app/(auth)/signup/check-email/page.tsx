export default function CheckEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-lg">
      <div className="max-w-[440px] text-center animate-slideUp">
        <div className="text-[22px] font-semibold text-primary mb-2xl">Drippr.</div>
        <h1 className="fraunces text-[40px] leading-[1.05] mb-md">
          Check your <em className="italic">inbox.</em>
        </h1>
        <p className="font-light text-[15px] text-text-2">
          We sent you a link to confirm your email. Tap it to keep going.
        </p>
      </div>
    </main>
  );
}

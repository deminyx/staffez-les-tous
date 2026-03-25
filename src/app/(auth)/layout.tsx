export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-black">
      {/* Decorative grid pattern */}
      <div className="hero-pattern pointer-events-none fixed inset-0" aria-hidden="true" />

      {/* Diagonal accent top-right */}
      <div className="diagonal-accent-lg pointer-events-none fixed opacity-60" aria-hidden="true" />

      {/* Diagonal accent bottom-left */}
      <div className="diagonal-accent-bottom pointer-events-none fixed opacity-40" aria-hidden="true" />

      {/* Red glow */}
      <div
        className="pointer-events-none fixed left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/8 blur-3xl"
        aria-hidden="true"
      />

      <main id="main-content" className="relative z-10 w-full max-w-md px-4 py-8">
        {children}
      </main>
    </div>
  );
}

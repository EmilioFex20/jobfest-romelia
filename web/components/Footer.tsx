export default function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-ink/10">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-ember" />
              <span className="font-display text-xl">JobFest</span>
            </div>
            <p className="mt-2 max-w-md text-sm text-ink/60">
              Plataforma de vinculación laboral — CETYS Universidad Campus
              Mexicali.
            </p>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-ink/50">
            © 2026 · Ingeniería en Software
          </div>
        </div>
      </div>
    </footer>
  );
}

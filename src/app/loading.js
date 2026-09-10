export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#0B0A0C' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-border border-t-brand-accent"></div>
        <p className="text-sm text-brand-tert">Carregando…</p>
      </div>
    </div>
  );
}
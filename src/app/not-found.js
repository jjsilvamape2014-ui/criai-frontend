import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: '#0B0A0C' }}>
      <p className="text-6xl font-black text-brand-accent" style={{ letterSpacing: '-2px' }}>
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-brand-text">Página não encontrada</h1>
      <p className="mt-2 max-w-sm text-sm text-brand-tert">O endereço mudou ou a página não existe mais.</p>
      <Link
        href="/dashboard"
        className="mt-8 rounded-xl bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-bg hover:bg-brand-accentHover transition-colors"
      >
        Ir para criar imagens
      </Link>
    </div>
  );
}
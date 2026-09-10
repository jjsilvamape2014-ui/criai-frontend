'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Criativa AI error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: '#0B0A0C' }}>
      <p className="text-5xl">🙈</p>
      <h1 className="mt-4 text-2xl font-bold text-brand-text">Ops! Algo deu errado.</h1>
      <p className="mt-2 max-w-sm text-sm text-brand-tert">Não foi sua culpa. Tente de novo — normalmente resolve.</p>
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-xl bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-bg hover:bg-brand-accentHover transition-colors"
        >
          Tentar de novo
        </button>
        <a href="/dashboard" className="rounded-xl border border-brand-borderStrong px-6 py-3 text-sm font-semibold text-brand-text hover:border-brand-text transition-colors">
          Ir para o início
        </a>
      </div>
    </div>
  );
}
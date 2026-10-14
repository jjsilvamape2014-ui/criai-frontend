'use client';

// Coisas de "app" que valem em qualquer página:
//  - registra o service worker (permite instalar no celular/computador)
//  - guarda o pedido de instalação do Android/Chrome para o botão "Instalar"
//  - barra de abas embaixo no celular (Criar · Minhas criações · Planos) para quem está logado

import { useEffect, useState } from 'react';

const TABS = [
  { href: '/cerebro', label: 'Criar', d: 'M12 5v14M5 12h14' },
  { href: '/dashboard', label: 'Criações', d: 'M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5' },
  { href: '/plans', label: 'Planos', d: 'M3 7h18v10H3zM3 11h18' },
];

export function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export default function AppShell() {
  const [logged, setLogged] = useState(false);
  const [path, setPath] = useState('');

  useEffect(() => {
    setPath(window.location.pathname);
    try { setLogged(!!localStorage.getItem('token')); } catch {}
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    const onPrompt = (e) => { e.preventDefault(); window.__installPrompt = e; window.dispatchEvent(new Event('criai-install-ready')); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const hide = !logged || !TABS.some((t) => path.startsWith(t.href));
  useEffect(() => {
    document.body.classList.toggle('has-tabbar', !hide);
  }, [hide]);
  if (hide) return null;

  return (
    <nav aria-label="Navegação" className="sm:hidden fixed bottom-0 inset-x-0 z-50 border-t border-brand-border bg-brand-bg/95 backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <ul className="grid grid-cols-3">
        {TABS.map((t) => {
          const on = path.startsWith(t.href);
          return (
            <li key={t.href}>
              <a href={t.href} aria-current={on ? 'page' : undefined} className={`flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${on ? 'text-brand-accent' : 'text-brand-tert'}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={t.d} /></svg>
                {t.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

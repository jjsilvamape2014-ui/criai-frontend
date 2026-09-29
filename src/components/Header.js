'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { clearAuthTokenCookie } from '@/lib/auth-cookie';

const NAV = [
  { href: '/cerebro', label: 'Criar', match: (p) => p.startsWith('/cerebro') },
  { href: '/dashboard#recentes', label: 'Minhas criações', match: (p) => p.startsWith('/dashboard') },
  { href: '/plans', label: 'Planos', match: (p) => p.startsWith('/plans') },
];

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [path, setPath] = useState('');

  useEffect(() => {
    setPath(window.location.pathname);
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(setUser).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearAuthTokenCookie();
    setUser(null);
    window.location.href = '/';
  };

  const credits = user ? (user.creditsImages || 0) + (user.creditsPurchased || 0) : null;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-[1180px] mx-auto h-16 px-4 sm:px-8 flex items-center gap-6">
        <a href={user ? '/cerebro' : '/'} className="font-display font-extrabold text-[17px] text-brand-text shrink-0">
          CRIATIVA<span className="text-brand-accent">.</span>AI
        </a>

        {user && (
          <nav className="hidden sm:flex items-center gap-1 h-full">
            {NAV.map((n) => {
              const active = path && n.match(path);
              return (
                <a
                  key={n.href}
                  href={n.href}
                  className={`relative h-full flex items-center px-3 text-[14px] transition-colors ${active ? 'text-brand-text' : 'text-brand-tert hover:text-brand-text'}`}
                >
                  {n.label}
                  {active && <span className="absolute left-3 right-3 bottom-0 h-[2px] bg-brand-accent rounded-full" />}
                </a>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              {credits !== null && (
                <a
                  href="/plans"
                  className="hidden sm:flex items-center gap-2 rounded-full border border-brand-borderStrong px-3 py-1.5 text-[13px] text-brand-sub hover:text-brand-text hover:border-brand-dim transition-colors"
                  title="Créditos disponíveis"
                >
                  <span className="w-[6px] h-[6px] rounded-full bg-brand-accent" />
                  <span className="tabular-nums">{credits.toLocaleString('pt-BR')}</span> créditos
                </a>
              )}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-9 h-9 rounded-full bg-brand-surface border border-brand-borderStrong flex items-center justify-center text-[14px] font-semibold text-brand-text hover:border-brand-dim transition-colors"
                  aria-label="Conta"
                >
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-brand-borderStrong bg-brand-surface shadow-2xl shadow-black/50 py-2 z-50">
                      <div className="px-4 py-3 border-b border-brand-border">
                        <p className="text-sm font-semibold text-brand-text">{user.name}</p>
                        <p className="text-xs text-brand-tert mt-0.5 truncate">{user.email}</p>
                        <p className="mt-2 text-[11px] uppercase text-brand-accent" style={{ letterSpacing: '1px' }}>
                          {user.plan === 'PREMIUM' ? 'Plano Premium' : 'Plano grátis'}
                        </p>
                      </div>
                      {NAV.map((n) => (
                        <a key={n.href} href={n.href} className="block px-4 py-2.5 text-sm text-brand-sub hover:text-brand-text hover:bg-white/[0.03]">
                          {n.label}
                        </a>
                      ))}
                      {credits !== null && (
                        <a href="/plans" className="sm:hidden block px-4 py-2.5 text-sm text-brand-sub hover:text-brand-text hover:bg-white/[0.03]">
                          {credits.toLocaleString('pt-BR')} créditos
                        </a>
                      )}
                      <div className="border-t border-brand-border mt-1 pt-1">
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-brand-tert hover:text-brand-text hover:bg-white/[0.03]">
                          Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="text-[14px] text-brand-tert hover:text-brand-text transition-colors">Entrar</a>
              <a href="/register" className="rounded-[8px] bg-brand-text px-[18px] py-[9px] text-[14px] font-semibold text-brand-bg hover:opacity-90 transition-opacity">
                Criar conta
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

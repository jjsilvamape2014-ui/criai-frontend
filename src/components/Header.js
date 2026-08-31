'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(setUser).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="font-bold text-xl text-gray-900">Criai</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">Gerador</a>
          <a href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</a>
          <a href="/plans" className="text-gray-600 hover:text-gray-900 font-medium">Planos</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                <span className={`text-xs text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${user.plan === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                      {user.plan === 'PREMIUM' ? '⭐ Premium' : 'Free'}
                    </span>
                  </div>
                  <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</a>
                  <a href="/plans" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Planos & Assinatura</a>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Entrar</a>
              <a href="/register" className="btn-primary text-sm py-2 px-4">Criar conta</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

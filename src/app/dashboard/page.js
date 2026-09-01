'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Header from '@/components/Header';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }

    const params = new URLSearchParams(window.location.search);
    const hasSuccess = params.get('success') === 'true';
    const sessionId = params.get('session_id');

    Promise.all([api.getProfile(), api.getHistory()])
      .then(([profile, hist]) => {
        setUser(profile); setHistory(hist); setLoading(false);
        const confirm = (sid) => api.confirmPayment(sid).then((r) => { if (r.user) setUser(r.user); window.history.replaceState({}, '', '/dashboard'); }).catch(() => {});
        if (sessionId) confirm(sessionId);
        else if (hasSuccess) api.getRecentSession().then((r) => r.sessionId && confirm(r.sessionId)).catch(() => {});
      })
      .catch(() => { localStorage.removeItem('token'); window.location.href = '/login'; });
  }, []);

  const handleDownload = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `criativa-imagem-${index + 1}.png`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleEdit = (item) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('criai_ref_image', item.imageUrl);
      sessionStorage.setItem('criai_ref_prompt', item.prompt);
      window.location.href = '/'; // generator na home lê sessionStorage
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary-800 border-t-primary-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  const totalCredits = (user?.creditsImages || 0) + (user?.creditsPurchased || 0);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pt-36">
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

        {/* Summary cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card-glow">
            <p className="text-sm text-gray-400 mb-1">Plano atual</p>
            <span className={user?.plan === 'PREMIUM' ? 'badge-premium' : 'badge-free'}>
              {user?.plan === 'PREMIUM' ? 'Premium' : 'Free'}
            </span>
          </div>
          <div className="card-glow">
            <p className="text-sm text-gray-400 mb-1">Creditos de imagem</p>
            <p className="text-2xl font-bold text-white">{totalCredits}</p>
            <p className="text-xs text-gray-500">
              {user?.plan === 'PREMIUM' ? 'Premium — sem limite' : `${user?.creditsImages || 0} gratuitos`}
            </p>
          </div>
          <div className="card-glow">
            <p className="text-sm text-gray-400 mb-1">Creditos de video</p>
            <p className="text-2xl font-bold text-white">{user?.creditsVideos || 0}</p>
            <p className="text-xs text-gray-500">
              {user?.plan === 'PREMIUM' ? 'Premium — sem limite' : 'gratis para comecar'}
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a href="/" className="btn-primary text-sm">Gerar nova imagem</a>
          {user?.plan === 'PREMIUM' ? (
            <span className="badge-premium">Premium — crie sem limites</span>
          ) : totalCredits > 0 ? (
            <span className="badge-free">Usando creditos gratuitos</span>
          ) : (
            <a href="/plans" className="btn-secondary text-sm">Assinar Premium — R$ 39,99/mes</a>
          )}
        </div>

        {/* History */}
        <h2 className="text-lg font-semibold text-white mb-4">Suas criacoes</h2>
        {history.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg mb-2">Nenhuma imagem ainda</p>
            <a href="/" className="text-primary-400 font-medium text-sm mt-2 inline-block hover:underline">
              Criar primeira imagem
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((item, i) => (
              <div key={item.id || i} className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 aspect-square hover:border-primary-500/30 transition-all duration-300">
                <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-3">
                  <p className="text-white text-xs mb-2 line-clamp-2">{item.prompt}</p>
                  <button onClick={() => handleEdit(item)} className="text-white text-xs font-semibold mb-1 text-left flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Editar/Refinar
                  </button>
                  <button onClick={() => handleDownload(item.imageUrl, i)} className="text-white text-xs font-medium text-left">Baixar</button>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : item.status === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {item.status === 'COMPLETED' ? '✓' : item.status === 'FAILED' ? '✗' : '...'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

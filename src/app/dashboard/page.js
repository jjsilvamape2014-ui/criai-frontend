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
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const hasSuccess = params.get('success') === 'true';
    const sessionId = params.get('session_id');

    Promise.all([api.getProfile(), api.getHistory()])
      .then(([profile, hist]) => {
        setUser(profile);
        setHistory(hist);
        setLoading(false);

        const confirm = (sid) =>
          api.confirmPayment(sid)
            .then((r) => {
              if (r.user) setUser(r.user);
              window.history.replaceState({}, '', '/dashboard');
            })
            .catch(() => {
              window.history.replaceState({}, '', '/dashboard?error=pagamento');
            });

        if (sessionId) {
          // Tem o session_id direto na URL — confirma agora
          confirm(sessionId);
        } else if (hasSuccess) {
          // Sem session_id na URL — busca a sessão paga mais recente e confirma
          api.getRecentSession()
            .then((r) => r.sessionId && confirm(r.sessionId))
            .catch(() => window.history.replaceState({}, '', '/dashboard'));
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
  }, []);

  const handleDownload = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `criai-imagem-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Cards de resumo */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-gray-500 mb-1">Plano atual</p>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${user?.plan === 'PREMIUM' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                {user?.plan === 'PREMIUM' ? '⭐ PREMIUM' : 'Free'}
              </span>
            </div>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500 mb-1">Créditos de imagem</p>
            <p className="text-2xl font-bold text-gray-900">{totalCredits}</p>
            <p className="text-xs text-gray-400">
              {user?.plan === 'PREMIUM' ? '✅ Premium — sem limite' : `${user?.creditsImages || 0} gratuitos para começar`}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500 mb-1">Créditos de vídeo</p>
            <p className="text-2xl font-bold text-gray-900">{user?.creditsVideos || 0}</p>
            <p className="text-xs text-gray-400">
              {user?.plan === 'PREMIUM' ? '✅ Premium — sem limite' : 'grátis para começar'}
            </p>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="flex gap-3 mb-8">
          <a href="/" className="btn-primary text-sm">✨ Gerar nova imagem</a>
          {user?.plan === 'PREMIUM' ? (
            <span className="inline-flex items-center px-4 py-3 rounded-xl bg-amber-50 text-amber-700 text-sm font-semibold">
              ⭐ Você é Premium — crie sem limites
            </span>
          ) : (
            (totalCredits + (user?.creditsVideos || 0)) > 0 ? (
              <span className="inline-flex items-center px-4 py-3 rounded-xl bg-green-50 text-green-700 text-sm font-semibold">
                ✅ Usando créditos gratuitos
              </span>
            ) : (
              <a href="/plans" className="btn-secondary text-sm">⭐ Assinar Premium — R$ 39,99/mês</a>
            )
          )}
        </div>

        {/* Histórico */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Suas criações</h2>
        {history.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg mb-2">🎨</p>
            <p className="text-gray-500">Você ainda não gerou nenhuma imagem</p>
            <a href="/" className="text-primary-600 font-medium text-sm mt-2 inline-block hover:underline">
              Criar primeira imagem →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((item, i) => (
              <div key={item.id || i} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square">
                <img 
                  src={item.imageUrl} 
                  alt={item.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs mb-2 line-clamp-2">{item.prompt}</p>
                  <button
                    onClick={() => handleDownload(item.imageUrl, i)}
                    className="text-white text-sm font-medium flex items-center gap-1"
                  >
                    ⬇️ Baixar
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : item.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status === 'COMPLETED' ? '✓' : item.status === 'FAILED' ? '✗' : '⋯'}
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

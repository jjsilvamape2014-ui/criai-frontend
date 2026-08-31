'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(setUser).catch(() => {});
      // Buscar imagens recentes para servir de origem do vídeo
      api.getHistory().then(setHistory).catch(() => {});
    }
  }, []);

  const recentImages = (history || []).filter(g => g.type === 'IMAGE' && g.imageUrl);

  const handleGenerate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    if (!imageUrl.trim()) {
      setError({ type: 'GENERIC', message: 'Cole a URL de uma imagem ou escolha uma das suas criações.' });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.generateVideo(imageUrl.trim());
      setResult(data);
      setUser(prev => prev ? { ...prev, ...data.credits } : null);
    } catch (err) {
      if (err.data?.code === 'NO_CREDITS') {
        setError({ type: 'NO_CREDITS', message: 'Seus créditos de vídeo acabaram! Assine o plano por R$ 39,99/mês.' });
      } else {
        setError({ type: 'GENERIC', message: err.message || 'Erro ao gerar vídeo. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result?.videoUrl) return;
    const link = document.createElement('a');
    link.href = result.videoUrl;
    link.download = 'criai-video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const credits = user ? (user.creditsVideos || 0) + (user.creditsPurchased || 0) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <h3 className="font-semibold text-gray-900 mb-1">Transforme uma imagem em vídeo</h3>
        <p className="text-sm text-gray-500 mb-4">Cole a URL de uma imagem, ou escolha uma das suas criações, e a IA anima com movimento natural.</p>

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Imagem de origem
        </label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://... ou data:image/png;base64,...."
          className="input mb-4"
        />

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Movimento desejado (opcional)
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: o gato pisca o olho e mexe a cabeça suavemente"
          className="input mb-5"
        />

        {recentImages.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium text-gray-500 mb-2">Ou escolha de suas criações:</p>
            <div className="flex gap-2 flex-wrap">
              {recentImages.slice(0, 8).map((img, i) => (
                <button
                  key={img.id || i}
                  onClick={() => setImageUrl(img.imageUrl)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    imageUrl === img.imageUrl ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Gerando vídeo (pode demorar)...
              </>
            ) : (
              <>🎬 Gerar Vídeo (1 crédito)</>
            )}
          </button>

          {user && (
            <span className="text-sm text-gray-500">
              🎬 <b className="text-gray-900">{credits}</b> créditos
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className={`rounded-xl p-4 mb-6 ${error.type === 'NO_CREDITS' ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm font-medium ${error.type === 'NO_CREDITS' ? 'text-amber-800' : 'text-red-800'}`}>
            {error.message}
          </p>
          {error.type === 'NO_CREDITS' && (
            <a href="/plans" className="inline-block mt-2 text-sm text-primary-600 font-semibold hover:underline">
              Ver planos e recargas →
            </a>
          )}
        </div>
      )}

      {result?.videoUrl && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Vídeo gerado</h3>
            <button onClick={handleDownload} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              ⬇️ Baixar
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
            <video src={result.videoUrl} controls className="w-full h-auto max-h-[500px]" />
          </div>
          {prompt && <p className="mt-3 text-sm text-gray-500 italic">&quot;{prompt}&quot;</p>}
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Crie sua conta gratuita</h3>
            <p className="text-gray-500 mb-6">Ganhe 2 vídeos grátis todo mês. Sem cartão de crédito.</p>
            <div className="space-y-3">
              <a href="/register" className="btn-primary block text-center">Criar conta grátis</a>
              <a href="/login" className="btn-secondary block text-center">Já tenho conta</a>
            </div>
            <button onClick={() => setShowLoginModal(false)} className="mt-4 text-sm text-gray-400 hover:text-gray-600 w-full">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

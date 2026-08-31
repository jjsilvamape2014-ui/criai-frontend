'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import TextOnImage from '@/components/TextOnImage';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [model, setModel] = useState('ideogram4');
  const [resolution, setResolution] = useState('2k');
  const [upscale, setUpscale] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTextTool, setShowTextTool] = useState(false);
  const [finalImage, setFinalImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(setUser).catch(() => {});
      api.getHistory().then(setHistory).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const p = e.detail?.prompt;
      if (p) setPrompt(p);
    };
    window.addEventListener('criai:set-prompt', handler);
    return () => window.removeEventListener('criai:set-prompt', handler);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) { setShowLoginModal(true); return; }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const dims = resolution === '4k' ? { width: 2048, height: 2048 } : resolution === '1k' ? { width: 1024, height: 1024 } : { width: 1536, height: 1536 };
      const data = await api.generateImage(prompt, { negativePrompt, model, ...dims, upscale });
      setResult(data);
      setUser(prev => prev ? { ...prev, ...data.credits } : null);
      setShowTextTool(false);
      setHistory(prev => [{ id: data.generationId, prompt, imageUrl: data.imageUrl, type: 'IMAGE', status: 'COMPLETED', createdAt: new Date().toISOString() }, ...prev].slice(0, 12));
    } catch (err) {
      if (err.data?.code === 'NO_CREDITS') {
        setError({ type: 'NO_CREDITS', message: 'Seus creditos acabaram! Assine o plano por R$ 39,99/mes para continuar criando.' });
      } else {
        setError({ type: 'GENERIC', message: err.message || 'Erro ao gerar imagem. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `criai-imagem-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const models = [
    { id: 'ideogram4', name: 'Ideogram 4', desc: 'Melhor para design e texto', premium: true },
    { id: 'flux2pro', name: 'FLUX 2 Pro', desc: 'Fotorrealismo maximo', premium: true },
    { id: 'flux', name: 'FLUX Schnell', desc: 'Rapido (gratis)', premium: false },
    { id: 'sdxl', name: 'SDXL', desc: 'Versatil (gratis)', premium: false },
  ];

  const resolutions = [
    { id: '1k', name: '1K', desc: 'Rapido' },
    { id: '2k', name: '2K', desc: 'Alta' },
    { id: '4k', name: '4K', desc: 'Maxima' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Prompt area */}
      <div className="card mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Descreva sua imagem</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Um gato astronauta flutuando no espaco, estilo pixel art, cores vibrantes..."
          className="input min-h-[100px] resize-none mb-3"
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>{prompt.length}/500</span>
          <span>Quanto mais detalhes, melhor o resultado</span>
        </div>

        {/* Advanced options */}
        <details className="mb-4">
          <summary className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">Opcoes avancadas</summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Prompt negativo (o que evitar)</label>
              <input type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="Ex: blurry, low quality, deformed" className="input text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Modelo</label>
              <div className="flex gap-2 flex-wrap">
                {models.map(m => (
                  <button key={m.id} onClick={() => setModel(m.id)} title={m.premium ? 'Modelo premium (qualidade superior)' : 'Modelo gratuito'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      model === m.id ? 'border-primary-500 bg-primary-500/10 text-primary-300' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}>
                    {m.name} {m.premium && <span className="text-[9px] align-middle">⭐</span>}
                    <span className="block text-xs font-normal opacity-60">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Resolucao</label>
              <div className="flex gap-2 flex-wrap">
                {resolutions.map(r => (
                  <button key={r.id} onClick={() => setResolution(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      resolution === r.id ? 'border-primary-500 bg-primary-500/10 text-primary-300' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}>
                    {r.name} <span className="text-[10px] font-normal opacity-60">({r.desc})</span>
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={upscale} onChange={(e) => setUpscale(e.target.checked)} className="accent-primary-500 w-4 h-4" />
              Upscale 4K (nitidez maxima)
            </label>
          </div>
        </details>

        {/* Generate button + credits */}
        <div className="flex items-center justify-between">
          <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="btn-primary flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Gerando...
              </>
            ) : 'Gerar Imagem (1 credito)'}
          </button>
          {user && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400">
                <b className="text-white">{user.creditsImages + user.creditsPurchased}</b> creditos
              </span>
              <a href="/plans" className="text-primary-400 hover:text-primary-300 font-medium">+ Recarregar</a>
            </div>
          )}
        </div>
      </div>

      {/* Errors */}
      {error && (
        <div className={`rounded-xl p-4 mb-6 border ${error.type === 'NO_CREDITS' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <p className={`text-sm font-medium ${error.type === 'NO_CREDITS' ? 'text-amber-300' : 'text-red-300'}`}>{error.message}</p>
          {error.type === 'NO_CREDITS' && (
            <a href="/plans" className="inline-block mt-2 text-sm text-primary-400 font-semibold hover:underline">Ver planos e recargas</a>
          )}
        </div>
      )}

      {/* Result */}
      {result?.imageUrl && (
        <div className="card mb-8 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Resultado</h3>
            <div className="flex items-center gap-3">
              {!showTextTool && (
                <button onClick={() => setShowTextTool(true)} className="text-sm bg-primary-500/10 text-primary-300 hover:bg-primary-500/20 font-medium px-3 py-1.5 rounded-lg transition-colors">
                  Adicionar texto em portugues
                </button>
              )}
              <button onClick={() => handleDownload(finalImage || result.imageUrl)} className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1">
                Baixar
              </button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img src={finalImage || result.imageUrl} alt="Imagem gerada" className="w-full h-auto max-h-[600px] object-contain" />
          </div>
          <p className="mt-3 text-sm text-gray-500 italic">"{prompt}"</p>
          {showTextTool && (
            <div className="mt-4">
              <TextOnImage baseImageUrl={result.imageUrl} onExport={(dataUrl) => { setFinalImage(dataUrl); setShowTextTool(false); }} />
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-white mb-4">Suas criacoes recentes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((item, i) => (
              <div key={item.id || i} className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 aspect-square hover:border-primary-500/30 transition-all duration-300">
                <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleDownload(item.imageUrl)} className="text-white text-sm font-medium flex items-center gap-1">Baixar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl animate-fade-up">
            <h3 className="text-xl font-bold text-white mb-2">Crie sua conta gratuita</h3>
            <p className="text-gray-400 mb-6">Ganhe 10 imagens e 2 videos gratis todo mes. Sem cartao de credito.</p>
            <div className="space-y-3">
              <a href="/register" className="btn-primary block text-center">Criar conta gratis</a>
              <a href="/login" className="btn-secondary block text-center">Ja tenho conta</a>
            </div>
            <button onClick={() => setShowLoginModal(false)} className="mt-4 text-sm text-gray-500 hover:text-gray-300 w-full transition-colors">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

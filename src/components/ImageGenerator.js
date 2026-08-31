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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const dims = resolution === '4k' ? { width: 2048, height: 2048 } : resolution === '1k' ? { width: 1024, height: 1024 } : { width: 1536, height: 1536 };
      const data = await api.generateImage(prompt, {
        negativePrompt,
        model,
        ...dims,
        upscale
      });

      setResult(data);
      setUser(prev => prev ? { ...prev, ...data.credits } : null);
      setShowTextTool(false);

      // Atualizar histórico
      const newGen = {
        id: data.generationId,
        prompt,
        imageUrl: data.imageUrl,
        type: 'IMAGE',
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      };
      setHistory(prev => [newGen, ...prev].slice(0, 12));
    } catch (err) {
      if (err.data?.code === 'NO_CREDITS') {
        setError({ type: 'NO_CREDITS', message: 'Seus créditos acabaram! Assine o plano por R$ 39,99/mês para continuar criando.' });
      } else {
        setError({ type: 'GENERIC', message: err.message || 'Erro ao gerar imagem. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `criai-imagem-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const models = [
    { id: 'ideogram4', name: 'Ideogram 4', desc: 'Melhor para design e texto', premium: true },
    { id: 'flux2pro', name: 'FLUX 2 Pro', desc: 'Fotorrealismo máximo', premium: true },
    { id: 'flux', name: 'FLUX Schnell', desc: 'Rápido (grátis)', premium: false },
    { id: 'sdxl', name: 'SDXL', desc: 'Versátil (grátis)', premium: false },
  ];

  const resolutions = [
    { id: '1k', name: '1K', desc: 'Rápido' },
    { id: '2k', name: '2K', desc: 'Alta' },
    { id: '4k', name: '4K', desc: 'Máxima' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Área de prompt */}
      <div className="card mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descreva sua imagem
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Um gato astronauta flutuando no espaço, estilo pixel art, cores vibrantes..."
          className="input min-h-[100px] resize-none mb-3"
          maxLength={500}
        />
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>{prompt.length}/500</span>
          <span>Quanto mais detalhes, melhor o resultado</span>
        </div>

        {/* Opções avançadas */}
        <details className="mb-4">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Opções avançadas
          </summary>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Prompt negativo (o que evitar)</label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Ex: blurry, low quality, deformed"
                className="input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Modelo</label>
              <div className="flex gap-2 flex-wrap">
                {models.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    title={m.premium ? 'Modelo premium (qualidade superior)' : 'Modelo gratuito'}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      model === m.id 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {m.name} {m.premium && <span className="text-[9px] align-middle">⭐</span>}
                    <span className="block text-xs font-normal text-gray-400">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Resolução</label>
              <div className="flex gap-2 flex-wrap">
                {resolutions.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setResolution(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                      resolution === r.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {r.name} <span className="text-[10px] font-normal text-gray-400">({r.desc})</span>
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={upscale}
                onChange={(e) => setUpscale(e.target.checked)}
                className="accent-primary-600 w-4 h-4"
              />
              Upscale 4K (nitidez máxima)
            </label>
          </div>
        </details>

        {/* Botão gerar + créditos */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Gerando...
              </>
            ) : (
              <>✨ Gerar Imagem (1 crédito)</>
            )}
          </button>

          {user && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500">
                🎨 <b className="text-gray-900">{user.creditsImages + user.creditsPurchased}</b> créditos
              </span>
              <a href="/plans" className="text-primary-600 hover:text-primary-700 font-medium">
                + Recarregar
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Erros */}
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

      {/* Resultado */}
      {result?.imageUrl && (
        <div className="card mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Resultado</h3>
            <div className="flex items-center gap-3">
              {!showTextTool && (
                <button
                  onClick={() => setShowTextTool(true)}
                  className="text-sm bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium px-3 py-1.5 rounded-lg"
                >
                  ✏️ Adicionar texto em português
                </button>
              )}
              <button
                onClick={() => handleDownload(finalImage || result.imageUrl, 0)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                ⬇️ Baixar
              </button>
            </div>
          </div>

          {finalImage ? (
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
              <img
                src={finalImage}
                alt="Imagem final com texto"
                className="w-full h-auto max-h-[600px] object-contain"
              />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
              <img
                src={result.imageUrl}
                alt="Imagem gerada"
                className="w-full h-auto max-h-[600px] object-contain"
              />
            </div>
          )}
          <p className="mt-3 text-sm text-gray-500 italic">"{prompt}"</p>

          {/* Ferramenta de texto em português */}
          {showTextTool && (
            <div className="mt-4">
              <TextOnImage
                baseImageUrl={result.imageUrl}
                onExport={(dataUrl) => {
                  setFinalImage(dataUrl);
                  setShowTextTool(false);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Histórico */}
      {history.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Suas criações recentes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((item, i) => (
              <div key={item.id || i} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square">
                <img 
                  src={item.imageUrl} 
                  alt={item.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDownload(item.imageUrl, i)}
                    className="text-white text-sm font-medium flex items-center gap-1"
                  >
                    ⬇️ Baixar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Crie sua conta gratuita</h3>
            <p className="text-gray-500 mb-6">Ganhe 10 imagens e 2 vídeos grátis todo mês. Sem cartão de crédito.</p>
            <div className="space-y-3">
              <a href="/register" className="btn-primary block text-center">Criar conta grátis</a>
              <a href="/login" className="btn-secondary block text-center">Já tenho conta</a>
            </div>
            <button 
              onClick={() => setShowLoginModal(false)}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 w-full"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

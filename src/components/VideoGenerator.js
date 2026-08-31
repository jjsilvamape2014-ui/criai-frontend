'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

export default function VideoGenerator() {
  const [mode, setMode] = useState('product');
  const [prompt, setPrompt] = useState('');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const [imageData, setImageData] = useState('');
  const [preview, setPreview] = useState('');
  const fileRef = useRef(null);

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
      api.getHistory().then(setHistory).catch(() => {});
    }
  }, []);

  const recentImages = (history || []).filter(g => g.type === 'IMAGE' && g.imageUrl);

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImageData(dataUrl);
      setImageUrl('');
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectRecent = (url) => {
    setImageData('');
    setImageUrl(url);
    setPreview(url);
  };

  const handleGenerate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    if (!imageData && !imageUrl.trim()) {
      setError({ type: 'GENERIC', message: 'Envie uma foto do seu produto ou escolha uma imagem.' });
      return;
    }
    if (mode === 'product' && !productName.trim()) {
      setError({ type: 'GENERIC', message: 'Informe o nome do produto para o anúncio.' });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const options = { mode };
    if (imageData) options.imageData = imageData;
    if (mode === 'product') {
      options.prompt = prompt;
      options.productName = productName;
      options.productDesc = productDesc;
    } else {
      options.prompt = prompt;
    }

    try {
      const data = await api.generateVideo(imageData ? '' : imageUrl.trim(), options);
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
    link.download = 'criai-anuncio-produto.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const credits = user ? (user.creditsVideos || 0) + (user.creditsPurchased || 0) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setMode('product')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${
              mode === 'product'
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30'
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-primary-300'
            }`}
          >
            📦 Anúncio de produto
          </button>
          <button
            onClick={() => setMode('animate')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${
              mode === 'animate'
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30'
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-primary-300'
            }`}
          >
            🎞️ Animar imagem
          </button>
        </div>

        {mode === 'product' && (
          <p className="text-sm text-primary-700 font-medium mb-4">
            Envie a foto do seu produto e crie um <b>anúncio em vídeo</b> para vender — igual aos vídeos de apresentação de produtos em marketplaces. Perfeito pra sua loja!
          </p>
        )}
        {mode === 'animate' && (
          <p className="text-sm text-gray-500 mb-4">Envie uma imagem ou escolha uma das suas criações, e a IA anima com movimento natural.</p>
        )}

        {/* Upload / origem */}
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {mode === 'product' ? '📷 Foto do produto' : '🖼️ Imagem de origem'}
        </label>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files?.[0])}
        />

        <div className="flex items-start gap-4">
          {preview ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-primary-400 group shrink-0"
            >
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Trocar foto
              </span>
            </button>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-36 h-36 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary-500 transition-all shrink-0"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-xs">Enviar foto</span>
            </button>
          )}

          <div className="flex-1">
            {recentImages.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-500 mb-2">Ou use uma das suas criações:</p>
                <div className="flex gap-2 flex-wrap">
                  {recentImages.slice(0, 6).map((img, i) => (
                    <button
                      key={img.id || i}
                      onClick={() => handleSelectRecent(img.imageUrl)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        preview === img.imageUrl ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {preview && (
              <button
                onClick={() => { setPreview(''); setImageData(''); setImageUrl(''); }}
                className="text-xs text-gray-400 hover:text-red-500 font-medium mt-1"
              >
                ✕ Remover imagem
              </button>
            )}
          </div>
        </div>

        {/* Campos do modo produto */}
        {mode === 'product' && (
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Nome do produto</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder='Ex: "Fritadeira Air Fryer 10L"'
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">✨ Destaques / vantagens (opcional)</label>
              <input
                type="text"
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder='Ex: "frita sem óleo, painel digital, 10 tamanhos"'
                className="input"
              />
            </div>
          </div>
        )}

        {/* Movimento personalizado */}
        {mode === 'animate' && (
          <div className="mt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Movimento desejado (opcional)</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: o produto gira lentamente mostrando os detalhes"
              className="input"
            />
          </div>
        )}
        {mode === 'product' && (
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Estilo do anúncio (opcional)</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Ex: "fundo branco limpo, luz de estúdio, câmera girando no produto"'
              className="input"
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
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
                {mode === 'product' ? 'Criando seu anúncio (pode demorar)...' : 'Gerando vídeo (pode demorar)...'}
              </>
            ) : (
              <>🎬 {mode === 'product' ? 'Criar anúncio (1 crédito)' : 'Gerar vídeo (1 crédito)'}</>
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
            <h3 className="font-semibold text-gray-900">
              {mode === 'product' ? '🎬 Anúncio do produto criado!' : 'Vídeo gerado'}
            </h3>
            <button onClick={handleDownload} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              ⬇️ Baixar
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
            <video src={result.videoUrl} controls className="w-full h-auto max-h-[500px]" />
          </div>
          {productName && <p className="mt-3 text-sm text-gray-500">📦 Anúncio para: <b className="text-gray-700">{productName}</b></p>}
          {prompt && <p className="mt-1 text-sm text-gray-500 italic">&quot;{prompt}&quot;</p>}
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

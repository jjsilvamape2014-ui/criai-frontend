'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

// Estilos de anúncio em vídeo — o "Afiliado Shopee" é o estilo de apresentação de
// produto usado pelos afiliados pra vender no marketplace.
const AD_STYLES = [
  { key: 'afiliado', label: '🛍️ Afiliado Shopee' },
  { key: 'promo', label: '⚡ Impulso (mktplace)' },
  { key: 'brasil', label: '🇧🇷 Energia BR' },
  { key: 'empresa', label: '🏢 Empresa' },
  { key: 'logo', label: '🔤 Logo' },
  { key: 'hero', label: '🎯 Hero shot' },
  { key: 'orbit', label: '🔄 Rotação 360°' },
  { key: 'lifestyle', label: '🌇 Lifestyle' },
  { key: 'elegant', label: '💎 Elegante' },
];

export default function VideoGenerator() {
  const [mode, setMode] = useState('product');
  const [prompt, setPrompt] = useState('');
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [preset, setPreset] = useState('afiliado');
  const [script, setScript] = useState('');
  const [liveStatus, setLiveStatus] = useState('');

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

  // Recebe a imagem vinda do "Criar anúncio em vídeo" (card da imagem gerada)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const vidImg = sessionStorage.getItem('criai_video_image');
    const vidName = sessionStorage.getItem('criai_video_name');
    if (vidImg) {
      setImageData('');
      setImageUrl(vidImg);
      setPreview(vidImg);
      sessionStorage.removeItem('criai_video_image');
    }
    if (vidName) {
      setProductName(String(vidName).slice(0, 60));
      sessionStorage.removeItem('criai_video_name');
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
    // Estilos focados em produto pedem o nome; Empresa/Logo animam a marca em si
    const NEEDS_PRODUCT_NAME = ['afiliado', 'promo', 'brasil', 'hero', 'orbit', 'lifestyle', 'elegant'];
    if (mode === 'product' && NEEDS_PRODUCT_NAME.includes(preset) && !productName.trim()) {
      setError({ type: 'GENERIC', message: 'Informe o nome do produto para o anúncio.' });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setLiveStatus('');

    if (mode === 'talking') {
      const payload = { productName, productDesc, script };
      if (productPrice.trim()) payload.productPrice = productPrice.trim();
      if (imageData) {
        payload.imageData = imageData;
      } else {
        payload.imageUrl = imageUrl.trim();
      }
      try {
        const data = await api.generateTalkingAd(payload, setLiveStatus);
        setResult(data);
        setUser(prev => prev ? { ...prev, ...data.credits } : null);
      } catch (err) {
        if (err.data?.code === 'NO_CREDITS') {
          setError({ type: 'NO_CREDITS', message: 'Seus créditos de vídeo acabaram! Assine o plano por R$ 39,99/mês.' });
        } else {
          setError({ type: 'GENERIC', message: err.message || 'Erro ao gerar o anúncio falado. Tente novamente.' });
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    const options = { mode, preset };
    if (imageData) options.imageData = imageData;
    if (mode === 'product') {
      options.prompt = prompt;
      options.productName = productName;
      options.productDesc = productDesc;
      if (productPrice.trim()) options.productPrice = productPrice.trim();
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
          <button
            onClick={() => setMode('talking')}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all border ${
              mode === 'talking'
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30'
                : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-primary-300'
            }`}
          >
            🎤 Anúncio falado
          </button>
        </div>

        {mode === 'product' && (
          <p className="text-sm text-primary-700 font-medium mb-4">
            Envie a foto do seu produto e crie um <b>anúncio em vídeo</b> para vender — igual aos vídeos de apresentação de produtos em marketplaces. Perfeito pra sua loja ou pra divulgar como <b>afiliado</b> no Shopee/Mercado Livre!
          </p>
        )}
        {mode === 'animate' && (
          <p className="text-sm text-gray-500 mb-4">Envie uma imagem ou escolha uma das suas criações, e a IA anima com movimento natural.</p>
        )}
        {mode === 'talking' && (
          <p className="text-sm text-primary-700 font-medium mb-4">
            Envie a foto do seu produto e crie um <b>anúncio falado</b>: uma apresentadora IA segura o produto,
            olha pra câmera e <b>fala o roteiro em português</b> — igual aos vídeos dos afiliados do Shopee.
            A IA escreve o roteiro, gera a voz e anima os lábios. Você também pode escrever o roteiro.
          </p>
        )}

        {mode !== 'talking' && (
          <div className="mb-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gray-700">
                {mode === 'product' ? '🎬 Estilo do anúncio em vídeo' : '🎬 Estilo do vídeo'}
              </p>
              <a
                href={`https://www.pinterest.com/search/videos/?q=${encodeURIComponent(AD_STYLES.find((s) => s.key === preset)?.label.replace(' ', '') || 'anuncio de produto')}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2"
              >
                Ver exemplos no Pinterest →
              </a>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {AD_STYLES.map((st) => (
                <button
                  key={st.key}
                  onClick={() => setPreset(st.key)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all border ${
                    preset === st.key
                      ? 'bg-primary-600 text-white border-primary-600 shadow'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              O "Afiliado Shopee" é o estilo dos anúncios que os afiliados usam pra apresentar o produto e vender
              no marketplace. "Empresa" e "Logo" criam vídeos de apresentação da sua marca. Se escrever um
              movimento próprio abaixo, ele vale mais que o estilo.
            </p>
          </div>
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
          <div className="grid sm:grid-cols-3 gap-4 mt-5">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">💸 Preço (opcional)</label>
              <input
                type="text"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder='Ex: "49,90"'
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

        {/* Campos do anúncio falado */}
        {mode === 'talking' && (
          <div className="mt-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ Nome do produto</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder='Ex: "Tênis Runner Plus"'
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">💸 Preço (opcional)</label>
                <input
                  type="text"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder='Ex: "89,90"'
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">✨ Vantagens (opcional)</label>
                <input
                  type="text"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder='Ex: "leve, confortável, ideal pra corrida"'
                  className="input"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">🎙️ Roteiro (opcional — a IA escreve se deixar em branco)</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={3}
                placeholder="Ex: Olha só que achado! Esse tênis é leve, confortável e por só R$ 89,90. Corre que é por tempo limitado!"
                className="input resize-none"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">🎥 Movimento próprio (opcional, vale mais que o estilo)</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Ex: "câmera dá zoom rápido mostrando o produto chegando de trás"'
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
                {mode === 'product' ? 'Criando seu anúncio (pode demorar)...' : mode === 'talking' ? 'Criando o anúncio falado (leva ~1 min)...' : 'Gerando vídeo (pode demorar)...'}
              </>
            ) : (
              <>🎬 {mode === 'talking' ? '🎤 Criar anúncio falado (1 crédito)' : mode === 'product' ? 'Criar anúncio (1 crédito)' : 'Gerar vídeo (1 crédito)'}</>
            )}
          </button>

          {user && (
            <span className="text-sm text-gray-500">
              🎬 <b className="text-gray-900">{credits}</b> créditos
            </span>
          )}
        </div>

        {loading && liveStatus && (
          <p className="mt-4 text-sm text-primary-700 font-medium animate-pulse flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary-500 animate-ping" />
            ✨ {liveStatus}
          </p>
        )}
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
              {mode === 'product' ? '🎬 Anúncio do produto criado!' : mode === 'talking' ? '🎤 Anúncio falado criado!' : 'Vídeo gerado'}
            </h3>
            <button onClick={handleDownload} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              ⬇️ Baixar
            </button>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
            <video src={result.videoUrl} controls className="w-full h-auto max-h-[500px]" />
          </div>
          {result?.script && (
            <p className="mt-3 text-sm text-gray-500">🎙️ Roteiro: <b className="text-gray-700">&quot;{result.script}&quot;</b></p>
          )}
          {productName && <p className="mt-3 text-sm text-gray-500">📦 Anúncio para: <b className="text-gray-700">{productName}</b></p>}
          {preset && mode !== 'talking' && !prompt.trim() && (
            <p className="mt-1 text-sm text-gray-500">🎬 Estilo: <b className="text-gray-700">{AD_STYLES.find((s) => s.key === preset)?.label || preset}</b></p>
          )}
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

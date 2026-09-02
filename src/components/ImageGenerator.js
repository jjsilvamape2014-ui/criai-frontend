'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import TextOnImage from '@/components/TextOnImage';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTextTool, setShowTextTool] = useState(false);
  const [finalImage, setFinalImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(setUser).catch(() => {});
      api.getHistory().then(setHistory).catch(() => {});
    }
    if (typeof window !== 'undefined') {
      const refImg = sessionStorage.getItem('criai_ref_image');
      const refPrompt = sessionStorage.getItem('criai_ref_prompt');
      if (refImg) { setReferenceImage(refImg); sessionStorage.removeItem('criai_ref_image'); }
      if (refPrompt) { setPrompt(refPrompt); sessionStorage.removeItem('criai_ref_prompt'); }
    }
  }, []);

  useEffect(() => {
    const handler = (e) => { const p = e.detail?.prompt; if (p) setPrompt(p); };
    const refHandler = (e) => { const ref = e.detail?.image; if (ref) setReferenceImage(ref); };
    window.addEventListener('criai:set-prompt', handler);
    window.addEventListener('criai:set-reference', refHandler);
    return () => {
      window.removeEventListener('criai:set-prompt', handler);
      window.removeEventListener('criai:set-reference', refHandler);
    };
  }, []);

  // Foca o campo quando a página carrega (estilo Kimi/Gemini)
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError({ type: 'GENERIC', message: 'Envie um arquivo de imagem válido.' }); return; }
    const reader = new FileReader();
    reader.onload = () => { setReferenceImage(reader.result); e.target.value = ''; };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) { setShowLoginModal(true); return; }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.generateImage(prompt, {
        model: 'flux2pro',
        width: 1536, height: 1536,
        ...(referenceImage ? { referenceImage, strength: 0.6 } : {}),
      });
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

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `criativa-imagem-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Caixa de prompt central estilo Kimi */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur shadow-2xl shadow-primary-900/20 overflow-hidden">
        <textarea
          ref={inputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Descreva a imagem que você quer criar..."
          className="w-full bg-transparent text-white placeholder-gray-500 px-5 pt-5 pb-4 text-base sm:text-lg outline-none resize-none min-h-[90px] leading-relaxed"
          maxLength={500}
        />

        {/* Barra inferior: anexar + gerar */}
        <div className="flex items-center justify-between px-4 pb-4 gap-3">
          <div className="flex items-center gap-1">
            {/* Anexar imagem */}
            <label className="p-2 rounded-lg text-gray-400 hover:text-primary-300 hover:bg-white/5 cursor-pointer transition-colors" title="Anexar imagem (opcional)">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            {referenceImage && (
              <button onClick={() => setReferenceImage(null)} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-500/15 border border-primary-500/25 text-primary-300 text-xs font-medium hover:bg-primary-500/25 transition-colors">
                <span className="w-4 h-4 rounded overflow-hidden border border-white/20"><img src={referenceImage} alt="" className="w-full h-full object-cover" /></span>
                imagem
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary-600/25"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Gerando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" /></svg>
                Gerar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Créditos */}
      <div className="flex items-center justify-center gap-3 mt-4 text-sm">
        {user && (
          <span className="text-gray-400">
            <b className="text-white">{user.creditsImages + user.creditsPurchased}</b> creditos
          </span>
        )}
        <a href={user ? "/plans" : "/login"} className="text-primary-400 hover:text-primary-300 font-medium text-xs">
          {user ? '+ Recarregar' : 'Entrar para gerar'}
        </a>
        <span className="text-gray-600 text-xs">Enter para gerar · Anexe imagem para editar</span>
      </div>

      {/* Erros */}
      {error && (
        <div className={`rounded-xl p-4 mt-5 border ${error.type === 'NO_CREDITS' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <p className={`text-sm font-medium ${error.type === 'NO_CREDITS' ? 'text-amber-300' : 'text-red-300'}`}>{error.message}</p>
          {error.type === 'NO_CREDITS' && (
            <a href="/plans" className="inline-block mt-2 text-sm text-primary-400 font-semibold hover:underline">Ver planos e recargas</a>
          )}
        </div>
      )}

      {/* Resultado */}
      {result?.imageUrl && (
        <div className="mt-8 card animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Resultado</h3>
            <div className="flex items-center gap-3">
              {!showTextTool && (
                <button onClick={() => setShowTextTool(true)} className="text-sm bg-primary-500/10 text-primary-300 hover:bg-primary-500/20 font-medium px-3 py-1.5 rounded-lg transition-colors">
                  Adicionar texto
                </button>
              )}
              <button onClick={() => handleDownload(finalImage || result.imageUrl)} className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1">Baixar</button>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
            <img src={finalImage || result.imageUrl} alt="Imagem gerada" className="w-full h-auto max-h-[600px] object-contain" />
          </div>
          {showTextTool && (
            <div className="mt-4">
              <TextOnImage baseImageUrl={result.imageUrl} onExport={(dataUrl) => { setFinalImage(dataUrl); setShowTextTool(false); }} />
            </div>
          )}
        </div>
      )}

      {/* Histórico */}
      {history.length > 0 && (
        <div className="mt-10">
          <h3 className="font-semibold text-white mb-4 text-sm text-gray-400">Suas criacoes recentes</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {history.map((item, i) => (
              <div key={item.id || i} className="group relative rounded-lg overflow-hidden border border-white/10 bg-white/5 aspect-square hover:border-primary-500/30 transition-all duration-300">
                <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button onClick={() => { setReferenceImage(item.imageUrl); }} className="text-white text-[10px] font-semibold hover:text-primary-300 p-1 rounded" title="Usar como referência">✎</button>
                  <button onClick={() => handleDownload(item.imageUrl)} className="text-white text-[10px] font-semibold hover:text-primary-300 p-1 rounded" title="Baixar">⬇</button>
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

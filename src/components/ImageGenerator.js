'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile().then(setUser).catch(() => {});
      api.getHistory().then(setHistory).catch(() => {});
    }
    if (typeof window !== 'undefined') {
      const refImg = sessionStorage.getItem('criai_ref_image');
      const refPrompt = sessionStorage.getItem('criai_ref_prompt');
      if (refImg) {
        setReferenceImage(refImg);
        sessionStorage.removeItem('criai_ref_image');
      }
      if (refPrompt) {
        setPrompt(refPrompt);
        sessionStorage.removeItem('criai_ref_prompt');
      }
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const p = e.detail?.prompt;
      if (p) setPrompt(p);
    };
    const appendHandler = (e) => {
      const p = e.detail?.prompt;
      if (p) setPrompt(prev => (prev ? prev + ', ' + p : p));
    };
    const refHandler = (e) => {
      const ref = e.detail?.image;
      if (ref) setReferenceImage(ref);
    };
    window.addEventListener('criai:set-prompt', handler);
    window.addEventListener('criai:append-prompt', appendHandler);
    window.addEventListener('criai:set-reference', refHandler);
    return () => {
      window.removeEventListener('criai:set-prompt', handler);
      window.removeEventListener('criai:append-prompt', appendHandler);
      window.removeEventListener('criai:set-reference', refHandler);
    };
  }, []);

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

  const handleDownload = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `criativa-imagem-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

        {/* Reference image */}
        <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-300">
              {referenceImage ? 'Imagem de referência (modificar/incluir algo)' : 'Quer mudar ou adicionar algo numa imagem que já tem?'}
            </p>
            {referenceImage && (
              <button onClick={() => setReferenceImage(null)} className="text-xs text-red-400 hover:text-red-300 font-medium">Remover</button>
            )}
          </div>
          {referenceImage ? (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
                <img src={referenceImage} alt="Referencia" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  <span className="text-primary-400 hover:text-primary-300 font-medium">Trocar imagem</span>
                </label>
                <p className="text-[10px] text-gray-600">Descreva no prompt acima o que quer adicionar ou mudar.</p>
              </div>
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary-500/30 bg-primary-500/10 text-primary-300 text-xs font-semibold hover:bg-primary-500/20 transition-colors cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Enviar minha imagem
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          )}
        </div>

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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-200 flex items-end justify-center p-3 opacity-0 group-hover:opacity-100 flex-col gap-1">
                  <button onClick={() => { setReferenceImage(item.imageUrl); window.dispatchEvent(new CustomEvent('criai:set-reference', { detail: { image: item.imageUrl } })); document.getElementById('gerador')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full text-left text-white text-xs font-semibold flex items-center gap-1.5 hover:text-primary-300">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Usar como referência
                  </button>
                  <button onClick={() => handleDownload(item.imageUrl)} className="w-full text-left text-white text-xs flex items-center gap-1.5">Baixar</button>
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

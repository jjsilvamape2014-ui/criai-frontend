'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

export default function CerebroEditor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [baseImage, setBaseImage] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credits, setCredits] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const refImg = sessionStorage.getItem('criai_ref_image');
    if (refImg) {
      setBaseImage(refImg);
      sessionStorage.removeItem('criai_ref_image');
    }
    const sid = sessionStorage.getItem('criai_cerebro_session');
    if (sid) {
      setSessionId(sid);
      api.cerebroMemory(sid)
        .then((mem) => {
          setMessages(mem.history || []);
          if (mem.memory.baseImage) setBaseImage(mem.memory.baseImage);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError({ type: 'GENERIC', message: 'Envie um arquivo de imagem válido.' }); return; }
    const reader = new FileReader();
    reader.onload = () => { setBaseImage(reader.result); e.target.value = ''; };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    const token = localStorage.getItem('token');
    if (!token) { setShowLoginModal(true); return; }

    setLoading(true); setError(null);
    const newMessages = [...messages, { role: 'user', message: msg }];
    setMessages(newMessages);

    try {
      const data = await api.cerebroChat(msg, {
        ...(sessionId ? { sessionId } : {}),
        ...(baseImage ? { image: baseImage } : {}),
      });
      setSessionId(data.sessionId);
      if (typeof window !== 'undefined') sessionStorage.setItem('criai_cerebro_session', data.sessionId);
      setMessages([...newMessages, { role: 'assistant', message: data.reply, imageUrl: data.imageUrl }]);
      setBaseImage(data.imageUrl);
      setCredits(data.credits || null);
    } catch (err) {
      if (err.data?.code === 'NO_CREDITS') {
        setError({ type: 'NO_CREDITS', message: 'Seus creditos acabaram! Assine o plano por R$ 39,99/mes para continuar criando.' });
      } else if (err.data?.code === 'GEN_FAILED') {
        setError({ type: 'GENERIC', message: 'Nao conseguimos gerar a nova imagem agora. Tente novamente.' });
      } else {
        setError({ type: 'GENERIC', message: err.message || 'Erro ao editar a imagem. Tente novamente.' });
      }
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleReset = async () => {
    if (sessionId) {
      try { await api.cerebroReset(sessionId); } catch {}
    }
    setMessages([]); setSessionId(null); setBaseImage(null); setInput(''); setError(null); setCredits(null);
    if (typeof window !== 'undefined') sessionStorage.removeItem('criai_cerebro_session');
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `criativa-edicao-${Date.now()}.png`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const examples = ['Trocar a cor para azul', 'Deixar o fundo branco', 'Remover a pessoa da foto', 'Trocar o texto para OFERTA 50%'];

  return (
    <div id="cerebro" className="card mb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span className="text-lg">🧠</span> Cerebro Visual
            {sessionId && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium">Sessao ativa</span>}
          </h3>
          <p className="text-xs text-gray-500 mt-1">Converse e edite sua imagem: trocar cor, remover pessoa, deixar o fundo branco... (1 credito por edicao)</p>
        </div>
        {sessionId && (
          <button onClick={handleReset} className="text-xs text-red-400 hover:text-red-300 font-medium shrink-0">Nova conversa</button>
        )}
      </div>

      {/* Base image / upload */}
      <div className={`mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 ${baseImage ? 'flex items-center gap-3' : ''}`}>
        {baseImage ? (
          <>
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shrink-0">
              <img src={baseImage} alt="Base" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1 font-medium">Imagem que estamos editando</p>
              <label className="text-xs text-primary-400 hover:text-primary-300 font-medium cursor-pointer">
                Trocar por outra imagem
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </>
        ) : (
          <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-primary-500/40 bg-primary-500/10 text-primary-300 text-sm font-semibold hover:bg-primary-500/20 transition-colors cursor-pointer w-full">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Envie a imagem que quer editar
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Messages */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 mb-4">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm mb-3">Exemplos do que posso fazer:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {examples.map((s) => (
                <button key={s} onClick={() => setInput(s)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:border-primary-500/40 hover:text-primary-300 transition-colors">{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-primary-500/20 border border-primary-500/30 text-white' : 'bg-white/5 border border-white/10 text-gray-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{m.message}</p>
              {m.imageUrl && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10 relative group max-w-[420px]">
                  <img src={m.imageUrl} alt="Resultado" className="w-full max-h-[320px] object-contain" />
                  <button onClick={() => handleDownload(m.imageUrl)} className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-black/90">Baixar</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <svg className="animate-spin h-4 w-4 text-primary-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <span className="text-sm text-gray-300">Editando a imagem...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Error */}
      {error && (
        <div className={`rounded-xl p-4 mb-4 border ${error.type === 'NO_CREDITS' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <p className={`text-sm font-medium ${error.type === 'NO_CREDITS' ? 'text-amber-300' : 'text-red-300'}`}>{error.message}</p>
          {error.type === 'NO_CREDITS' && (
            <a href="/plans" className="inline-block mt-2 text-sm text-primary-400 font-semibold hover:underline">Ver planos e recargas</a>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="O que quer mudar na imagem? Ex: trocar a cor da caneca para azul..."
          className="input flex-1 min-h-[44px] resize-none"
          maxLength={300}
        />
        <button onClick={handleSend} disabled={loading || !input.trim()} className="btn-primary !px-4 !py-3 shrink-0" title="Enviar">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </div>
      {credits && (
        <p className="mt-2 text-[11px] text-gray-500">
          <b className="text-white">{credits.creditsImages + credits.creditsPurchased}</b> creditos restantes
          <a href="/plans" className="ml-2 text-primary-400 hover:text-primary-300 font-medium">+ Recarregar</a>
        </p>
      )}

      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl animate-fade-up">
            <h3 className="text-xl font-bold text-white mb-2 mt-0">Crie sua conta gratuita</h3>
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
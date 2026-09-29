'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

const JOB_KEY = 'criai_cerebro_job';

// Atalhos da tela inicial: preenchem a caixa com um pedido pronto para completar.
const STARTERS = [
  {
    title: 'Anúncio em vídeo com voz',
    desc: 'Vídeo animado 9:16 com narração, pronto para Reels e Status.',
    prompt: 'Vídeo de anúncio com voz da [nome da empresa], [o que vende e preço], WhatsApp [número], cores [cores da marca]',
    icon: 'M15 10l4.55-2.28A1 1 0 0121 8.62v6.76a1 1 0 01-1.45.9L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  },
  {
    title: 'Post para Instagram',
    desc: 'Arte de divulgação com texto, preço e chamada.',
    prompt: 'Criar um post de Instagram para [nome da empresa] divulgando [produto ou promoção], com o texto "[frase]"',
    icon: 'M4 16l4.59-4.59a2 2 0 012.82 0L16 16m-2-2l1.59-1.59a2 2 0 012.82 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm8-12h.01',
  },
  {
    title: 'Editar uma foto',
    desc: 'Envie a foto e diga o que mudar: fundo, cor, remover objetos.',
    prompt: 'Deixar o fundo branco e melhorar a iluminação',
    icon: 'M15.23 5.23l3.54 3.54M9 11l6.36-6.36a2.5 2.5 0 113.54 3.54L12.54 14.54a4 4 0 01-1.79 1.04L7 17l1.42-3.75A4 4 0 019 11z',
    needsImage: true,
  },
  {
    title: 'Logo para a marca',
    desc: 'Logo profissional a partir do nome e do ramo.',
    prompt: 'Criar uma logo para [nome da empresa], que trabalha com [ramo], nas cores [cores]',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.34M11 7.34l1.66-1.66a2 2 0 012.83 0l2.83 2.83a2 2 0 010 2.83L10 19.66',
  },
];

function Icon({ d, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-primary-400 shrink-0" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function CerebroEditor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [baseImage, setBaseImage] = useState(null);
  const [refImages, setRefImages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credits, setCredits] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [portraitMode, setPortraitMode] = useState(false);
  const [jobStep, setJobStep] = useState(null); // progresso do anúncio em vídeo
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  // Acompanha o anúncio em vídeo (1–4 min) sem segurar a requisição.
  // O jobId fica no sessionStorage para retomar se a página for recarregada.
  const pollJob = async (jobId) => {
    if (typeof window !== 'undefined') sessionStorage.setItem(JOB_KEY, jobId);
    const started = Date.now();
    try {
      while (Date.now() - started < 10 * 60 * 1000) {
        await new Promise((r) => setTimeout(r, 4000));
        let job;
        try { job = await api.cerebroJob(jobId); } catch (e) {
          if (e.status === 404) break; // job perdido (servidor reiniciou)
          continue;
        }
        if (job.status === 'running') { setJobStep(job.step || 'Produzindo o vídeo...'); continue; }
        if (job.status === 'done') {
          setMessages((prev) => [...prev, { role: 'assistant', message: job.reply, videoUrl: job.videoUrl }]);
          if (job.credits) setCredits(job.credits);
        } else {
          setError({ type: 'GENERIC', message: job.error || 'Não consegui montar o vídeo. Tente novamente.' });
        }
        return;
      }
      setError({ type: 'GENERIC', message: 'O vídeo não foi concluído. Tente pedir novamente.' });
    } finally {
      setJobStep(null);
      if (typeof window !== 'undefined') sessionStorage.removeItem(JOB_KEY);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const refImg = sessionStorage.getItem('criai_ref_image');
    if (refImg) {
      setBaseImage(refImg);
      setRefImages([refImg]);
      sessionStorage.removeItem('criai_ref_image');
    }
    const refPrompt = sessionStorage.getItem('criai_ref_prompt');
    if (refPrompt) {
      setInput(refPrompt);
      sessionStorage.removeItem('criai_ref_prompt');
    }
    if (sessionStorage.getItem('criai_retrato') === '1') {
      setPortraitMode(true);
      sessionStorage.removeItem('criai_retrato');
    }
    const sid = sessionStorage.getItem('criai_cerebro_session');
    if (sid) {
      setSessionId(sid);
      api.cerebroMemory(sid)
        .then((mem) => {
          setMessages(mem.history || []);
          if (mem.memory?.refImages?.length) {
            setRefImages(mem.memory.refImages);
            setBaseImage(mem.memory.refImages[0]);
          } else if (mem.memory?.baseImage) {
            setBaseImage(mem.memory.baseImage);
            setRefImages([mem.memory.baseImage]);
          }
        })
        .catch(() => {});
    }
    const pendingJob = sessionStorage.getItem(JOB_KEY);
    if (pendingJob) {
      setLoading(true);
      setJobStep('Retomando o vídeo em produção...');
      pollJob(pendingJob).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading, jobStep]);

  // Caixa de texto cresce com o conteúdo (até ~6 linhas)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [input]);

  const handleUpload = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    setError(null);
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (images.length !== files.length) setError({ type: 'GENERIC', message: 'Envie apenas arquivos de imagem.' });
    if (refImages.length + images.length > 4) {
      setError({ type: 'GENERIC', message: 'Você pode anexar até 4 imagens. Remova alguma para trocar.' });
      e.target.value = '';
      return;
    }
    if (!images.length) { e.target.value = ''; return; }
    let loaded = 0;
    const next = [...refImages];
    images.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        next.push(reader.result);
        loaded++;
        if (loaded === images.length) {
          setRefImages(next);
          if (!baseImage) setBaseImage(next[0]);
          e.target.value = '';
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    const next = refImages.filter((_, i) => i !== idx);
    setRefImages(next);
    if (baseImage === refImages[idx]) setBaseImage(next[0] || null);
  };

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    const blank = msg.match(/\[[^\]]*\]/);
    if (blank) {
      setError({ type: 'GENERIC', message: `Complete o campo ${blank[0]} antes de enviar.` });
      const el = inputRef.current;
      if (el) { el.focus(); el.setSelectionRange(blank.index, blank.index + blank[0].length); }
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) { setShowLoginModal(true); return; }

    setLoading(true); setError(null);
    const newMessages = [...messages, { role: 'user', message: msg }];
    setMessages(newMessages);
    setInput('');

    try {
      const data = await api.cerebroChat(msg, {
        ...(sessionId ? { sessionId } : {}),
        images: refImages,
        ...(portraitMode ? { portrait: true } : {}),
      });
      setSessionId(data.sessionId);
      setPortraitMode(false);
      if (typeof window !== 'undefined') sessionStorage.setItem('criai_cerebro_session', data.sessionId);
      setMessages([...newMessages, { role: 'assistant', message: data.reply, imageUrl: data.imageUrl, videoUrl: data.videoUrl || null }]);
      if (data.jobId) {
        // anúncio em vídeo rodando em segundo plano → acompanha o progresso
        setJobStep('Começando...');
        await pollJob(data.jobId);
      } else if (data.imageUrl && !data.videoUrl) {
        // vídeo NÃO vira imagem de referência (quebrava as edições seguintes)
        setBaseImage(data.imageUrl);
        setRefImages((prev) => (prev.length ? [data.imageUrl, ...prev.slice(1)] : [data.imageUrl]));
      }
      if (!data.jobId) setCredits(data.credits || null);
    } catch (err) {
      if (err.data?.code === 'NO_CREDITS') {
        setError({ type: 'NO_CREDITS', message: 'Seus créditos acabaram. Assine o plano por R$ 39,99/mês para continuar criando.' });
      } else if (err.data?.code === 'GEN_FAILED') {
        setError({ type: 'GENERIC', message: 'Não conseguimos gerar agora. Tente novamente.' });
      } else {
        setError({ type: 'GENERIC', message: err.message || 'Algo deu errado. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (loading) return;
    if (sessionId) {
      try { await api.cerebroReset(sessionId); } catch {}
    }
    setMessages([]); setSessionId(null); setBaseImage(null); setRefImages([]); setInput(''); setError(null); setCredits(null);
    if (typeof window !== 'undefined') sessionStorage.removeItem('criai_cerebro_session');
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `criativa-${Date.now()}.png`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const pickStarter = (s) => {
    setInput(s.prompt);
    if (s.needsImage && !refImages.length) fileRef.current?.click();
    setTimeout(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      // seleciona o primeiro [campo] para o cliente já digitar por cima
      const start = s.prompt.indexOf('[');
      if (start >= 0) el.setSelectionRange(start, s.prompt.indexOf(']', start) + 1);
    }, 0);
  };

  const empty = messages.length === 0 && !loading;

  return (
    <div id="cerebro" className="flex flex-col min-h-[calc(100vh-11rem)]">
      {/* Topo */}
      {!empty && (
        <div className="flex items-center justify-between gap-3 pb-3 mb-2 border-b border-white/10">
          <p className="text-sm font-semibold text-white">Conversa atual</p>
          <button
            onClick={handleReset}
            disabled={loading}
            className="text-xs font-medium text-gray-400 hover:text-white disabled:opacity-40 flex items-center gap-1.5"
          >
            <Icon d="M12 4v16m8-8H4" className="w-3.5 h-3.5" /> Nova criação
          </button>
        </div>
      )}

      {/* Conversa */}
      <div className="flex-1">
        {empty ? (
          <div className="pt-6 sm:pt-12 pb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center tracking-tight">O que vamos criar hoje?</h1>
            <p className="mt-3 text-center text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
              Descreva o que você precisa, como se estivesse falando com um designer. Se tiver uma foto ou logo, anexe no clipe.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STARTERS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => pickStarter(s)}
                  className="text-left rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-primary-500/50 hover:bg-primary-500/[0.06] transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/15 text-primary-300 flex items-center justify-center shrink-0 group-hover:bg-primary-500/25">
                      <Icon d={s.icon} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{s.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-primary-500/20 border border-primary-500/30 text-white rounded-br-md' : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-md'}`}>
                  {m.message && <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.message}</p>}
                  {m.videoUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-white/10 max-w-[360px] bg-black">
                      <video src={m.videoUrl} controls playsInline className="w-full max-h-[520px] object-contain bg-black" />
                      <a href={m.videoUrl} download target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border-t border-white/10">
                        <Icon d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" className="w-4 h-4" /> Baixar vídeo
                      </a>
                    </div>
                  )}
                  {m.imageUrl && !m.videoUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-white/10 max-w-[420px]">
                      <img src={m.imageUrl} alt="Resultado" className="w-full max-h-[420px] object-contain bg-black/30" />
                      <button onClick={() => handleDownload(m.imageUrl)} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border-t border-white/10">
                        <Icon d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" className="w-4 h-4" /> Baixar imagem
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 max-w-[88%]">
                  <div className="flex items-center gap-2.5">
                    <Spinner />
                    <span className="text-sm text-gray-200">{jobStep || 'Criando...'}</span>
                  </div>
                  {jobStep && (
                    <p className="text-xs text-gray-500 mt-1.5">O vídeo leva de 1 a 4 minutos. Pode deixar esta página aberta.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Caixa de pedido */}
      <div className="sticky bottom-0 pt-2 pb-3 bg-gradient-to-t from-dark-950 via-dark-950 to-transparent">
        {/* Erro */}
        {error && (
          <div className={`rounded-xl px-4 py-3 mb-3 border ${error.type === 'NO_CREDITS' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
            <p className={`text-sm font-medium ${error.type === 'NO_CREDITS' ? 'text-amber-300' : 'text-red-300'}`}>{error.message}</p>
            {error.type === 'NO_CREDITS' && (
              <a href="/plans" className="inline-block mt-1.5 text-sm text-primary-400 font-semibold hover:underline">Ver planos e recargas</a>
            )}
          </div>
        )}
        <div className="rounded-2xl border border-white/15 bg-brand-surface focus-within:border-primary-500/60 transition-colors shadow-xl shadow-black/30">
          {refImages.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pt-3">
              {refImages.map((img, i) => (
                <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 relative group shrink-0">
                  <img src={img} alt={`Anexo ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(i)}
                    disabled={loading}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/75 text-white text-[10px] font-bold flex items-center justify-center hover:bg-red-600"
                    title="Remover"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={refImages.length ? 'Diga o que fazer com a imagem...' : 'Descreva o que você quer criar...'}
            className="block w-full resize-none bg-transparent px-4 pt-3 pb-1 text-[15px] text-white placeholder-gray-500 outline-none disabled:opacity-60"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <label
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer ${refImages.length >= 4 || loading ? 'opacity-40 pointer-events-none' : ''}`}
              title="Anexar foto ou logo (até 4)"
            >
              <Icon d="M15.17 7l-6.59 6.59a2 2 0 102.83 2.83l6.41-6.59a4 4 0 00-5.66-5.66l-6.4 6.58a6 6 0 108.49 8.49L20.5 13" className="w-5 h-5" />
              <span className="hidden sm:inline">Anexar imagem</span>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            </label>
            <div className="flex items-center gap-3">
              {credits && (
                <a href="/plans" className="text-[11px] text-gray-500 hover:text-gray-300 hidden sm:block">
                  {credits.creditsImages + credits.creditsPurchased} créditos
                </a>
              )}
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-primary-500 hover:bg-primary-400 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Enviar"
              >
                <Icon d="M5 12h14M13 6l6 6-6 6" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-gray-600">Cada criação usa 1 crédito. Enter envia, Shift+Enter quebra a linha.</p>
      </div>

      {/* Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl animate-fade-up">
            <h3 className="text-xl font-bold text-white mb-2 mt-0">Crie sua conta gratuita</h3>
            <p className="text-gray-400 mb-6">Ganhe 10 imagens e 2 vídeos grátis todo mês. Sem cartão de crédito.</p>
            <div className="space-y-3">
              <a href="/register" className="btn-primary block text-center">Criar conta grátis</a>
              <a href="/login" className="btn-secondary block text-center">Já tenho conta</a>
            </div>
            <button onClick={() => setShowLoginModal(false)} className="mt-4 text-sm text-gray-500 hover:text-gray-300 w-full transition-colors">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

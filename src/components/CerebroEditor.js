'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

const JOB_KEY = 'criai_cerebro_job';

// Atalhos da tela inicial: preenchem a caixa com um pedido pronto para completar.
const STARTERS = [
  {
    title: 'Anúncio em vídeo com voz', short: 'Vídeo com voz',
    desc: 'Vídeo animado 9:16 com narração, pronto para Reels e Status.',
    prompt: 'Vídeo de anúncio com voz da [nome da empresa], [o que vende e preço], WhatsApp [número], cores [cores da marca]',
    icon: 'M15 10l4.55-2.28A1 1 0 0121 8.62v6.76a1 1 0 01-1.45.9L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  },
  {
    title: 'Vídeo com apresentador', short: 'Vídeo com apresentador',
    prompt: 'Vídeo com apresentadora mostrando [produto ou serviço] da [nome da empresa], [preço ou oferta], WhatsApp [número]',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    title: 'Post para Instagram', short: 'Post para Instagram',
    desc: 'Arte de divulgação com texto, preço e chamada.',
    prompt: 'Criar um post de Instagram para [nome da empresa] divulgando [produto ou promoção], com o texto "[frase]"',
    icon: 'M4 16l4.59-4.59a2 2 0 012.82 0L16 16m-2-2l1.59-1.59a2 2 0 012.82 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm8-12h.01',
  },
  {
    title: 'Editar uma foto', short: 'Editar foto',
    desc: 'Envie a foto e diga o que mudar: fundo, cor, remover objetos.',
    prompt: 'Deixar o fundo branco e melhorar a iluminação',
    icon: 'M15.23 5.23l3.54 3.54M9 11l6.36-6.36a2.5 2.5 0 113.54 3.54L12.54 14.54a4 4 0 01-1.79 1.04L7 17l1.42-3.75A4 4 0 019 11z',
    needsImage: true,
  },
  {
    title: 'Logo para a marca', short: 'Logo',
    desc: 'Logo profissional a partir do nome e do ramo.',
    prompt: 'Criar uma logo para [nome da empresa], que trabalha com [ramo], nas cores [cores]',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.34M11 7.34l1.66-1.66a2 2 0 012.83 0l2.83 2.83a2 2 0 010 2.83L10 19.66',
  },
];

// Exemplos reais (mesmas imagens da página inicial): clicar preenche o pedido.
const INSPIRATION = [
  { cat: 'Anúncio de produto', src: '/showcase/anuncio-hamburguer.webp', prompt: 'Anúncio de hambúrguer artesanal com o preço R$ 29,90 e a chamada Peça já' },
  { cat: 'Post para feed', src: '/showcase/post-feed.webp', prompt: 'Post quadrado com a frase Promoção de Setembro, fundo laranja' },
  { cat: 'Logotipo', src: '/showcase/logo-padaria.webp', prompt: 'Logotipo para a marca Padaria São João, traço minimalista' },
  { cat: 'Pôster', src: '/showcase/hero-acai.webp', prompt: 'Pôster de açaí com o preço R$ 12,90 em destaque, fundo roxo, tipografia forte' },
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
        // o servidor explica o caso (ex.: apresentador custa 3 e há alternativa animada)
        setError({ type: 'NO_CREDITS', message: err.data?.error || 'Seus créditos acabaram. Assine o plano por R$ 39,99/mês para continuar criando.' });
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
    if (s.href) { window.location.href = s.href; return; }
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

  const composer = (
    <div>
      {error && (
        <div className={`rounded-xl px-4 py-3 mb-3 border text-sm ${error.type === 'NO_CREDITS' ? 'bg-amber-500/10 border-amber-500/25 text-amber-200' : 'bg-red-500/10 border-red-500/25 text-red-200'}`}>
          {error.message}
          {error.type === 'NO_CREDITS' && (
            <a href="/plans" className="ml-2 font-semibold text-brand-accent hover:underline">Ver planos</a>
          )}
        </div>
      )}
      <div className="rounded-[18px] border border-brand-borderStrong bg-brand-surface focus-within:border-brand-dim transition-colors shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]">
        {refImages.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-4">
            {refImages.map((img, i) => (
              <div key={i} className="w-16 h-16 rounded-[10px] overflow-hidden border border-brand-borderStrong relative group shrink-0">
                <img src={img} alt={`Anexo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  disabled={loading}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white text-[10px] flex items-center justify-center hover:bg-black"
                  title="Remover"
                >✕</button>
              </div>
            ))}
          </div>
        )}
        <textarea
          ref={inputRef}
          rows={empty ? 3 : 1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder={refImages.length ? 'Diga o que fazer com a imagem...' : 'Ex.: vídeo de anúncio com voz da minha pizzaria, pizza grande R$ 49,90, WhatsApp...'}
          className="block w-full resize-none bg-transparent px-5 pt-4 pb-2 text-[15px] leading-relaxed text-brand-text placeholder-brand-dim outline-none disabled:opacity-60"
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <label
            className={`flex items-center gap-2 h-9 px-3 rounded-full text-[13px] text-brand-tert hover:text-brand-text hover:bg-white/[0.04] cursor-pointer transition-colors ${refImages.length >= 4 || loading ? 'opacity-40 pointer-events-none' : ''}`}
            title="Anexar foto ou logo (até 4)"
          >
            <Icon d="M15.17 7l-6.59 6.59a2 2 0 102.83 2.83l6.41-6.59a4 4 0 00-5.66-5.66l-6.4 6.58a6 6 0 108.49 8.49L20.5 13" className="w-[18px] h-[18px]" />
            Anexar imagem
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="h-9 pl-4 pr-3 rounded-full bg-brand-accent hover:bg-brand-accentHover text-[13px] font-semibold text-brand-bg flex items-center gap-1.5 disabled:bg-brand-borderStrong disabled:text-brand-dim disabled:cursor-not-allowed transition-colors"
          >
            Criar
            <Icon d="M5 12h14M13 6l6 6-6 6" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div id="cerebro" className="flex flex-col min-h-[calc(100vh-4rem)] text-brand-text">
      {empty ? (
        <div className="pt-10 sm:pt-20 pb-16">
          <p className="text-center text-xs font-semibold uppercase text-brand-accent" style={{ letterSpacing: '1.4px' }}>Estúdio de criação</p>
          <h1
            className="mt-4 text-center font-display font-extrabold text-[38px] sm:text-[52px] leading-[1.02]"
            style={{ letterSpacing: '-2px', textWrap: 'balance' }}
          >
            O que vamos <span className="text-brand-accent">criar</span> hoje?
          </h1>
          <p className="mt-4 text-center text-[15px] sm:text-[17px] text-brand-sub max-w-[520px] mx-auto leading-relaxed" style={{ textWrap: 'pretty' }}>
            Peça como pediria a um designer. Vídeo, post, logo ou edição de foto, com o texto em português escrito certo.
          </p>

          <div className="mt-9">{composer}</div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {STARTERS.map((s) => (
              <button
                key={s.title}
                onClick={() => pickStarter(s)}
                className="flex items-center gap-2 h-9 px-3.5 rounded-full border border-brand-borderStrong text-[13px] text-brand-sub hover:text-brand-text hover:border-brand-dim transition-colors"
              >
                <Icon d={s.icon} className="w-4 h-4 text-brand-accent" />
                {s.short}
              </button>
            ))}
          </div>

          <div className="mt-16">
            <div className="flex items-end justify-between pb-3 border-b border-brand-border">
              <p className="text-xs font-semibold uppercase text-brand-tert" style={{ letterSpacing: '1.4px' }}>Feito na Criativa</p>
              <p className="text-[12px] text-brand-dim">Clique para usar o pedido</p>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INSPIRATION.map((it) => (
                <button
                  key={it.src}
                  onClick={() => pickStarter({ prompt: it.prompt })}
                  className="group text-left"
                  title={it.prompt}
                >
                  <div className="aspect-[4/5] rounded-[12px] overflow-hidden border border-brand-border bg-brand-surface">
                    <img src={it.src} alt={it.cat} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </div>
                  <p className="mt-2 text-[12px] text-brand-tert group-hover:text-brand-text transition-colors">{it.cat}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 py-4 border-b border-brand-border">
            <p className="text-xs font-semibold uppercase text-brand-tert" style={{ letterSpacing: '1.4px' }}>Conversa</p>
            <button
              onClick={handleReset}
              disabled={loading}
              className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-brand-borderStrong text-[12px] text-brand-sub hover:text-brand-text hover:border-brand-dim disabled:opacity-40 transition-colors"
            >
              <Icon d="M12 5v14M5 12h14" className="w-3.5 h-3.5" /> Nova criação
            </button>
          </div>

          <div className="flex-1 space-y-6 py-6">
            {messages.map((m, i) => (
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-[16px] rounded-br-[6px] bg-brand-surface border border-brand-borderStrong px-4 py-3">
                    <p className="text-[15px] whitespace-pre-wrap leading-relaxed text-brand-text">{m.message}</p>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-brand-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {m.message && <p className="text-[15px] whitespace-pre-wrap leading-relaxed text-brand-sub">{m.message}</p>}
                    {m.action && (
                      <a href={m.action.href} className="mt-3 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-brand-accent hover:bg-brand-accentHover text-[13px] font-semibold text-brand-bg">
                        {m.action.label}
                        <Icon d="M5 12h14M13 6l6 6-6 6" className="w-4 h-4" />
                      </a>
                    )}
                    {m.videoUrl && (
                      <div className="mt-3 w-full max-w-[340px] rounded-[14px] overflow-hidden border border-brand-borderStrong bg-black">
                        <video src={m.videoUrl} controls playsInline className="w-full max-h-[560px] object-contain bg-black" />
                        <a href={m.videoUrl} download target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 h-11 text-[13px] font-semibold text-brand-text bg-brand-surface hover:bg-[#1a171b] border-t border-brand-borderStrong">
                          <Icon d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" className="w-4 h-4" /> Baixar vídeo
                        </a>
                      </div>
                    )}
                    {m.imageUrl && !m.videoUrl && (
                      <div className="mt-3 w-full max-w-[420px] rounded-[14px] overflow-hidden border border-brand-borderStrong bg-brand-surface">
                        <img src={m.imageUrl} alt="Resultado" className="w-full max-h-[480px] object-contain" />
                        <button onClick={() => handleDownload(m.imageUrl)} className="w-full flex items-center justify-center gap-2 h-11 text-[13px] font-semibold text-brand-text hover:bg-[#1a171b] border-t border-brand-borderStrong">
                          <Icon d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" className="w-4 h-4" /> Baixar imagem
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                </div>
                <div className="flex-1 max-w-[420px]">
                  <p className="text-[15px] text-brand-text">{jobStep || 'Criando...'}</p>
                  <div className="mt-3 h-[3px] rounded-full bg-brand-border overflow-hidden">
                    <div className="h-full w-1/3 rounded-full bg-brand-accent animate-[criai-bar_1.6s_ease-in-out_infinite]" />
                  </div>
                  {jobStep && (
                    <p className="mt-2 text-[12px] text-brand-dim">Vídeos levam alguns minutos. Pode deixar esta página aberta.</p>
                  )}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="sticky bottom-0 pt-3 pb-4 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent">
            {composer}
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes criai-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
      `}</style>

      {/* Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="rounded-2xl p-8 max-w-md w-full border border-brand-borderStrong bg-brand-surface shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-brand-text mb-2 mt-0">Crie sua conta gratuita</h3>
            <p className="text-brand-sub mb-6">Ganhe 10 imagens e 2 vídeos grátis todo mês. Sem cartão de crédito.</p>
            <div className="space-y-3">
              <a href="/register" className="block text-center rounded-[10px] bg-brand-accent py-3 text-sm font-semibold text-brand-bg hover:bg-brand-accentHover">Criar conta grátis</a>
              <a href="/login" className="block text-center rounded-[10px] border border-brand-borderStrong py-3 text-sm font-semibold text-brand-text hover:border-brand-dim">Já tenho conta</a>
            </div>
            <button onClick={() => setShowLoginModal(false)} className="mt-4 text-sm text-brand-tert hover:text-brand-text w-full">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

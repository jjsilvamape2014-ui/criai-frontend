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

// Opções fechadas: o cliente diz O QUE quer; o servidor não precisa adivinhar.
const MODES = [
  { id: 'livre', label: 'Automático', sub: 'A IA entende o pedido: post, imagem, logo, edição ou vídeo', hint: 'Diga o que quer. Ex.: post de Instagram da minha pizzaria com a promoção de terça' },
  { id: 'anuncio', label: 'Anúncio em vídeo', sub: 'Vídeo 9:16 com narração', hint: 'O que você vende? Ex.: instalação e manutenção de ar-condicionado, orçamento pelo WhatsApp', fields: ['empresa', 'whatsapp'] },
  { id: 'apresentador', label: 'Com apresentador', sub: 'Uma pessoa mostra o produto', hint: 'O que a pessoa vai mostrar? Ex.: nossa placa de avaliação do Google por R$ 80,00', fields: ['empresa', 'whatsapp', 'voz'] },
  { id: 'animar', label: 'Animar minha imagem', sub: 'Anexe a imagem e descreva o movimento', hint: 'Anexe a imagem e descreva o movimento. Ex.: a barriga do mascote girando como uma betoneira', needsImage: true },
  { id: 'falar', label: 'Personagem falando', sub: 'Anexe o personagem e escreva a fala', hint: 'Anexe o personagem e escreva a fala. Ex.: Bom dia! Eu sou o Delta.', needsImage: true, fields: ['voz'] },
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
  const [onStage, setOnStage] = useState(null); // índice da mensagem exibida no palco
  const [mode, setMode] = useState('livre');
  const [fields, setFields] = useState({ empresa: '', whatsapp: '', voz: 'masculina' });
  const modeDef = MODES.find((m) => m.id === mode) || MODES[0];
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

  // o palco sempre mostra o resultado mais novo
  useEffect(() => { setOnStage(null); }, [messages.length]);

  useEffect(() => {
    // rola só o roteiro (não a página): no celular o palco fica no topo
    const list = endRef.current?.parentElement;
    if (list) list.scrollTop = list.scrollHeight;
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
    if (modeDef.needsImage && !refImages.length) {
      setError({ type: 'GENERIC', message: 'Anexe a imagem primeiro (botão "Anexar imagem").' });
      fileRef.current?.click();
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
        ...(mode !== 'livre' ? { mode, fields } : {}),
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
        setError({ type: 'NO_CREDITS', message: err.data?.error || 'Seus créditos acabaram. Veja os planos e pacotes para continuar criando.' });
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
    setMessages([]); setOnStage(null); setSessionId(null); setBaseImage(null); setRefImages([]); setInput(''); setError(null); setCredits(null);
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
    setMode(s.mode || 'livre');
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

  // Palco: o resultado escolhido no roteiro ou, por padrão, o mais novo.
  let lastMedia = -1;
  messages.forEach((m, i) => { if (m.role !== 'user' && (m.videoUrl || m.imageUrl)) lastMedia = i; });
  const stageIdx = onStage ?? lastMedia;
  const staged = stageIdx >= 0 ? messages[stageIdx] : null;
  const take = (n) => String(n).padStart(2, '0');
  let takeCount = 0;

  const label = 'font-mono text-[10.5px] uppercase text-brand-dim';
  const labelStyle = { letterSpacing: '1.6px' };

  // ── Direção (direita): o cliente escolhe O QUE quer; Automático deixa a IA decidir.
  const direction = (
    <aside aria-label="Direção" className="flex-1 rounded-[18px] border border-brand-border bg-brand-surface p-4 lg:overflow-y-auto">
      <p className={label} style={labelStyle}>Direção</p>
      <div role="radiogroup" aria-label="O que criar" className="mt-3 flex flex-wrap gap-1.5 lg:flex-col lg:flex-nowrap">
        {MODES.map((m) => {
          const on = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => { setMode(m.id); setError(null); }}
              disabled={loading}
              className={`text-left rounded-[12px] border px-3 py-2 lg:py-2.5 min-h-[44px] transition-colors disabled:opacity-50 ${on ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border hover:border-brand-borderStrong'}`}
            >
              <span className="flex items-center gap-2 text-[13.5px] font-semibold text-brand-text">
                <span className={`w-2 h-2 rounded-full ${on ? 'bg-brand-accent shadow-[0_0_10px_2px_rgba(255,90,43,0.6)]' : 'bg-brand-borderStrong'}`} />
                {m.label}
              </span>
              <span className="mt-0.5 hidden lg:block pl-4 text-[12px] leading-snug text-brand-tert">{m.sub}</span>
            </button>
          );
        })}
      </div>

      {(modeDef.fields || []).length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          <p className={label} style={labelStyle}>Dados do anúncio</p>
          {modeDef.fields.includes('empresa') && (
            <input value={fields.empresa} onChange={(e) => setFields({ ...fields, empresa: e.target.value })} disabled={loading}
              aria-label="Nome da empresa" placeholder="Nome da empresa" className="h-10 rounded-[10px] bg-brand-bg border border-brand-borderStrong px-3 text-[13.5px] text-brand-text placeholder-brand-dim outline-none focus:border-brand-accent" />
          )}
          {modeDef.fields.includes('whatsapp') && (
            <input value={fields.whatsapp} onChange={(e) => setFields({ ...fields, whatsapp: e.target.value })} disabled={loading} inputMode="tel"
              aria-label="WhatsApp" placeholder="WhatsApp (opcional)" className="h-10 rounded-[10px] bg-brand-bg border border-brand-borderStrong px-3 text-[13.5px] text-brand-text placeholder-brand-dim outline-none focus:border-brand-accent" />
          )}
          {modeDef.fields.includes('voz') && (
            <div role="radiogroup" aria-label="Voz" className="grid grid-cols-2 h-10 rounded-[10px] border border-brand-borderStrong overflow-hidden text-[12.5px]">
              {['masculina', 'feminina'].map((v) => (
                <button key={v} type="button" role="radio" aria-checked={fields.voz === v} onClick={() => setFields({ ...fields, voz: v })} disabled={loading}
                  className={fields.voz === v ? 'bg-brand-accent/15 text-brand-text font-semibold' : 'text-brand-tert hover:text-brand-text'}>
                  Voz {v}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {credits && typeof credits === 'object' && (credits.remaining != null || credits.credits != null) && (
        <p className="mt-5 font-mono text-[11px] text-brand-dim">Créditos: {credits.remaining ?? credits.credits}</p>
      )}
    </aside>
  );

  // ── Roteiro (esquerda): a conversa vira uma lista de takes.
  const script = (
    <aside aria-label="Roteiro" className="flex-1 rounded-[18px] border border-brand-border bg-brand-surface flex flex-col min-h-0 lg:overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3 border-b border-brand-border">
        <p className={label} style={labelStyle}>Roteiro</p>
        <button
          onClick={handleReset}
          disabled={loading || empty}
          className="flex items-center gap-1 h-8 px-3 rounded-full border border-brand-borderStrong text-[12px] text-brand-sub hover:text-brand-text hover:border-brand-dim disabled:opacity-40"
        >
          <Icon d="M12 5v14M5 12h14" className="w-3.5 h-3.5" /> Nova criação
        </button>
      </div>
      <ol className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3 max-h-[50vh] lg:max-h-none">
        {empty && <li className="text-[13px] text-brand-dim">Seus pedidos e as respostas aparecem aqui, em ordem.</li>}
        {messages.map((m, i) => {
          if (m.role === 'user') {
            takeCount += 1;
            return (
              <li key={i}>
                <p className="font-mono text-[10.5px] text-brand-accent" style={labelStyle}>TAKE {take(takeCount)}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-brand-text whitespace-pre-wrap">{m.message}</p>
              </li>
            );
          }
          const media = m.videoUrl || m.imageUrl;
          return (
            <li key={i} className="pl-3 border-l border-brand-borderStrong">
              {m.message && <p className="text-[13px] leading-relaxed text-brand-sub whitespace-pre-wrap">{m.message}</p>}
              {m.action && (
                <a href={m.action.href} className="mt-2 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-brand-accent text-[12.5px] font-semibold text-brand-bg hover:bg-brand-accentHover">
                  {m.action.label} <Icon d="M5 12h14M13 6l6 6-6 6" className="w-3.5 h-3.5" />
                </a>
              )}
              {media && (
                <button
                  type="button"
                  onClick={() => setOnStage(i)}
                  aria-pressed={stageIdx === i}
                  className={`mt-2 flex items-center gap-2 rounded-[10px] border p-1.5 pr-3 text-[12px] ${stageIdx === i ? 'border-brand-accent text-brand-text' : 'border-brand-borderStrong text-brand-tert hover:text-brand-text'}`}
                >
                  {m.videoUrl
                    ? <span className="w-10 h-10 rounded-[6px] bg-black flex items-center justify-center"><Icon d="M8 5v14l11-7z" className="w-4 h-4" /></span>
                    : <img src={m.imageUrl} alt="" className="w-10 h-10 rounded-[6px] object-cover" />}
                  {stageIdx === i ? 'No palco' : 'Ver no palco'}
                </button>
              )}
            </li>
          );
        })}
        <li aria-hidden="true" ref={endRef} />
      </ol>
    </aside>
  );

  // ── Palco (centro): o resultado em destaque; durante a criação, a luz de segurança acende.
  const stage = (
    <section aria-label="Palco" className="relative flex-1 rounded-[18px] border border-brand-border bg-[#080708] flex flex-col min-h-[380px] lg:min-h-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3">
        <p className={label} style={labelStyle}>{loading ? 'Revelando' : staged ? (staged.videoUrl ? 'Vídeo' : 'Imagem') : 'Palco'}</p>
        <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-brand-accent animate-pulse shadow-[0_0_14px_4px_rgba(255,90,43,0.55)]' : 'bg-brand-borderStrong'}`} />
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center p-4">
        {loading ? (
          <div className="w-full max-w-[300px] aspect-[9/16] max-h-full rounded-[14px] border border-brand-accent/40 bg-[radial-gradient(ellipse_at_center,rgba(255,90,43,0.18),transparent_70%)] flex flex-col items-center justify-center text-center px-6" role="status" aria-live="polite">
            <p className="font-display text-[20px] font-bold text-brand-text">{jobStep || 'Criando…'}</p>
            {jobStep && <p className="mt-2 text-[12px] text-brand-tert">Vídeos levam alguns minutos. Pode deixar esta página aberta.</p>}
          </div>
        ) : staged ? (
          staged.videoUrl ? (
            <video key={staged.videoUrl} src={staged.videoUrl} controls playsInline className="max-h-full max-w-full rounded-[14px] bg-black" style={{ maxHeight: 'min(70vh, 100%)' }} />
          ) : (
            <img src={staged.imageUrl} alt="Resultado" className="max-h-full max-w-full rounded-[14px] object-contain" style={{ maxHeight: 'min(70vh, 100%)' }} />
          )
        ) : (
          <div className="w-full max-w-[560px] text-center">
            <h1 className="font-display font-extrabold text-[32px] sm:text-[44px] leading-[1.02] text-brand-text" style={{ letterSpacing: '-1.5px', textWrap: 'balance' }}>
              O que vamos <span className="text-brand-accent">revelar</span> hoje?
            </h1>
            <p className="mt-3 text-[14.5px] text-brand-sub">Escreva o pedido embaixo. Em <b className="text-brand-text">Automático</b> a IA entende se é post, logo, edição ou vídeo.</p>
            <div className="mt-6 grid grid-cols-4 gap-2">
              {INSPIRATION.map((it) => (
                <button key={it.src} onClick={() => pickStarter({ prompt: it.prompt })} className="group text-left" title={it.prompt}>
                  <div className="aspect-[4/5] rounded-[10px] overflow-hidden border border-brand-border">
                    <img src={it.src} alt={it.cat} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                  </div>
                  <p className="mt-1.5 text-[11px] text-brand-tert group-hover:text-brand-text">{it.cat}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {staged && !loading && (
        staged.videoUrl ? (
          <a href={staged.videoUrl} download target="_blank" rel="noreferrer" className="mx-4 mb-3 flex items-center justify-center gap-2 h-11 rounded-full border border-brand-borderStrong text-[13px] font-semibold text-brand-text hover:border-brand-dim">
            <Icon d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" className="w-4 h-4" /> Baixar vídeo
          </a>
        ) : (
          <button onClick={() => handleDownload(staged.imageUrl)} className="mx-4 mb-3 flex items-center justify-center gap-2 h-11 rounded-full border border-brand-borderStrong text-[13px] font-semibold text-brand-text hover:border-brand-dim">
            <Icon d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" className="w-4 h-4" /> Baixar imagem
          </button>
        )
      )}

      {/* Fita: barra de progresso em forma de película */}
      <div aria-hidden="true" className="h-3 border-t border-brand-border bg-[repeating-linear-gradient(90deg,#1E1B1F_0_10px,transparent_10px_18px)] relative overflow-hidden">
        {loading && <div className="absolute inset-y-0 w-1/3 bg-brand-accent/70 animate-[criai-bar_1.6s_ease-in-out_infinite]" />}
      </div>
    </section>
  );

  // ── Barra de pedido (embaixo)
  const composer = (
    <div>
      {error && (
        <div role="alert" className={`rounded-xl px-4 py-3 mb-2 border text-sm ${error.type === 'NO_CREDITS' ? 'bg-amber-500/10 border-amber-500/25 text-amber-200' : 'bg-red-500/10 border-red-500/25 text-red-200'}`}>
          {error.message}
          {error.type === 'NO_CREDITS' && <a href="/plans" className="ml-2 font-semibold text-brand-accent hover:underline">Ver planos</a>}
        </div>
      )}
      <div className="rounded-[18px] border border-brand-borderStrong bg-brand-surface focus-within:border-brand-accent/60 transition-colors">
        {refImages.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {refImages.map((img, i) => (
              <div key={i} className="w-12 h-12 rounded-[8px] overflow-hidden border border-brand-borderStrong relative shrink-0">
                <img src={img} alt={`Anexo ${i + 1}`} className="w-full h-full object-cover" />
                <button onClick={() => removeImage(i)} disabled={loading} aria-label={`Remover anexo ${i + 1}`}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/80 text-white text-[10px] flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 p-2">
          <label
            className={`flex items-center justify-center w-11 h-11 rounded-full text-brand-tert hover:text-brand-text hover:bg-white/[0.05] cursor-pointer shrink-0 ${refImages.length >= 4 || loading ? 'opacity-40 pointer-events-none' : ''}`}
            title="Anexar foto ou logo (até 4)"
          >
            <span className="sr-only">Anexar imagem</span>
            <Icon d="M15.17 7l-6.59 6.59a2 2 0 102.83 2.83l6.41-6.59a4 4 0 00-5.66-5.66l-6.4 6.58a6 6 0 108.49 8.49L20.5 13" className="w-5 h-5" />
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
          </label>
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            aria-label="Pedido"
            placeholder={modeDef.hint}
            className="flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-relaxed text-brand-text placeholder-brand-dim outline-none disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="h-11 pl-5 pr-4 rounded-full bg-brand-accent hover:bg-brand-accentHover text-[14px] font-semibold text-brand-bg flex items-center gap-1.5 shrink-0 disabled:bg-brand-borderStrong disabled:text-brand-dim disabled:cursor-not-allowed"
          >
            Criar <Icon d="M5 12h14M13 6l6 6-6 6" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="mt-1.5 px-2 font-mono text-[10.5px] text-brand-dim">Modo: {modeDef.label} · Enter cria · Shift+Enter quebra linha</p>
    </div>
  );

  return (
    <div id="cerebro" className="text-brand-text py-4 grid gap-3 lg:h-[calc(100vh-4.5rem)] lg:grid-cols-[280px_minmax(0,1fr)_300px] lg:grid-rows-[minmax(0,1fr)_auto]">
      <div className="order-1 lg:order-2 lg:row-start-1 lg:col-start-2 min-h-0 flex">{stage}</div>
      <div className="order-3 lg:order-4 lg:row-start-2 lg:col-start-2">{composer}</div>
      <div className="order-2 lg:order-3 lg:row-start-1 lg:row-span-2 lg:col-start-3 min-h-0 flex flex-col">{direction}</div>
      <div className="order-4 lg:order-1 lg:row-start-1 lg:row-span-2 lg:col-start-1 min-h-0 flex flex-col">{script}</div>

      <style jsx global>{`
        @keyframes criai-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
      `}</style>

      {/* Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="rounded-2xl p-8 max-w-md w-full border border-brand-borderStrong bg-brand-surface shadow-2xl">
            <h3 className="font-display text-2xl font-bold text-brand-text mb-2 mt-0">Crie sua conta gratuita</h3>
            <p className="text-brand-sub mb-6">Ganhe 10 imagens e 1 vídeo curto grátis todo mês. Sem cartão de crédito.</p>
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

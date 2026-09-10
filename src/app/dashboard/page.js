'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api';
import Header from '@/components/Header';

const SUGESTOES = [
  { label: '🍔 Anúncio de lanche', prompt: 'Anúncio de hambúrguer artesanal com o preço R$ 29,90 e a chamada Peça já' },
  { label: '🖼️ Post de promoção', prompt: 'Post quadrado com a frase Promoção de Setembro, fundo laranja' },
  { label: '✏️ Logotipo', prompt: 'Logotipo para a marca Padaria São João, traço minimalista' },
  { label: '🎬 Capa de vídeo', prompt: 'Thumbnail com o título Como Vender Mais no Instagram' },
  { label: '🛍️ Anúncio de açaí', prompt: 'Anúncio de açaí com o preço R$ 12,90 em destaque, fundo roxo' },
  { label: '📸 Foto de perfil', prompt: 'Retrato profissional, fundo neutro, luz suave de estúdio' },
];

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]); // { role, text?, imageUrl? }
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState('');
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const activePrompt = useRef('');

  const loadHistory = useCallback(async () => {
    try {
      const hist = await api.getHistory();
      setHistory(hist || []);
    } catch {
      // histórico vazio não derruba a página
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    Promise.all([loadHistory()]).then(() => setLoading(false));
  }, [loadHistory]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, generating, status]);

  const send = async (rawPrompt) => {
    const msg = (rawPrompt ?? input).trim();
    if (!msg || generating) return;
    setInput('');
    activePrompt.current = msg;
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setGenerating(true);
    setStatus('');
    try {
      const data = await api.generateImageLive(msg, { model: 'flux2pro', width: 1216, height: 1520 }, setStatus, () => {});
      setMessages((m) => [...m, { role: 'assistant', imageUrl: data.imageUrl, text: msg }]);
      loadHistory();
    } catch (err) {
      if (err.data?.code === 'NO_CREDITS') { window.location.href = '/plans'; return; }
      setMessages((m) => [...m, { role: 'error', text: 'Não consegui gerar agora. Tente novamente.' }]);
    } finally {
      setGenerating(false);
      setStatus('');
    }
  };

  const openItem = (item) => {
    setMessages([
      { role: 'user', text: item.prompt || 'Minha criação' },
      { role: 'assistant', imageUrl: item.imageUrl, text: item.prompt || '' },
    ]);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const newChat = () => {
    setMessages([]);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const openCerebro = (url, prompt) => {
    sessionStorage.setItem('criai_ref_image', url);
    sessionStorage.setItem('criai_ref_prompt', prompt || '');
    window.location.href = '/cerebro';
  };

  const openVideo = (url) => {
    sessionStorage.setItem('criai_video_image', url);
    sessionStorage.setItem('criai_video_name', activePrompt.current || '');
    window.location.href = '/video';
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary-800 border-t-primary-400 rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      </>
    );
  }

  const empty = messages.length === 0;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pt-40 pb-8">
        <div className="flex gap-5" style={{ height: 'calc(100dvh - 200px)', minHeight: 480 }}>
          {/* Sidebar — histórico */}
          <aside className={`${sidebarOpen ? 'fixed inset-0 z-40' : 'hidden md:block'} md:relative md:w-72 md:shrink-0`}>
            {sidebarOpen && (
              <div className="fixed inset-0 bg-black/60 z-30" onClick={() => setSidebarOpen(false)} />
            )}
            <div className={`flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-3 ${sidebarOpen ? 'relative z-40 w-72 animate-slide-in' : ''}`}>
              <button
                onClick={newChat}
                className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-primary-500 hover:to-primary-400 transition-all"
              >
                <span className="text-base">✚</span> Nova criação
              </button>
              <a
                href="/card-de-candidato"
                className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-primary-500/30 bg-primary-500/10 px-4 py-2.5 text-sm font-semibold text-primary-300 hover:bg-primary-500/20 transition-all"
              >
                🗳️ Santinho do candidato
              </a>
              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Histórico</p>
              <div className="flex-1 overflow-y-auto pb-2">
                {history.length === 0 ? (
                  <p className="px-2 pt-3 text-[13px] text-gray-500">Suas imagens aparecem aqui.</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => openItem(item)}
                        className="group flex items-center gap-2.5 rounded-xl border border-transparent p-2 text-left hover:bg-white/5 hover:border-white/10 transition-all"
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover border border-white/10" />
                        ) : (
                          <div className="h-11 w-11 shrink-0 rounded-lg bg-white/10" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] text-gray-300">{item.prompt || 'Sem descrição'}</span>
                          <span className={`text-[10px] ${item.status === 'COMPLETED' ? 'text-green-400' : item.status === 'FAILED' ? 'text-red-400' : 'text-amber-400'}`}>
                            {item.status === 'COMPLETED' ? '✓ Pronto' : item.status === 'FAILED' ? '✗ Falhou' : '... gerando'}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a href="/plans" className="mt-2 rounded-xl border border-white/10 px-3 py-2.5 text-center text-[13px] text-gray-300 hover:text-white hover:border-white/20 transition-colors">
                ⭐ Planos & créditos
              </a>
            </div>
          </aside>

          {/* Conversa */}
          <section className="flex min-w-0 flex-1 flex-col rounded-2xl border border-white/10 bg-white/[0.03]">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden mt-3 ml-3 w-fit rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[13px] text-gray-300"
            >
              ☰ Histórico
            </button>

            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
              {empty ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-3xl font-bold text-white">O que você quer criar?</p>
                  <p className="mt-2 max-w-md text-[15px] text-gray-400">
                    Escreva com as suas palavras — a IA monta o resto. Tudo fica salvo no histórico aqui ao lado.
                  </p>
                  <div className="mt-6 grid w-full max-w-lg grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGESTOES.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => send(s.prompt)}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-[13px] text-gray-300 hover:border-primary-500/40 hover:text-white transition-all"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <a
                    href="/card-de-candidato"
                    className="mt-3 rounded-xl border border-primary-500/40 bg-primary-500/10 px-5 py-3 inline-flex items-center gap-2 text-[13px] font-semibold text-primary-300 hover:bg-primary-500/20 transition-all"
                  >
                    🗳️ Montar um santinho de candidato →
                  </a>
                </div>
              ) : (
                <div className="mx-auto flex max-w-2xl flex-col gap-5">
                  {messages.map((msg, i) => {
                    if (msg.role === 'user') {
                      return (
                        <div key={i} className="flex justify-end">
                          <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary-600/80 px-4 py-2.5 text-[14px] text-white">
                            {msg.text}
                          </div>
                        </div>
                      );
                    }
                    if (msg.role === 'error') {
                      return (
                        <div key={i} className="mx-auto rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
                          {msg.text}
                        </div>
                      );
                    }
                    return (
                      <div key={i} className="flex justify-start">
                        <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                          {msg.imageUrl ? (
                            <>
                              <img src={msg.imageUrl} alt="" className="w-full bg-black/20" />
                              <div className="p-3">
                                <p className="mb-2.5 text-[12px] leading-snug text-gray-400 line-clamp-2">{msg.text}</p>
                                <div className="flex flex-col gap-1.5">
                                  <a
                                    href={msg.imageUrl}
                                    download="criativa-imagem.png"
                                    className="block rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 py-2 text-center text-[13px] font-semibold text-white hover:from-primary-500 hover:to-primary-400 transition-all"
                                  >
                                    Baixar imagem
                                  </a>
                                  <button
                                    onClick={() => openVideo(msg.imageUrl)}
                                    className="block rounded-lg border border-white/15 py-2 text-center text-[13px] text-gray-200 hover:bg-white/10 transition-colors"
                                  >
                                    🎬 Transformar em vídeo
                                  </button>
                                  <button
                                    onClick={() => openCerebro(msg.imageUrl, msg.text)}
                                    className="block rounded-lg border border-white/15 py-2 text-center text-[13px] text-primary-300 hover:bg-white/10 transition-colors"
                                  >
                                    🧠 Editar na conversa
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-3 px-5 py-6 text-[14px] text-gray-300">
                              <span className="flex gap-1">
                                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:120ms]" />
                                <span className="h-2 w-2 animate-bounce rounded-full bg-primary-400 [animation-delay:240ms]" />
                              </span>
                              {status || 'Pensando…'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endRef} />
                </div>
              )}
            </div>

            {/* Compositor */}
            <div className="border-t border-white/10 p-3 md:p-4">
              <div className="mx-auto max-w-2xl">
                <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 focus-within:border-primary-500/40 transition-colors">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
                    }}
                    rows={1}
                    placeholder="Descreva a imagem que você quer…"
                    className="max-h-40 flex-1 resize-none bg-transparent px-2 py-2 text-[14px] text-white placeholder-gray-500 outline-none"
                  />
                  <button
                    onClick={() => send()}
                    disabled={generating || !input.trim()}
                    className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-600/25 hover:from-primary-500 hover:to-primary-400 disabled:opacity-40 transition-all"
                    aria-label="Gerar"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[11px] text-gray-500">Enter envia · Shift+Enter pula linha</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
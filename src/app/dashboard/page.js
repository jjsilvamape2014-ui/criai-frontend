'use client';

// Minhas criações: só a galeria. Criar fica num lugar só (o Estúdio, /cerebro).
// Antes esta página tinha um segundo criador (só de imagem, com outras regras),
// e o cliente pedia vídeo aqui e recebia imagem.

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { setAuthTokenCookie, clearAuthTokenCookie } from '@/lib/auth-cookie';
import Header from '@/components/Header';

const FILTROS = [
  { id: 'todas', label: 'Todas' },
  { id: 'imagens', label: 'Imagens' },
  { id: 'videos', label: 'Vídeos' },
  { id: 'favoritos', label: 'Favoritos' },
];

const isVideo = (i) => i.type === 'VIDEO' || /\.(mp4|webm|mov)(\?|$)/i.test(i.imageUrl || '');
// o servidor guarda marcas internas no começo do pedido ("[ad p=0 v=1] [falar] ...")
const cleanPrompt = (p) => String(p || '').replace(/^(\s*\[[^\]]*\]\s*)+/, '').trim();
const fmtData = (d) => (d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '');

function Icon({ d, className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}
const I = {
  download: 'M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3',
  edit: 'M15.23 5.23l3.54 3.54M9 11l6.36-6.36a2.5 2.5 0 113.54 3.54L12.54 14.54a4 4 0 01-1.79 1.04L7 17l1.42-3.75A4 4 0 019 11z',
  trash: 'M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0l-1 12a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7',
  heart: 'M12 20s-7-4.35-7-10a4 4 0 017-2.65A4 4 0 0119 10c0 5.65-7 10-7 10z',
  plus: 'M12 5v14M5 12h14',
  play: 'M8 5v14l11-7z',
  close: 'M6 6l12 12M18 6L6 18',
};

export default function MinhasCriacoes() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const [aberta, setAberta] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [favs, setFavs] = useState(() => new Set());

  useEffect(() => {
    try { setFavs(new Set(JSON.parse(localStorage.getItem('criai_favs') || '[]'))); } catch {}
  }, []);

  const load = useCallback(async () => {
    try {
      setHistory((await api.getHistory()) || []);
    } catch (e) {
      setErro('Não consegui carregar suas criações. Atualize a página.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { clearAuthTokenCookie(); window.location.href = '/login'; return; }
    setAuthTokenCookie(token);
    load();
  }, [load]);

  useEffect(() => {
    if (!aberta) return;
    const onKey = (e) => { if (e.key === 'Escape') setAberta(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [aberta]);

  const toggleFav = (id) => {
    setFavs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem('criai_favs', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const remover = async (id) => {
    try {
      await api.deleteHistoryItem(id);
      setHistory((h) => h.filter((i) => i.id !== id));
      setAberta(null);
    } catch {
      setErro('Não consegui excluir agora. Tente de novo.');
    } finally {
      setConfirmando(false);
    }
  };

  const editarNoEstudio = (url) => {
    try {
      sessionStorage.setItem('criai_ref_image', url);
      sessionStorage.setItem('criai_ref_prompt', '');
    } catch {}
    window.location.href = '/cerebro';
  };

  const prontas = history.filter((i) => i.imageUrl && i.status === 'COMPLETED');
  const lista = prontas.filter((i) => {
    if (filtro === 'imagens') return !isVideo(i);
    if (filtro === 'videos') return isVideo(i);
    if (filtro === 'favoritos') return favs.has(i.id);
    return true;
  });
  const conta = {
    todas: prontas.length,
    imagens: prontas.filter((i) => !isVideo(i)).length,
    videos: prontas.filter(isVideo).length,
    favoritos: prontas.filter((i) => favs.has(i.id)).length,
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-24 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10.5px] uppercase text-brand-dim" style={{ letterSpacing: '1.6px' }}>Arquivo</p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold" style={{ letterSpacing: '-1px' }}>Minhas criações</h1>
          </div>
          <a href="/cerebro" className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-brand-accent hover:bg-brand-accentHover text-[14px] font-semibold text-brand-bg">
            <Icon d={I.plus} /> Nova criação
          </a>
        </div>

        <div role="tablist" aria-label="Filtrar criações" className="mt-6 flex flex-wrap gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filtro === f.id}
              onClick={() => setFiltro(f.id)}
              className={`h-10 px-4 rounded-full border text-[13px] font-medium transition-colors ${filtro === f.id ? 'border-brand-accent bg-brand-accent/10 text-brand-text' : 'border-brand-borderStrong text-brand-sub hover:text-brand-text'}`}
            >
              {f.label} <span className="ml-1 font-mono text-[11px] text-brand-dim">{conta[f.id]}</span>
            </button>
          ))}
        </div>

        {erro && <p role="alert" className="mt-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{erro}</p>}

        {loading ? (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/5] rounded-[14px] bg-brand-surface animate-pulse" />)}
          </div>
        ) : lista.length === 0 ? (
          <div className="mt-10 rounded-[18px] border border-brand-border bg-brand-surface px-6 py-14 text-center">
            <p className="font-display text-xl font-bold">
              {filtro === 'favoritos' ? 'Nenhum favorito ainda' : filtro === 'videos' ? 'Nenhum vídeo ainda' : filtro === 'imagens' ? 'Nenhuma imagem ainda' : 'Você ainda não criou nada'}
            </p>
            <p className="mt-2 text-sm text-brand-sub">
              {filtro === 'favoritos' ? 'Toque no coração de uma criação para guardar aqui.' : 'Tudo o que você criar no Estúdio aparece aqui.'}
            </p>
            {filtro !== 'favoritos' && (
              <a href="/cerebro" className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-brand-accent text-[14px] font-semibold text-brand-bg hover:bg-brand-accentHover">
                Ir para o Estúdio
              </a>
            )}
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {lista.map((item) => {
              const video = isVideo(item);
              return (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => { setAberta(item); setConfirmando(false); }}
                    className="group block w-full text-left"
                    aria-label={`Abrir ${video ? 'vídeo' : 'imagem'}: ${cleanPrompt(item.prompt).slice(0, 60)}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] border border-brand-border bg-black">
                      {video ? (
                        <video src={item.imageUrl} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                      ) : (
                        <img src={item.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                      )}
                      {video && (
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 font-mono text-[10px] text-white">
                          <Icon d={I.play} className="w-3 h-3" /> VÍDEO
                        </span>
                      )}
                    </div>
                    <p className="mt-2 line-clamp-1 text-[12.5px] text-brand-sub group-hover:text-brand-text">{cleanPrompt(item.prompt) || 'Sem descrição'}</p>
                    <p className="font-mono text-[10.5px] text-brand-dim">{fmtData(item.createdAt)}</p>
                  </button>
                  <button
                    onClick={() => toggleFav(item.id)}
                    aria-pressed={favs.has(item.id)}
                    aria-label={favs.has(item.id) ? 'Tirar dos favoritos' : 'Favoritar'}
                    className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full ${favs.has(item.id) ? 'bg-brand-accent text-brand-bg' : 'bg-black/60 text-white hover:bg-black/80'}`}
                  >
                    <Icon d={I.heart} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-14 border-t border-brand-border pt-6">
          <p className="font-mono text-[10.5px] uppercase text-brand-dim" style={{ letterSpacing: '1.6px' }}>Outras ferramentas</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/video" className="h-10 inline-flex items-center px-4 rounded-full border border-brand-borderStrong text-[13px] text-brand-sub hover:text-brand-text">Transformar foto em vídeo</a>
            <a href="/card-de-candidato" className="h-10 inline-flex items-center px-4 rounded-full border border-brand-borderStrong text-[13px] text-brand-sub hover:text-brand-text">Santinho de candidato</a>
          </div>
        </div>
      </main>

      {aberta && (
        <div role="dialog" aria-modal="true" aria-label="Criação" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6" onClick={() => setAberta(null)}>
          <div className="relative flex max-h-full w-full max-w-4xl flex-col gap-4 overflow-y-auto rounded-[18px] border border-brand-borderStrong bg-brand-surface p-4 sm:flex-row sm:p-5" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setAberta(null)} aria-label="Fechar" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
              <Icon d={I.close} />
            </button>
            <div className="flex flex-1 items-center justify-center rounded-[12px] bg-black min-h-[240px]">
              {isVideo(aberta) ? (
                <video src={aberta.imageUrl} controls autoPlay playsInline className="max-h-[70vh] max-w-full" />
              ) : (
                <img src={aberta.imageUrl} alt={cleanPrompt(aberta.prompt)} className="max-h-[70vh] max-w-full object-contain" />
              )}
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-72">
              <p className="pr-12 font-mono text-[10.5px] uppercase text-brand-dim" style={{ letterSpacing: '1.6px' }}>{isVideo(aberta) ? 'Vídeo' : 'Imagem'} · {fmtData(aberta.createdAt)}</p>
              <p className="text-[14px] leading-relaxed text-brand-sub whitespace-pre-wrap">{cleanPrompt(aberta.prompt) || 'Sem descrição'}</p>
              <div className="mt-auto flex flex-col gap-2 pt-2">
                <a href={aberta.imageUrl} download target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-accent text-[14px] font-semibold text-brand-bg hover:bg-brand-accentHover">
                  <Icon d={I.download} /> Baixar
                </a>
                {!isVideo(aberta) && (
                  <button onClick={() => editarNoEstudio(aberta.imageUrl)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-borderStrong text-[14px] text-brand-text hover:border-brand-dim">
                    <Icon d={I.edit} /> Editar no Estúdio
                  </button>
                )}
                <button onClick={() => toggleFav(aberta.id)} aria-pressed={favs.has(aberta.id)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-borderStrong text-[14px] text-brand-text hover:border-brand-dim">
                  <Icon d={I.heart} /> {favs.has(aberta.id) ? 'Nos favoritos' : 'Favoritar'}
                </button>
                {confirmando ? (
                  <div className="flex gap-2">
                    <button onClick={() => remover(aberta.id)} className="h-11 flex-1 rounded-full bg-red-500/80 text-[13px] font-semibold text-white hover:bg-red-500">Excluir de vez</button>
                    <button onClick={() => setConfirmando(false)} className="h-11 flex-1 rounded-full border border-brand-borderStrong text-[13px] text-brand-sub">Cancelar</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmando(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full text-[13px] text-red-300 hover:bg-red-500/10">
                    <Icon d={I.trash} /> Excluir
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

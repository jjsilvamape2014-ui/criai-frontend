'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LandingGenerator from '@/components/LandingGenerator';
import CerebroEditor from '@/components/CerebroEditor';

const IDEIAS = [
  { cat: 'Anúncio de produto', prompt: 'Anúncio de hambúrguer artesanal com o preço R$ 29,90 e a chamada Peça já', src: '/showcase/anuncio-hamburguer.webp' },
  { cat: 'Post para feed', prompt: 'Post quadrado com a frase Promoção de Setembro, fundo laranja', src: '/showcase/post-feed.webp' },
  { cat: 'Logotipo', prompt: 'Logotipo para a marca Padaria São João, traço minimalista', src: '/showcase/logo-padaria.webp' },
  { cat: 'Anúncio Instagram', prompt: 'Anúncio vertical para o Instagram de uma faculdade, chamada Vestibular 2027, cores azul e branco', src: '/showcase/capa-video.webp' },
  { cat: 'Story/Reels', prompt: 'Story vertical 9:16 de promoção de açaí com o preço R$ 12,90 em destaque', src: '/showcase/estilo-anuncio.webp' },
  { cat: 'Foto de perfil', prompt: 'Retrato profissional, fundo neutro, luz suave de estúdio', src: '/showcase/foto-perfil.webp' },
  { cat: 'Capa de vídeo', prompt: 'Thumbnail com o título Como Vender Mais no Instagram', src: '/showcase/capa-video.webp' },
  { cat: 'Anúncio', prompt: 'Anúncio de açaí com o preço R$ 12,90 em destaque, fundo roxo', src: '/showcase/estilo-anuncio.webp' },
  { cat: 'Logotipo', prompt: 'Logotipo minimalista para a marca Açaí do Norte, traço limpo', src: '/showcase/estilo-logo.webp' },
  { cat: 'Promoção', prompt: 'Post quadrado com a chamada Promoção de Setembro, tipografia forte', src: '/showcase/estilo-post.webp' },
  { cat: 'Capa de vídeo', prompt: 'Capa de vídeo com o título Como Abrir Sua Loja, alto contraste', src: '/showcase/estilo-capa.webp' },
  { cat: 'Foto de perfil', prompt: 'Retrato profissional em fundo neutro, luz suave de estúdio', src: '/showcase/estilo-perfil.webp' },
  { cat: 'Arte decorativa', prompt: 'Arte abstrata em tons terrosos para quadro decorativo grande', src: '/showcase/estilo-arte.webp' },
];

// Formatos de peça com formato pronto — toque, descreva o resto e gere.
const FORMATOS = [
  { label: 'Anúncio Instagram', prompt: 'Anúncio para o feed do Instagram (formato vertical), oferta em destaque, chamada clara e CTA, cores da sua marca', size: { width: 1216, height: 1520 } },
  { label: 'Post quadrado', prompt: 'Post quadrado para Instagram com chamada de promoção e preço em destaque', size: { width: 1024, height: 1024 } },
  { label: 'Story/Reels', prompt: 'Story vertical para Instagram (9:16) com mensagem curta e chamada clara', size: { width: 1200, height: 1920 } },
  { label: 'Logotipo', prompt: 'Logotipo minimalista da sua marca, traço limpo, fundo branco', size: { width: 1024, height: 1024 } },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fpResults, setFpResults] = useState([]);
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }

    const params = new URLSearchParams(window.location.search);
    const hasSuccess = params.get('success') === 'true';
    const sessionId = params.get('session_id');

    Promise.all([api.getProfile(), api.getHistory()])
      .then(([profile, hist]) => {
        setUser(profile); setHistory(hist); setLoading(false);
        const confirm = (sid) => api.confirmPayment(sid).then((r) => { if (r.user) setUser(r.user); window.history.replaceState({}, '', '/dashboard'); }).catch(() => {});
        if (sessionId) confirm(sessionId);
        else if (hasSuccess) api.getRecentSession().then((r) => r.sessionId && confirm(r.sessionId)).catch(() => {});
      })
      .catch(() => { localStorage.removeItem('token'); window.location.href = '/login'; });
  }, []);

  const pickIdea = (prompt) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('criai:set-prompt', { detail: { prompt } }));
    }
  };

  const pickFormat = (f) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('criai:set-prompt', { detail: { prompt: f.prompt, ...f.size } }));
    }
  };

  const searchFreepik = async () => {
    const t = window.prompt('Qual modelo de design você quer? Ex: flyer de pizza, anúncio de faculdade, post de promoção');
    if (!t) return;
    setFpLoading(true); setFpError(null); setFpResults([]);
    try {
      const data = await api.freepikTemplates(t);
      setFpResults(data.templates || []);
    } catch (err) {
      if (err.status === 501) {
        setFpError('A busca de modelos do Freepik ainda não foi ativada neste servidor (falta a chave gratuita).');
      } else {
        setFpError('Não foi possível buscar modelos agora. Tente novamente.');
      }
    } finally {
      setFpLoading(false);
    }
  };

  const useTemplate = (thumb) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('criai_ref_image', thumb);
      sessionStorage.setItem('criai_ref_prompt', 'Modelo do Freepik');
      window.location.href = '/dashboard?chat=1#cerebro';
    }
  };

  const handleChatEdit = (item) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('criai_ref_image', item.imageUrl);
      sessionStorage.setItem('criai_ref_prompt', item.prompt);
      window.location.href = '/dashboard?chat=1#cerebro';
    }
  };

  const handleDownload = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `criativa-imagem-${index + 1}.png`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary-800 border-t-primary-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  const totalCredits = (user?.creditsImages || 0) + (user?.creditsPurchased || 0);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        {/* Status compacto */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">O que você quer criar?</h1>
            <p className="text-sm text-gray-400 mt-1.5">Escreva com as suas palavras. Abaixo tem exemplos prontos para copiar.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={user?.plan === 'PREMIUM' ? 'badge-premium' : 'badge-free'}>
              {user?.plan === 'PREMIUM' ? '⭐ Premium' : 'Grátis'}
            </span>
            {user?.plan === 'PREMIUM' ? (
              <span className="badge-premium">imagens sem limite</span>
            ) : totalCredits > 0 ? (
              <span className="badge-free">{totalCredits} imagens este mês</span>
            ) : (
              <a href="/plans" className="btn-secondary text-sm">Quero mais imagens</a>
            )}
          </div>
        </div>

        {/* Gerador - o coração do app */}
        <div className="mb-12">
          <LandingGenerator initialPrompt="" scrollOnSet />
        </div>

        {/* Formatos rápidos - anúncio Instagram, post, story, logo */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-1">Peça pronta para rede social</h2>
          <p className="text-sm text-gray-400 mb-4">Toque no formato certo para o Instagram/Facebook — o campo de cima já monta o começo da descrição.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FORMATOS.map((f, i) => (
              <button
                key={i}
                onClick={() => pickFormat(f)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-left hover:border-primary-500/40 transition-all duration-300"
              >
                <p className="text-sm font-semibold text-white mb-0.5">{f.label}</p>
                <p className="text-[11px] text-gray-400">{f.size.width}×{f.size.height}px</p>
              </button>
            ))}
          </div>
        </div>

        {/* Modelos do Freepik - o Cérebro busca designs prontos */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-1">Modelos prontos (Freepik)</h2>
          <p className="text-sm text-gray-400 mb-4">Busco modelos de design gratuitos, você escolhe um e edita com a sua marca no Cérebro.</p>
          <button
            onClick={searchFreepik}
            disabled={fpLoading}
            className="btn-secondary text-sm"
          >
            {fpLoading ? 'Buscando...' : '🔎 Buscar modelos no Freepik'}
          </button>
          {fpError && (
            <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-300">{fpError}</p>
            </div>
          )}
          {fpResults.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {fpResults.map((t) => (
                <button
                  key={t.id}
                  onClick={() => useTemplate(t.thumb)}
                  className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 text-left hover:border-primary-500/40 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={t.thumb} alt={t.title || 'Modelo'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[11px] text-gray-300 line-clamp-2">{t.title || 'Modelo gratuito'}</p>
                    <p className="text-[10px] text-primary-400 mt-1">Usar como base →</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Artes prontas para copiar */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-1">Comece por um exemplo</h2>
          <p className="text-sm text-gray-400 mb-5">Toque em uma imagem — a descrição dela já entra no campo lá em cima.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {IDEIAS.map((it, i) => (
              <button
                key={i}
                onClick={() => pickIdea(it.prompt)}
                className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 text-left hover:border-primary-500/40 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={it.src} alt={it.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-semibold uppercase text-primary-400 mb-1">{it.cat}</p>
                  <p className="text-[13px] text-gray-300 line-clamp-3" style={{ textWrap: 'pretty' }}>“{it.prompt}”</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cérebro Visual - editar com conversa */}
        <CerebroEditor />

        {/* Histórico do usuário */}
        <h2 className="text-lg font-semibold text-white mb-4">Suas criações</h2>
        {history.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg mb-2">Nenhuma imagem ainda</p>
            <p className="text-gray-500 text-sm">Escreva sua ideia no campo de cima e toque em Gerar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((item, i) => (
              <div key={item.id || i} className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 aspect-square hover:border-primary-500/30 transition-all duration-300">
                <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col justify-end p-3">
                  <p className="text-white text-xs mb-2 line-clamp-2">{item.prompt}</p>
                  <button onClick={() => handleChatEdit(item)} className="text-white text-xs mb-1.5 text-left flex items-center gap-1.5">
                    <span className="text-sm">🧠</span> Editar na conversa
                  </button>
                  <button onClick={() => handleDownload(item.imageUrl, i)} className="text-white text-xs font-medium text-left">Baixar</button>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : item.status === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {item.status === 'COMPLETED' ? '✓' : item.status === 'FAILED' ? '✗' : '...'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
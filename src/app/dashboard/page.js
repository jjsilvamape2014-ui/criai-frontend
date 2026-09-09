'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import LandingGenerator from '@/components/LandingGenerator';
import CerebroEditor from '@/components/CerebroEditor';
import VideoGenerator from '@/components/VideoGenerator';

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

const RETRATOS = [
  {
    label: '🎬 Neo-noir neon',
    desc: 'Cinematográfico, luz azul + vermelha',
    prompt: `Create a dramatic, ultra-sharp close-up portrait in the style of a 35mm film photograph. The subject is lit with bold neon lighting: an intense blue glow on one side of the face, and a deep red neon hue on the other, creating a striking dual-color composition. The facial expression is fearless and focused, full of character and presence. Preserve the exact face angle, lighting direction, and body posture from the original reference image — no alterations. The face should appear gritty and raw, with visible beads of sweat, slightly wet hair, and a few realistic small cuts for a rugged, hardened look. The subject wears a black suit jacket over a white shirt and black tie, blending into a black shadowy background where only the face and front profile are clearly visible. The lighting sculpts the jawline and cheekbones. Cinematic neo-noir style, film grain, shallow depth of field, realistic skin texture — no smoothing or stylization. Close-up vertical portrait, rich in mood, color contrast and filmic atmosphere.`
  },
  {
    label: '🎧 Capa de álbum',
    desc: 'Produtor musical imerso no próprio mundo',
    prompt: `Maintain the facial features and hair exactly from the uploaded selfie. Ensure the result is ultra-realistic, sharp, and visually striking - like a music producer lost in their own world. This should look like a professional cinematic portrait in 4K quality, perfect for an album cover or promotional content.`
  },
  {
    label: '🌘 Eclipse divino',
    desc: 'Perfil em halo de luz alaranjada',
    prompt: `A cinematic side-profile portrait of me standing in front of a glowing circular orange red halo light, resembling a solar eclipse. The subject wears a dark black oversized hoodie. The rim lighting outlines the profile. The lighting is dramatic and moody, creating a golden rim light that outlines his silhouette against a deep, reddish-purple background. The atmosphere is mysterious and elegant, evoking celestial or divine.`
  },
  {
    label: '📸 Famoso na foto',
    desc: 'Selfie casual de madrugada com um ídolo',
    prompt: `Take an extremely ordinary and unremarkable iPhone selfie, with no clear subject or sense of composition—just a quick accidental snapshot. The photo should have slight motion blur and uneven lighting from streetlights and nearby lamps at night near the Baiterek Tower in Astana, Kazakhstan, causing mild overexposure in some areas. The angle should be awkward and the framing messy, giving the picture a deliberately mediocre and casual feel, as if it was taken absentmindedly while pulling the phone from a pocket. The main character is the uploaded person's face, and a famous sports star stands next to them, dressed in casual clothes with a relaxed smile, both caught in a casual, imperfect nighttime moment. The background shows the iconic illuminated monument, parts of the modern city skyline, and blurry silhouettes of passing pedestrians. The overall look should feel intentionally plain, spontaneous and random, capturing the authentic vibe of a poorly composed, spontaneous night-time iPhone selfie.`
  },
  {
    label: '🌧️ Dupla exposição',
    desc: 'Floresta e chuva sobre o retrato',
    prompt: `Create a double exposure using the picture provided. The main image should be a man walking through a woodland holding a camera with a long lens. Small amounts of rain falling with reflections on the puddles on the dirt path. The double exposure should blend seamlessly with the trees using natural light. The whole image should use cool tones.`
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fpResults, setFpResults] = useState([]);
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState(null);
  const [tool, setTool] = useState('image');

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

  const useRetrato = (r) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('criai_ref_prompt', r.prompt);
      sessionStorage.setItem('criai_retrato', '1');
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

        {/* Seletor de ferramenta: imagem / vídeo + anúncio, tudo no mesmo lugar */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setTool('image')}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all border ${
              tool === 'image'
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-primary-500/40'
            }`}
          >
            🖼️ Criar imagem
          </button>
          <button
            onClick={() => setTool('video')}
            className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all border ${
              tool === 'video'
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/30'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-primary-500/40'
            }`}
          >
            🎬 Vídeo · Anúncio
          </button>
        </div>

        {/* Gerador - o coração do app */}
        {tool === 'image' && (
          <div className="mb-12">
            <LandingGenerator initialPrompt="" scrollOnSet />
          </div>
        )}

        {/* Anúncio em vídeo / anúncio falado (mesmo lugar, na hora) */}
        {tool === 'video' && (
          <div className="mb-12">
            <VideoGenerator />
          </div>
        )}

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

        {/* Estilos de retrato - selfie + estilo profissional */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-1">Retrato de impacto a partir da selfie</h2>
          <p className="text-sm text-gray-400 mb-4">Toque num estilo, suba sua selfie no Cérebro e mande enviar — o rosto é mantido.</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {RETRATOS.map((r, i) => (
              <button
                key={i}
                onClick={() => useRetrato(r)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-left hover:border-primary-500/40 transition-all duration-300"
              >
                <p className="text-sm font-semibold text-white mb-0.5">{r.label}</p>
                <p className="text-[11px] text-gray-400">{r.desc}</p>
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
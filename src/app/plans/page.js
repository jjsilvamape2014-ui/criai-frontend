'use client';

// Planos: os números vêm do servidor (/api/credits/plans → src/plans.js do backend),
// então o que aparece aqui é exatamente o que o app aplica. Os valores abaixo são só
// o padrão enquanto a resposta não chega.

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Header from '@/components/Header';

const PADRAO = {
  videoCreditsPer5s: 10,
  free: { images: 10, videoSeconds: 5 },
  premium: { priceFormatted: 'R$ 39,90', images: 50, videoSeconds: 15 },
  packages: [
    { id: 'credits_30', name: 'Pacote 30', credits: 30, priceFormatted: 'R$ 19,90' },
    { id: 'credits_100', name: 'Pacote 100', credits: 100, priceFormatted: 'R$ 59,90' },
    { id: 'credits_250', name: 'Pacote 250', credits: 250, priceFormatted: 'R$ 139,90' },
  ],
  videoPackages: [
    { id: 'video_5', clips: 5, credits: 50, priceFormatted: 'R$ 29,90', pricePerClipFormatted: 'R$ 5,98' },
    { id: 'video_15', clips: 15, credits: 150, priceFormatted: 'R$ 79,90', pricePerClipFormatted: 'R$ 5,33' },
    { id: 'video_40', clips: 40, credits: 400, priceFormatted: 'R$ 199,90', pricePerClipFormatted: 'R$ 5,00' },
  ],
};

function Check({ off }) {
  return <span aria-hidden="true" className={off ? 'text-brand-dim' : 'text-brand-accent'}>{off ? '–' : '✓'}</span>;
}

export default function PlansPage() {
  const [user, setUser] = useState(null);
  const [p, setP] = useState(PADRAO);
  const [loading, setLoading] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.getPlans().then((d) => d && d.premium && setP(d)).catch(() => {});
    if (localStorage.getItem('token')) api.getProfile().then(setUser).catch(() => {});
  }, []);

  const checkout = async (type, packageId) => {
    if (!user) { window.location.href = '/register'; return; }
    setErro('');
    setLoading(packageId || type);
    try {
      const data = await api.createCheckoutSession(type, packageId);
      window.location.href = data.url;
    } catch {
      setErro('Não consegui abrir o pagamento agora. Tente de novo em instantes.');
      setLoading(null);
    }
  };

  const porSeg = p.videoCreditsPer5s / 5;
  const exemplos = (cred) => {
    const anuncios = Math.floor(cred / (porSeg * 15));
    return anuncios > 0 ? `≈ ${cred} imagens, ou ${anuncios} vídeo${anuncios > 1 ? 's' : ''} de 15 s` : `≈ ${cred} imagens, ou ${Math.floor(cred / porSeg)} s de vídeo`;
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <Header />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-20">
        <div className="text-center">
          <p className="font-mono text-[10.5px] uppercase text-brand-dim" style={{ letterSpacing: '1.6px' }}>Planos</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold" style={{ letterSpacing: '-1px' }}>Comece grátis. Pague só se usar mais.</h1>
          <p className="mt-3 text-brand-sub">1 crédito = 1 imagem. Vídeo usa {porSeg} créditos por segundo.</p>
        </div>

        {erro && <p role="alert" className="mx-auto mt-6 max-w-xl rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">{erro}</p>}

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2">
          <section aria-labelledby="free-h" className={`rounded-[18px] border bg-brand-surface p-6 ${user?.plan === 'FREE' ? 'border-brand-borderStrong' : 'border-brand-border'}`}>
            <div className="flex items-center justify-between">
              <h2 id="free-h" className="text-[15px] font-semibold text-brand-sub">Grátis</h2>
              {user?.plan === 'FREE' && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold">SEU PLANO</span>}
            </div>
            <p className="mt-2 font-display text-4xl font-extrabold">R$ 0</p>
            <p className="text-sm text-brand-tert">todo mês, sem cartão</p>
            <ul className="mt-6 space-y-2.5 text-sm text-brand-sub">
              <li className="flex gap-2"><Check /> {p.free.images} imagens por mês</li>
              <li className="flex gap-2"><Check /> 1 vídeo de {p.free.videoSeconds} s por mês</li>
              <li className="flex gap-2"><Check /> Sem marca d'água</li>
              <li className="flex gap-2"><Check off /> <span className="text-brand-dim">Anúncio em vídeo de 15 s</span></li>
            </ul>
            {!user && <a href="/register" className="mt-8 block rounded-full border border-brand-borderStrong py-3 text-center text-sm font-semibold hover:border-brand-dim">Começar grátis</a>}
          </section>

          <section aria-labelledby="pro-h" className="relative rounded-[18px] border border-brand-accent bg-[#17110E] p-6">
            <div className="flex items-center justify-between">
              <h2 id="pro-h" className="text-[15px] font-semibold text-brand-accent">Premium</h2>
              {user?.plan === 'PREMIUM' && <span className="rounded-full bg-brand-accent/20 px-2 py-0.5 text-[11px] font-bold text-brand-accent">SEU PLANO</span>}
            </div>
            <p className="mt-2 font-display text-4xl font-extrabold">{p.premium.priceFormatted}</p>
            <p className="text-sm text-brand-tert">por mês · cancele quando quiser</p>
            <ul className="mt-6 space-y-2.5 text-sm text-brand-sub">
              <li className="flex gap-2"><Check /> {p.premium.images} imagens por mês</li>
              <li className="flex gap-2"><Check /> {p.premium.videoSeconds} s de vídeo por mês (ex.: 1 anúncio de 15 s)</li>
              <li className="flex gap-2"><Check /> Anúncio em vídeo com narração</li>
              <li className="flex gap-2"><Check /> Precisa de mais? Some um pacote de créditos</li>
            </ul>
            {user?.plan === 'PREMIUM' ? (
              <p className="mt-8 rounded-full bg-white/5 py-3 text-center text-sm text-brand-tert">Plano atual</p>
            ) : (
              <button onClick={() => checkout('subscription')} disabled={!!loading} className="mt-8 w-full rounded-full bg-brand-accent py-3 text-sm font-semibold text-brand-bg hover:bg-brand-accentHover disabled:opacity-50">
                {loading === 'subscription' ? 'Abrindo pagamento…' : `Assinar por ${p.premium.priceFormatted}/mês`}
              </button>
            )}
          </section>
        </div>

        <section aria-labelledby="pacotes-h" className="mx-auto mt-14 max-w-4xl">
          <h2 id="pacotes-h" className="text-center font-display text-xl font-bold">Pacotes de créditos</h2>
          <p className="mt-1 text-center text-sm text-brand-tert">Pagamento único. Não vencem. Valem para imagem e vídeo, com ou sem assinatura.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {p.packages.map((pkg) => (
              <div key={pkg.id} className="rounded-[16px] border border-brand-border bg-brand-surface p-5 text-center">
                <p className="text-sm font-semibold text-brand-sub">{pkg.credits} créditos</p>
                <p className="mt-1 font-display text-3xl font-extrabold">{pkg.priceFormatted}</p>
                <p className="mt-1 text-[12.5px] text-brand-tert">{exemplos(pkg.credits)}</p>
                <button onClick={() => checkout('credits', pkg.id)} disabled={!!loading} className="mt-4 w-full rounded-full border border-brand-borderStrong py-2.5 text-sm font-semibold hover:border-brand-dim disabled:opacity-50">
                  {loading === pkg.id ? 'Abrindo…' : 'Comprar'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="video-h" className="mx-auto mt-14 max-w-4xl">
          <h2 id="video-h" className="text-center font-display text-xl font-bold">Pacotes de vídeo</h2>
          <p className="mt-1 text-center text-sm text-brand-tert">Vídeos de 5 segundos com movimento de câmera. Pagamento único, não vencem — e os créditos também valem para imagem.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {(p.videoPackages || []).map((pkg) => (
              <div key={pkg.id} className="rounded-[16px] border border-brand-accent/40 bg-brand-surface p-5 text-center">
                <p className="text-sm font-semibold text-brand-sub">{pkg.clips} vídeos de 5 s</p>
                <p className="mt-1 font-display text-3xl font-extrabold">{pkg.priceFormatted}</p>
                <p className="mt-1 text-[12.5px] text-brand-tert">{pkg.pricePerClipFormatted} por vídeo · {pkg.credits} créditos</p>
                <button onClick={() => checkout('video', pkg.id)} disabled={!!loading} className="mt-4 w-full rounded-full border border-brand-borderStrong py-2.5 text-sm font-semibold hover:border-brand-dim disabled:opacity-50">
                  {loading === pkg.id ? 'Abrindo…' : 'Comprar vídeos'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="faq-h" className="mx-auto mt-16 max-w-2xl">
          <h2 id="faq-h" className="text-center font-display text-lg font-bold">Perguntas frequentes</h2>
          <div className="mt-4 space-y-2">
            {[
              { q: 'Como funcionam os créditos?', a: `Cada imagem usa 1 crédito. Vídeo usa ${porSeg} créditos por segundo: um vídeo de 5 s usa ${p.videoCreditsPer5s}, um anúncio de 15 s usa ${p.videoCreditsPer5s * 3}. Arte com muito texto (um comunicado colado, por exemplo) usa 2. O app mostra o custo antes de gerar.` },
              { q: 'O grátis é grátis mesmo?', a: `Sim. Todo mês você ganha ${p.free.images} imagens e um vídeo de ${p.free.videoSeconds} s, sem cartão.` },
              { q: 'E quando acabar?', a: 'As imagens e vídeos do mês renovam no dia 1. Se precisar antes, compre um pacote de créditos ou assine o Premium.' },
              { q: 'Quero só vídeo, sem assinar. Dá?', a: `Dá. Os pacotes de vídeo saem mais baratos por vídeo no pacote maior (${(p.videoPackages && p.videoPackages[0] && p.videoPackages[0].pricePerClipFormatted) || 'R$ 5,98'} a ${(p.videoPackages && p.videoPackages[2] && p.videoPackages[2].pricePerClipFormatted) || 'R$ 5,00'} por vídeo de 5 s) e os créditos não vencem.` },
              { q: 'Os créditos do mês acumulam?', a: 'Não: os do plano renovam todo dia 1. Os de pacote não vencem.' },
              { q: 'Posso cancelar o Premium?', a: 'Sim, quando quiser. Você continua com o plano até o fim do período pago.' },
              { q: 'Posso usar comercialmente?', a: 'Sim. O que você cria é seu.' },
            ].map((item) => (
              <details key={item.q} className="rounded-[14px] border border-brand-border bg-brand-surface px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">{item.q}<span aria-hidden="true" className="text-brand-dim">+</span></summary>
                <p className="mt-3 text-sm text-brand-sub">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

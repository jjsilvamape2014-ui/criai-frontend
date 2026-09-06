import LandingGenerator from '@/components/LandingGenerator';
import ImageSlot from '@/components/ImageSlot';

function HeadingLabel({ children }) {
  return (
    <span className="text-xs font-semibold uppercase text-brand-accent" style={{ letterSpacing: '1.4px' }}>
      {children}
    </span>
  );
}

export default function SeoPage({ config }) {
  const {
    badge,
    h1,
    lede,
    examplePrompt,
    heroImage,
    heroImageLabel = 'Saída real da Criativa AI',
    stepsIntro,
    steps,
    galleryLabel,
    galleryTitle,
    galleryRight,
    gallery,
    faq,
    related,
  } = config;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      {/* NAV */}
      <nav className="flex items-center justify-between px-10 py-5 max-w-[1180px] mx-auto">
        <a href="/" className="font-display font-extrabold text-[17px] text-brand-text">
          CRIATIVA<span className="text-brand-accent">.</span>AI
        </a>
        <div className="flex items-center gap-[26px]">
          <a href="/plans" className="text-[14px] text-brand-tert hover:text-brand-text transition-colors">Planos</a>
          <a href="/login" className="text-[14px] text-brand-tert hover:text-brand-text transition-colors">Entrar</a>
          <a href="/register" className="rounded-[8px] bg-brand-text px-[18px] py-[9px] text-[14px] font-semibold text-brand-bg hover:opacity-90 transition-opacity">
            Criar conta grátis
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-10 max-w-[1180px] mx-auto pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_.98fr] gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-brand-borderStrong py-1.5 pr-4 pl-1.5">
              <span className="w-[6px] h-[6px] rounded-full bg-brand-accent" />
              <span className="text-[12px] text-brand-tert">{badge}</span>
            </div>

            <h1
              className="mt-6 font-display font-extrabold text-brand-text text-[52px] leading-[1.02] max-w-[600px]"
              style={{ letterSpacing: '-2.2px', textWrap: 'balance' }}
            >
              {h1}
            </h1>

            <p className="mt-6 text-[17px] text-brand-sub max-w-[460px] leading-relaxed" style={{ textWrap: 'pretty' }}>
              {lede}
            </p>

            <div className="mt-8">
              <LandingGenerator initialPrompt={examplePrompt} />
            </div>
          </div>

          <div className="relative">
            <ImageSlot src={heroImage} label={heroImageLabel} aspect="4/5" className="border-brand-borderStrong" />
            <div className="absolute -left-[22px] bottom-[-14px] max-w-[270px] rounded-[11px] border border-brand-borderStrong bg-brand-surface p-4">
              <p className="text-[11px] uppercase text-brand-dim" style={{ letterSpacing: '1px' }}>Exemplo de pedido</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#DDD6CF]" style={{ textWrap: 'pretty' }}>
                “{examplePrompt}”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="px-10 max-w-[1180px] mx-auto pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-brand-border">
          <div>
            <HeadingLabel>{stepsIntro.label}</HeadingLabel>
            <h2 className="mt-3 font-display font-bold text-brand-text text-[34px] leading-[1.05]" style={{ letterSpacing: '-1.8px' }}>
              {stepsIntro.title}
            </h2>
          </div>
          <p className="text-[14px] text-brand-tert max-w-[330px] leading-relaxed" style={{ textWrap: 'pretty' }}>
            {stepsIntro.right}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {steps.map((s, i) => (
            <div key={i} className="rounded-[14px] border border-brand-border bg-brand-surface p-[20px]">
              <span className="font-display font-extrabold text-brand-accent text-[26px]" style={{ letterSpacing: '-1px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="mt-3 text-[15px] font-semibold text-brand-text">{s.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-brand-sub" style={{ textWrap: 'pretty' }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* EXEMPLOS */}
      <section className="px-10 max-w-[1180px] mx-auto pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-brand-border">
          <div>
            <HeadingLabel>{galleryLabel}</HeadingLabel>
            <h2 className="mt-3 font-display font-bold text-brand-text text-[34px] leading-[1.05]" style={{ letterSpacing: '-1.8px' }}>
              {galleryTitle}
            </h2>
          </div>
          <p className="text-[14px] text-brand-tert max-w-[330px] leading-relaxed" style={{ textWrap: 'pretty' }}>
            {galleryRight}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {gallery.map((g, i) => (
            <div key={i} className="rounded-[14px] border border-brand-border bg-brand-surface overflow-hidden">
              <ImageSlot src={g.src} label={g.prompt} styleRadius={false} aspect={g.aspect || 'square'} />
              <div className="px-[15px] pt-[13px] pb-[15px]">
                <p className="text-[11px] font-semibold uppercase text-brand-accent" style={{ letterSpacing: '1px' }}>{g.cat}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-brand-sub" style={{ textWrap: 'pretty' }}>“{g.prompt}”</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-10 max-w-[1180px] mx-auto pt-20">
        <div className="pb-5 border-b border-brand-border">
          <HeadingLabel>Dúvidas comuns</HeadingLabel>
          <h2 className="mt-3 font-display font-bold text-brand-text text-[34px] leading-[1.05]" style={{ letterSpacing: '-1.8px' }}>
            Perguntas frequentes
          </h2>
        </div>
        <div className="mt-6 max-w-[760px] space-y-3">
          {faq.map((f, i) => (
            <details key={i} className="group rounded-[12px] border border-brand-border bg-brand-surface p-[18px] open:border-brand-borderStrong">
              <summary className="cursor-pointer text-[15px] font-semibold text-brand-text list-none flex items-center justify-between gap-3">
                {f.q}
                <span className="text-brand-dim group-open:hidden">+</span>
                <span className="hidden text-brand-dim group-open:inline">−</span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-brand-sub" style={{ textWrap: 'pretty' }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* RELACIONADOS */}
      {related && related.length > 0 && (
        <section className="px-10 max-w-[1180px] mx-auto pt-16">
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <a
                key={r.href}
                href={r.href}
                className="rounded-full border border-brand-border px-4 py-2 text-[13px] text-brand-tert hover:text-brand-text hover:border-brand-borderStrong transition-colors"
              >
                {r.label}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* CTA FINAL */}
      <section className="px-10 max-w-[1180px] mx-auto pt-20">
        <div className="rounded-[18px] border border-brand-borderStrong bg-brand-surface px-10 py-[52px] text-center">
          <h2 className="font-display font-extrabold text-brand-text text-[38px] leading-[1.05]" style={{ letterSpacing: '-2px' }}>
            Escreva em português. Receba em 4K.
          </h2>
          <p className="mt-3 text-[16px] text-brand-tert">10 imagens grátis por mês, sem cartão.</p>
          <a href="/register" className="mt-6 inline-block rounded-[10px] bg-brand-accent px-[30px] py-[15px] text-[14px] font-semibold text-brand-bg hover:bg-brand-accentHover transition-colors">
            Criar conta grátis
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-[80px] border-t border-brand-border px-10 py-[26px]">
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-display font-extrabold text-[14px] text-brand-tert">
            CRIATIVA<span className="text-brand-accent">.</span>AI
          </span>
          <span className="text-[12px] text-brand-dim">© 2026 Criativa AI · Todos os direitos reservados</span>
        </div>
      </footer>

      {/* FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </div>
  );
}
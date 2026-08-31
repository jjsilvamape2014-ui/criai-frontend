import Header from '@/components/Header';
import GeneratorTabs from '@/components/GeneratorTabs';
import Logo from '@/components/Logo';

const SHOWCASE_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&h=600&fit=crop', prompt: 'Fogos de artificio neon sobre cidade' },
  { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=600&fit=crop', prompt: 'Galaxia e ceu estrelado em 8K' },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop', prompt: 'Vale com neblina ao amanhecer' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop', prompt: 'Montanha nevada cinematografica' },
  { url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=600&fit=crop', prompt: 'Paisagem de drone em alta resolucao' },
  { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop', prompt: 'Abstrato digital com cores vivas' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=600&fit=crop', prompt: 'Cordilheira ao por do sol' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=600&fit=crop', prompt: 'Floresta mística com raios de luz' },
];

const FEATURES = [
  { icon: '🎨', title: 'Texto perfeito em PT', desc: 'Diferente de outras IAs, nossa gera texto em português 100% correto — sem erros, sem caracteres estranhos.' },
  { icon: '⚡', title: 'Velocidade máxima', desc: 'Imagens geradas em segundos com os modelos mais avançados do mercado (Ideogram 4.0, FLUX 2 Pro).' },
  { icon: '🔍', title: 'Resolução 4K', desc: 'Cada imagem é renderizada em alta resolução. Perfeita para impressão, redes sociais e web.' },
  { icon: '🎯', title: 'Prompt inteligente', desc: 'Descreva em português o que quer — nossa IA otimiza automaticamente o prompt para melhor resultado.' },
  { icon: '✂️', title: 'Texto sobre imagem', desc: 'Adicione texto diretamente na imagem com fontes profissionais. Ideal para posts e anúncios.' },
  { icon: '💰', title: 'Grátis para começar', desc: 'Ganhe 10 imagens e 2 vídeos grátis todo mês. Sem cartão, sem compromisso.' },
];

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/20 via-dark-950 to-dark-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary-600/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gradient-radial from-blue-600/10 via-transparent to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-gray-300 mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Comece grátis — quando acabar, é só R$ 39,99/mês
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Crie imagens<br />
            <span className="gradient-text">incríveis com IA</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Descreva o que você imagina — nossa inteligência artificial transforma em imagens 4K e vídeos profissionais em segundos.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href="/register" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
              Começar grátis
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <a href="#como-funciona" className="btn-secondary text-base px-8 py-3.5">
              Como funciona
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 text-sm text-gray-500 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">10</p>
              <p>imagens grátis/mês</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">4K</p>
              <p>resolução máxima</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">PT</p>
              <p>texto perfeito</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Gallery */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">Galeria de exemplos</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Imagens geradas por <span className="gradient-text">nossos usuários</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {SHOWCASE_IMAGES.map((img, i) => (
              <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-primary-500/30 transition-all duration-500">
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{img.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Transform */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">Transformação real</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              De ideia <span className="text-gray-500">embaçada</span> a imagem <span className="gradient-text">cristalina</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">Descreva em português — nossa IA transforma conceitos vagos em imagens 4K nítidas e detalhadas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { before: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=500&fit=crop', label: 'Foto comum → Obra de arte', prompt: 'Ceu estrelado com galaxia em 8K, astrofotografia' },
              { before: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&h=500&fit=crop', label: 'Paisagem → Foto profissional', prompt: 'Cordilheira dramatica ao por do sol, fotorrealismo' },
              { before: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=500&fit=crop', after: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop', label: 'Ambiente → Cena cinematográfica', prompt: 'Floresta mística com raios de luz atravessando' },
            ].map((pair, i) => (
              <div key={i} className="group">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-primary-500/30 transition-all duration-500">
                  <div className="grid grid-cols-2">
                    {/* Before - blurry */}
                    <div className="relative aspect-square overflow-hidden">
                      <img src={pair.before} alt="Antes" className="w-full h-full object-cover blur-sm scale-110 brightness-75 saturate-50" loading="lazy" />
                      <div className="absolute inset-0 bg-dark-950/40" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Antes</span>
                    </div>
                    {/* After - clean */}
                    <div className="relative aspect-square overflow-hidden">
                      <img src={pair.after} alt="Depois" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-primary-600/80 text-[10px] font-bold text-white uppercase tracking-wider">Depois</span>
                    </div>
                  </div>
                  {/* Arrow overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-blue-500 flex items-center justify-center shadow-xl shadow-primary-500/40 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <p className="text-xs text-gray-500 font-medium">{pair.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5 italic truncate">"{pair.prompt}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">Experimente agora</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Gere sua primeira imagem <span className="gradient-text">grátis</span>
            </h2>
          </div>
          <GeneratorTabs />
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">Por que a Criai?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Tudo que você precisa para <span className="gradient-text">criar com IA</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-glow group hover:scale-[1.02] transition-transform duration-300">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">Simples assim</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Como funciona</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Descreva', desc: 'Escreva em português o que você quer ver. Quanto mais detalhes, melhor o resultado.', color: 'from-violet-500 to-purple-500' },
              { step: '02', title: 'Gere', desc: 'Nossa IA cria sua imagem em segundos em resolução 4K, usando os modelos mais avançados.', color: 'from-purple-500 to-blue-500' },
              { step: '03', title: 'Use', desc: 'Baixe em alta resolução, sem watermark. Use onde quiser: loja, redes sociais, apresentações.', color: 'from-blue-500 to-cyan-500' },
            ].map(item => (
              <div key={item.step} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-3">Planos</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Escolha seu plano</h2>
            <p className="text-gray-400">Comece grátis. Quando os créditos acabarem, é só R$ 39,99/mês.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="card text-center">
              <h3 className="text-lg font-bold text-white mb-1">Free</h3>
              <p className="text-4xl font-bold text-white mb-1">Grátis</p>
              <p className="text-sm text-gray-500 mb-6">para começar</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8 text-left max-w-xs mx-auto">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> 10 imagens + 2 vídeos/mês</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Resolução 4K</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Sem watermark</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Texto em português nítido</li>
                <li className="flex items-center gap-2 text-gray-500"><span className="text-red-400">✗</span> Sem limite de criações</li>
              </ul>
              <a href="/register" className="btn-secondary block text-center text-sm">Começar grátis</a>
            </div>

            {/* Premium */}
            <div className="card-glow text-center relative gradient-border">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-premium">SEM LIMITES</div>
              <h3 className="text-lg font-bold text-white mb-1">Premium</h3>
              <p className="text-4xl font-bold gradient-text mb-1">R$ 39,99</p>
              <p className="text-sm text-gray-500 mb-6">por mês</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8 text-left max-w-xs mx-auto">
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Imagens ilimitadas em 4K</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Vídeos ilimitados</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Modelos exclusivos premium</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Upscale 4K automático</li>
                <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Sem fila — prioridade máxima</li>
              </ul>
              <a href="/plans" className="btn-primary block text-center text-sm">Assinar Premium</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">© 2026 Criai. Todos os direitos reservados.</p>
              <p className="text-xs text-gray-600 mt-1">Desenvolvido por <span className="text-gray-400">João Gomes</span> · (91) 99987-9932</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

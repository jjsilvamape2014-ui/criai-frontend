import Header from '@/components/Header';
import GeneratorTabs from '@/components/GeneratorTabs';

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white pb-16">
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
            Comece grátis — quando acabar, é só R$ 39,99/mês
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Crie imagens incríveis<br/>
            <span className="text-primary-600">com inteligência artificial</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Descreva o que você imagina e nossa IA transforma em imagens em 4K e vídeos profissionais
            em segundos. Grátis para começar — quando os créditos acabam, é só R$ 39,99/mês.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">✅ Grátis para começar</span>
            <span className="flex items-center gap-1">✅ Sem watermark</span>
            <span className="flex items-center gap-1">✅ Alta resolução</span>
          </div>
        </div>
      </section>

      {/* Gerador */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <GeneratorTabs />
      </section>

      {/* Como funciona */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Como funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Descreva', desc: 'Escreva em português o que você quer ver. Quanto mais detalhes, melhor.' },
              { step: '2', title: 'Gere', desc: 'Nossa IA cria sua imagem em segundos em resolução 4K, usando os modelos mais avançados do mercado.' },
              { step: '3', title: 'Use', desc: 'Baixe em alta resolução, sem watermark. Use onde quiser: loja, redes sociais, apresentações.' },
            ].map(item => (
              <div key={item.step} className="card text-center">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos preview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
            Escolha seu plano
          </h2>
          <p className="text-center text-gray-500 mb-12">Comece grátis. Quando os créditos acabarem, é só R$ 39,99/mês.</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="card border-2 border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-1">Free</h3>
              <p className="text-3xl font-bold text-gray-900 mb-4">Grátis<span className="text-base font-normal text-gray-400"> para começar</span></p>
              <ul className="space-y-3 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">✅ Créditos grátis de imagem e vídeo</li>
                <li className="flex items-center gap-2">✅ Resolução 4K</li>
                <li className="flex items-center gap-2">✅ Sem watermark</li>
                <li className="flex items-center gap-2">✅ Texto em português nítido</li>
                <li className="flex items-center gap-2 text-gray-400">❌ Quando acabar, paga R$ 39,99/mês</li>
              </ul>
              <a href="/register" className="btn-secondary block text-center text-sm">Começar grátis</a>
            </div>

            {/* Premium */}
            <div className="card border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                SEM LIMITES
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Premium</h3>
              <p className="text-3xl font-bold text-primary-600 mb-4">R$ 39,99<span className="text-base font-normal text-gray-400">/mês</span></p>
              <ul className="space-y-3 text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">✅ Imagens ilimitadas em 4K</li>
                <li className="flex items-center gap-2">✅ Vídeos ilimitados</li>
                <li className="flex items-center gap-2">✅ Modelos exclusivos premium</li>
                <li className="flex items-center gap-2">✅ Upscale 4K automático</li>
                <li className="flex items-center gap-2">✅ Sem fila — prioridade máxima</li>
              </ul>
              <a href="/plans" className="btn-primary block text-center text-sm">Assinar Premium</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">© 2026 Criai. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}

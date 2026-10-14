// Deixa o site instalável como app no celular (e no computador): ícone na tela de
// início, abre em tela cheia, sem a barra do navegador.
export default function manifest() {
  return {
    name: 'Linha Fácil IA',
    short_name: 'Linha Fácil IA',
    description: 'Posts, artes e vídeos de anúncio para o seu negócio, feitos com IA.',
    start_url: '/cerebro',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0B0A0C',
    theme_color: '#0B0A0C',
    lang: 'pt-BR',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

import SeoPage from '@/components/SeoPage';

export const metadata = {
  title: 'Gerar Arte com IA Grátis – Quadros e Artes Digitais | Criativa AI',
  description: 'Gerar arte com IA de graça: descreva a cena e receba quadros, artes digitais e capas em 4K, sem watermark. Explore estilos abstratos, tons terrosos e muito mais.',
  alternates: { canonical: '/gerar-arte-com-ia' },
};

const config = {
  badge: 'Arte digital com IA',
  h1: 'Gerar arte com IA, do rascunho mental ao quadro.',
  lede: 'Descreva a cena que está na sua cabeça e a Criativa AI transforma em arte: composições abstratas, paisagens, capas e decoração — em 4K, sem marca d’água.',
  examplePrompt: 'Composição abstrata em tons terrosos, formato retrato',
  heroImage: '/showcase/arte-parede.webp',
  stepsIntro: {
    label: 'Como funciona',
    title: 'Da ideia à arte em três passos',
    right: 'Sua descrição vira uma imagem com qualidade de exposição.',
  },
  steps: [
    { title: 'Descreva a cena', body: 'Fale a atmosfera, as cores e o formato: “abstrato terroso, retrato”, “paisagem futurista, papel de parede”.' },
    { title: 'Escolha o estilo', body: 'A IA combina a descrição com estilos prontos para gerar uma arte coesa, com luz e composição equilibradas.' },
    { title: 'Baixe em 4K', body: 'Impressão ou digital: a arte sai em alta resolução, sem watermark, pronta para enquadrar ou usar como capa.' },
  ],
  galleryLabel: 'Exemplos reais',
  galleryTitle: 'Artes nascidas de uma frase',
  galleryRight: 'Cenas e estilos variados, todos do prompt à esquerda.',
  gallery: [
    { cat: 'Arte de parede', prompt: 'Composição abstrata em tons terrosos, formato retrato', src: '/showcase/arte-parede.webp' },
    { cat: 'Arte de parede', prompt: 'Arte abstrata em tons terrosos para quadro decorativo grande', src: '/showcase/estilo-arte.webp' },
    { cat: 'Post para feed', prompt: 'Post quadrado com a frase Promoção de Setembro, fundo laranja', src: '/showcase/post-feed.webp' },
  ],
  faq: [
    { q: 'Posso gerar arte para vender ou usar num livro?', a: 'Sim. As imagens geradas são suas para uso comercial, incluindo impressões, capas e produtos.' },
    { q: 'Dá para escolher o estilo da arte?', a: 'Sim. Você descreve o estilo no prompt — abstrato, minimalista, aquarela, futurista — ou usa os estilos prontos da plataforma.' },
    { q: 'A qualidade serve para impressão?', a: 'Sim, as imagens saem em 4K, adequadas para quadros, posters e materiais impressos.' },
    { q: 'Gerar arte com IA é grátis?', a: 'O plano gratuito dá 10 imagens por mês em 4K. O Premium é ilimitado para quem cria bastante.' },
  ],
  related: [
    { label: 'Criar imagem com IA', href: '/criar-imagem-com-ia' },
    { label: 'Gerar logo online', href: '/gerar-logo-online' },
    { label: 'Editar foto com IA', href: '/editar-foto-com-ia' },
    { label: 'Transformar foto em vídeo', href: '/transformar-foto-em-video' },
  ],
};

export default function Page() {
  return <SeoPage config={config} />;
}
import SeoPage from '@/components/SeoPage';

export const metadata = {
  title: 'Editar Foto com IA Online – Trocar Fundo, Remover Pessoa | Criativa AI',
  description: 'Editar foto com IA online e de graça: troque o fundo, remova pessoas, coloque chapéu, ajuste iluminação conversando com o Cérebro. Sem instalar nada.',
  alternates: { canonical: '/editar-foto-com-ia' },
};

const config = {
  badge: 'Editor de fotos com IA',
  h1: 'Editar foto com IA falando o que você quer.',
  lede: 'Suba até 4 fotos e converse com o Cérebro: “troque o fundo para um estúdio”, “remova essa pessoa”, “me deixe de chapéu”. A IA refaz a imagem como você pediu.',
  examplePrompt: 'Retrato profissional em fundo de estúdio, luz suave',
  heroImage: '/showcase/foto-perfil.webp',
  stepsIntro: {
    label: 'Como funciona',
    title: 'Edição por conversa, sem Photoshop',
    right: 'O Cérebro é o agente da Criativa AI que edita usando suas fotos como referência.',
  },
  steps: [
    { title: 'Envie suas fotos', body: 'Suba até 4 imagens no Cérebro — pode ser uma selfie, a foto do produto ou o card de aniversário.' },
    { title: 'Peça a mudança em português', body: '“Coloca um fundo de praia”, “tira a pessoa do fundo”, “deixa num formato de 4:5 para o feed”. A IA entende.' },
    { title: 'Receba a foto editada', body: 'O resultado sai pronto para publicar, na resolução que você pediu.' },
  ],
  galleryLabel: 'Exemplos reais',
  galleryTitle: 'Edições típicas do dia a dia',
  galleryRight: 'Fotos de perfil, capas e posts — todos gerados por frases.',
  gallery: [
    { cat: 'Foto de perfil', prompt: 'Retrato profissional, fundo neutro, luz suave de estúdio', src: '/showcase/foto-perfil.webp' },
    { cat: 'Capa de vídeo', prompt: 'Thumbnail com o título Como Vender Mais no Instagram', src: '/showcase/capa-video.webp' },
    { cat: 'Post para feed', prompt: 'Post quadrado com a frase Promoção de Setembro, fundo laranja', src: '/showcase/post-feed.webp' },
  ],
  faq: [
    { q: 'Posso trocar o fundo de uma foto minha?', a: 'Sim. Basta enviar a foto no Cérebro e pedir: “troca o fundo para um estúdio branco” ou “fundo de praia com sol”. A IA refaz a imagem mantendo você.' },
    { q: 'A edição mantém minha aparência?', a: 'Sim, o Cérebro usa suas fotos como referência para preservar o rosto e suas características na nova imagem.' },
    { q: 'É preciso saber Photoshop?', a: 'Não. Toda edição é pedida em português, como numa conversa. Se não gostar, peça de outro jeito.' },
    { q: 'Editar foto com IA é grátis?', a: 'O plano gratuito dá 10 imagens por mês. O Premium remove os limites para quem edita bastante.' },
  ],
  related: [
    { label: 'Criar imagem com IA', href: '/criar-imagem-com-ia' },
    { label: 'Gerar logo online', href: '/gerar-logo-online' },
    { label: 'Transformar foto em vídeo', href: '/transformar-foto-em-video' },
    { label: 'Gerar arte com IA', href: '/gerar-arte-com-ia' },
  ],
};

export default function Page() {
  return <SeoPage config={config} />;
}
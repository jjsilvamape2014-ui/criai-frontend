import SeoPage from '@/components/SeoPage';

export const metadata = {
  title: 'Transformar Foto em Vídeo com IA – Carrossel e Capa de Vídeo | Criativa AI',
  description: 'Transformar foto em vídeo com IA: gere a capa, o post ou a imagem do carrossel com texto em português escrito certo — o Conversor de vídeo da Criativa AI anima suas imagens.',
  alternates: { canonical: '/transformar-foto-em-video' },
};

const config = {
  badge: 'Imagens e vídeos com IA',
  h1: 'Transformar foto em vídeo e vender mais no feed.',
  lede: 'Crie a capa, o cartaz e a arte do carrossel com texto em português correto — e depois anime a imagem com o Conversor de vídeo da Criativa AI, tudo conversando no Cérebro.',
  examplePrompt: 'Capa de vídeo com o título Como Vender Mais no Instagram, alto contraste',
  heroImage: '/showcase/capa-video.webp',
  stepsIntro: {
    label: 'Como funciona',
    title: 'Da arte ao vídeo em três passos',
    right: 'Produza suas artes e vídeos na mesma plataforma.',
  },
  steps: [
    { title: 'Gere a imagem', body: 'Peça a capa ou o cartaz do seu vídeo com texto em português — título grande, chamada clara, marcando bem o assunto.' },
    { title: 'Anime no Cérebro', body: 'Com sua conta criada, o Cérebro transforma a imagem em vídeo curto, ideal para Reels, TikTok e Stories.' },
    { title: 'Publique', body: 'Baixe o resultado pronto e poste. O texto continua nítido porque a base foi gerada com qualidade.' },
  ],
  galleryLabel: 'Exemplos reais',
  galleryTitle: 'Artes que abrem seus vídeos',
  galleryRight: 'Cabeçalhos e capas gerados por uma frase em português.',
  gallery: [
    { cat: 'Capa de vídeo', prompt: 'Thumbnail com o título Como Vender Mais no Instagram', src: '/showcase/capa-video.webp' },
    { cat: 'Capa de vídeo', prompt: 'Capa de vídeo com o título Como Abrir Sua Loja, alto contraste', src: '/showcase/estilo-capa.webp' },
    { cat: 'Anúncio de produto', prompt: 'Anúncio de hambúrguer artesanal com o preço R$ 29,90 e a chamada Peça já', src: '/showcase/anuncio-hamburguer.webp' },
  ],
  faq: [
    { q: 'A Criativa AI transforma foto em vídeo?', a: 'Sim. O Cérebro recebe sua imagem e gera um vídeo curto animado — ideal para Reels, TikTok e Stories.' },
    { q: 'Preciso editar vídeo em programas?', a: 'Não. Tudo é pedido em português, como numa conversa, direto no navegador.' },
    { q: 'O título do vídeo escreve certo?', a: 'Sim. Primeiro você gera a capa com o Cérebro, que escreve o título em português corretamente; depois a imagem é animada.' },
    { q: 'É grátis transformar foto em vídeo?', a: 'O plano gratuito inclui 10 imagens por mês. O Premium oferece gerações ilimitadas, incluindo vídeos.' },
  ],
  related: [
    { label: 'Criar imagem com IA', href: '/criar-imagem-com-ia' },
    { label: 'Gerar logo online', href: '/gerar-logo-online' },
    { label: 'Editar foto com IA', href: '/editar-foto-com-ia' },
    { label: 'Gerar arte com IA', href: '/gerar-arte-com-ia' },
  ],
};

export default function Page() {
  return <SeoPage config={config} />;
}
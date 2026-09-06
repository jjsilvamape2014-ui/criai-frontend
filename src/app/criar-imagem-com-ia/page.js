import SeoPage from '@/components/SeoPage';

export const metadata = {
  title: 'Criar Imagem com IA Grátis – Gerador de Imagens com Inteligência Artificial',
  description: 'Criar imagem com IA de graça: descreva em português e receba pôster, anúncio e logo em 4K com texto escrito certo. Sem cartão. 10 imagens grátis por mês.',
  alternates: { canonical: '/criar-imagem-com-ia' },
};

const config = {
  badge: 'Gerador de imagens com IA',
  h1: 'Criar imagem com IA é simples: fale o que você quer.',
  lede: 'Escreva uma frase em português — um pôster, uma arte para o feed, um cartaz de promoção — e a Criativa AI gera em segundos, em 4K e com o texto escrito corretamente.',
  examplePrompt: 'Pôster de açaí com o preço R$ 12,90 em destaque, fundo roxo',
  heroImage: '/showcase/hero-acai.webp',
  stepsIntro: {
    label: 'Como funciona',
    title: 'Da frase à imagem em três passos',
    right: 'Sem cartão para experimentar. Sem instalar nada, direto no navegador.',
  },
  steps: [
    { title: 'Descreva o que precisa', body: 'Escreva do seu jeito, em português: “anúncio de açaí com preço em destaque”. Quanto mais detalhes, mais perto do resultado ideal.' },
    { title: 'A IA gera em segundos', body: 'Modelos treinados para renderizar texto em português com acentuação e ortografia corretas — inclusive em preços e chamadas.' },
    { title: 'Baixe em alta resolução', body: 'Imagem em 4K, sem marca d’água, pronta para publicar em rede social, site ou impresso.' },
  ],
  galleryLabel: 'Exemplos reais',
  galleryTitle: 'Imagens geradas com uma frase',
  galleryRight: 'Cada peça abaixo nasceu do prompt escrito em português.',
  gallery: [
    { cat: 'Pôster de produto', prompt: 'Pôster de açaí com o preço R$ 12,90 em destaque, fundo roxo', src: '/showcase/hero-acai.webp' },
    { cat: 'Anúncio de produto', prompt: 'Anúncio de hambúrguer artesanal com o preço R$ 29,90 e a chamada Peça já', src: '/showcase/anuncio-hamburguer.webp' },
    { cat: 'Post para feed', prompt: 'Post quadrado com a frase Promoção de Setembro, fundo laranja', src: '/showcase/post-feed.webp' },
  ],
  faq: [
    { q: 'É grátis mesmo criar imagem com IA?', a: 'Sim. O plano gratuito dá 10 imagens por mês em 4K, sem cartão de crédito. Para uso intenso existe o Premium com gerações ilimitadas.' },
    { q: 'A IA escreve o texto certo em português?', a: 'Sim, essa é a especialidade da Criativa AI. Usamos modelos treinados para renderizar acentuação e ortografia corretas em português — preços, nomes e chamadas saem nítidos.' },
    { q: 'Preciso instalar algum programa?', a: 'Não. Tudo roda no navegador: você cria a conta, escreve o pedido e baixa a imagem pronta.' },
    { q: 'Posso usar as imagens comercialmente?', a: 'Sim, as imagens geradas são suas para usar em anúncios, redes sociais, sites e materiais impressos.' },
  ],
  related: [
    { label: 'Gerar logo online', href: '/gerar-logo-online' },
    { label: 'Editar foto com IA', href: '/editar-foto-com-ia' },
    { label: 'Transformar foto em vídeo', href: '/transformar-foto-em-video' },
    { label: 'Gerar arte com IA', href: '/gerar-arte-com-ia' },
  ],
};

export default function Page() {
  return <SeoPage config={config} />;
}
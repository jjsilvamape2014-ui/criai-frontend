import SeoPage from '@/components/SeoPage';

export const metadata = {
  title: 'Gerar Logo Online Grátis com IA – Logo com Nome Escrito Certo | Criativa AI',
  description: 'Gerar logo online grátis com IA: descreva o nome da sua marca e receba um logotipo com o texto escrito certo, em 4K e sem watermark. Sem cartão para começar.',
  alternates: { canonical: '/gerar-logo-online' },
};

const config = {
  badge: 'Logotipo com nome escrito certo',
  h1: 'Gerar logo online, com o nome da sua marca escrito certo.',
  lede: 'A maioria das IAs erra letras e acentuação em logotipos. A Criativa AI foi treinada para escrever nomes e frases em português com precisão — perfeita para criar a marca da sua empresa.',
  examplePrompt: 'Logotipo minimalista para a marca Açaí do Norte, traço limpo',
  heroImage: '/showcase/logo-padaria.webp',
  stepsIntro: {
    label: 'Como funciona',
    title: 'Seu logotipo em três passos',
    right: 'Ideal para quem precisa de logo rápido, sem pagar designer.',
  },
  steps: [
    { title: 'Escreva o nome da marca', body: 'Informe o nome do seu negócio e o estilo que você gosta — minimalista, colorido, moderno, clássico.' },
    { title: 'Escolha o visual', body: 'A IA propõe um logotipo com o nome escrito corretamente, pronto para representar sua empresa.' },
    { title: 'Ajuste no Cérebro', body: 'Depois de criar sua conta, o Cérebro (nosso agente de conversa) reformula cores, fundo e elementos usando suas fotos como referência.' },
  ],
  galleryLabel: 'Exemplos reais',
  galleryTitle: 'Logos gerados por frases simples',
  galleryRight: 'Nomes escritos corretamente, sem OCR estragar a arte.',
  gallery: [
    { cat: 'Logotipo', prompt: 'Logotipo para a marca Padaria São João, traço minimalista', src: '/showcase/logo-padaria.webp' },
    { cat: 'Logotipo', prompt: 'Logotipo minimalista para a marca Açaí do Norte, traço limpo', src: '/showcase/estilo-logo.webp' },
    { cat: 'Anúncio com logo', prompt: 'Anúncio de hambúrguer artesanal com o preço R$ 29,90 e a chamada Peça já', src: '/showcase/anuncio-hamburguer.webp' },
  ],
  faq: [
    { q: 'O nome da minha marca sai escrito certo?', a: 'Sim. Os modelos da Criativa AI renderizam texto, incluindo nomes com acentuação — o problema mais comum de outras IAs de imagem.' },
    { q: 'É grátis gerar logo online?', a: 'O plano gratuito inclui 10 imagens por mês em 4K, sem cartão. Dá para criar e testar seu logotipo sem pagar nada.' },
    { q: 'Posso usar o logo no CNPJ e nas redes sociais?', a: 'Sim. As imagens geradas são suas e podem ser usadas em redes sociais, site, materiais impressos e apresentações.' },
    { q: 'Preciso saber design para fazer um logo?', a: 'Não. Você descreve o nome e o estilo; a IA cuida do resto. Se quiser refinar, o Cérebro ajusta cores e elementos por conversa.' },
  ],
  related: [
    { label: 'Criar imagem com IA', href: '/criar-imagem-com-ia' },
    { label: 'Editar foto com IA', href: '/editar-foto-com-ia' },
    { label: 'Transformar foto em vídeo', href: '/transformar-foto-em-video' },
    { label: 'Gerar arte com IA', href: '/gerar-arte-com-ia' },
  ],
};

export default function Page() {
  return <SeoPage config={config} />;
}
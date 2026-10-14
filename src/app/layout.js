import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-bricolage',
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-instrument',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-mono',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ia.linhafacil2026.com.br';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Linha Fácil IA (beta) – Posts e vídeos para o seu negócio',
    template: '%s | Linha Fácil IA',
  },
  description: 'Posts, artes e vídeos de anúncio para o seu negócio, feitos com IA em minutos. Texto em português escrito certo, sem marca d’água. Grátis para começar.',
  keywords: ['criar imagens com IA', 'inteligência artificial', 'gerar imagem', 'anúncio de produto', 'ia de imagens', 'texto em português ia'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Linha Fácil IA',
    locale: 'pt_BR',
    url: SITE_URL,
    title: 'Linha Fácil IA (beta) – Posts e vídeos para o seu negócio',
    description: 'Posts, artes e vídeos de anúncio para o seu negócio, feitos com IA em minutos. Grátis para começar.',
    images: [{ url: '/linhafacil-logo.png', width: 1672, height: 330, alt: 'Linha Fácil IA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linha Fácil IA (beta) – Posts e vídeos para o seu negócio',
    description: 'Posts, artes e vídeos de anúncio para o seu negócio, feitos com IA em minutos.',
    images: ['/linhafacil-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    'google-site-verification': 'Oke-oVcZAkOPXT6B45TJfDMgst5Pw4LdhV919SbcTYY',
  },
  icons: { icon: '/linhafacil-logo.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable} antialiased min-h-screen font-sans`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Linha Fácil IA',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Web',
              description: 'Plataforma para criar imagens profissionais com inteligência artificial, com texto em português e estilos prontos para anúncio de produto.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'BRL',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}

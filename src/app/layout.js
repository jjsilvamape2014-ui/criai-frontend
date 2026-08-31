import { Inter, Sora } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://criai-frontend-production.up.railway.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Criai - Gere imagens incríveis com IA',
    template: '%s | Criai',
  },
  description: 'Crie imagens profissionais com inteligência artificial. Texto em português nítido, resolução 4K, sem watermark e com estilos prontos para anúncio de produto. Grátis para começar.',
  keywords: ['criar imagens com IA', 'inteligência artificial', 'gerar imagem', 'anúncio de produto', 'ia de imagens', 'texto em português ia'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Criai',
    locale: 'pt_BR',
    url: SITE_URL,
    title: 'Criai - Gere imagens incríveis com IA',
    description: 'Crie imagens profissionais com IA. Texto em português, resolução 4K, estilos prontos para anúncio de produto. Grátis para começar.',
    images: [{ url: '/criai-logo.png', width: 2172, height: 724, alt: 'Criai' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Criai - Gere imagens incríveis com IA',
    description: 'Crie imagens profissionais com IA. Texto em português, resolução 4K, estilos prontos para anúncio.',
    images: ['/criai-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: '/criai-logo.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${sora.variable} antialiased min-h-screen font-sans`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Criai',
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

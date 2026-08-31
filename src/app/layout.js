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

export const metadata = {
  title: 'Criai - Crie imagens e vídeos com IA',
  description: 'Gere imagens e vídeos incríveis com inteligência artificial. Texto em português nítido, resolução 4K, sem watermark.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${sora.variable} antialiased min-h-screen font-sans`}>
        {children}
      </body>
    </html>
  );
}

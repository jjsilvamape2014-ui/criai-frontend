import './globals.css';

export const metadata = {
  title: 'Criai - Crie imagens e vídeos com IA',
  description: 'Gere imagens e vídeos incríveis com inteligência artificial. Texto em português nítido, resolução 4K, sem watermark.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

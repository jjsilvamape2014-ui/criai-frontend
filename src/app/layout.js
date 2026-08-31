export const metadata = {
  title: 'Criai - Crie imagens e vídeos com IA',
  description: 'Gere imagens e vídeos incríveis com inteligência artificial. Grátis para começar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

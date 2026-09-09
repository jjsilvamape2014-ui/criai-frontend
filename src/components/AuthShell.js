'use client';

import Logo from '@/components/Logo';

// Layout padrão para as telas de autenticação (login/registro): mobile-first,
// sem Header/navegação extra — só a logo no topo e o formulário centralizado
// ocupando toda a largura no celular.
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-dvh flex flex-col bg-dark-950">
      <header className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5">
        <Logo size="md" />
        <a href="/" className="btn-ghost text-sm !px-3 !py-1.5">← Voltar</a>
      </header>

      <main className="flex-1 flex items-center justify-center w-full px-4 pb-8">
        <div className="w-full max-w-md">
          <div className="card-glow w-full px-5 py-6 sm:px-8 sm:py-8">
            <h1 className="text-2xl font-bold text-white text-center mb-1.5">{title}</h1>
            {subtitle && <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">{subtitle}</p>}
            {children}
          </div>
        </div>
      </main>

      <footer className="pb-5 text-center px-4">
        <p className="text-xs text-gray-600">Criativa AI — crie imagens e vídeos com inteligência artificial</p>
      </footer>
    </div>
  );
}
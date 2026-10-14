'use client';

// Botão "Instalar no celular": Android/Chrome usa o pedido nativo; iPhone (Safari não
// tem esse pedido) mostra o passo a passo de "Adicionar à Tela de Início".
import { useEffect, useState } from 'react';
import { isStandalone } from './AppShell';

export default function InstallApp({ className = '' }) {
  const [ready, setReady] = useState(false);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [ajuda, setAjuda] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    setReady(!!window.__installPrompt);
    const on = () => setReady(true);
    window.addEventListener('criai-install-ready', on);
    return () => window.removeEventListener('criai-install-ready', on);
  }, []);

  if (installed || (!ready && !ios)) return null;

  const instalar = async () => {
    if (ios) { setAjuda(true); return; }
    const p = window.__installPrompt;
    if (!p) return;
    p.prompt();
    await p.userChoice.catch(() => null);
    window.__installPrompt = null;
    setReady(false);
  };

  return (
    <>
      <button type="button" onClick={instalar} className={className}>Instalar no celular</button>
      {ajuda && (
        <div role="dialog" aria-modal="true" aria-label="Instalar no iPhone" className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4" onClick={() => setAjuda(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-brand-borderStrong bg-brand-surface p-5 text-brand-text" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-lg font-bold">Instalar no iPhone</p>
            <ol className="mt-3 space-y-2 text-sm text-brand-sub">
              <li>1. No Safari, toque em <b className="text-brand-text">Compartilhar</b> (o quadrado com a seta para cima).</li>
              <li>2. Toque em <b className="text-brand-text">Adicionar à Tela de Início</b>.</li>
              <li>3. Toque em <b className="text-brand-text">Adicionar</b>. O ícone da Linha Fácil IA aparece junto dos seus apps.</li>
            </ol>
            <button type="button" onClick={() => setAjuda(false)} className="mt-5 h-11 w-full rounded-full bg-brand-accent text-sm font-semibold text-brand-bg">Entendi</button>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

const PLACEHOLDER = 'Pôster de açaí com o preço R$ 12,90 em destaque';

export default function LandingGenerator({ initialPrompt = '', scrollOnSet = false }) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [size, setSize] = useState({ width: 1216, height: 1520 });
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const p = e.detail?.prompt;
      if (p) setPrompt(p);
      if (e.detail?.width && e.detail?.height) setSize({ width: e.detail.width, height: e.detail.height });
      if (scrollOnSet && inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputRef.current.focus();
      }
    };
    window.addEventListener('criai:set-prompt', handler);
    return () => window.removeEventListener('criai:set-prompt', handler);
  }, [scrollOnSet]);

  const handleGenerate = async () => {
    const msg = prompt.trim();
    if (!msg) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      window.location.href = '/register';
      return;
    }
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const data = await api.generateImage(msg, { model: 'flux2pro', width: size.width, height: size.height });
      setImageUrl(data.imageUrl);
    } catch (err) {
      if (err.data?.code === 'NO_CREDITS') {
        window.location.href = '/plans';
        return;
      }
      setError('Não foi possível gerar agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 rounded-[14px] border border-brand-borderStrong bg-brand-surface p-[14px] pl-[18px] max-w-[520px]">
        <input
          ref={inputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKey}
          placeholder={PLACEHOLDER}
          className="flex-1 min-w-0 bg-transparent text-[15px] text-brand-text placeholder-brand-dim outline-none"
          maxLength={300}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="shrink-0 rounded-[9px] bg-brand-accent px-5 py-[11px] text-sm font-semibold text-brand-bg hover:bg-brand-accentHover disabled:opacity-40 transition-colors"
        >
          {loading ? 'Gerando…' : 'Gerar'}
        </button>
      </div>
      <p className="mt-2 text-[13px] text-brand-dim">Descreva em português. Sem cartão para começar.</p>

      {error && (
        <div className="mt-4 rounded-xl border border-brand-border bg-brand-surface p-4">
          <p className="text-sm text-brand-sub">{error}</p>
        </div>
      )}

      {imageUrl && (
        <div className="mt-6 rounded-lg overflow-hidden border border-brand-border max-w-[520px]">
          <img
            src={imageUrl}
            alt="Resultado da geração"
            className="w-full max-h-[460px] object-contain bg-brand-surface"
          />
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-center text-sm py-3 text-brand-accent hover:text-brand-accentHover font-medium bg-brand-surface"
          >
            Abrir em alta resolução
          </a>
        </div>
      )}
    </div>
  );
}

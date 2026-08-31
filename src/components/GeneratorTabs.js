'use client';

import { useState, useEffect } from 'react';
import ImageGenerator from '@/components/ImageGenerator';

export default function GeneratorTabs() {
  const [tab, setTab] = useState('image');

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.tab === 'image') setTab('image');
    };
    window.addEventListener('criai:switch-tab', handler);
    return () => window.removeEventListener('criai:switch-tab', handler);
  }, []);

  return (
    <div>
      <div className="mb-6 inline-flex bg-white/5 rounded-xl p-1.5 border border-white/10">
        <button
          onClick={() => setTab('image')}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20"
        >
          Imagem
        </button>
      </div>

      <ImageGenerator />
    </div>
  );
}

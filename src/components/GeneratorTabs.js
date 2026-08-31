'use client';

import { useState } from 'react';
import ImageGenerator from '@/components/ImageGenerator';
import VideoGenerator from '@/components/VideoGenerator';

export default function GeneratorTabs() {
  const [tab, setTab] = useState('image');

  return (
    <div>
      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1.5 max-w-xs">
        <button
          onClick={() => setTab('image')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === 'image' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🖼️ Imagem
        </button>
        <button
          onClick={() => setTab('video')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === 'video' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🎬 Vídeo
        </button>
      </div>

      {tab === 'image' ? <ImageGenerator /> : <VideoGenerator />}
    </div>
  );
}

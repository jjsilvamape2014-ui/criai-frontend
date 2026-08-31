'use client';

import { useState } from 'react';
import ImageGenerator from '@/components/ImageGenerator';
import VideoGenerator from '@/components/VideoGenerator';

export default function GeneratorTabs() {
  const [tab, setTab] = useState('image');

  return (
    <div>
      <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-1.5 max-w-xs border border-white/10">
        <button
          onClick={() => setTab('image')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'image' ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Imagem
        </button>
        <button
          onClick={() => setTab('video')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'video' ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Video
        </button>
      </div>

      {tab === 'image' ? <ImageGenerator /> : <VideoGenerator />}
    </div>
  );
}

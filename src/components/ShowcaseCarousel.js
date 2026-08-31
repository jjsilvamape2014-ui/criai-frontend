'use client';

import { useState, useEffect, useCallback } from 'react';

export default function ShowcaseCarousel() {
  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&h=900&fit=crop',
      title: 'Galáxia em 8K',
      prompt: 'Ceu estrelado com galaxia, astrofotografia cinematografica',
      tag: 'Fantasia',
    },
    {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&h=900&fit=crop',
      title: 'Cordilheira ao pôr do sol',
      prompt: 'Paisagem dramatica com tons quentes, fotorrealismo',
      tag: 'Paisagem',
    },
    {
      url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=1400&h=900&fit=crop',
      title: 'Neon sobre a cidade',
      prompt: 'Fogos e neon urbano, estilo cyberpunk',
      tag: 'Cidade',
    },
    {
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&h=900&fit=crop',
      title: 'Floresta mística',
      prompt: 'Raios de sol atravessando a mata, atmosfera magica',
      tag: 'Natureza',
    },
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&h=900&fit=crop',
      title: 'Abstrato vivo',
      prompt: 'Cores fluidas e vibrantes, arte digital',
      tag: 'Arte',
    },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex(i => (i + 1) % slides.length), [slides.length]);
  const prev = () => setIndex(i => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <div
      className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-500/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Gradient glow behind */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-600/20 via-fuchsia-500/10 to-blue-600/20 blur-2xl rounded-full -z-10" />

      {/* Slides */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            style={{ zIndex: i === index ? 1 : 0 }}
          >
            <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} />
            {/* Overlay para legibilidade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-500/30 text-primary-200 text-xs font-semibold backdrop-blur mb-3">
                {slide.tag}
              </span>
              <h3 className="text-2xl sm:text-4xl font-display font-bold text-white mb-2">{slide.title}</h3>
              <p className="text-gray-300 text-sm sm:text-base max-w-lg">"{slide.prompt}"</p>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Anterior"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-primary-600/80 backdrop-blur text-white flex items-center justify-center transition-all hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={next}
        aria-label="Próximo"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-primary-600/80 backdrop-blur text-white flex items-center justify-center transition-all hover:scale-110"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-primary-400' : 'w-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}

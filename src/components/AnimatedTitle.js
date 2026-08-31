'use client';

const WORDS = ['imagens', 'vídeos', 'logos', 'artes', 'posts'];

export default function AnimatedTitle() {
  return (
    <span className="inline-flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
      {WORDS.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((char, i) => (
            <span
              key={i}
              className="inline-block gradient-text animate-letter"
              style={{ animationDelay: `${1.2 + wi * 0.6 + i * 0.07}s` }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

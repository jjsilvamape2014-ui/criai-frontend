'use client';

export default function AnimatedTitle() {
  const word = 'incríveis';
  return (
    <span className="inline-block">
      {word.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block gradient-text animate-letter"
          style={{ animationDelay: `${0.3 + i * 0.08}s` }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

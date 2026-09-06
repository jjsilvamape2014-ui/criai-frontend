'use client';

import { useState } from 'react';

// Espaço de imagem que sempre aponta para uma saída local real da IA (/public/showcase/*.webp).
// Se o arquivo ainda não existir, exibe um contorno tracejado com a legenda do que vai aparecer.
export default function ImageSlot({ src, label, aspect = 'square', className = '', styleRadius = true }) {
  const [missing, setMissing] = useState(false);

  const aspectCls =
    aspect === '4/5' ? 'aspect-[4/5]' : aspect === 'square' ? 'aspect-square' : 'aspect-video';

  const rounded = styleRadius === false ? '' : ' rounded-[14px]';
  const border = styleRadius === false ? '' : ' border bg-brand-surface';

  return (
    <div
      className={`relative overflow-hidden ${aspectCls}${rounded}${border} ${className}`}
    >
      {!missing ? (
        <img
          src={src}
          alt={label}
          onError={() => setMissing(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          {/* contorno pontilhado da área da imagem */}
          <div className="w-full h-full border-2 border-dashed border-brand-borderStrong rounded-lg flex items-center justify-center">
            <span className="px-3 text-xs text-brand-dim">{label}</span>
          </div>
        </div>
      )}
    </div>
  );
}

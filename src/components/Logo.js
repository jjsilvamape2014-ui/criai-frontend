export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-3xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <a href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative">
        <svg width={s.icon} height={s.icon} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7c3aed" />
              <stop offset="0.5" stopColor="#6366f1" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="logoInner" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c4b5fd" />
              <stop offset="1" stopColor="#93c5fd" />
            </linearGradient>
          </defs>
          {/* Outer rounded square */}
          <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#logoGrad)" />
          {/* Inner sparkle/star shape */}
          <path d="M24 10L27.5 19.5L37 16L30 24L37 32L27.5 28.5L24 38L20.5 28.5L11 32L18 24L11 16L20.5 19.5L24 10Z" fill="url(#logoInner)" opacity="0.95" />
          {/* Center dot */}
          <circle cx="24" cy="24" r="3" fill="white" opacity="0.9" />
        </svg>
        <div className="absolute inset-0 rounded-xl bg-primary-500/20 blur-xl group-hover:bg-primary-400/30 transition-all duration-500" />
      </div>
      {showText && (
        <span className={`font-bold ${s.text} text-white tracking-tight`}>
          Cri<span className="gradient-text">ai</span>
        </span>
      )}
    </a>
  );
}

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };
  const s = sizes[size] || sizes.md;

  return (
    <a href="/" className={`flex items-center group ${className}`}>
      <span className={`font-black tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105 ${s}`}>
        CRIATIVA AI
      </span>
    </a>
  );
}

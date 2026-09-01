export default function Logo({ size = 'md', showText = true, className = '' }) {
  const heights = {
    sm: 32,
    md: 42,
    lg: 52,
  };
  const h = heights[size] || heights.md;

  return (
    <a href="/" className={`flex items-center group ${className}`}>
      <img
        src="/criativa-logo.png"
        alt="Criativa AI"
        height={h}
        style={{ height: h, width: 'auto' }}
        className="drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
      />
    </a>
  );
}

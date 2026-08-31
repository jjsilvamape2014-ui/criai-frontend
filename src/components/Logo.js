export default function Logo({ size = 'md', showText = true, className = '' }) {
  const heights = {
    sm: 26,
    md: 34,
    lg: 44,
  };
  const h = heights[size] || heights.md;

  return (
    <a href="/" className={`flex items-center group ${className}`}>
      <img
        src="/criai-logo.png"
        alt="Criai"
        height={h}
        style={{ height: h, width: 'auto' }}
        className="drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
      />
    </a>
  );
}

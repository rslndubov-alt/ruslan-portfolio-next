export default function LogoSVG() {
  return (
    <div style={{ width: '180px', height: '180px', margin: '0 auto', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.1)); opacity: 0.8; }
          50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.5)); opacity: 1; }
          100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.1)); opacity: 0.8; }
        }
        .shimmer-logo {
          animation: shimmer 4s infinite ease-in-out;
        }
      `}} />
      <svg viewBox="0 0 100 100" className="shimmer-logo" style={{ width: '100%', height: '100%' }}>
        {/* Outer rings */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#ringGrad2)" strokeWidth="1.5" />
        
        {/* The 'D' */}
        <path d="M35 25 L55 25 C70 25, 75 35, 75 50 C75 65, 70 75, 55 75 L35 75 Z" fill="none" stroke="url(#dGrad)" strokeWidth="10" />
        
        {/* The inner hole of 'D' (so it looks thick) */}
        <path d="M43 33 L55 33 C64 33, 67 40, 67 50 C67 60, 64 67, 55 67 L43 67 Z" fill="#000" />

        {/* The Eye inside D */}
        <path d="M38 50 Q50 38 65 50 Q50 62 38 50 Z" fill="none" stroke="#ccc" strokeWidth="2" />
        <circle cx="51.5" cy="50" r="5" fill="#ccc" />
        <circle cx="52.5" cy="49" r="2" fill="#000" />
        
        {/* Eye highlight */}
        <circle cx="51" cy="48" r="0.8" fill="#fff" />

        {/* Text */}
        <text x="50" y="88" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="url(#textGrad)" letterSpacing="0.5">
          RD AI PRODUCTION
        </text>

        {/* Gradients to make it look metallic/3D */}
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="30%" stopColor="#555" />
            <stop offset="100%" stopColor="#111" />
          </linearGradient>
          <linearGradient id="ringGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ddd" />
            <stop offset="50%" stopColor="#444" />
            <stop offset="100%" stopColor="#000" />
          </linearGradient>
          <linearGradient id="dGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ddd" />
            <stop offset="50%" stopColor="#555" />
            <stop offset="100%" stopColor="#222" />
          </linearGradient>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ccc" />
            <stop offset="50%" stopColor="#fff" />
            <stop offset="100%" stopColor="#aaa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

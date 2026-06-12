export default function BgOrnament() {
  return (
    <svg
      id="bg-ornament"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        zIndex: -1, pointerEvents: 'none', opacity: 0.09,
      }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="tp" width="420" height="420" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round">
            <line x1="90" y1="85" x2="330" y2="65" strokeWidth="0.45" opacity="0.7"/>
            <line x1="330" y1="65" x2="370" y2="300" strokeWidth="0.45" opacity="0.7"/>
            <line x1="370" y1="300" x2="210" y2="210" strokeWidth="0.45" opacity="0.7"/>
            <line x1="210" y1="210" x2="75" y2="345" strokeWidth="0.45" opacity="0.7"/>
            <line x1="75" y1="345" x2="90" y2="85" strokeWidth="0.45" opacity="0.7"/>
            <line x1="90" y1="85" x2="210" y2="210" strokeWidth="0.3" opacity="0.5"/>
            <line x1="330" y1="65" x2="210" y2="210" strokeWidth="0.3" opacity="0.5"/>
            <line x1="370" y1="300" x2="75" y2="345" strokeWidth="0.3" opacity="0.5"/>
            {/* Node dots */}
            <circle cx="90" cy="85" r="2.2" fill="white" stroke="none"/>
            <circle cx="330" cy="65" r="2.2" fill="white" stroke="none"/>
            <circle cx="370" cy="300" r="2.2" fill="white" stroke="none"/>
            <circle cx="210" cy="210" r="2.2" fill="white" stroke="none"/>
            <circle cx="75" cy="345" r="2.2" fill="white" stroke="none"/>
            {/* Midjourney Sailboat */}
            <g transform="translate(90,85)" strokeWidth="1.3">
              <path d="M-16,9 C-9,16 9,16 16,9"/>
              <line x1="0" y1="-19" x2="0" y2="9"/>
              <path d="M-1,-17 L-16,8"/>
              <path d="M1,-11 L14,8"/>
            </g>
            {/* ChatGPT 6-ray */}
            <g transform="translate(330,65)" strokeWidth="1.2">
              <line x1="0" y1="-14" x2="0" y2="14"/>
              <line x1="-12.1" y1="-7" x2="12.1" y2="7"/>
              <line x1="-12.1" y1="7" x2="12.1" y2="-7"/>
              <circle cx="0" cy="0" r="5"/>
            </g>
            {/* Suno music note */}
            <g transform="translate(370,300)" strokeWidth="1.2">
              <line x1="0" y1="-14" x2="0" y2="7"/>
              <path d="M0,-14 L12,-20 L12,-11 L0,-5"/>
              <ellipse cx="-4" cy="8" rx="5.5" ry="3.5"/>
            </g>
            {/* Claude diamond */}
            <g transform="translate(75,345)" strokeWidth="1.2">
              <path d="M0,-13 L12,0 L0,13 L-12,0 Z"/>
              <path d="M0,-7 L6.5,0 L0,7 L-6.5,0 Z"/>
            </g>
            {/* Google G */}
            <g transform="translate(210,210)" strokeWidth="1.3">
              <path d="M5,-11 A12,12 0 1 1 12,4 L6,4"/>
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tp)"/>
    </svg>
  );
}

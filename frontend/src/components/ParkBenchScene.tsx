export default function ParkBenchScene() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* glow halo under the scene */}
      <div className="absolute inset-x-6 bottom-0 h-16 bg-primary-400/20 blur-2xl rounded-full" />

      <svg viewBox="0 0 340 220" className="w-full h-auto relative" aria-hidden>
        <defs>
          <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#66ab76" />
            <stop offset="100%" stopColor="#317245" />
          </linearGradient>
          <linearGradient id="tree" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#285c3a" />
            <stop offset="100%" stopColor="#438e57" />
          </linearGradient>
          <radialGradient id="lantern" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff3c4" />
            <stop offset="60%" stopColor="#ffd97a" />
            <stop offset="100%" stopColor="#e8a33d" />
          </radialGradient>
        </defs>

        {/* grass ground */}
        <ellipse cx="170" cy="196" rx="150" ry="22" fill="url(#grass)" />
        <ellipse cx="170" cy="198" rx="150" ry="22" fill="rgba(29,61,42,0.35)" />

        {/* little grass tufts */}
        {[40, 95, 235, 290].map((x, i) => (
          <path key={i} d={`M${x} 196 q3 -10 1 -14 q-2 6 -5 8 q4 2 4 6z`} fill="#438e57" />
        ))}

        {/* tree trunk + canopy */}
        <g className="anim-sway">
          <rect x="282" y="88" width="12" height="96" rx="5" fill="#6b4226" />
          <ellipse cx="288" cy="74" rx="46" ry="38" fill="url(#tree)" />
          <ellipse cx="270" cy="92" rx="28" ry="24" fill="#285c3a" opacity="0.9" />
          <ellipse cx="306" cy="88" rx="26" ry="22" fill="#66ab76" opacity="0.85" />
          <circle cx="268" cy="66" r="7" fill="#96c8a0" opacity="0.8" />
        </g>

        {/* bench */}
        <g className="anim-bench">
          {/* backrest */}
          <rect x="56" y="104" width="128" height="7" rx="3.5" fill="#7a4d2d" />
          <rect x="56" y="113" width="128" height="7" rx="3.5" fill="#6b4226" />
          <rect x="50" y="98" width="9" height="64" rx="4.5" fill="#4a2f1a" />
          <rect x="182" y="98" width="9" height="64" rx="4.5" fill="#4a2f1a" />
          {/* seat slats */}
          <rect x="48" y="142" width="144" height="8" rx="4" fill="#8a5a33" />
          <rect x="48" y="152" width="144" height="8" rx="4" fill="#7a4d2d" />
          <rect x="48" y="162" width="144" height="8" rx="4" fill="#6b4226" />
          {/* legs */}
          <rect x="56" y="170" width="10" height="24" rx="4" fill="#4a2f1a" />
          <rect x="174" y="170" width="10" height="24" rx="4" fill="#4a2f1a" />
          {/* armrests */}
          <rect x="42" y="128" width="10" height="34" rx="4" fill="#5d3a21" />
          <rect x="188" y="128" width="10" height="34" rx="4" fill="#5d3a21" />
          <rect x="36" y="126" width="20" height="7" rx="3.5" fill="#6b4226" />
          <rect x="184" y="126" width="20" height="7" rx="3.5" fill="#6b4226" />
        </g>

        {/* lantern */}
        <g className="anim-lantern">
          <rect x="26" y="150" width="6" height="46" rx="3" fill="#3a2414" />
          <rect x="20" y="142" width="18" height="12" rx="3" fill="#6b4226" />
          <circle cx="29" cy="134" r="9" fill="url(#lantern)" />
          <circle cx="29" cy="134" r="4" fill="#fff7dc" />
          <rect x="24" y="126" width="10" height="5" rx="2.5" fill="#3a2414" />
        </g>

        {/* small bush */}
        <g className="anim-sway" style={{ animationDelay: '-2s' }}>
          <ellipse cx="120" cy="196" rx="34" ry="18" fill="#438e57" opacity="0.9" />
          <ellipse cx="140" cy="198" rx="26" ry="14" fill="#317245" opacity="0.85" />
        </g>
      </svg>

      {/* floating leaf accents */}
      <div className="absolute top-6 right-4 w-3 h-5 rounded-[0_100%_0_100%] bg-primary-500/80 anim-float" />
      <div className="absolute top-16 right-10 w-2.5 h-4 rounded-[100%_0_100%_0] bg-primary-300/80 anim-float" style={{ animationDelay: '-2s' }} />
      <div className="absolute bottom-8 left-3 w-3 h-5 rounded-[0_100%_0_100%] bg-primary-400/80 anim-float" style={{ animationDelay: '-4s' }} />
    </div>
  );
}
/**
 * Mock satellite change-detection pair — CSS/SVG rendering, clearly labeled a
 * demo. Production serves real Sentinel-2 chips (and, on subscriber tracts,
 * commercial high-res) from the imagery pipeline.
 */
function Scrub({ seedOffset = 0 }: { seedOffset?: number }) {
  // deterministic pseudo-random scrub dots
  const dots = Array.from({ length: 90 }, (_, i) => {
    const a = Math.sin(i * 12.9898 + seedOffset) * 43758.5453;
    const b = Math.sin(i * 78.233 + seedOffset) * 12543.1231;
    const x = (a - Math.floor(a)) * 200;
    const y = (b - Math.floor(b)) * 200;
    const r = 1 + ((i * 7 + seedOffset) % 3);
    return { x, y, r };
  });
  return (
    <>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#5C6B4F" opacity="0.5" />
      ))}
    </>
  );
}

export function SatelliteTiles() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {/* before */}
        <figure>
          <svg viewBox="0 0 200 200" className="w-full rounded-sm border border-line" role="img"
            aria-label="Satellite tile, July 28 pass: undisturbed scrubland">
            <rect width="200" height="200" fill="#8A9271" />
            <rect width="200" height="200" fill="#75805C" opacity="0.5" />
            <Scrub />
            <path d="M0 148 Q60 138 118 152 T200 144" fill="none" stroke="#6E7A57" strokeWidth="5" opacity="0.7" />
            <text x="8" y="192" fontSize="11" fill="#F7F4EC" fontFamily="var(--font-mono)" opacity="0.95">JUL 28</text>
          </svg>
          <figcaption className="mt-1 text-[11px] text-ink-3">Previous pass — undisturbed</figcaption>
        </figure>
        {/* after */}
        <figure>
          <svg viewBox="0 0 200 200" className="w-full rounded-sm border border-brass" role="img"
            aria-label="Satellite tile, August 12 pass: cleared rectangular pad and new access road, flagged by change detection">
            <rect width="200" height="200" fill="#8A9271" />
            <rect width="200" height="200" fill="#75805C" opacity="0.5" />
            <Scrub seedOffset={3} />
            <path d="M0 148 Q60 138 118 152 T200 144" fill="none" stroke="#6E7A57" strokeWidth="5" opacity="0.7" />
            {/* access road */}
            <path d="M0 60 L74 84" stroke="#C9BFA0" strokeWidth="6" strokeLinecap="round" />
            {/* cleared pad */}
            <rect x="70" y="72" width="72" height="52" fill="#CFC5A5" transform="rotate(-8 106 98)" />
            <rect x="70" y="72" width="72" height="52" fill="none" stroke="#A87B2F" strokeWidth="2.5"
              strokeDasharray="6 4" transform="rotate(-8 106 98)" />
            <text x="8" y="192" fontSize="11" fill="#F7F4EC" fontFamily="var(--font-mono)" opacity="0.95">AUG 12</text>
          </svg>
          <figcaption className="mt-1 text-[11px] font-medium text-brass-deep">
            Change detected — cleared pad + access road
          </figcaption>
        </figure>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
        Sentinel-2 · 10 m/px · demo rendering. Production shows the real chips,
        with commercial high-res on subscriber tracts.
      </p>
    </div>
  );
}

/** Decorative backdrops — all inline SVG, no assets. The survey grid and
 *  contour lines come straight from the brand's native imagery: Texas plat
 *  maps and topo sheets. */

export function SurveyGrid({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id="sg-fine" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.28" />
        </pattern>
        <pattern id="sg-section" width="140" height="140" patternUnits="userSpaceOnUse">
          <path d="M140 0H0V140" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <circle cx="0" cy="0" r="1.6" fill="currentColor" opacity="0.55" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sg-fine)" />
      <rect width="100%" height="100%" fill="url(#sg-section)" />
    </svg>
  );
}

export function ContourLines({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1200 520"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[
        "M-20 90 C 220 30, 420 140, 640 96 S 1050 20, 1240 80",
        "M-20 190 C 240 130, 460 240, 680 196 S 1060 120, 1240 180",
        "M-20 300 C 200 240, 480 350, 700 300 S 1080 230, 1240 290",
        "M-20 410 C 260 350, 440 460, 660 410 S 1040 340, 1240 400",
        "M-20 500 C 240 450, 500 545, 720 500 S 1060 440, 1240 495",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={i === 2 ? 1.4 : 0.9}
          opacity={i === 2 ? 0.5 : 0.32}
        />
      ))}
    </svg>
  );
}

export function SealWatermark({ size = 380, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <text
        x="32" y="41" textAnchor="middle"
        fontFamily="Georgia, serif" fontSize="24" fontWeight="bold"
        fill="currentColor"
      >
        RO
      </text>
    </svg>
  );
}

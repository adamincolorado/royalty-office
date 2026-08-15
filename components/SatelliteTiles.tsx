"use client";

/**
 * Satellite comparison slider — drag the divider to wipe between the two
 * passes. Pointer events unify mouse and touch; `touch-action: pan-y` lets
 * vertical page scroll pass through while horizontal drags drive the wipe.
 * Keyboard: arrow keys. The tiles are CSS/SVG mock renderings, clearly
 * labeled demo; production serves real chips from the imagery pipeline.
 */
import { useCallback, useRef, useState } from "react";

function Scrub({ seedOffset = 0 }: { seedOffset?: number }) {
  const dots = Array.from({ length: 90 }, (_, i) => {
    const a = Math.sin(i * 12.9898 + seedOffset) * 43758.5453;
    const b = Math.sin(i * 78.233 + seedOffset) * 12543.1231;
    return {
      x: (a - Math.floor(a)) * 200,
      y: (b - Math.floor(b)) * 200,
      r: 1 + ((i * 7 + seedOffset) % 3),
    };
  });
  return (
    <>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#5C6B4F" opacity="0.5" />
      ))}
    </>
  );
}

function Tile({ after = false }: { after?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="block h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="200" height="200" fill="#8A9271" />
      <rect width="200" height="200" fill="#75805C" opacity="0.5" />
      <Scrub seedOffset={after ? 3 : 0} />
      <path d="M0 148 Q60 138 118 152 T200 144" fill="none" stroke="#6E7A57" strokeWidth="5" opacity="0.7" />
      {after && (
        <>
          <path d="M0 60 L74 84" stroke="#C9BFA0" strokeWidth="6" strokeLinecap="round" />
          <rect x="70" y="72" width="72" height="52" fill="#CFC5A5" transform="rotate(-8 106 98)" />
          <rect x="70" y="72" width="72" height="52" fill="none" stroke="#A87B2F" strokeWidth="2.5"
            strokeDasharray="6 4" transform="rotate(-8 106 98)" />
        </>
      )}
    </svg>
  );
}

export function SatelliteTiles() {
  const [pct, setPct] = useState(46);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const moveTo = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <div>
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label="Compare satellite passes: July 28 versus August 12"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className="relative aspect-square w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[4px] border border-line focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        onPointerDown={(e) => {
          try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          } catch {
            /* synthetic or already-released pointer — capture is best-effort */
          }
          setActive(true);
          moveTo(e.clientX);
        }}
        onPointerMove={(e) => {
          if (active) moveTo(e.clientX);
        }}
        onPointerUp={() => setActive(false)}
        onPointerCancel={() => setActive(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") { setPct((p) => Math.max(4, p - 4)); e.preventDefault(); }
          if (e.key === "ArrowRight") { setPct((p) => Math.min(96, p + 4)); e.preventDefault(); }
        }}
      >
        {/* before layer */}
        <div className="absolute inset-0"><Tile /></div>
        {/* after layer, revealed right of the divider */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pct}%)` }}>
          <Tile after />
        </div>

        {/* corner labels */}
        <span className="figures pointer-events-none absolute bottom-2 left-2 rounded-sm bg-pine-deep/70 px-1.5 py-0.5 text-[10.5px] font-semibold text-paper">
          JUL 28
        </span>
        <span className="figures pointer-events-none absolute bottom-2 right-2 rounded-sm bg-brass px-1.5 py-0.5 text-[10.5px] font-bold text-pine-deep">
          AUG 12
        </span>

        {/* divider + grip */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pct}%` }}>
          <div className="absolute inset-y-0 -ml-px w-0.5 bg-paper shadow-[0_0_6px_rgba(8,26,21,0.6)]" />
          <div
            className={`absolute top-1/2 -ml-[17px] -mt-[17px] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line bg-paper-card shadow-card transition-transform ${active ? "scale-110" : ""}`}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
              <path d="M5 1 1 6l4 5M11 1l4 5-4 5" fill="none" stroke="#14342B" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
        <strong className="text-brass-deep">Drag to compare.</strong>{" "}
        Change flagged Aug 12 — cleared pad + access road. Sentinel-2 ·
        10 m/px · demo rendering; production shows real chips, with commercial
        high-res on subscriber tracts.
      </p>
    </div>
  );
}

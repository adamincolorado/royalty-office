/**
 * Tiny trend line for table rows — server-rendered SVG with a CSS draw-in
 * animation (pathLength trick; disabled under prefers-reduced-motion).
 */
export function Sparkline({
  vals,
  width = 96,
  height = 26,
}: {
  vals: number[];
  width?: number;
  height?: number;
}) {
  if (vals.length < 2) return null;
  const peak = Math.max(...vals, 1);
  const px = (i: number) => 2 + (i / (vals.length - 1)) * (width - 8);
  const py = (v: number) => 2 + (height - 6) * (1 - v / peak);
  const d = vals.map((v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  const last = vals[vals.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="spark"
      aria-hidden="true"
    >
      <path d={d} pathLength={1} fill="none" stroke="#14342B" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <circle cx={px(vals.length - 1)} cy={py(last)} r="2.4" fill="#A87B2F" />
    </svg>
  );
}

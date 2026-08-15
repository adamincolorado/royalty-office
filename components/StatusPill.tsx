export function StatusPill({ status }: { status: string }) {
  const style =
    status === "producing"
      ? "bg-pine-soft text-pine"
      : status === "shut-in"
        ? "bg-brass-soft text-brass-deep"
        : "bg-line-soft text-ink-3";
  return (
    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${style}`}>
      {status}
    </span>
  );
}

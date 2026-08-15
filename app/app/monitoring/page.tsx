import Link from "next/link";
import { SatelliteTiles } from "@/components/SatelliteTiles";
import { getEvents, getUpcoming, getOperator, ownerPositions } from "@/lib/data";
import { getPlan } from "@/lib/plan";
import { monthLabel, cn } from "@/lib/format";

export const metadata = { title: "Monitoring" };

const KIND_LABEL: Record<string, string> = {
  permit_filed: "Permit",
  permit_amended: "Permit",
  pad_detected: "Satellite",
  frac_expected: "Frac",
  frac_disclosed: "Frac",
  completed: "Completion",
  completion_expected: "Completion",
  first_production: "Production",
  first_check: "First check",
  shut_in: "Shut-in",
  plugged: "Plugged",
};

const CONFIDENCE_LABEL: Record<string, string> = {
  unit: "on your unit",
  abstract: "your abstract",
  proximity: "near your wells",
};

export default function MonitoringPage() {
  const plan = getPlan();
  if (plan !== "sentinel") return <UpgradeGate />;

  const events = getEvents();
  const up = getUpcoming();
  const op = getOperator(up.operatorSlug);
  const locations = ownerPositions().length;
  const done = up.timeline.filter((s) => !s.projected).length;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Monitoring
        </h1>
        <p className="text-[13px] text-ink-3">
          Sentinel plan · watching {locations} claimed locations
        </p>
      </div>

      {/* ---- lifecycle spotlight ---- */}
      <div className="card relative mt-5 overflow-hidden border-brass/60 p-4 ring-1 ring-brass/30 sm:mt-6 sm:p-6">
        <div className="hairline-brass absolute inset-x-0 top-0" aria-hidden="true" />
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="eyebrow">New well on your unit</p>
            <h2 className="mt-1 font-display text-xl font-semibold sm:text-2xl">{up.name}</h2>
            <p className="mt-1 text-[13.5px] text-ink-2">
              {op?.name} · {up.county} County · {up.formation} ·{" "}
              {up.plannedLateralFt.toLocaleString()} ft planned lateral
            </p>
          </div>
          <div className="rounded-sm bg-pine px-4 py-2.5 text-paper">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-paper/70">
              Your first check due
            </p>
            <p className="figures text-xl font-semibold">{monthLabel(up.expectedFirstCheckBy)}</p>
          </div>
        </div>

        {/* stepper */}
        <ol className="mt-6 grid gap-0 sm:grid-cols-6">
          {up.timeline.map((s, i) => (
            <li key={s.kind} className="relative flex gap-3 pb-5 sm:block sm:pb-0 sm:pr-2">
              {/* connector */}
              {i < up.timeline.length - 1 && (
                <span
                  className={cn(
                    "absolute left-[7px] top-5 h-full w-0.5 sm:left-auto sm:top-[7px] sm:h-0.5 sm:w-full",
                    i < done - 1 ? "bg-pine" : "bg-line",
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "relative z-10 mt-0.5 block h-4 w-4 shrink-0 rounded-full border-2 sm:mt-0",
                  s.projected
                    ? "border-brass bg-paper"
                    : "border-pine bg-pine",
                )}
                aria-hidden="true"
              />
              <div className="sm:mt-2.5">
                <p className={cn("text-[13px] font-semibold leading-tight", s.projected ? "text-brass-deep" : "text-ink")}>
                  {s.title}
                </p>
                <p className="figures mt-0.5 text-[11.5px] text-ink-3">
                  {s.date.length === 7 ? monthLabel(s.date) : s.date}
                  {s.projected && " · projected"}
                </p>
                <p className="text-[10.5px] text-ink-3">{s.source}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-5 rounded-sm bg-brass-soft px-4 py-3 text-[13px] leading-relaxed text-ink-2">
          <strong className="text-brass-deep">Why we can promise a date:</strong>{" "}
          {up.firstCheckRule} If it hasn&rsquo;t arrived by then, we&rsquo;ll give you
          the operator&rsquo;s owner-relations contact and exactly what to ask for.
        </p>
      </div>

      <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[1fr_0.9fr]">
        {/* ---- event feed ---- */}
        <div className="card p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold sm:text-xl">Detected events</h2>
          <ul className="mt-3 divide-y divide-line-soft">
            {events.map((e) => (
              <li key={e.id} className="py-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn(
                    "rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide",
                    e.kind === "shut_in" ? "bg-brass-soft text-brass-deep" : "bg-pine-soft text-pine",
                  )}>
                    {KIND_LABEL[e.kind] ?? e.kind}
                  </span>
                  <span className="text-[11px] font-medium text-ink-3">
                    {e.date} · {e.source} · {CONFIDENCE_LABEL[e.confidence]}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-semibold leading-snug">
                  {e.wellName} — {e.title}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{e.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            Detection cadence: permits daily · satellite each Sentinel-2 pass
            (~5 days) · frac disclosures ~30 days · completions weekly ·
            production monthly. Tier-1 events (on your unit) notify immediately;
            the rest arrive in your weekly digest.
          </p>
        </div>

        {/* ---- satellite panel ---- */}
        <div className="card p-4 sm:p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-semibold sm:text-xl">From orbit</h2>
            <p className="text-[11.5px] text-ink-3">next pass ~Aug 17</p>
          </div>
          <p className="mt-1.5 text-[13px] text-ink-2">
            RANCHERO STATE UNIT — change flagged on the Aug 12 pass.
          </p>
          <div className="mt-3">
            <SatelliteTiles />
          </div>
          <div className="mt-4 rounded-sm border border-line-soft bg-paper px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">
              What your subscription funds
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
              Imagery is processed only for locations tied to active Sentinel
              subscriptions — yours among them — plus ten public showcase
              sites. No subscriber, no processing: that&rsquo;s what keeps this
              tier&rsquo;s cost honest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpgradeGate() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        Monitoring
      </h1>
      <div className="card mt-5 border-brass/60 p-6 ring-1 ring-brass/30 sm:p-8">
        <p className="eyebrow">Sentinel plan</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Know before the mail does
        </h2>
        <p className="mt-3 leading-relaxed text-ink-2">
          The Owner plan shows you what your wells are paying. Sentinel watches
          what happens <em>next</em> — and tells you the moment it does:
        </p>
        <ul className="mt-4 space-y-2.5">
          {[
            "New permits filed on or near your acreage — detected daily",
            "Every status change: permit → pad → frac → completion → first production",
            "Satellite change detection over your locations, every ~5 days",
            "Shut-in watch with the dollars you're not receiving",
            "First-check countdown with the statutory due date — and what to do if it's missed",
          ].map((f) => (
            <li key={f} className="flex gap-2.5 text-[14.5px] leading-snug">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brass" aria-hidden="true" />
              <span className="text-ink-2">{f}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a href="/api/demo-plan?plan=sentinel&to=/app/monitoring" className="btn-primary">
            Upgrade to Sentinel — $29/mo
          </a>
          <p className="text-[12.5px] text-ink-3">
            Demo: this switches the tour plan instantly.
          </p>
        </div>
        <p className="mt-5 border-t border-line-soft pt-4 text-[12.5px] leading-relaxed text-ink-3">
          Sentinel pricing funds the imagery pipeline itself — processing is
          run only for subscriber locations, so the people watching are the
          people paying.
        </p>
      </div>
    </div>
  );
}

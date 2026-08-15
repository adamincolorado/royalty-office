import { cookies } from "next/headers";

/**
 * Subscription tiers.
 *
 *   owner    — $9/mo:  the cashflow product (history, forecasts, well detail,
 *              statement X-ray, annual report).
 *   sentinel — $29/mo: everything in Owner plus MONITORING — new permits on or
 *              near your acreage, status transitions (permit → pad → frac →
 *              completion → first production), shut-in watch, satellite change
 *              detection on your locations, first-check countdown.
 *
 * Sentinel pricing funds the imagery pipeline: processing/storage for open
 * Sentinel-2 change detection plus selective commercial high-res tasking —
 * acquired ONLY for locations tied to active Sentinel subscriptions and the
 * ten public showcase sites.
 *
 * In the demo the plan is a cookie so the upgrade gate can be toured; in
 * production it comes from Stripe subscription state.
 */
export type Plan = "owner" | "sentinel";

export const PLAN_LABELS: Record<Plan, string> = {
  owner: "Owner — $9/mo",
  sentinel: "Sentinel — $29/mo",
};

export function getPlan(): Plan {
  const v = cookies().get("ro_demo_plan")?.value;
  return v === "owner" ? "owner" : "sentinel";
}

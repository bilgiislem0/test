/** Turkish-style numbers without relying on ICU (SSR and browser stay identical). */
export function formatNum(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return digits > 0 ? `0,${"0".repeat(digits)}` : "0";
  const sign = n < 0 ? "-" : "";
  const fixed = Math.abs(n).toFixed(digits);
  const [whole, frac] = fixed.split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return digits > 0 ? `${sign}${grouped},${frac}` : `${sign}${grouped}`;
}

export function formatTL(n: number, digits = 2): string {
  return `${formatNum(n, digits)} TL`;
}

export function formatTLInt(n: number): string {
  return `${formatNum(Math.round(n), 0)} TL`;
}

/** Whole lira, rounding up, stable on floating-point noise. */
export function ceilTL(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.ceil(n - 1e-6);
}

export function formatMult(n: number): string {
  if (!Number.isFinite(n)) return "x0";
  const r = Math.round(n * 100) / 100;
  const digits = Number.isInteger(r) ? 0 : Math.abs(r * 10 - Math.round(r * 10)) < 1e-6 ? 1 : 2;
  return `x${formatNum(r, digits)}`;
}

export function formatDuration(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "0 dk";
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m} dk`;
  if (m === 0) return `${h} sa`;
  return `${h} sa ${m} dk`;
}

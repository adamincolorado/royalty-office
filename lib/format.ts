export function money(x: number, dec = 0): string {
  return x.toLocaleString("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: dec, maximumFractionDigits: dec,
  });
}

export function num(x: number, dec = 0): string {
  return x.toLocaleString("en-US", {
    minimumFractionDigits: dec, maximumFractionDigits: dec,
  });
}

export function decimal8(x: number): string {
  return x.toFixed(8);
}

export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[m - 1]} ${y}`;
}

export function monthShort(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const names = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return m === 1 ? `'${String(y).slice(2)}` : names[m - 1];
}

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export function formatSalary(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")} jt`;
  return n.toLocaleString("id-ID");
}

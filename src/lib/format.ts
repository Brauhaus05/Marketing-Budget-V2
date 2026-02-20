/**
 * Format a number as North American currency (USD).
 * Uses commas for thousands and periods for decimals.
 * Example: formatCurrency(1000) => "$1,000.00"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

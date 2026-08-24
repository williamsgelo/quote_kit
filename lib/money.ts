const DEFAULT_SCALE = 2;

export const MAX_MONEY_VALUE = "99999999999999999.99";

export function normalizeDecimalString(value: string, scale = DEFAULT_SCALE) {
  const [whole, fraction = ""] = value.split(".");
  return `${whole}.${fraction.padEnd(scale, "0")}`;
}

export function isDecimalAtMost(
  value: string,
  maximum: string,
  scale = DEFAULT_SCALE,
) {
  return (
    decimalToScaledBigInt(value, scale) <=
    decimalToScaledBigInt(maximum, scale)
  );
}

export function decimalToScaledBigInt(
  value: string,
  scale = DEFAULT_SCALE,
) {
  return BigInt(normalizeDecimalString(value, scale).replace(".", ""));
}

export function isDecimalGreaterThanZero(
  value: string,
  scale = DEFAULT_SCALE,
) {
  return decimalToScaledBigInt(value, scale) > BigInt(0);
}

export function formatCurrency(
  value: string | number,
  options: { minimumFractionDigits?: number } = {},
) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatDecimalPercentage(value: string) {
  const [whole, fraction = ""] = value.split(".");
  const trimmedFraction = fraction.replace(/0+$/, "");
  return `${trimmedFraction ? `${whole}.${trimmedFraction}` : whole}%`;
}

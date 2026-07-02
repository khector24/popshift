export function formatPercentDifference(
  value,
  nationalValue,
  label = "U.S. metro avg",
) {
  const differencePercent = ((value - nationalValue) / nationalValue) * 100;
  const roundedDifference = Math.abs(differencePercent).toFixed(0);

  return differencePercent >= 0
    ? `${roundedDifference}% above ${label}`
    : `${roundedDifference}% below ${label}`;
}

export function formatPointDifference(
  value,
  nationalValue,
  label = "U.S. metro avg",
) {
  const difference = value - nationalValue;
  const roundedDifference = Math.abs(difference).toFixed(1);

  return difference >= 0
    ? `${roundedDifference} pp above ${label}`
    : `${roundedDifference} pp below ${label}`;
}

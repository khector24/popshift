export function formatPopulation(value) {
  if (value === undefined || value === null) {
    return "Loading...";
  }

  return `${(value / 1000000).toFixed(1)}M`;
}

export function formatPopulationChange(value) {
  if (value === undefined || value === null) return "";

  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const abbreviatedValue = Math.abs(value) / 1000000;

  return `${sign}${abbreviatedValue.toFixed(2)}M`;
}

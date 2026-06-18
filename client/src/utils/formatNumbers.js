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

export function formatChartPopulation(value) {
  if (value === undefined || value === null) return "";

  if (value >= 100000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 10000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(3)}M`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`;
  }

  return value.toLocaleString();
}

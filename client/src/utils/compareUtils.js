import { formatGrowth } from "./growthUtils.js";

export const compareMetrics = [
  { label: "Population", key: "population" },
  { label: "Growth", key: "growth" },
  { label: "Share", key: "share" },
  { label: "Region", key: "region" },
];

export function formatCompareMetric(state, metricKey) {
  if (!state) return "N/A";

  switch (metricKey) {
    case "population":
      return state.population.toLocaleString();

    case "growth":
      return formatGrowth(state.growth).growthValue;

    case "share":
      return `${state.share}%`;

    case "region":
      return state.region;

    default:
      return "N/A";
  }
}

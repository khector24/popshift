import { formatGrowth } from "./growthUtils.js";

export const compareMetrics = [
  { label: "Population", key: "population" },
  { label: "Growth", key: "growth" },
  { label: "Share", key: "share" },
  { label: "Region", key: "region" },
  { label: "Median Household Income", key: "medianIncome" },
  { label: "Median Gross Rent", key: "medianRent" },
  { label: "Median Home Value", key: "medianHomeValue" },
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

    case "medianIncome":
      return state.economics
        ? `$${state.economics.medianIncome.toLocaleString()}`
        : "N/A";

    case "medianRent":
      return state.economics
        ? `$${state.economics.medianRent.toLocaleString()} / mo`
        : "N/A";

    case "medianHomeValue":
      return state.economics
        ? `$${state.economics.medianHomeValue.toLocaleString()}`
        : "N/A";

    default:
      return "N/A";
  }
}

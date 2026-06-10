export function formatGrowth(growth) {
  let growthValue = "N/A";
  let growthClassName = "";
  let growthSentence = "population change data was not available";

  if (growth > 0) {
    growthValue = `↑ ${growth}%`;
    growthClassName = "growth-positive";
    growthSentence = `up ${growth}%`;
  } else if (growth < 0) {
    growthValue = `↓ ${Math.abs(growth)}%`;
    growthClassName = "growth-negative";
    growthSentence = `down ${Math.abs(growth)}%`;
  } else if (growth === 0) {
    growthValue = "→ 0%";
    growthClassName = "";
    growthSentence = "unchanged";
  }

  return {
    growthValue,
    growthClassName,
    growthSentence,
  };
}

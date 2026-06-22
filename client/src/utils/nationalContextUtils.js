export function formatNationalContext(multiplier, type = "cost") {
  const percent = Math.round((multiplier - 1) * 100);

  if (percent === 0) {
    return {
      text: "At national median",
      symbol: "→",
      tone: "neutral",
    };
  }

  const isAbove = percent > 0;

  const isPositive = type === "income" ? isAbove : !isAbove;

  return {
    text: `${Math.abs(percent)}% ${isAbove ? "above" : "below"} national median`,
    symbol: isAbove ? "▲" : "▼",
    tone: isPositive ? "positive" : "negative",
  };
}

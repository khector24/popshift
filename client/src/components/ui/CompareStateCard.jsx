import { formatGrowth } from "../../utils/growthUtils.js";
import "../../styles/components/CompareStateCard.css";

export default function CompareStateCard({ state }) {
  const { growthValue, growthClassName } = formatGrowth(state?.growth);

  return (
    <div className="compare__card">
      <h2>{state?.name || "Select a state"}</h2>

      <div className="compare__row">
        <span>Population</span>
        <span>{state?.population?.toLocaleString() || "N/A"}</span>
      </div>

      <div className="compare__row">
        <span>Growth</span>
        <span className={growthClassName}>{growthValue}</span>
      </div>

      <div className="compare__row">
        <span>Share</span>
        <span>{state?.share !== undefined ? `${state.share}%` : "N/A"}</span>
      </div>

      <div className="compare__row">
        <span>Region</span>
        <span>{state?.region || "N/A"}</span>
      </div>
    </div>
  );
}

import "../../styles/components/MoverSection.css";
import { formatPopulationChange } from "../../utils/formatNumbers.js";

function MoverSection({ title, states, type }) {
  const isNegative = type === "negative";

  return (
    <div className="dashboard__movers-section">
      <div className="dashboard__movers-section-header">
        <h3>{title}</h3>

        <div className="dashboard__movers-column-labels">
          <span>% Change</span>
          <span>Pop. Change</span>
        </div>
      </div>

      {states.map((state, index) => (
        <div
          className={`dashboard__mover-row ${
            isNegative ? "dashboard__mover-row--negative" : ""
          }`}
          key={state.code}
        >
          <span className="dashboard__mover-name">
            <span className="dashboard__mover-rank">{index + 1}</span>
            <span>{state.name}</span>
          </span>
          <span>{isNegative ? state.growth : `+${state.growth}`}%</span>
          <span>{formatPopulationChange(state.populationChange)}</span>
        </div>
      ))}
    </div>
  );
}

export default MoverSection;

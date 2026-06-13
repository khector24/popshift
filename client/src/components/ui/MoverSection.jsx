import "../../styles/components/MoverSection.css";
function MoverSection({ title, states, type }) {
  const isNegative = type === "negative";

  function formatPopulationChange(value) {
    const sign = value > 0 ? "+" : "-";
    const abbreviatedValue = Math.abs(value) / 1000000;

    return `${sign}${abbreviatedValue.toFixed(2)}M`;
  }

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

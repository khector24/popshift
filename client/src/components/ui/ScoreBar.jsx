import "../../styles/components/ScoreBar.css";

const MAX_SCORE = 500;

export default function ScoreBar({
  icon,
  title,
  stateName,
  stateScore,
  stateRank,
  nationalScore,
  topStateName,
  topStateScore,
}) {
  const rows = [
    {
      label: stateName,
      score: stateScore,
      rank: `#${stateRank}`,
      type: "state",
    },
    {
      label: "U.S. Average",
      score: nationalScore,
      rank: "--",
      type: "national",
    },
    {
      label: `Top State (${topStateName})`,
      score: topStateScore,
      rank: "#1",
      type: "top",
    },
  ];

  return (
    <div className="score-bar">
      <div className="score-bar__header">
        <div className="score-bar__title">
          <span className="score-bar__icon">{icon}</span>
          <h4>{title}</h4>
        </div>

        <p>Average Score (out of 500)</p>
      </div>

      <div className="score-bar__rows">
        {rows.map((row) => {
          const width = `${(row.score / MAX_SCORE) * 100}%`;

          return (
            <div className="score-bar__row" key={row.label}>
              <span className="score-bar__label">{row.label}</span>

              <div className="score-bar__track">
                <div
                  className={`score-bar__fill score-bar__fill--${row.type}`}
                  style={{ width }}
                />
              </div>

              <strong className="score-bar__score">{row.score}</strong>
              <span className="score-bar__rank">{row.rank}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

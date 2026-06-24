import "../../styles/components/MigrationFlowCard.css";

export default function MigrationFlowCard({
  label,
  subLabel,
  migrationType,
  flows,
  totalMovers,
}) {
  return (
    <div
      className={`migration-flow-card migration-flow-card--${migrationType}`}
    >
      <h3>{label}</h3>
      {subLabel && <p>{subLabel}</p>}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>State</th>
            <th>Movers</th>
          </tr>
        </thead>

        <tbody>
          {flows.map((flow, index) => (
            <tr key={flow.code}>
              <td>{index + 1}</td>
              <td>{flow.state}</td>
              <td>{flow.movers.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {migrationType && (
        <p className="migration-flow-card__total">
          Total {migrationType} movers: {totalMovers.toLocaleString()}
        </p>
      )}
    </div>
  );
}

import "../../styles/components/MigrationFlowCard.css";

export default function MigrationFlowCard({
  label,
  subLabel,
  migrationType,
  flows = [],
  totalMovers = 0,
  nameHeader = "State",
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
            <th>{nameHeader}</th>
            <th>Movers</th>
          </tr>
        </thead>

        <tbody>
          {flows.map((flow, index) => (
            <tr key={flow.slug || flow.code || flow.name || index}>
              <td>{index + 1}</td>
              <td>
                {flow.shortName || flow.displayName || flow.name || flow.state}
              </td>
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

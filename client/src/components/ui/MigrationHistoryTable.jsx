import "../../styles/components/MigrationHistoryTable.css";

function formatNumber(value) {
  return value.toLocaleString();
}

function formatNet(value) {
  return `${value > 0 ? "+" : ""}${value.toLocaleString()}`;
}

export default function MigrationHistoryTable({ data }) {
  const rows = [...data].sort((a, b) => b.year - a.year);

  return (
    <div className="migration-history-table">
      <div className="migration-history-table__row migration-history-table__header">
        <span>Year</span>
        <span>Inbound</span>
        <span>Outbound</span>
        <span>Net</span>
      </div>

      {rows.map((item) => (
        <div className="migration-history-table__row" key={item.year}>
          <span className="migration-history-table__year">{item.year}</span>

          <span className="migration-history-table__value">
            {formatNumber(item.totalInbound)}
          </span>

          <span className="migration-history-table__value">
            {formatNumber(item.totalOutbound)}
          </span>

          <span
            className={
              item.netMigration > 0
                ? "migration-history-table__net migration-history-table__net--positive"
                : item.netMigration < 0
                  ? "migration-history-table__net migration-history-table__net--negative"
                  : "migration-history-table__net"
            }
          >
            {formatNet(item.netMigration)}
          </span>
        </div>
      ))}
    </div>
  );
}

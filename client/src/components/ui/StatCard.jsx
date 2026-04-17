import "../../styles/components/StatCard.css";

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p className="stat-card__label">{label}</p>
      <h3 className="stat-card__value">{value}</h3>
    </div>
  );
}

export default StatCard;

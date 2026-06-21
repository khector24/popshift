import "../../styles/components/EconomicStatCard.css";

export default function EconomicStatCard({ label, value, icon, variant }) {
  return (
    <div className={`economic-stat-card economic-stat-card--${variant}`}>
      <div className="economic-stat-card__icon">{icon}</div>

      <div className="economic-stat-card__content">
        <p className="economic-stat-card__label">{label}</p>
        <p className="economic-stat-card__value">{value}</p>
      </div>
    </div>
  );
}

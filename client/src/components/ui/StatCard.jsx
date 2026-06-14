import "../../styles/components/StatCard.css";

function StatCard({ label, value, subtitle, variant, icon }) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__icon">{icon}</div>

      <div className="stat-card__content">
        <p className="stat-card__label">{label}</p>
        <h3 className="stat-card__value">{value}</h3>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;

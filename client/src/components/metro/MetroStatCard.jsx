import "../../styles/components/metro/MetroStatCard.css";
export default function MetroStatCard({
  icon,
  title,
  value,
  subtitle,
  iconClass,
}) {
  return (
    <div className="metro-stat-card">
      <div className={`metro-stat-card__icon ${iconClass}`}>{icon}</div>

      <div className="metro-stat-card__content">
        <p className="metro-stat-card__title">{title}</p>

        <p className="metro-stat-card__value">{value}</p>

        <p className="metro-stat-card__subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

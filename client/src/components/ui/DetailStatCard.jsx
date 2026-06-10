import "../../styles/components/DetailStatCard.css";

export default function DetailStatCard({ label, value, valueClassName = "" }) {
  return (
    <div className="detail-stat-card">
      <p className="detail-stat-card_label">{label}</p>
      <p className={`detail-stat-card_value ${valueClassName}`}>{value}</p>
    </div>
  );
}

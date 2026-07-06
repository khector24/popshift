import "../../styles/components/metro/MetroEducationMiniCard.css";
import ContextIndicator from "../ui/ContextIndicator";

export default function MetroEducationMiniCard({
  icon,
  value,
  label,
  context,
}) {
  return (
    <div className="metro-education-mini-card">
      <div className="metro-education-mini-card__icon">{icon}</div>

      <div>
        <p>{label}</p>
        <strong>{value}%</strong>

        <ContextIndicator
          direction={context.direction}
          tone={context.tone}
          value={context.value}
          text={context.text}
        />
      </div>
    </div>
  );
}

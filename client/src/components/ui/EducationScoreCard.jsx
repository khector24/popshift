import "../../styles/components/EducationScoreCard.css";
import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";

function getComparison(value, nationalValue, unit) {
  const differenceFromNational = Number((value - nationalValue).toFixed(1));

  if (differenceFromNational === 0) {
    return {
      tone: "neutral",
      icon: null,
      text: `Matches U.S. average (${nationalValue}${unit})`,
    };
  }

  if (differenceFromNational > 0) {
    return {
      tone: "positive",
      icon: <FaRegArrowAltCircleUp />,
      text: `+${differenceFromNational}${unit} above U.S. avg (${nationalValue}${unit})`,
    };
  }

  return {
    tone: "negative",
    icon: <FaRegArrowAltCircleDown />,
    text: `${differenceFromNational}${unit} below U.S. avg (${nationalValue}${unit})`,
  };
}

export default function EducationScoreCard({
  icon,
  title,
  subtitle,
  value,
  displayValue,
  nationalValue,
  unit = "",
  badge,
}) {
  const comparison = getComparison(value, nationalValue, unit);

  return (
    <article className="education-score-card">
      <div className="education-score-card__header">
        <div className="education-score-card__icon">{icon}</div>

        <div>
          <h3>{title}</h3>
          <p className="education-score-card__subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="education-score-card__divider" />

      <div className="education-score-card__value-row">
        <p className="education-score-card__value">{displayValue}</p>
        <span className="education-score-card__badge">{badge}</span>
      </div>

      <div className="education-score-card__divider" />

      <p
        className={`education-score-card__comparison education-score-card__comparison--${comparison.tone}`}
      >
        {comparison.icon && (
          <span className="education-score-card__comparison-icon">
            {comparison.icon}
          </span>
        )}
        {comparison.text}
      </p>
    </article>
  );
}

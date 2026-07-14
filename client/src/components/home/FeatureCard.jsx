import { Link } from "react-router-dom";
import "../../styles/components/home/FeatureCard.css";

export default function FeatureCard({
  title,
  description,
  icon,
  buttonText,
  to,
  color = "blue",
  disabled = false,
}) {
  const cardClassName = [
    "feature-card",
    `feature-card--${color}`,
    disabled ? "feature-card--disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cardContent = (
    <>
      <div className="feature-card__icon">{icon}</div>

      <div className="feature-card__content">
        <h3 className="feature-card__title">{title}</h3>

        <p className="feature-card__description">{description}</p>

        <span className="feature-card__button">
          {buttonText}
          {!disabled && " →"}
        </span>
      </div>
    </>
  );

  if (disabled) {
    return <article className={cardClassName}>{cardContent}</article>;
  }

  return (
    <Link to={to} className={cardClassName}>
      {cardContent}
    </Link>
  );
}

import { Link } from "react-router-dom";

export default function FeatureCard({
  title,
  description,
  icon,
  buttonText,
  to,
  disabled = false,
}) {
  if (disabled) {
    return (
      <article className="feature-card feature-card--disabled">
        <div className="feature-card__icon">{icon}</div>

        <h3 className="feature-card__title">{title}</h3>

        <p className="feature-card__description">{description}</p>

        <span className="feature-card__button">{buttonText}</span>
      </article>
    );
  }

  return (
    <Link to={to} className="feature-card">
      <div className="feature-card__icon">{icon}</div>

      <h3 className="feature-card__title">{title}</h3>

      <p className="feature-card__description">{description}</p>

      <span className="feature-card__button">{buttonText} →</span>
    </Link>
  );
}

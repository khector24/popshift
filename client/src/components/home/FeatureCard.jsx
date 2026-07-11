import { Link } from "react-router-dom";

export default function FeatureCard({
  title,
  description,
  icon,
  buttonText,
  to,
  disabled = false,
}) {
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
    return (
      <article className="feature-card feature-card--disabled">
        {cardContent}
      </article>
    );
  }

  return (
    <Link to={to} className="feature-card">
      {cardContent}
    </Link>
  );
}

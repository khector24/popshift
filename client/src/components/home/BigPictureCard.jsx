import "../../styles/components/home/BigPictureCard.css";

export default function BigPictureCard({
  icon,
  title,
  value,
  subtitle,
  context,
}) {
  return (
    <article className="big-picture-card">
      <div className="big-picture-card__icon">{icon}</div>

      <div className="big-picture-card__content">
        <div className="big-picture-card__title">{title}</div>

        <div className="big-picture-card__value">{value}</div>

        {context && (
          <div className="big-picture-card__context">
            {context.icon}
            <span>{context.text}</span>
          </div>
        )}

        {subtitle && (
          <div className="big-picture-card__subtitle">{subtitle}</div>
        )}
      </div>
    </article>
  );
}

import "../../styles/components/home/BigPictureCard.css";

export default function BigPictureCard({ icon, title, value, subtitle }) {
  return (
    <article className="big-picture-card">
      <div className="big-picture-card__icon">{icon}</div>

      <div className="big-picture-card__content">
        <div className="big-picture-card__title">{title}</div>

        <div className="big-picture-card__value">{value}</div>

        {subtitle && (
          <div className="big-picture-card__subtitle">{subtitle}</div>
        )}
      </div>
    </article>
  );
}

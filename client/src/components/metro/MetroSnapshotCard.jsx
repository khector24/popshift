import ContextIndicator from "../ui/ContextIndicator.jsx";
import "../../styles/components/metro/MetroSnapshotCard.css";

export default function MetroSnapshotCard({ title, subtitle, items }) {
  return (
    <article className="metro-snapshot-card">
      <div className="metro-snapshot-card__header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="metro-snapshot-card__items">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div className="metro-snapshot-card__item" key={item.label}>
              <div className={`metro-snapshot-card__icon ${item.iconClass}`}>
                <Icon />
              </div>

              <div className="metro-snapshot-card__content">
                <div className="metro-snapshot-card__topline">
                  <span className="metro-snapshot-card__label">
                    {item.label}
                  </span>

                  <strong className="metro-snapshot-card__value">
                    {item.value}
                  </strong>
                </div>

                {item.context && (
                  <ContextIndicator
                    tone={item.context.tone}
                    direction={item.context.direction}
                    value={item.context.value}
                    text={item.context.text}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

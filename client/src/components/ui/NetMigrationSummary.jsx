import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";

import "../../styles/components/NetMigrationSummary.css";

export default function NetMigrationSummary({ geographyName, netMigration }) {
  const tone =
    netMigration > 0 ? "positive" : netMigration < 0 ? "negative" : "neutral";

  const label =
    netMigration > 0 ? "Positive" : netMigration < 0 ? "Negative" : "Neutral";

  const amount = Math.abs(netMigration).toLocaleString();

  return (
    <div className="net-migration-summary">
      <span
        className={`net-migration-summary__icon net-migration-summary__icon--${tone}`}
      >
        {tone === "positive" ? (
          <FaRegArrowAltCircleUp />
        ) : (
          <FaRegArrowAltCircleDown />
        )}
      </span>

      <span className="net-migration-summary__label">Net migration:</span>

      <span
        className={`net-migration-summary__badge net-migration-summary__badge--${tone}`}
      >
        {label}
      </span>

      <span className="net-migration-summary__divider"></span>

      <span>
        {netMigration > 0 && (
          <>
            {geographyName} gained{" "}
            <span
              className={`net-migration-summary__number net-migration-summary__number--${tone}`}
            >
              {amount}
            </span>{" "}
            more people than it lost to other states.
          </>
        )}

        {netMigration < 0 && (
          <>
            {geographyName} lost{" "}
            <span
              className={`net-migration-summary__number net-migration-summary__number--${tone}`}
            >
              {amount}
            </span>{" "}
            more people than it gained from other states.
          </>
        )}

        {netMigration === 0 && (
          <>{geographyName} had no net migration change with other states.</>
        )}
      </span>
    </div>
  );
}

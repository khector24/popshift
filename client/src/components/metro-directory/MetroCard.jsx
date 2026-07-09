import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import "../../styles/components/metro-directory/MetroCard.css";

export default function MetroCard({ metro }) {
  const growthPercent = metro.growthSince2020?.percent ?? 0;
  const isGrowing = growthPercent > 0;
  const isDeclining = growthPercent < 0;

  const stateLabels = metro.states
    .map((state) => state.abbreviation)
    .join(", ");

  return (
    <article className="metro-card">
      <div className="metro-card__image-wrap">
        <img
          className="metro-card__image"
          src={metro.imageData?.name}
          alt={metro.name}
        />

        <span className="metro-card__rank">{metro.rank}</span>
      </div>

      <div className="metro-card__body">
        <h3>{metro.name}</h3>

        <div className="metro-card__stats">
          <div>
            <span>Population</span>
            <strong>{metro.population.toLocaleString()}</strong>
          </div>

          <div className="metro-card__stat--right">
            <span>Growth Since 2020</span>
            <strong
              className={
                isGrowing
                  ? "metro-card__growth metro-card__growth--positive"
                  : isDeclining
                    ? "metro-card__growth metro-card__growth--negative"
                    : "metro-card__growth"
              }
            >
              {isGrowing && "+"}
              {growthPercent}%{isGrowing && <FaArrowTrendUp />}
              {isDeclining && <FaArrowTrendDown />}
            </strong>
          </div>

          <div>
            <span>Median Income</span>
            <strong>
              ${metro.economics.medianHouseholdIncome.toLocaleString()}
            </strong>
          </div>

          <div className="metro-card__stat--right">
            <span>Home Value</span>
            <strong>${metro.housing.medianHomeValue.toLocaleString()}</strong>
          </div>
        </div>

        <div className="metro-card__footer">
          <span>{metro.counties.countyCount} counties</span>
          <span>{stateLabels}</span>
        </div>
      </div>
    </article>
  );
}

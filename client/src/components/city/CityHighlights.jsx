import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaHouse,
  FaPeopleGroup,
  FaWallet,
} from "react-icons/fa6";

import "../../styles/components/city/CityHighlights.css";

export default function CityHighlights({ populationHistory, acsProfile }) {
  const firstPopulation = Number(populationHistory[0]?.population ?? 0);
  const latestPopulation = Number(populationHistory.at(-1)?.population ?? 0);

  const growthSince2020 =
    firstPopulation > 0
      ? Number(
          (
            ((latestPopulation - firstPopulation) / firstPopulation) *
            100
          ).toFixed(1),
        )
      : 0;

  const isGrowing = growthSince2020 > 0;
  const isDeclining = growthSince2020 < 0;

  return (
    <section className="city-highlights">
      <article className="city-highlight-card">
        <div className="city-highlight-card__icon">
          <FaPeopleGroup />
        </div>

        <div>
          <span>Population (2025)</span>
          <strong>{latestPopulation.toLocaleString()}</strong>
        </div>
      </article>

      <article className="city-highlight-card">
        <div className="city-highlight-card__icon city-highlight-card__icon--green">
          {isDeclining ? <FaArrowTrendDown /> : <FaArrowTrendUp />}
        </div>

        <div>
          <span>Growth Since 2020</span>

          <strong
            className={
              isGrowing
                ? "city-highlight-card__positive"
                : isDeclining
                  ? "city-highlight-card__negative"
                  : ""
            }
          >
            {isGrowing ? "+" : ""}
            {growthSince2020}%
          </strong>
        </div>
      </article>

      <article className="city-highlight-card">
        <div className="city-highlight-card__icon">
          <FaWallet />
        </div>

        <div>
          <span>Median Household Income</span>
          <strong>
            ${Number(acsProfile.median_household_income).toLocaleString()}
          </strong>
        </div>
      </article>

      <article className="city-highlight-card">
        <div className="city-highlight-card__icon city-highlight-card__icon--orange">
          <FaHouse />
        </div>

        <div>
          <span>Poverty Rate</span>
          <strong>{Number(acsProfile.poverty_rate).toFixed(1)}%</strong>
        </div>
      </article>
    </section>
  );
}

import { Link } from "react-router-dom";
import { FaArrowTrendDown, FaArrowTrendUp, FaCity } from "react-icons/fa6";

import "../../styles/components/city-directory/CityCard.css";

export default function CityCard({ city, rank }) {
  const population = Number(city.population);
  const growth = Number(city.growth_since_2020);

  const isGrowing = growth > 0;
  const isDeclining = growth < 0;

  return (
    <Link to={`/cities/${city.slug}`} className="city-card__link">
      <article className="city-card">
        <div className="city-card__top">
          <div className="city-card__icon">
            <FaCity />
          </div>

          <span className="city-card__rank">#{rank}</span>
        </div>

        <div className="city-card__body">
          <div className="city-card__heading">
            <h2>{city.name}</h2>

            <p>
              {city.state} · {city.state_abbreviation}
            </p>
          </div>

          <div className="city-card__stats">
            <div>
              <span>Population</span>

              <strong>{population.toLocaleString()}</strong>

              <small>{city.population_year} estimate</small>
            </div>

            <div className="city-card__stat--right">
              <span>Growth Since 2020</span>

              <strong
                className={
                  isGrowing
                    ? "city-card__growth city-card__growth--positive"
                    : isDeclining
                      ? "city-card__growth city-card__growth--negative"
                      : "city-card__growth"
                }
              >
                {isGrowing && "+"}
                {growth}%{isGrowing && <FaArrowTrendUp />}
                {isDeclining && <FaArrowTrendDown />}
              </strong>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

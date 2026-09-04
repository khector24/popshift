import { Link } from "react-router-dom";
import { FaCity, FaLocationDot } from "react-icons/fa6";

import "../../styles/components/city/CityHero.css";

export default function CityHero({ city, state, metro }) {
  return (
    <section className="city-hero">
      <div className="city-hero__content">
        <Link className="city-hero__back" to="/cities">
          ← Back to Cities
        </Link>

        <h1>
          {city.name}
          {state?.name ? `, ${state.name}` : ""}
        </h1>

        <div className="city-hero__meta">
          {state && (
            <span>
              <FaLocationDot />
              {state.name}
            </span>
          )}

          {metro && (
            <span>
              <FaCity />
              Part of {metro.name}
            </span>
          )}
        </div>

        <p className="city-hero__estimate">2025 Population Estimate</p>
      </div>

      <div className="city-hero__visual" aria-hidden="true">
        <FaCity />
        <span>{city.name}</span>
      </div>
    </section>
  );
}

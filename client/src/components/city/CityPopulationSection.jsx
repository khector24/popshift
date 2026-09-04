import { Link } from "react-router-dom";
import { FaCity, FaLocationDot, FaMap } from "react-icons/fa6";

import PopulationTimeline from "../ui/PopulationTimeline.jsx";

import "../../styles/components/city/CityPopulationSection.css";

const SQUARE_METERS_PER_SQUARE_MILE = 2_589_988.11;

export default function CityPopulationSection({
  city,
  state,
  metro,
  populationHistory,
}) {
  const landAreaSquareMiles =
    Number(city.land_area) / SQUARE_METERS_PER_SQUARE_MILE;

  return (
    <section className="city-population-section">
      <div className="city-population-section__history">
        <h2>Population Over Time</h2>

        <PopulationTimeline
          title="Population trend"
          data={populationHistory}
          showSource={false}
          showLabels
        />
      </div>

      <aside className="city-at-a-glance">
        <h2>At a Glance</h2>

        {state && (
          <div className="city-at-a-glance__item">
            <FaMap />

            <div>
              <span>State</span>

              <Link to={`/states/${state.state_fips}`}>{state.name}</Link>
            </div>
          </div>
        )}

        {metro && (
          <div className="city-at-a-glance__item">
            <FaCity />

            <div>
              <span>Metro Area</span>

              <Link to={`/metros/${metro.slug}`}>{metro.name}</Link>
            </div>
          </div>
        )}

        <div className="city-at-a-glance__item">
          <FaMap />

          <div>
            <span>Land Area</span>

            <strong>
              {landAreaSquareMiles.toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })}{" "}
              sq mi
            </strong>
          </div>
        </div>

        <div className="city-at-a-glance__item">
          <FaLocationDot />

          <div>
            <span>Coordinates</span>

            <strong>
              {Number(city.latitude).toFixed(2)}°,{" "}
              {Number(city.longitude).toFixed(2)}°
            </strong>
          </div>
        </div>
      </aside>
    </section>
  );
}

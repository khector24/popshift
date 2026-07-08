import { Link } from "react-router-dom";

import "../../styles/components/metro/MetroOverview.css";

export default function MetroOverview({ metro }) {
  const firstYear = metro.populationYears[0];
  const lastYear = metro.populationYears.at(-1);

  const populationChange = metro.growthSince2020.amount;
  const populationPercent = Math.abs(metro.growthSince2020.percent);

  const counties = metro.counties.counties;

  return (
    <section className="metro-overview">
      <h2>Metro Overview</h2>

      <div className="metro-overview__content">
        <p>
          The <strong>{metro.name}</strong> spans{" "}
          <strong>{metro.counties.countyCount}</strong> counties across{" "}
          <strong>{metro.states.length}</strong>{" "}
          {metro.states.length === 1 ? "state" : "states"} and ranks{" "}
          <strong>#{metro.rank}</strong> among the largest metropolitan areas
          tracked by PopShift.
        </p>

        <p>
          As of <strong>{lastYear}</strong>, the metro has an estimated
          population of <strong>{metro.population.toLocaleString()}</strong>.
          Since {firstYear}, it has{" "}
          {populationChange >= 0 ? "grown" : "declined"} by{" "}
          <strong>{Math.abs(populationChange).toLocaleString()}</strong>{" "}
          residents ({populationPercent}%).
        </p>

        <p>
          PopShift combines Census population estimates, American Community
          Survey data, and IRS migration statistics to help explore population,
          housing, economics, education, transportation, and migration trends
          across U.S. metropolitan areas.
        </p>
      </div>

      <div className="metro-overview__bottom">
        <div className="metro-overview__section">
          <h3>Counties in this Metro</h3>

          <ol className="metro-overview__list">
            {counties.map((county) => (
              <li key={county.fips}>{county.name}</li>
            ))}
          </ol>
        </div>

        <div className="metro-overview__section">
          <h3>States in this Metro</h3>

          <div className="metro-overview__states">
            {metro.states.map((state) => (
              <Link
                key={state.code}
                className="metro-overview__state"
                to={`/states/${state.code}`}
              >
                <span>{state.name}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>

          <div className="metro-overview__population">
            <span>Total Metro Population</span>
            <strong>{metro.population.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

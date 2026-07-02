import { Link } from "react-router-dom";
import { FaRoute } from "react-icons/fa6";
import "../../styles/components/metro/MetroHero.css";

export default function MetroHero({ metro }) {
  const states = metro.states || [];
  const stateCodes = states.map((state) => state.abbreviation).join(", ");

  const metroName = metro.name.replace(/ Metro Area$/, "");
  const latestPopulationYear = metro.populationYears.at(-1);

  return (
    <section className="metro-hero">
      <div className="metro-hero__content">
        <Link to="/metros">← Back to Metro Directory</Link>
        <h1>
          {metroName} <span className="metro-hero__accent">Metro Area</span>
        </h1>

        <p className="metro-hero__description">
          The {metroName} is one of the largest metro areas tracked by PopShift.
        </p>

        <div className="metro-hero__meta">
          <span>
            {states.length} States ({stateCodes})
          </span>

          <span className="metro-hero__dot" aria-hidden="true"></span>

          <span>{latestPopulationYear} Population Estimate</span>
        </div>

        <button className="metro-hero__button">
          <FaRoute /> Explore Moving
        </button>
      </div>

      <img
        className="metro-hero__image"
        src={metro.imageData.name}
        alt={metro.name}
      />
    </section>
  );
}

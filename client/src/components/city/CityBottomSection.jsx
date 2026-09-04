import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaCloudSun,
  FaMapLocationDot,
  FaNewspaper,
  FaShieldHalved,
} from "react-icons/fa6";

import "../../styles/components/city/CityBottomSection.css";

export default function CityBottomSection({
  city,
  state,
  metro,
  acsProfile,
  populationHistory,
}) {
  const populationSource = populationHistory?.[0];

  return (
    <section className="city-bottom">
      <div className="city-bottom__main">
        <article className="city-bottom__panel">
          <div className="city-bottom__heading">
            <FaMapLocationDot />

            <div>
              <span>Explore Nearby Geography</span>
              <h2>Related Places</h2>
            </div>
          </div>

          <div className="city-bottom__links">
            {state && (
              <Link
                to={`/states/${state.state_fips}`}
                className="city-bottom__place-link"
              >
                <div>
                  <span>State</span>
                  <strong>{state.name}</strong>
                </div>

                <span>Explore →</span>
              </Link>
            )}

            {metro && (
              <Link
                to={`/metros/${metro.slug}`}
                className="city-bottom__place-link"
              >
                <div>
                  <span>Metro Area</span>
                  <strong>{metro.name}</strong>
                </div>

                <span>Explore →</span>
              </Link>
            )}
          </div>
        </article>

        <article className="city-bottom__panel">
          <div className="city-bottom__heading">
            <FaBookOpen />

            <div>
              <span>About the Data</span>
              <h2>Sources & Methodology</h2>
            </div>
          </div>

          <p className="city-bottom__description">
            RegionLore combines official population estimates and American
            Community Survey data to build this profile of {city.name}.
          </p>

          <div className="city-bottom__sources">
            {populationSource && (
              <div>
                <span>Population</span>

                <strong>{populationSource.source}</strong>

                <small>
                  {populationSource.dataset_name}
                  {populationSource.vintage
                    ? ` · Vintage ${populationSource.vintage}`
                    : ""}
                </small>
              </div>
            )}

            {acsProfile?.source && (
              <div>
                <span>Community Profile</span>

                <strong>{acsProfile.source}</strong>

                <small>
                  {acsProfile.dataset_name}
                  {acsProfile.vintage ? ` · ${acsProfile.vintage}` : ""}
                </small>
              </div>
            )}
          </div>

          <Link to="/methodology" className="city-bottom__methodology-link">
            View methodology →
          </Link>
        </article>
      </div>

      <div className="city-bottom__future">
        <div className="city-bottom__future-heading">
          <span>Coming Later</span>
          <h2>More Ways to Understand {city.name}</h2>
        </div>

        <div className="city-bottom__future-grid">
          <div className="city-bottom__future-item">
            <FaShieldHalved />
            <div>
              <strong>Crime & Safety</strong>
              <span>Coming in a later V2 phase</span>
            </div>
          </div>

          <div className="city-bottom__future-item">
            <FaNewspaper />
            <div>
              <strong>Related Articles</strong>
              <span>Coming in a later V2 phase</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { FaBookOpen, FaMapLocationDot, FaNewspaper } from "react-icons/fa6";

import RelatedArticles from "../articles/RelatedArticles.jsx";

import "../../styles/components/city/CityBottomSection.css";

export default function CityBottomSection({ city, state, metro, crime }) {
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
            RegionLore combines data from the U.S. Census Bureau, NOAA,
            OpenWeather, and the FBI to build this profile of {city.name}.
          </p>

          <div className="city-bottom__sources">
            <div>
              <span>Census Data</span>
              <strong>U.S. Census Bureau</strong>
              <small>Population Estimates · American Community Survey</small>
            </div>

            <div>
              <span>Climate Normals</span>
              <strong>NOAA</strong>
              <small>U.S. Climate Normals · 1991–2020</small>
            </div>

            <div>
              <span>Current Weather</span>
              <strong>OpenWeather</strong>
              <small>Current Weather API</small>
            </div>

            {crime?.source && (
              <div>
                <span>Crime</span>
                <strong>{crime.source}</strong>
                <small>
                  {crime.dataset_name}
                  {crime.vintage ? ` · ${crime.vintage}` : ""}
                </small>
              </div>
            )}
          </div>

          <Link to="/methodology" className="city-bottom__methodology-link">
            View methodology →
          </Link>
        </article>
      </div>

      <article className="city-bottom__articles">
        <div className="city-bottom__heading">
          <FaNewspaper />

          <div>
            <span>Stories & Analysis</span>
            <h2>Related Articles</h2>
          </div>
        </div>

        <RelatedArticles placeId={city.id} />
      </article>
    </section>
  );
}

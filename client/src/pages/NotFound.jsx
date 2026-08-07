import { Link } from "react-router-dom";

import "../styles/pages/NotFound.css";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__content">
        <p className="not-found__eyebrow">Error 404</p>

        <p className="not-found__number" aria-hidden="true">
          404
        </p>

        <h1>This place isn’t on the map</h1>

        <p className="not-found__message">
          RegionLore could not find the page you requested. The address may be
          incorrect, or the page may have moved.
        </p>

        <div className="not-found__actions">
          <Link className="not-found__primary-link" to="/">
            Return home
          </Link>

          <Link className="not-found__secondary-link" to="/states">
            Explore states
          </Link>
        </div>
      </div>

      <div className="not-found__coordinates" aria-hidden="true">
        <span>LAT: UNKNOWN</span>
        <span>LON: UNKNOWN</span>
      </div>
    </section>
  );
}
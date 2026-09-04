import { FaHouse, FaKey } from "react-icons/fa6";

import "../../styles/components/city/CityHousingSection.css";

export default function CityHousingSection({ acsProfile }) {
  return (
    <section className="city-domain-section">
      <div className="city-domain-section__header">
        <div>
          <span>Housing</span>
          <h2>Housing & Affordability</h2>
        </div>
      </div>

      <div className="city-housing-grid">
        <article className="city-domain-card">
          <div className="city-domain-card__icon">
            <FaHouse />
          </div>

          <span>Median Home Value</span>

          <strong>
            ${Number(acsProfile.median_home_value).toLocaleString()}
          </strong>
        </article>

        <article className="city-domain-card">
          <div className="city-domain-card__icon">
            <FaKey />
          </div>

          <span>Median Gross Rent</span>

          <strong>
            ${Number(acsProfile.median_rent).toLocaleString()} / mo
          </strong>
        </article>

        <article className="city-domain-card">
          <span>Owner Occupied</span>

          <strong>{Number(acsProfile.owner_share).toFixed(1)}%</strong>
        </article>

        <article className="city-domain-card">
          <span>Renter Occupied</span>

          <strong>{Number(acsProfile.renter_share).toFixed(1)}%</strong>
        </article>
      </div>
    </section>
  );
}

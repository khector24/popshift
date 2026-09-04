import { FaGraduationCap, FaWallet } from "react-icons/fa6";

import "../../styles/components/city/CityEconomicsSection.css";

export default function CityEconomicsSection({ acsProfile }) {
  return (
    <section className="city-domain-section">
      <div className="city-domain-section__header">
        <div>
          <span>Economics</span>
          <h2>Economic Snapshot</h2>
        </div>

        <p>{acsProfile.data_year} ACS 5-Year estimates</p>
      </div>

      <div className="city-economics-grid">
        <article className="city-domain-card">
          <div className="city-domain-card__icon">
            <FaWallet />
          </div>

          <span>Median Household Income</span>

          <strong>
            ${Number(acsProfile.median_household_income).toLocaleString()}
          </strong>
        </article>

        <article className="city-domain-card">
          <div className="city-domain-card__icon city-domain-card__icon--orange">
            <FaWallet />
          </div>

          <span>Poverty Rate</span>

          <strong>{Number(acsProfile.poverty_rate).toFixed(1)}%</strong>
        </article>

        <article className="city-domain-card">
          <div className="city-domain-card__icon city-domain-card__icon--green">
            <FaGraduationCap />
          </div>

          <span>High School or Higher</span>

          <strong>
            {Number(acsProfile.high_school_or_higher).toFixed(1)}%
          </strong>
        </article>

        <article className="city-domain-card">
          <div className="city-domain-card__icon">
            <FaGraduationCap />
          </div>

          <span>Bachelor's or Higher</span>

          <strong>{Number(acsProfile.bachelors_or_higher).toFixed(1)}%</strong>
        </article>
      </div>
    </section>
  );
}

import { FaCity } from "react-icons/fa6";

import "../../styles/components/city-directory/CityDirectoryHero.css";

export default function CityDirectoryHero({ cityCount }) {
  return (
    <section className="city-directory-hero">
      <div className="city-directory-hero__icon">
        <FaCity />
      </div>

      <div>
        <span className="city-directory-hero__eyebrow">Cities</span>

        <h1>City Directory</h1>

        <p>
          Explore {cityCount} U.S. cities with population data and growth
          trends. Search, filter, and find the places that matter to you.
        </p>
      </div>
    </section>
  );
}

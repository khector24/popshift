import CityCard from "./CityCard.jsx";

import "../../styles/components/city-directory/CityGrid.css";

export default function CityGrid({ cities }) {
  return (
    <section className="city-grid">
      {cities.map((city) => (
        <CityCard key={city.id} city={city} rank={city.rank} />
      ))}
    </section>
  );
}

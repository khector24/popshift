import { useEffect, useState } from "react";

import { getCities } from "../services/citiesApi.js";

import CityDirectoryHero from "../components/city-directory/CityDirectoryHero.jsx";
import CityGrid from "../components/city-directory/CityGrid.jsx";

import "../styles/pages/CityDirectory.css";

export default function CityDirectory() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true);
        setError("");

        const result = await getCities();

        setCities(result.data);
      } catch (error) {
        console.error("Unable to load cities:", error);
        setError("Unable to load cities.");
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  if (loading) {
    return <p>Loading cities...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="city-directory">
      <CityDirectoryHero cityCount={cities.length} />

      <div className="city-directory__content">
        <CityGrid cities={cities} />
      </div>
    </main>
  );
}

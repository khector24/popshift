import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getCityBySlug, getCityWeather } from "../services/citiesApi.js";

import CityHero from "../components/city/CityHero.jsx";
import CityHighlights from "../components/city/CityHighlights.jsx";
import CityPopulationSection from "../components/city/CityPopulationSection.jsx";

import CityEconomicsSection from "../components/city/CityEconomicsSection.jsx";
import CityHousingSection from "../components/city/CityHousingSection.jsx";
import CityDemographicsSection from "../components/city/CityDemographicsSection.jsx";
import CityTransportationSection from "../components/city/CityTransportationSection.jsx";
import CityBottomSection from "../components/city/CityBottomSection.jsx";
import CityClimateSection from "../components/city/CityClimateSection.jsx";

import "../styles/pages/CityDetail.css";

export default function CityDetail() {
  const { slug } = useParams();

  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    async function fetchCity() {
      try {
        setLoading(true);
        setError("");

        const result = await getCityBySlug(slug);

        setCityData(result);
      } catch (error) {
        console.error("Unable to load city:", error);
        setError("Unable to load city.");
      } finally {
        setLoading(false);
      }
    }

    async function fetchWeather() {
      try {
        setWeatherError("");

        const result = await getCityWeather(slug);

        setWeatherData(result.weather);
      } catch (error) {
        console.error("Unable to load weather:", error);
        setWeatherError("Unable to load current weather.");
      }
    }

    fetchCity();
    fetchWeather();
  }, [slug]);

  if (loading) {
    return <p>Loading city...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!cityData) {
    return <p>City not found.</p>;
  }

  return (
    <main className="city-detail">
      <CityHero
        city={cityData.city}
        state={cityData.state}
        metro={cityData.metro}
        weather={weatherData}
        weatherError={weatherError}
      />

      <CityHighlights
        populationHistory={cityData.populationHistory}
        acsProfile={cityData.acsProfile}
      />

      <CityPopulationSection
        city={cityData.city}
        state={cityData.state}
        metro={cityData.metro}
        populationHistory={cityData.populationHistory}
      />

      <CityEconomicsSection acsProfile={cityData.acsProfile} />

      <CityHousingSection acsProfile={cityData.acsProfile} />

      <CityDemographicsSection acsProfile={cityData.acsProfile} />

      <CityTransportationSection acsProfile={cityData.acsProfile} />

      <CityClimateSection climate={cityData.climate} />

      <CityBottomSection
        city={cityData.city}
        state={cityData.state}
        metro={cityData.metro}
        acsProfile={cityData.acsProfile}
        populationHistory={cityData.populationHistory}
      />
    </main>
  );
}

import { useEffect, useMemo, useState } from "react";

import { getCities } from "../services/citiesApi.js";

import CityDirectoryHero from "../components/city-directory/CityDirectoryHero.jsx";
import CityDirectoryToolbar from "../components/city-directory/CityDirectoryToolbar.jsx";
import CityFilters from "../components/city-directory/CityFilters.jsx";
import CityGrid from "../components/city-directory/CityGrid.jsx";
import CityPagination from "../components/city-directory/CityPagination.jsx";

import "../styles/pages/CityDirectory.css";

const CITIES_PER_PAGE = 12;

export default function CityDirectory() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(true);
  const [citySearchText, setCitySearchText] = useState("");
  const [sortBy, setSortBy] = useState("population-desc");

  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedGrowth, setSelectedGrowth] = useState([]);

  const [maxPopulation, setMaxPopulation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true);
        setError("");

        const result = await getCities();
        const cityData = result.data.map((city, index) => ({
          ...city,
          rank: index + 1,
        }));

        setCities(cityData);

        const largestPopulation = Math.max(
          ...cityData.map((city) => Number(city.population)),
        );

        setMaxPopulation(largestPopulation);
      } catch (error) {
        console.error("Unable to load cities:", error);
        setError("Unable to load cities.");
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  const maxPopulationLimit = useMemo(() => {
    if (cities.length === 0) {
      return 0;
    }

    return Math.max(...cities.map((city) => Number(city.population)));
  }, [cities]);

  const states = useMemo(() => {
    const stateMap = new Map();

    for (const city of cities) {
      if (!city.state_abbreviation || !city.state) {
        continue;
      }

      stateMap.set(city.state_abbreviation, {
        name: city.state,
        abbreviation: city.state_abbreviation,
      });
    }

    return [...stateMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [cities]);

  const filteredCities = useMemo(() => {
    const normalizedSearch = citySearchText.trim().toLowerCase();

    const result = cities.filter((city) => {
      const population = Number(city.population);
      const growth = Number(city.growth_since_2020);

      const matchesSearch =
        !normalizedSearch ||
        city.name.toLowerCase().includes(normalizedSearch) ||
        city.state.toLowerCase().includes(normalizedSearch) ||
        city.state_abbreviation.toLowerCase().includes(normalizedSearch);

      const matchesState =
        selectedStates.length === 0 ||
        selectedStates.includes(city.state_abbreviation);

      const matchesPopulation = population <= maxPopulation;

      const matchesGrowth =
        selectedGrowth.length === 0 ||
        (selectedGrowth.includes("growing") && growth > 0) ||
        (selectedGrowth.includes("declining") && growth < 0) ||
        (selectedGrowth.includes("no-change") && growth === 0);

      return (
        matchesSearch && matchesState && matchesPopulation && matchesGrowth
      );
    });

    result.sort((a, b) => {
      const populationA = Number(a.population);
      const populationB = Number(b.population);
      const growthA = Number(a.growth_since_2020);
      const growthB = Number(b.growth_since_2020);

      switch (sortBy) {
        case "population-asc":
          return populationA - populationB;

        case "growth-desc":
          return growthB - growthA;

        case "growth-asc":
          return growthA - growthB;

        case "name-asc":
          return a.name.localeCompare(b.name);

        case "population-desc":
        default:
          return populationB - populationA;
      }
    });

    return result;
  }, [
    cities,
    citySearchText,
    selectedStates,
    selectedGrowth,
    maxPopulation,
    sortBy,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [citySearchText, sortBy, selectedStates, selectedGrowth, maxPopulation]);

  const totalPages = Math.ceil(filteredCities.length / CITIES_PER_PAGE);

  const startIndex = (currentPage - 1) * CITIES_PER_PAGE;

  const visibleCities = filteredCities.slice(
    startIndex,
    startIndex + CITIES_PER_PAGE,
  );

  if (loading) {
    return <p>Loading cities...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="city-directory">
      <CityDirectoryHero cityCount={cities.length} />

      <CityDirectoryToolbar
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((previous) => !previous)}
        citySearchText={citySearchText}
        setCitySearchText={setCitySearchText}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div
        className={
          showFilters
            ? "city-directory__layout"
            : "city-directory__layout city-directory__layout--filters-hidden"
        }
      >
        {showFilters && (
          <CityFilters
            cities={cities}
            states={states}
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            selectedGrowth={selectedGrowth}
            setSelectedGrowth={setSelectedGrowth}
            maxPopulation={maxPopulation}
            setMaxPopulation={setMaxPopulation}
            defaultMaxPopulation={maxPopulationLimit}
            maxPopulationLimit={maxPopulationLimit}
          />
        )}

        <div className="city-directory__results">
          <div className="city-directory__results-header">
            <p>
              Showing {visibleCities.length} of {filteredCities.length} cities
            </p>
          </div>

          {visibleCities.length > 0 ? (
            <CityGrid cities={visibleCities} />
          ) : (
            <p className="city-directory__empty">
              No cities match your filters.
            </p>
          )}

          <CityPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
}

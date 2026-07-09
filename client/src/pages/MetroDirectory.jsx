import { useState, useEffect } from "react";
import { getStates } from "../services/statesApi.js";
import { getMetros } from "../services/metrosApi.js";

import MetroDirectoryHero from "../components/metro-directory/MetroDirectoryHero";
import MetroDirectoryToolbar from "../components/metro-directory/MetroDirectoryToolbar";
import MetroFilters from "../components/metro-directory/MetroFilters";
import MetroGrid from "../components/metro-directory/MetroGrid";
import MetroPagination from "../components/metro-directory/MetroPagination";

import "../styles/pages/MetroDirectory.css";

const MAX_POPULATION = 25000000;
const DEFAULT_MAX_POPULATION = MAX_POPULATION * 0.85;

export default function MetroDirectory() {
  const [metros, setMetros] = useState([]);
  const [states, setStates] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedGrowth, setSelectedGrowth] = useState([]);
  const [maxPopulation, setMaxPopulation] = useState(DEFAULT_MAX_POPULATION);

  const [metroSearchText, setMetroSearchText] = useState("");

  const filteredStates = states.filter((state) => state.name !== "Puerto Rico");

  const regionByStateCode = Object.fromEntries(
    filteredStates.map((state) => [state.code, state.region]),
  );

  useEffect(() => {
    async function fetchData() {
      const metroResult = await getMetros();
      const statesResult = await getStates({
        sortBy: "name",
        order: "asc",
      });

      setMetros(metroResult);
      setStates(statesResult.data);
    }

    fetchData();
  }, []);

  const filteredMetros = metros.filter((metro) => {
    if (metro.population > maxPopulation) {
      return false;
    }

    if (selectedGrowth.length > 0) {
      const growthPercent = metro.growthSince2020?.percent ?? 0;

      const isGrowing = growthPercent > 0;
      const isDeclining = growthPercent < 0;
      const isNoChange = growthPercent === 0;

      const matchesGrowth =
        (selectedGrowth.includes("growing") && isGrowing) ||
        (selectedGrowth.includes("declining") && isDeclining) ||
        (selectedGrowth.includes("no-change") && isNoChange);

      if (!matchesGrowth) {
        return false;
      }
    }

    if (selectedStates.length > 0) {
      const matchesState = metro.states.some((state) =>
        selectedStates.includes(state.code),
      );

      if (!matchesState) {
        return false;
      }
    }

    if (selectedRegions.length > 0) {
      const matchesRegion = metro.states.some((state) =>
        selectedRegions.includes(regionByStateCode[state.code]),
      );

      if (!matchesRegion) {
        return false;
      }
    }

    if (
      metroSearchText &&
      !metro.name.toLowerCase().includes(metroSearchText.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <main className="metro-directory-page">
      <MetroDirectoryHero />

      <MetroDirectoryToolbar
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        metroSearchText={metroSearchText}
        setMetroSearchText={setMetroSearchText}
      />

      <div
        className={`metro-directory-page__layout ${
          !showFilters ? "metro-directory-page__layout--filters-hidden" : ""
        }`}
      >
        {showFilters && (
          <MetroFilters
            metros={metros}
            filteredStates={filteredStates}
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            regionByStateCode={regionByStateCode}
            selectedGrowth={selectedGrowth}
            setSelectedGrowth={setSelectedGrowth}
            maxPopulation={maxPopulation}
            setMaxPopulation={setMaxPopulation}
            defaultMaxPopulation={DEFAULT_MAX_POPULATION}
            maxPopulationLimit={MAX_POPULATION}
          />
        )}

        <MetroGrid metros={filteredMetros} />
      </div>

      <MetroPagination />
    </main>
  );
}

import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

import "../../styles/components/city-directory/CityFilters.css";

export default function CityFilters({
  cities,
  states,
  selectedStates,
  setSelectedStates,
  selectedGrowth,
  setSelectedGrowth,
  maxPopulation,
  setMaxPopulation,
  defaultMaxPopulation,
  maxPopulationLimit,
}) {
  const [stateSearchText, setStateSearchText] = useState("");

  const visibleStates = states.filter((state) =>
    state.name.toLowerCase().includes(stateSearchText.toLowerCase()),
  );

  const cityCountByState = {};

  for (const city of cities) {
    const abbreviation = city.state_abbreviation;

    cityCountByState[abbreviation] = (cityCountByState[abbreviation] || 0) + 1;
  }

  let growingCityCount = 0;
  let decliningCityCount = 0;
  let noChangeCityCount = 0;

  for (const city of cities) {
    const growth = Number(city.growth_since_2020);

    if (growth > 0) {
      growingCityCount++;
    } else if (growth < 0) {
      decliningCityCount++;
    } else {
      noChangeCityCount++;
    }
  }

  function handleStateToggle(stateAbbreviation) {
    if (selectedStates.includes(stateAbbreviation)) {
      setSelectedStates((previous) =>
        previous.filter((item) => item !== stateAbbreviation),
      );
    } else {
      setSelectedStates((previous) => [...previous, stateAbbreviation]);
    }
  }

  function handleGrowthToggle(growthType) {
    if (selectedGrowth.includes(growthType)) {
      setSelectedGrowth((previous) =>
        previous.filter((item) => item !== growthType),
      );
    } else {
      setSelectedGrowth((previous) => [...previous, growthType]);
    }
  }

  function handleClearFilters() {
    setSelectedStates([]);
    setSelectedGrowth([]);
    setStateSearchText("");
    setMaxPopulation(defaultMaxPopulation);
  }

  return (
    <aside className="city-filters">
      <div className="city-filters__header">
        <h2>Filters</h2>

        <button type="button" onClick={handleClearFilters}>
          Clear all
        </button>
      </div>

      <section className="city-filters__section">
        <h3>Population</h3>

        <div className="city-filters__range-row">
          <input type="text" value="0" readOnly />

          <span>to</span>

          <input
            type="text"
            value={
              maxPopulation >= maxPopulationLimit
                ? `${(maxPopulationLimit / 1_000_000).toFixed(1)}M+`
                : maxPopulation.toLocaleString()
            }
            readOnly
          />
        </div>

        <input
          className="city-filters__range"
          type="range"
          min="0"
          max={maxPopulationLimit}
          step="100000"
          value={maxPopulation}
          onChange={(event) => setMaxPopulation(Number(event.target.value))}
        />
      </section>

      <section className="city-filters__section">
        <h3>Growth Since 2020</h3>

        <label className="city-filters__checkbox-row">
          <input
            type="checkbox"
            checked={selectedGrowth.includes("growing")}
            onChange={() => handleGrowthToggle("growing")}
          />

          <span>Growing</span>

          <strong className="city-filters__positive">{growingCityCount}</strong>
        </label>

        <label className="city-filters__checkbox-row">
          <input
            type="checkbox"
            checked={selectedGrowth.includes("declining")}
            onChange={() => handleGrowthToggle("declining")}
          />

          <span>Declining</span>

          <strong className="city-filters__negative">
            {decliningCityCount}
          </strong>
        </label>

        <label className="city-filters__checkbox-row">
          <input
            type="checkbox"
            checked={selectedGrowth.includes("no-change")}
            onChange={() => handleGrowthToggle("no-change")}
          />

          <span>No Change</span>

          <strong>{noChangeCityCount}</strong>
        </label>
      </section>

      <section className="city-filters__section">
        <h3>States</h3>

        <div className="city-filters__search-wrap">
          <input
            className="city-filters__search"
            type="text"
            value={stateSearchText}
            onChange={(event) => setStateSearchText(event.target.value)}
            placeholder="Search states..."
          />

          {stateSearchText && (
            <button
              className="city-filters__search-clear"
              type="button"
              onClick={() => setStateSearchText("")}
              aria-label="Clear state search"
            >
              <FaXmark />
            </button>
          )}
        </div>

        <div className="city-filters__state-list">
          {visibleStates.map((state) => (
            <label
              className="city-filters__checkbox-row"
              key={state.abbreviation}
            >
              <input
                type="checkbox"
                checked={selectedStates.includes(state.abbreviation)}
                onChange={() => handleStateToggle(state.abbreviation)}
              />

              <span>{state.name}</span>

              <strong>{cityCountByState[state.abbreviation] || 0}</strong>
            </label>
          ))}
        </div>
      </section>
    </aside>
  );
}

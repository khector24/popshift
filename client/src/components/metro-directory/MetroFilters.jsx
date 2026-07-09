import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

import "../../styles/components/metro-directory/MetroFilters.css";

const REGIONS = ["Northeast", "Midwest", "South", "West"];

export default function MetroFilters({ states, metros }) {
  const [selectedStates, setSelectedStates] = useState([]);
  const [searchStateText, setSearchStateText] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedGrowth, setSelectedGrowth] = useState([]);

  const filteredStates = states.filter((state) => state.name !== "Puerto Rico");

  const visibleStates = filteredStates.filter((state) =>
    state.name.toLowerCase().includes(searchStateText.toLowerCase()),
  );

  const metroCountByStateCode = {};

  for (const metro of metros) {
    for (const state of metro.states) {
      metroCountByStateCode[state.code] =
        (metroCountByStateCode[state.code] || 0) + 1;
    }
  }

  const regionByStateCode = Object.fromEntries(
    filteredStates.map((state) => [state.code, state.region]),
  );

  const metroCountByRegion = {};

  for (const metro of metros) {
    const metroRegions = new Set(
      metro.states.map((state) => regionByStateCode[state.code]),
    );

    for (const region of metroRegions) {
      if (!region) continue;

      metroCountByRegion[region] = (metroCountByRegion[region] || 0) + 1;
    }
  }

  const selectedStateCount = selectedStates.length;

  const allVisibleStatesSelected =
    visibleStates.length > 0 &&
    visibleStates.every((state) => selectedStates.includes(state.code));

  const allRegionsSelected =
    REGIONS.length > 0 &&
    REGIONS.every((region) => selectedRegions.includes(region));

  function handleStateToggle(stateCode) {
    if (selectedStates.includes(stateCode)) {
      setSelectedStates((prev) => prev.filter((code) => code !== stateCode));
    } else {
      setSelectedStates((prev) => [...prev, stateCode]);
    }
  }

  function handleAllStatesToggle() {
    setSelectedStates(
      allVisibleStatesSelected ? [] : visibleStates.map((state) => state.code),
    );
  }

  function handleRegionToggle(region) {
    if (selectedRegions.includes(region)) {
      setSelectedRegions((prev) => prev.filter((item) => item !== region));
    } else {
      setSelectedRegions((prev) => [...prev, region]);
    }
  }

  function handleAllRegionsToggle() {
    setSelectedRegions(allRegionsSelected ? [] : REGIONS);
  }

  let growingMetroCount = 0;
  let decliningMetroCount = 0;
  let noChangeMetroCount = 0;

  for (const metro of metros) {
    const growthPercent = metro.growthSince2020.percent;

    if (growthPercent > 0) {
      growingMetroCount++;
    } else if (growthPercent < 0) {
      decliningMetroCount++;
    } else {
      noChangeMetroCount++;
    }
  }

  function handleGrowthToggle(growthType) {
    if (selectedGrowth.includes(growthType)) {
      setSelectedGrowth((prev) => prev.filter((item) => item !== growthType));
    } else {
      setSelectedGrowth((prev) => [...prev, growthType]);
    }
  }

  return (
    <aside className="metro-filters">
      <div className="metro-filters__header">
        <h2>Filters</h2>
        <button type="button">Clear all</button>
      </div>

      <section className="metro-filters__section">
        <h3>Population</h3>

        <div className="metro-filters__range-row">
          <input type="text" value="0" readOnly />
          <span>to</span>
          <input type="text" value="20M+" readOnly />
        </div>

        <input className="metro-filters__range" type="range" />
      </section>

      <section className="metro-filters__section">
        <h3>Growth Since 2020</h3>

        <label className="metro-filters__checkbox-row">
          <input
            type="checkbox"
            checked={selectedGrowth.includes("growing")}
            onChange={() => handleGrowthToggle("growing")}
          />
          <span>Growing</span>
          <strong className="metro-filters__positive">
            {growingMetroCount}
          </strong>
        </label>

        <label className="metro-filters__checkbox-row">
          <input
            type="checkbox"
            checked={selectedGrowth.includes("declining")}
            onChange={() => handleGrowthToggle("declining")}
          />
          <span>Declining</span>
          <strong className="metro-filters__negative">
            {decliningMetroCount}
          </strong>
        </label>

        <label className="metro-filters__checkbox-row">
          <input
            type="checkbox"
            checked={selectedGrowth.includes("no-change")}
            onChange={() => handleGrowthToggle("no-change")}
          />
          <span>No Change</span>
          <strong>{noChangeMetroCount}</strong>
        </label>
      </section>

      <section className="metro-filters__section">
        <h3>States</h3>

        <div className="metro-filters__search-wrap">
          <input
            className="metro-filters__search"
            value={searchStateText}
            type="text"
            onChange={(e) => setSearchStateText(e.target.value)}
            placeholder="Search states..."
          />

          {searchStateText && (
            <button
              className="metro-filters__search-clear"
              type="button"
              onClick={() => setSearchStateText("")}
              aria-label="Clear state search"
            >
              <FaXmark />
            </button>
          )}
        </div>

        <label className="metro-filters__checkbox-row">
          <input
            type="checkbox"
            checked={allVisibleStatesSelected}
            onChange={handleAllStatesToggle}
          />
          <span>All States</span>
          <strong>{selectedStateCount}</strong>
        </label>

        <div className="metro-filters__state-list">
          {visibleStates.map((state) => (
            <label className="metro-filters__checkbox-row" key={state.code}>
              <input
                type="checkbox"
                checked={selectedStates.includes(state.code)}
                onChange={() => handleStateToggle(state.code)}
              />
              <span>{state.name}</span>
              <strong>{metroCountByStateCode[state.code] || 0}</strong>
            </label>
          ))}
        </div>
      </section>

      <section className="metro-filters__section">
        <h3>Region</h3>

        <label className="metro-filters__checkbox-row">
          <input
            type="checkbox"
            checked={allRegionsSelected}
            onChange={handleAllRegionsToggle}
          />
          <span>All Regions</span>
          <strong>{selectedRegions.length}</strong>
        </label>

        {REGIONS.map((region) => (
          <label className="metro-filters__checkbox-row" key={region}>
            <input
              type="checkbox"
              checked={selectedRegions.includes(region)}
              onChange={() => handleRegionToggle(region)}
            />
            <span>{region}</span>
            <strong>{metroCountByRegion[region] || 0}</strong>
          </label>
        ))}
      </section>

      <button className="metro-filters__apply" type="button">
        Apply Filters
      </button>
    </aside>
  );
}

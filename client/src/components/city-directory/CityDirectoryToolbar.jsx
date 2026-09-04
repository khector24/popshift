import { FaMagnifyingGlass, FaSliders, FaXmark } from "react-icons/fa6";

import "../../styles/components/city-directory/CityDirectoryToolbar.css";

export default function CityDirectoryToolbar({
  showFilters,
  onToggleFilters,
  citySearchText,
  setCitySearchText,
  sortBy,
  setSortBy,
}) {
  return (
    <section className="city-directory-toolbar">
      <button
        className="city-directory-toolbar__filters-toggle"
        type="button"
        onClick={onToggleFilters}
      >
        <FaSliders />
        <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
      </button>

      <div className="city-directory-toolbar__search">
        <FaMagnifyingGlass className="city-directory-toolbar__search-icon" />

        <input
          id="city-search"
          name="search"
          type="text"
          value={citySearchText}
          onChange={(event) => setCitySearchText(event.target.value)}
          placeholder="Search cities..."
        />

        {citySearchText && (
          <button
            className="city-directory-toolbar__search-clear"
            type="button"
            onClick={() => setCitySearchText("")}
            aria-label="Clear city search"
          >
            <FaXmark />
          </button>
        )}
      </div>

      <label className="city-directory-toolbar__sort">
        <span>Sort by:</span>

        <select
          id="city-sort"
          name="sort"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="population-desc">Population (High to Low)</option>
          <option value="population-asc">Population (Low to High)</option>
          <option value="growth-desc">Growth Since 2020 (High to Low)</option>
          <option value="growth-asc">Growth Since 2020 (Low to High)</option>
          <option value="name-asc">City Name (A to Z)</option>
        </select>
      </label>
    </section>
  );
}

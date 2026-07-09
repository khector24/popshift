import "../../styles/components/metro-directory/MetroDirectoryToolbar.css";
import { FaMagnifyingGlass, FaSliders } from "react-icons/fa6";

export default function MetroDirectoryToolbar({
  showFilters,
  onToggleFilters,
}) {
  return (
    <section className="metro-directory-toolbar">
      <button
        className="metro-directory-toolbar__filters-toggle"
        type="button"
        onClick={onToggleFilters}
      >
        <FaSliders />
        <p>{showFilters ? "Hide Filters" : "Show Filters"}</p>

        {/* TODO: Show active filter count badge when filters are fully implemented. 
          EX: <span>3</span>
          */}
      </button>

      <div className="metro-directory-toolbar__search">
        <input
          id="metro-search"
          name="search"
          type="text"
          placeholder="Search metros..."
        />

        <FaMagnifyingGlass className="metro-directory-toolbar__search-icon" />
      </div>

      <label className="metro-directory-toolbar__sort">
        <span>Sort by:</span>

        <select id="metro-sort" name="sort" defaultValue="population-desc">
          <option value="population-desc">Population (High to Low)</option>
          <option value="population-asc">Population (Low to High)</option>
          <option value="growth-desc">Growth Since 2020 (High to Low)</option>
          <option value="growth-asc">Growth Since 2020 (Low to High)</option>
          <option value="income-desc">Median Income (High to Low)</option>
          <option value="rent-desc">Median Rent (High to Low)</option>
          <option value="home-value-desc">Home Value (High to Low)</option>
        </select>
      </label>
    </section>
  );
}

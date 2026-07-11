import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaMagnifyingGlass,
  FaMapLocationDot,
  FaXmark,
} from "react-icons/fa6";

import { getStates } from "../../services/statesApi.js";
import { getMetros } from "../../services/metrosApi.js";

import "../../styles/components/GlobalSearch.css";

export default function GlobalSearch() {
  const [searchText, setSearchText] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSearchData() {
      try {
        setLoading(true);

        const statesResult = await getStates({
          sortBy: "name",
          order: "asc",
        });

        const metrosResult = await getMetros();

        const stateSearchItems = statesResult.data
          .filter((state) => state.name !== "Puerto Rico")
          .map((state) => ({
            type: "state",
            name: state.name,
            code: state.code,
            region: state.region,
          }));

        const metroSearchItems = metrosResult
          .filter((metro) => {
            const metroName = metro.name.toLowerCase();

            const includesSanJuan = metroName.includes("san juan");

            const includesPuertoRico = metro.states?.some(
              (state) => state.abbreviation === "PR",
            );

            return !includesSanJuan && !includesPuertoRico;
          })
          .map((metro) => ({
            type: "metro",
            name: metro.name,
            slug: metro.slug,
            states: metro.states,
          }));

        setSearchItems([...stateSearchItems, ...metroSearchItems]);
      } catch (error) {
        console.error("Unable to load global search data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchData();
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const normalizedSearch = searchText.trim().toLowerCase();

  const matchingItems =
    normalizedSearch.length === 0
      ? []
      : searchItems
          .filter((item) => item.name.toLowerCase().includes(normalizedSearch))
          .slice(0, 8);

  function handleSearchChange(event) {
    setSearchText(event.target.value);
    setShowResults(true);
  }

  function handleResultClick(item) {
    if (item.type === "state") {
      navigate(`/states/${item.code}`);
    }

    if (item.type === "metro") {
      navigate(`/metros/${item.slug}`);
    }

    setSearchText("");
    setShowResults(false);
  }

  function handleClearSearch() {
    setSearchText("");
    setShowResults(false);
  }

  return (
    <div className="global-search" ref={searchRef}>
      <div className="global-search__input-wrap">
        <FaMagnifyingGlass className="global-search__search-icon" />

        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchText.trim()) {
              setShowResults(true);
            }
          }}
          placeholder="Search for a state, metro, or place..."
          aria-label="Search states and metro areas"
          autoComplete="off"
        />

        {searchText && (
          <button
            className="global-search__clear"
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <FaXmark />
          </button>
        )}
      </div>

      {showResults && normalizedSearch && (
        <div className="global-search__dropdown">
          {loading ? (
            <p className="global-search__message">Loading search data...</p>
          ) : matchingItems.length > 0 ? (
            matchingItems.map((item) => (
              <button
                className="global-search__result"
                type="button"
                key={
                  item.type === "state"
                    ? `state-${item.code}`
                    : `metro-${item.slug}`
                }
                onClick={() => handleResultClick(item)}
              >
                <span className="global-search__result-icon">
                  {item.type === "state" ? (
                    <FaMapLocationDot />
                  ) : (
                    <FaBuilding />
                  )}
                </span>

                <span className="global-search__result-text">
                  <strong>{item.name}</strong>

                  <small>
                    {item.type === "state"
                      ? `State · ${item.region}`
                      : "Metro Area"}
                  </small>
                </span>
              </button>
            ))
          ) : (
            <p className="global-search__message">
              No states or metro areas found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

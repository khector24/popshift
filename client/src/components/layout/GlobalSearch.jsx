import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaCity,
  FaMagnifyingGlass,
  FaMapLocationDot,
  FaXmark,
} from "react-icons/fa6";

import { searchPlaces } from "../../services/searchApi.js";

import "../../styles/components/GlobalSearch.css";

export default function GlobalSearch() {
  const [searchText, setSearchText] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const normalizedSearch = searchText.trim();

    if (!normalizedSearch) {
      setSearchItems([]);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);

        const result = await searchPlaces(normalizedSearch);

        setSearchItems(result.data);
      } catch (error) {
        console.error("Unable to search places:", error);
        setSearchItems([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);

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

  function handleSearchChange(event) {
    setSearchText(event.target.value);
    setShowResults(true);
  }

  function handleResultClick(item) {
    if (item.place_type === "state" || item.place_type === "federal_district") {
      navigate(`/states/${item.state_fips}`);
    }

    if (item.place_type === "metro") {
      navigate(`/metros/${item.slug}`);
    }

    if (item.place_type === "city") {
      navigate(`/cities/${item.slug}`);
    }

    setSearchText("");
    setSearchItems([]);
    setShowResults(false);
  }

  function handleClearSearch() {
    setSearchText("");
    setSearchItems([]);
    setShowResults(false);
  }

  function getResultLabel(item) {
    if (item.place_type === "state") {
      return "State";
    }

    if (item.place_type === "federal_district") {
      return "Federal District";
    }

    if (item.place_type === "metro") {
      return "Metro Area";
    }

    if (item.place_type === "city") {
      return "City";
    }

    return item.place_type;
  }

  function getResultIcon(item) {
    if (item.place_type === "state" || item.place_type === "federal_district") {
      return <FaMapLocationDot />;
    }

    if (item.place_type === "metro") {
      return <FaBuilding />;
    }

    return <FaCity />;
  }

  const normalizedSearch = searchText.trim();

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
          placeholder="Search cities, states, and metro areas..."
          aria-label="Search cities, states, and metro areas"
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
            <p className="global-search__message">Searching...</p>
          ) : searchItems.length > 0 ? (
            searchItems.map((item) => (
              <button
                className="global-search__result"
                type="button"
                key={item.id}
                onClick={() => handleResultClick(item)}
              >
                <span className="global-search__result-icon">
                  {getResultIcon(item)}
                </span>

                <span className="global-search__result-text">
                  <strong>{item.name}</strong>
                  <small>
                    {item.place_type === "city" && item.state_abbreviation
                      ? `City · ${item.state_abbreviation}`
                      : getResultLabel(item)}
                  </small>
                </span>
              </button>
            ))
          ) : (
            <p className="global-search__message">No places found.</p>
          )}
        </div>
      )}
    </div>
  );
}

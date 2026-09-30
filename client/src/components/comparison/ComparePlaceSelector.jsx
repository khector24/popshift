import { useEffect, useRef, useState } from "react";
import {
  FaBuilding,
  FaCity,
  FaMagnifyingGlass,
  FaMapLocationDot,
  FaXmark,
} from "react-icons/fa6";

import { searchPlaces } from "../../services/searchApi.js";

import "../../styles/components/comparison/ComparePlaceSelector.css";

function getPlaceIcon(place) {
  if (place.place_type === "state" || place.place_type === "federal_district") {
    return <FaMapLocationDot />;
  }

  if (place.place_type === "metro") {
    return <FaBuilding />;
  }

  return <FaCity />;
}

function getPlaceLabel(place) {
  if (place.place_type === "city" && place.state_abbreviation) {
    return `${place.name}, ${place.state_abbreviation}`;
  }

  return place.name;
}

export default function ComparePlaceSelector({
  geographyType,
  selectedPlaces,
  onAddPlace,
  onRemovePlace,
}) {
  const [searchText, setSearchText] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);

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

        const result = await searchPlaces(normalizedSearch, geographyType);

        setSearchItems(result.data);
      } catch (error) {
        console.error("Unable to search comparison places:", error);
        setSearchItems([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchText, geographyType]);

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

  function handleResultClick(place) {
    const alreadySelected = selectedPlaces.some(
      (selectedPlace) => selectedPlace.id === place.id,
    );

    if (!alreadySelected) {
      onAddPlace(place);
    }

    setSearchText("");
    setSearchItems([]);
    setShowResults(false);
  }

  const normalizedSearch = searchText.trim();

  return (
    <div className="compare-place-selector">
      <div className="compare-place-selector__search" ref={searchRef}>
        <div className="compare-place-selector__input-wrap">
          <FaMagnifyingGlass />

          <input
            type="text"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setShowResults(true);
            }}
            onFocus={() => {
              if (searchText.trim()) {
                setShowResults(true);
              }
            }}
            placeholder={`Search for a ${geographyType}...`}
            aria-label={`Search for a ${geographyType} to compare`}
            autoComplete="off"
          />
        </div>

        {showResults && normalizedSearch && (
          <div className="compare-place-selector__dropdown">
            {loading ? (
              <p className="compare-place-selector__message">Searching...</p>
            ) : searchItems.length > 0 ? (
              searchItems.map((place) => {
                const alreadySelected = selectedPlaces.some(
                  (selectedPlace) => selectedPlace.id === place.id,
                );

                return (
                  <button
                    key={place.id}
                    type="button"
                    className="compare-place-selector__result"
                    disabled={alreadySelected}
                    onClick={() => handleResultClick(place)}
                  >
                    <span className="compare-place-selector__result-icon">
                      {getPlaceIcon(place)}
                    </span>

                    <span>
                      <strong>{getPlaceLabel(place)}</strong>
                      <small>{alreadySelected ? "Already selected" : ""}</small>
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="compare-place-selector__message">
                No matching places found.
              </p>
            )}
          </div>
        )}
      </div>

      {selectedPlaces.length > 0 && (
        <div className="compare-place-selector__selected">
          {selectedPlaces.map((place) => (
            <div className="compare-place-selector__chip" key={place.id}>
              <span className="compare-place-selector__chip-icon">
                {getPlaceIcon(place)}
              </span>

              <span>{getPlaceLabel(place)}</span>

              <button
                type="button"
                onClick={() => onRemovePlace(place.id)}
                aria-label={`Remove ${getPlaceLabel(place)}`}
              >
                <FaXmark />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

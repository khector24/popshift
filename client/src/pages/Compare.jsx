import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ComparePlaceSelector from "../components/comparison/ComparePlaceSelector.jsx";
import ComparePersonalization from "../components/comparison/ComparePersonalization.jsx";
import CompareResults from "../components/comparison/CompareResults.jsx";
import {
  getAiComparison,
  getCityComparison,
  getMetroComparison,
  getStateComparison,
} from "../services/comparisonApi.js";
import { getCityBySlug } from "../services/citiesApi.js";
import { getMetrosBySlug } from "../services/metrosApi.js";
import { getStateByCode } from "../services/statesApi.js";
import "../styles/pages/Compare.css";
import {
  FaBuilding,
  FaCity,
  FaFlagUsa,
  FaMapLocationDot,
} from "react-icons/fa6";

const geographyTypes = [
  {
    value: "city",
    label: "Cities",
    description: "Compare cities across the country",
    icon: FaCity,
  },
  {
    value: "metro",
    label: "Metro Areas",
    description: "Compare metropolitan areas",
    icon: FaBuilding,
  },
  {
    value: "state",
    label: "States",
    description: "Compare U.S. states",
    icon: FaFlagUsa,
  },
];

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [geographyType, setGeographyType] = useState("city");
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [comparisonReason, setComparisonReason] = useState(null);
  const [comparisonPriorities, setComparisonPriorities] = useState([]);
  const [comparisonPreferences, setComparisonPreferences] = useState({
    climate: null,
  });

  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);

  const [comparisonResult, setComparisonResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const resultsRef = useRef(null);
  const setupRef = useRef(null);

  useEffect(() => {
    async function loadInitialPlace() {
      const type = searchParams.get("type");
      const place = searchParams.get("place");

      if (!place) {
        return;
      }

      try {
        if (type === "city") {
          const result = await getCityBySlug(place);

          setGeographyType("city");
          setSelectedPlaces([result.city]);
          return;
        }

        if (type === "metro") {
          const result = await getMetrosBySlug(place);

          setGeographyType("metro");
          setSelectedPlaces([
            {
              ...result,
              place_type: "metro",
            },
          ]);
        }

        if (type === "state") {
          const result = await getStateByCode(place);

          setGeographyType("state");
          setSelectedPlaces([
            {
              ...result,
              place_type: "state",
              state_fips: result.code,
            },
          ]);
        }
      } catch (error) {
        console.error("Unable to load initial place:", error);
      }
    }

    loadInitialPlace();
  }, [searchParams]);

  const minimumPlaces = 2;
  const placesNeeded = Math.max(minimumPlaces - selectedPlaces.length, 0);
  const canCompare = placesNeeded === 0;

  const geographyLabel =
    geographyType === "city"
      ? "cities"
      : geographyType === "metro"
        ? "metro areas"
        : "states";

  function handleReset() {
    setGeographyType("city");
    setSelectedPlaces([]);
    setComparisonReason(null);
    setComparisonPriorities([]);
    setComparisonPreferences({
      climate: null,
    });
    setComparisonError(null);
    setComparisonLoading(false);
    setComparisonResult(null);
    setAiResult(null);
    setAiLoading(false);
    setAiError(null);
  }

  function getPersonalization() {
    return {
      reason: comparisonReason,
      otherReason:
        comparisonReason === "other"
          ? comparisonPreferences.otherReason || null
          : null,
      priorities: comparisonPriorities,
      preferences: {
        climate: comparisonPriorities.includes("climate")
          ? comparisonPreferences.climate
          : null,
      },
    };
  }

  async function loadAiComparison(placeIdentifiers) {
    const minimumLoadingTime = 2500;
    const startedAt = Date.now();

    setAiLoading(true);
    setAiError(null);

    try {
      const result = await getAiComparison({
        geographyType,
        placeIdentifiers,
        personalization: getPersonalization(),
      });

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(minimumLoadingTime - elapsed, 0);

      if (remaining > 0) {
        await new Promise((resolve) => {
          setTimeout(resolve, remaining);
        });
      }

      setAiResult(result);
    } catch (error) {
      console.error("Unable to load AI comparison:", error);

      setAiError(
        "The written comparison is unavailable right now. The RegionLore data is still available below.",
      );
    } finally {
      setAiLoading(false);
    }
  }

  async function handleCompare() {
    if (!canCompare) {
      return;
    }

    try {
      setComparisonLoading(true);
      setComparisonError(null);
      setComparisonResult(null);
      setAiResult(null);
      setAiError(null);

      let result;
      let placeIdentifiers;

      if (geographyType === "city") {
        placeIdentifiers = selectedPlaces.map((place) => place.slug);
        result = await getCityComparison(placeIdentifiers);
      }

      if (geographyType === "metro") {
        placeIdentifiers = selectedPlaces.map((place) => place.slug);
        result = await getMetroComparison(placeIdentifiers);
      }

      if (geographyType === "state") {
        placeIdentifiers = selectedPlaces.map((place) => place.state_fips);
        result = await getStateComparison(placeIdentifiers);
      }

      setComparisonResult(result);
      setComparisonLoading(false);

      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

      await loadAiComparison(placeIdentifiers);
    } catch (error) {
      console.error("Unable to load comparison:", error);
      setComparisonError("Unable to load this comparison. Please try again.");
    } finally {
      setComparisonLoading(false);
    }
  }

  async function handleAiRetry() {
    let placeIdentifiers;

    if (geographyType === "state") {
      placeIdentifiers = selectedPlaces.map((place) => place.state_fips);
    } else {
      placeIdentifiers = selectedPlaces.map((place) => place.slug);
    }

    await loadAiComparison(placeIdentifiers);
  }

  return (
    <main className="compare" ref={setupRef}>
      <header className="compare__header">
        <div className="compare__header-icon" aria-hidden="true">
          <FaMapLocationDot />
        </div>

        <div>
          <h1>Compare Places</h1>
          <p>
            Compare cities, metro areas, or states and focus on what matters
            most to you.
          </p>
          <p>Add a little context if you want a more focused comparison.</p>
        </div>
      </header>

      <section className="compare__section">
        <div className="compare__section-heading">
          <span className="compare__step" aria-hidden="true">
            1
          </span>

          <div>
            <h2>What do you want to compare?</h2>
            <p>Choose the type of places you want to compare.</p>
          </div>
        </div>

        <div className="compare__type-grid">
          {geographyTypes.map((type) => {
            const isSelected = geographyType === type.value;
            const TypeIcon = type.icon;

            return (
              <button
                key={type.value}
                type="button"
                className={`compare__type-card ${
                  isSelected ? "compare__type-card--selected" : ""
                }`}
                aria-pressed={isSelected}
                onClick={() => {
                  setGeographyType(type.value);
                  setSelectedPlaces([]);
                }}
              >
                <span className="compare__type-icon" aria-hidden="true">
                  <TypeIcon />
                </span>

                <span className="compare__type-content">
                  <strong>{type.label}</strong>
                  <span>{type.description}</span>
                </span>

                <span
                  className={`compare__radio ${
                    isSelected ? "compare__radio--selected" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </section>

      <section className="compare__section compare__section--spaced">
        <div className="compare__section-heading">
          <span className="compare__step" aria-hidden="true">
            2
          </span>

          <div>
            <h2>
              Choose{" "}
              {geographyType === "city"
                ? "cities"
                : geographyType === "metro"
                  ? "metro areas"
                  : "states"}
            </h2>

            <p>Add at least two places to compare.</p>
          </div>
        </div>

        <div className="compare__section-content">
          <ComparePlaceSelector
            geographyType={geographyType}
            selectedPlaces={selectedPlaces}
            onAddPlace={(place) => {
              setSelectedPlaces((currentPlaces) => [...currentPlaces, place]);
            }}
            onRemovePlace={(placeId) => {
              setSelectedPlaces((currentPlaces) =>
                currentPlaces.filter((place) => place.id !== placeId),
              );
            }}
          />
        </div>
      </section>

      <section className="compare__section compare__section--spaced">
        <div className="compare__section-heading">
          <span className="compare__step" aria-hidden="true">
            3
          </span>

          <div>
            <h2>Personalize your comparison</h2>
            <p>
              Add a little context to make your comparison more useful.
              Everything here is optional.
            </p>
          </div>
        </div>

        <div className="compare__section-content">
          <ComparePersonalization
            reason={comparisonReason}
            priorities={comparisonPriorities}
            preferences={comparisonPreferences}
            onReasonChange={setComparisonReason}
            onPrioritiesChange={setComparisonPriorities}
            onPreferencesChange={setComparisonPreferences}
          />
        </div>
      </section>

      {comparisonError && (
        <p className="compare__error" role="alert">
          {comparisonError}
        </p>
      )}

      <section className="compare__actions">
        <div>
          {!canCompare ? (
            <p className="compare__status">
              {placesNeeded === 1
                ? "1 more place needed"
                : `${placesNeeded} more places needed`}
            </p>
          ) : (
            <p className="compare__status compare__status--ready">
              Ready to compare {selectedPlaces.length} {geographyLabel}
            </p>
          )}
        </div>

        <div className="compare__action-buttons">
          <button
            type="button"
            className="compare__reset"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            type="button"
            className="compare__submit"
            disabled={!canCompare || comparisonLoading}
            onClick={handleCompare}
          >
            {comparisonLoading ? "Comparing..." : "Compare Places"}
          </button>
        </div>
      </section>

      <div ref={resultsRef} className="compare__results-anchor">
        <CompareResults
          geographyType={geographyType}
          comparisonResult={comparisonResult}
          aiResult={aiResult}
          aiLoading={aiLoading}
          aiError={aiError}
          onAiRetry={handleAiRetry}
          onEditComparison={() => {
            setupRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        />
      </div>
    </main>
  );
}

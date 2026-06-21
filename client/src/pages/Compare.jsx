import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getStates,
  getStateHistoryByCode,
  getStateEconomics,
} from "../services/statesApi.js";
import CompareTable from "../components/ui/CompareTable.jsx";
import ComparePopulationChart from "../components/ui/ComparePopulationChart.jsx";
import CompareStateLinks from "../components/ui/CompareStateLinks.jsx";

import "../styles/pages/Compare.css";

export default function Compare() {
  const [statesData, setStatesData] = useState([]);
  const [selectedStateCodes, setSelectedStateCodes] = useState([]);
  const [economicsData, setEconomicsData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStatesFromUrl = useRef(searchParams.get("states"));

  useEffect(() => {
    async function fetchStates() {
      try {
        const result = await getStates({
          sortBy: "population",
          order: "desc",
        });

        const economicsResult = await getStateEconomics();
        setEconomicsData(economicsResult.data);

        setStatesData(result.data);

        if (initialStatesFromUrl.current) {
          setSelectedStateCodes(initialStatesFromUrl.current.split(","));
        } else {
          setSelectedStateCodes([
            result.data[0]?.code || "",
            result.data[1]?.code || "",
          ]);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const histories = await Promise.all(
          selectedStateCodes.map((code) => getStateHistoryByCode(code)),
        );

        const mergedData = [];

        histories.forEach((history, index) => {
          history.forEach((point) => {
            let yearRow = mergedData.find((item) => item.year === point.year);

            if (!yearRow) {
              yearRow = { year: point.year };
              mergedData.push(yearRow);
            }

            const state = statesData.find(
              (state) => state.code === selectedStateCodes[index],
            );

            if (state) {
              yearRow[state.name] = point.population;
            }
          });
        });

        setChartData(mergedData);
      } catch (err) {
        console.log(err);
      }
    }

    if (selectedStateCodes.length > 0 && statesData.length > 0) {
      fetchChartData();
    }
  }, [selectedStateCodes, statesData]);

  useEffect(() => {
    if (selectedStateCodes.length > 0) {
      setSearchParams({
        states: selectedStateCodes.join(","),
      });
    }
  }, [selectedStateCodes, setSearchParams]);

  const selectedStates = selectedStateCodes
    .map((code) => {
      const state = statesData.find((state) => state.code === code);
      const economics = economicsData.find((item) => item.code === code);

      if (!state) return null;

      return {
        ...state,
        economics: economics || null,
      };
    })
    .filter(Boolean);

  return (
    <div className="compare">
      <div className="compare__header">
        <h1>Compare States</h1>
        <p>
          Select two to four states to compare population, growth, housing, and
          income.
        </p>
      </div>

      <div className="compare__selectors">
        {selectedStateCodes.map((code, index) => (
          <div className="compare__selector" key={index}>
            <div className="compare__selector-header">
              <label>State {index + 1}</label>

              {selectedStateCodes.length > 2 && (
                <button
                  className="compare__remove-button"
                  type="button"
                  aria-label={`Remove state ${index + 1}`}
                  onClick={() => {
                    const updatedCodes = selectedStateCodes.filter(
                      (_, i) => i !== index,
                    );
                    setSelectedStateCodes(updatedCodes);
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <select
              value={code}
              onChange={(event) => {
                const updatedCodes = [...selectedStateCodes];
                updatedCodes[index] = event.target.value;
                setSelectedStateCodes(updatedCodes);
              }}
            >
              {statesData.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          className="compare__add-button"
          type="button"
          disabled={selectedStateCodes.length >= 4}
          onClick={() => {
            const nextState = statesData.find(
              (state) => !selectedStateCodes.includes(state.code),
            );

            if (!nextState) return;

            setSelectedStateCodes([...selectedStateCodes, nextState.code]);
          }}
        >
          + Add State
        </button>
      </div>

      <div className="compare__table-section">
        <CompareTable states={selectedStates} />
      </div>

      <ComparePopulationChart data={chartData} states={selectedStates} />
      <CompareStateLinks states={selectedStates} />
    </div>
  );
}

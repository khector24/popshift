import { useEffect, useState } from "react";
import { getStates } from "../services/statesApi.js";

// import CompareStateCard from "../components/ui/CompareStateCard.jsx";
import CompareTable from "../components/ui/CompareTable.jsx";

import "../styles/pages/Compare.css";

export default function Compare() {
  const [statesData, setStatesData] = useState([]);
  const [selectedStateCodes, setSelectedStateCodes] = useState([]);

  useEffect(() => {
    async function fetchStates() {
      try {
        const result = await getStates({
          sortBy: "population",
          order: "desc",
        });

        setStatesData(result.data);
        setSelectedStateCodes([
          result.data[0]?.code || "",
          result.data[1]?.code || "",
        ]);
      } catch (err) {
        console.log(err);
      }
    }

    fetchStates();
  }, []);

  const selectedStates = selectedStateCodes
    .map((code) => statesData.find((state) => state.code === code))
    .filter(Boolean);

  return (
    <div className="compare">
      <div className="compare__header">
        <h1>Compare States</h1>
        <p>
          Select two states to compare population, growth, share, and region.
        </p>
      </div>

      <div className="compare__selectors">
        {selectedStateCodes.map((code, index) => (
          <div className="compare__selector" key={index}>
            <label>State {index + 1}</label>

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

            {selectedStateCodes.length > 2 && (
              <button
                type="button"
                onClick={() => {
                  const updatedCodes = selectedStateCodes.filter(
                    (_, i) => i !== index,
                  );
                  setSelectedStateCodes(updatedCodes);
                }}
              >
                Remove
              </button>
            )}
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

      {/* <div className="compare__cards">
        <CompareStateCard state={stateA} />
        <CompareStateCard state={stateB} />
      </div> */}

      <div className="compare__table-section">
        <CompareTable states={selectedStates} />
      </div>
    </div>
  );
}

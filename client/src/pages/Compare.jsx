import { useEffect, useState } from "react";
import { getStates } from "../services/statesApi.js";
import CompareStateCard from "../components/ui/CompareStateCard.jsx";
import "../styles/pages/Compare.css";

export default function Compare() {
  const [statesData, setStatesData] = useState([]);
  const [stateACode, setStateACode] = useState("");
  const [stateBCode, setStateBCode] = useState("");

  useEffect(() => {
    async function fetchStates() {
      try {
        const result = await getStates({
          sortBy: "population",
          order: "desc",
        });

        setStatesData(result.data);
        setStateACode(result.data[0]?.code || "");
        setStateBCode(result.data[1]?.code || "");
      } catch (err) {
        console.log(err);
      }
    }

    fetchStates();
  }, []);

  const stateA = statesData.find((state) => state.code === stateACode);
  const stateB = statesData.find((state) => state.code === stateBCode);

  return (
    <div className="compare">
      <div className="compare__header">
        <h1>Compare States</h1>
        <p>
          Select two states to compare population, growth, share, and region.
        </p>
      </div>

      <div className="compare__selectors">
        <div className="compare__selector">
          <label>State A</label>

          <select
            value={stateACode}
            onChange={(event) => setStateACode(event.target.value)}
          >
            {statesData.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className="compare__selector">
          <label>State B</label>

          <select
            value={stateBCode}
            onChange={(event) => setStateBCode(event.target.value)}
          >
            {statesData.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="compare__cards">
        <CompareStateCard state={stateA} />
        <CompareStateCard state={stateB} />
      </div>
    </div>
  );
}

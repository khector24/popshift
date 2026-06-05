import { useState, useEffect } from "react";
import "../styles/pages/Rankings.css";

function Rankings() {
  const [sortBy, setSortBy] = useState("population");
  const [viewBy, setViewBy] = useState("state");
  const [statesData, setStatesData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sortedRankings = [...statesData].sort((a, b) => {
    return b[sortBy] - a[sortBy];
  });

  useEffect(() => {
    async function fetchStates() {
      try {
        const response = await fetch("http://localhost:3000/api/states");

        if (!response.ok) {
          throw new Error("Failed to fetch states");
        }

        const data = await response.json();
        setStatesData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStates();
  }, []);

  return (
    <div className="rankings">
      <h1>State Rankings</h1>

      <div className="rankings__controls">
        <div className="rankings__control">
          <label htmlFor="sort">Sort By</label>
          <select
            name="sort"
            id="sort"
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
            }}
          >
            <option value="population">Population</option>
            <option value="growth">Growth</option>
            <option value="share">Share</option>
          </select>
        </div>

        <div className="rankings__control">
          <label htmlFor="view">View By</label>
          <select
            id="view"
            name="view"
            value={viewBy}
            onChange={(event) => setViewBy(event.target.value)}
          >
            <option value="state">State</option>
            <option value="region">Region</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading state data...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="rankings__table">
          <div className="rankings__row rankings__header">
            <span>Rank</span>
            <span>State</span>
            <span>Population</span>
            <span>Growth</span>
            <span>Share</span>
            <span>Region</span>
          </div>

          {sortedRankings.map((item, index) => (
            <div className="rankings__row" key={item.state}>
              <span>{index + 1}</span>
              <span>{item.state}</span>
              <span>{item.population}M</span>
              <span>{item.growth}%</span>
              <span>{item.share}%</span>
              <span>{item.region}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rankings;

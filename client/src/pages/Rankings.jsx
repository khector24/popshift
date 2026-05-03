import { useState } from "react";
import "../styles/pages/Rankings.css";

const rankingsData = [
  {
    state: "California",
    region: "West",
    population: 39,
    growth: -0.3,
    share: 11.8,
  },
  { state: "Texas", region: "South", population: 30, growth: 1.5, share: 9.2 },
  {
    state: "Florida",
    region: "South",
    population: 22,
    growth: 1.2,
    share: 6.8,
  },
  {
    state: "New York",
    region: "Northeast",
    population: 19,
    growth: -0.8,
    share: 5.7,
  },
  {
    state: "Pennsylvania",
    region: "Northeast",
    population: 13,
    growth: -0.1,
    share: 3.9,
  },
  {
    state: "Illinois",
    region: "Midwest",
    population: 12,
    growth: -0.6,
    share: 3.7,
  },
  {
    state: "Ohio",
    region: "Midwest",
    population: 11.8,
    growth: 0.2,
    share: 3.5,
  },
  {
    state: "Georgia",
    region: "South",
    population: 11,
    growth: 1.1,
    share: 3.3,
  },
  {
    state: "North Carolina",
    region: "South",
    population: 10.8,
    growth: 1.3,
    share: 3.2,
  },
  {
    state: "Arizona",
    region: "West",
    population: 7.5,
    growth: 1.4,
    share: 2.3,
  },
];

function Rankings() {
  const [sortBy, setSortBy] = useState("population");
  const [viewBy, setViewBy] = useState("state");
  const sortedRankings = [...rankingsData].sort((a, b) => {
    return b[sortBy] - a[sortBy];
  });

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
    </div>
  );
}

export default Rankings;

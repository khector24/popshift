import { useState, useEffect } from "react";
import "../styles/pages/Rankings.css";
import { getStates } from "../services/statesApi.js";

function Rankings() {
  const [sortBy, setSortBy] = useState("population");
  const [order, setOrder] = useState("desc");
  const [viewBy, setViewBy] = useState("state");
  const [region, setRegion] = useState("");

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const [statesData, setStatesData] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStates() {
      try {
        setLoading(true);
        setError("");

        const data = await getStates({
          sortBy,
          order,
          region,
          search,
          limit,
          page,
        });
        setStatesData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStates();
  }, [sortBy, order, region, search, limit, page]);

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
              setPage(1);
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

        <div className="rankings__control">
          <label htmlFor="order">Order</label>
          <select
            id="order"
            name="order"
            value={order}
            onChange={(event) => {
              setOrder(event.target.value);
              setPage(1);
            }}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div className="rankings__control">
          <label htmlFor="region">Region</label>
          <select
            id="region"
            name="region"
            value={region}
            onChange={(event) => {
              setRegion(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All Regions</option>
            <option value="South">South</option>
            <option value="Northeast">Northeast</option>
            <option value="West">West</option>
            <option value="Midwest">Midwest</option>
          </select>
        </div>

        <div className="rankings__control">
          <label htmlFor="search">Search</label>

          <input
            id="search"
            name="search"
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search states..."
          />
        </div>

        <div className="rankings__control">
          <label htmlFor="limit">Limit</label>

          <select
            id="limit"
            name="limit"
            value={limit}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading state data...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="rankings__table">
          <div className="rankings__row rankings__header">
            <span>Rank</span>

            {viewBy === "state" ? (
              <>
                <span>State</span>
                <span>Population</span>
                <span>Growth</span>
                <span>Share</span>
                <span>Region</span>
              </>
            ) : (
              <>
                <span>Region</span>
                <span>State</span>
                <span>Population</span>
                <span>Growth</span>
                <span>Share</span>
              </>
            )}
          </div>

          {statesData.map((item, index) => (
            <div className="rankings__row" key={item.state}>
              <span>{(page - 1) * limit + index + 1}</span>

              {viewBy === "state" ? (
                <>
                  <span>{item.state}</span>
                  <span>{item.population}M</span>
                  <span>{item.growth}%</span>
                  <span>{item.share}%</span>
                  <span>{item.region}</span>
                </>
              ) : (
                <>
                  <span>{item.region}</span>
                  <span>{item.state}</span>
                  <span>{item.population}M</span>
                  <span>{item.growth}%</span>
                  <span>{item.share}%</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rankings__pagination">
        <button
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={statesData.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Rankings;

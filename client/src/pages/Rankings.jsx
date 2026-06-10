import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Rankings.css";
import { getStates } from "../services/statesApi.js";
import { formatGrowth } from "../utils/growthUtils.js";

function Rankings() {
  const [sortBy, setSortBy] = useState("population");
  const [order, setOrder] = useState("desc");
  const [viewBy, setViewBy] = useState("state");
  const [region, setRegion] = useState("");

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const [statesData, setStatesData] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStates() {
      try {
        setLoading(true);
        setError("");

        const result = await getStates({
          sortBy,
          order,
          region,
          search,
          limit,
          page,
        });

        setStatesData(result.data);
        setPagination(result.pagination);
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
                <span>Year</span>
                <span>Code</span>
              </>
            ) : (
              <>
                <span>Region</span>
                <span>State</span>
                <span>Population</span>
                <span>Growth</span>
                <span>Share</span>
                <span>Year</span>
                <span>Code</span>
              </>
            )}
          </div>

          {statesData.map((state, index) => {
            const { growthValue, growthClassName } = formatGrowth(state.growth);

            return (
              <div
                className="rankings__row"
                key={state.code}
                onClick={() => navigate(`/states/${state.code}`)}
              >
                <span>{(page - 1) * limit + index + 1}</span>

                {viewBy === "state" ? (
                  <>
                    <span>{state.name}</span>
                    <span>{state.population.toLocaleString()}</span>
                    <span className={growthClassName}>{growthValue}</span>
                    <span>{state.share}%</span>
                    <span>{state.region}</span>
                    <span>{state.year}</span>
                    <span>{state.code}</span>
                  </>
                ) : (
                  <>
                    <span>{state.region}</span>
                    <span>{state.name}</span>
                    <span>{state.population.toLocaleString()}</span>
                    <span className={growthClassName}>{growthValue}</span>
                    <span>{state.share}%</span>
                    <span>{state.year}</span>
                    <span>{state.code}</span>
                  </>
                )}
              </div>
            );
          })}
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

        <span>
          Page {page} of {pagination?.totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={pagination && page >= pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Rankings;

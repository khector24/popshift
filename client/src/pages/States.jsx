import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getStates } from "../services/statesApi.js";
import { formatGrowth } from "../utils/growthUtils.js";

import StatusMessage from "../components/ui/StatusMessage.jsx";
import InfoTooltip from "../components/ui/InfoTooltip.jsx";

import "../styles/pages/States.css";

export default function States() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "population",
  );
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 5);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [statesData, setStatesData] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    setSearchParams(
      {
        sortBy,
        order,
        region,
        search,
        limit: String(limit),
        page: String(page),
      },
      { replace: true },
    );
  }, [sortBy, order, region, search, limit, page, setSearchParams]);

  return (
    <div className="states">
      <div className="states__header-block">
        <h1>States</h1>

        <p>Explore population, growth, and regional data for all 50 states.</p>
      </div>

      <div className="states__controls">
        <div className="states__control">
          <label htmlFor="sort">Sort By</label>

          <select
            id="sort"
            name="sort"
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

        <div className="states__control">
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

        <div className="states__control">
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

        <div className="states__control">
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

        <div className="states__control">
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

      {loading && (
        <StatusMessage
          type="loading"
          title="Loading states..."
          message="Fetching the latest state population data."
        />
      )}

      {error && (
        <StatusMessage
          type="error"
          title="Unable to load states"
          message={error}
        />
      )}

      {!loading && !error && (
        <>
          {statesData.length === 0 ? (
            <StatusMessage
              type="info"
              title="No states found"
              message="Try a different search term or adjust your filters."
            />
          ) : (
            <>
              <div className="states__table">
                <div className="states__row states__header">
                  <span>Rank</span>
                  <span>State</span>
                  <span>Population</span>

                  <span className="states__tooltip-label">
                    Growth
                    <InfoTooltip text="Growth compares the 2025 population estimate against the 2024 estimate." />
                  </span>

                  <span className="states__tooltip-label">
                    Share
                    <InfoTooltip text="Share is the state's percentage of the tracked U.S. population total." />
                  </span>

                  <span>Region</span>
                  <span>Year</span>
                  <span>Code</span>
                </div>

                {statesData.map((state, index) => {
                  const { growthValue, growthClassName } = formatGrowth(
                    state.growth,
                  );

                  return (
                    <div
                      className="states__row"
                      key={state.code}
                      onClick={() =>
                        navigate(`/states/${state.code}`, {
                          state: {
                            from: `/states${window.location.search}`,
                            label: "States",
                          },
                        })
                      }
                    >
                      <span>{(page - 1) * limit + index + 1}</span>
                      <span>{state.name}</span>
                      <span>{state.population.toLocaleString()}</span>
                      <span className={growthClassName}>{growthValue}</span>
                      <span>{state.share}%</span>
                      <span>{state.region}</span>
                      <span>{state.year}</span>
                      <span>{state.code}</span>
                    </div>
                  );
                })}
              </div>

              <div className="states__pagination">
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
            </>
          )}
        </>
      )}
    </div>
  );
}

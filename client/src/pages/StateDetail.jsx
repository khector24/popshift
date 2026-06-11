import { getStateByCode } from "../services/statesApi.js";
import { formatGrowth } from "../utils/growthUtils.js";
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

import DetailStatCard from "../components/ui/DetailStatCard.jsx";
import StatusMessage from "../components/ui/StatusMessage.jsx";

import "../styles/pages/StateDetail.css";

function StateDetail() {
  const { code } = useParams();
  const location = useLocation();

  const [stateData, setStateData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchState() {
      try {
        const result = await getStateByCode(code);

        setStateData(result);
      } catch (err) {
        console.error(err);

        setError(
          "State not found. Please check the state code or return to rankings.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchState();
  }, [code]);

  const { growthValue, growthClassName, growthSentence } = formatGrowth(
    stateData?.growth,
  );

  return (
    <div className="state-detail">
      <Link className="state-detail__back" to={`/rankings${location.search}`}>
        ← Back to Rankings
      </Link>

      {loading && (
        <StatusMessage
          type="loading"
          title="Loading state data"
          message="Please wait while we fetch the latest information."
        />
      )}
      {error && (
        <StatusMessage
          type="error"
          title="Unable to load state"
          message={error}
        />
      )}

      {!loading &&
        !error &&
        (!stateData ? (
          "State not found"
        ) : (
          <div>
            <div className="state-detail__header">
              <h1>{stateData.name}</h1>
              <p>
                {stateData.region} <span> &bull; </span> Census {stateData.year}{" "}
                <span> &bull; </span> State Code {stateData.code}
              </p>
            </div>
            <div className="state-detail-grid">
              <DetailStatCard
                label="Population"
                value={stateData.population.toLocaleString()}
              />
              <DetailStatCard
                label="Yearly Growth"
                value={growthValue}
                valueClassName={growthClassName}
              />
              <DetailStatCard
                label="U.S. Share"
                value={`${stateData.share}%`}
              />
              <DetailStatCard label="Region" value={stateData.region} />
            </div>

            <section className="state-detail__about">
              <h2>About {stateData.name}</h2>
              <p>
                {stateData.name} is part of the {stateData.region} region and
                accounts for {stateData.share}% of the tracked U.S. population
                in the {stateData.year} Census estimate. Its year-over-year
                population change was{" "}
                {stateData.growth !== null
                  ? `${growthSentence}`
                  : "not available"}
                .
              </p>
            </section>
          </div>
        ))}
    </div>
  );
}

export default StateDetail;

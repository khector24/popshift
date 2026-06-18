import {
  getStateByCode,
  getStateHistoryByCode,
} from "../services/statesApi.js";
import { formatGrowth } from "../utils/growthUtils.js";
import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

import DetailStatCard from "../components/ui/DetailStatCard.jsx";
import StatusMessage from "../components/ui/StatusMessage.jsx";
import PopulationTimeline from "../components/ui/PopulationTimeline.jsx";

import "../styles/pages/StateDetail.css";

function StateDetail() {
  const { code } = useParams();
  const location = useLocation();

  const [stateData, setStateData] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchState() {
      try {
        const result = await getStateByCode(code);
        const historyResult = await getStateHistoryByCode(code);

        setHistory(historyResult);
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

  const firstHistoryItem = history[0];

  const historyWithGrowth = [...history].reverse().map((item) => {
    if (item.year === firstHistoryItem?.year) {
      return {
        ...item,
        changeText: "Baseline",
      };
    }

    const growthSinceBaseline = Number(
      (
        ((item.population - firstHistoryItem.population) /
          firstHistoryItem.population) *
        100
      ).toFixed(1),
    );

    return {
      ...item,
      changeText: `${growthSinceBaseline > 0 ? "+" : ""}${growthSinceBaseline}%`,
    };
  });

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
          <main className="state-detail__content">
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

            <section className="state-detail__history">
              <h2>{stateData.name} Population Over Time</h2>

              {history.length > 0 ? (
                <div className="state-detail__history-grid">
                  <div className="state-detail__history-chart">
                    <PopulationTimeline
                      title="Population trend"
                      data={history}
                      showSource={false}
                      showLabels
                    />
                  </div>
                  <div className="state-detail__history-list">
                    <div className="state-detail__history-row state-detail__history-header">
                      <span>Year</span>
                      <span>Population</span>
                      <span>Change since {firstHistoryItem?.year}</span>
                    </div>

                    {historyWithGrowth.map((item) => (
                      <div
                        className="state-detail__history-row"
                        key={item.year}
                      >
                        <span className="state-detail__history-year">
                          {item.year}
                        </span>

                        <span className="state-detail__history-population">
                          {item.population.toLocaleString()}
                        </span>

                        <span className="state-detail__history-change">
                          {item.changeText}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="state-detail__history-empty">
                  Population history is not available for this state.
                </p>
              )}
            </section>
          </main>
        ))}
    </div>
  );
}

export default StateDetail;

import {
  getStateByCode,
  getStateHistoryByCode,
  getStateEconomicsByCode,
  getStateMigrationByCode,
} from "../services/statesApi.js";
import { formatGrowth } from "../utils/growthUtils.js";
import { formatNationalContext } from "../utils/nationalContextUtils.js";

import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";

import DetailStatCard from "../components/ui/DetailStatCard.jsx";
import StatusMessage from "../components/ui/StatusMessage.jsx";
import PopulationTimeline from "../components/ui/PopulationTimeline.jsx";
import EconomicStatCard from "../components/ui/EconomicStatCard.jsx";
import MigrationFlowCard from "../components/ui/MigrationFlowCard.jsx";
import InfoToolTip from "../components/ui/InfoTooltip.jsx";

import "../styles/pages/StateDetail.css";

import { FaWallet, FaBuilding, FaHouse } from "react-icons/fa6";
import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from "react-icons/fa";

function StateDetail() {
  const { code } = useParams();
  const location = useLocation();
  const backLink = location.state?.from || `/rankings${location.search}`;
  const backLabel = location.state?.label || "Rankings";

  const [stateData, setStateData] = useState(null);
  const [history, setHistory] = useState([]);
  const [stateEconomics, setStateEconomics] = useState(null);
  const [stateMigration, setStateMigration] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchState() {
      try {
        const result = await getStateByCode(code);
        const historyResult = await getStateHistoryByCode(code);
        const economicsResult = await getStateEconomicsByCode(code);
        const migrationResult = await getStateMigrationByCode(code);

        setHistory(historyResult);
        setStateData(result);
        setStateEconomics(economicsResult);
        setStateMigration(migrationResult);
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
      return { ...item, changeText: "Baseline" };
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

  const incomeContext = stateEconomics?.data
    ? formatNationalContext(
        stateEconomics.data.nationalContext.incomeVsNational,
        "income",
      )
    : null;

  const rentContext = stateEconomics?.data
    ? formatNationalContext(
        stateEconomics.data.nationalContext.rentVsNational,
        "cost",
      )
    : null;

  const homeValueContext = stateEconomics?.data
    ? formatNationalContext(
        stateEconomics.data.nationalContext.homeValueVsNational,
        "cost",
      )
    : null;

  const topInboundFlows = stateMigration?.data?.inbound?.slice(0, 3) || [];
  const topOutboundFlows = stateMigration?.data?.outbound?.slice(0, 3) || [];
  const totalInbound = stateMigration?.data?.totalInbound ?? 0;
  const totalOutbound = stateMigration?.data?.totalOutbound ?? 0;
  const netMigration = stateMigration?.data?.netMigration ?? 0;

  const netMigrationTone =
    netMigration > 0 ? "positive" : netMigration < 0 ? "negative" : "neutral";

  const netMigrationLabel =
    netMigration > 0 ? "Positive" : netMigration < 0 ? "Negative" : "Neutral";

  const netMigrationAmount = Math.abs(netMigration).toLocaleString();

  return (
    <div className="state-detail">
      <Link className="state-detail__back" to={backLink}>
        ← Back to {backLabel}
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
        (!stateData || !stateEconomics ? (
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

            <section className="state-detail__economics">
              <h2>Economic Snapshot</h2>
              <p>{stateEconomics.year} ACS estimates</p>

              <div className="state-economics-grid">
                <EconomicStatCard
                  label="Median Household Income"
                  value={`$${stateEconomics.data.medianIncome.toLocaleString()}`}
                  context={incomeContext}
                  icon={<FaWallet />}
                  variant="green"
                />

                <EconomicStatCard
                  label="Median Gross Rent"
                  value={`$${stateEconomics.data.medianRent.toLocaleString()} / mo`}
                  context={rentContext}
                  icon={<FaBuilding />}
                  variant="purple"
                />

                <EconomicStatCard
                  label="Median Home Value"
                  value={`$${stateEconomics.data.medianHomeValue.toLocaleString()}`}
                  context={homeValueContext}
                  icon={<FaHouse />}
                  variant="blue"
                />
              </div>
            </section>

            <section className="state-detail__migration">
              <div>
                <h2>
                  Migration Snapshot{" "}
                  <InfoToolTip
                    symbol="i"
                    text="Estimates of moves between U.S. states during 2024. Inbound states are where residents came from, while outbound states are where residents moved to."
                  />
                </h2>

                <p>2024 State-to-State Migration Estimates</p>
              </div>

              <div className="state-migration-grid">
                <MigrationFlowCard
                  label="Top states people moved from"
                  migrationType="inbound"
                  flows={topInboundFlows}
                  totalMovers={totalInbound}
                />

                <MigrationFlowCard
                  label="Top states people moved to"
                  migrationType="outbound"
                  flows={topOutboundFlows}
                  totalMovers={totalOutbound}
                />
              </div>

              {stateMigration?.data && (
                <div className="state-detail__migration-net">
                  <div className="state-detail__migration-net-summary">
                    <span
                      className={`state-detail__migration-net-icon state-detail__migration-net-icon--${netMigrationTone}`}
                    >
                      {netMigrationTone === "positive" ? (
                        <FaRegArrowAltCircleUp />
                      ) : (
                        <FaRegArrowAltCircleDown />
                      )}
                    </span>

                    <span className="state-detail__migration-net-label">
                      Net migration:
                    </span>

                    <span
                      className={`state-detail__migration-net-badge state-detail__migration-net-badge--${netMigrationTone}`}
                    >
                      {netMigrationLabel}
                    </span>

                    <span className="state-detail__migration-net-divider"></span>

                    <span>
                      {netMigration > 0 && (
                        <>
                          {stateData.name} gained{" "}
                          <span
                            className={`state-detail__migration-net-number state-detail__migration-net-number--${netMigrationTone}`}
                          >
                            {netMigrationAmount}
                          </span>{" "}
                          more people than it lost to other states.
                        </>
                      )}

                      {netMigration < 0 && (
                        <>
                          {stateData.name} lost{" "}
                          <span
                            className={`state-detail__migration-net-number state-detail__migration-net-number--${netMigrationTone}`}
                          >
                            {netMigrationAmount}
                          </span>{" "}
                          more people than it gained from other states.
                        </>
                      )}

                      {netMigration === 0 && (
                        <>
                          {stateData.name} had no net migration change with
                          other states.
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}
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

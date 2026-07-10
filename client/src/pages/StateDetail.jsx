import {
  getStateByCode,
  getStateHistoryByCode,
  getStateEconomicsByCode,
  getStateMigrationByCode,
  getStateEducationByCode,
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
import MigrationTimeline from "../components/ui/MigrationTimeline.jsx";
import MigrationHistoryTable from "../components/ui/MigrationHistoryTable.jsx";
import EducationSnapshot from "../components/ui/EducationSnapshot.jsx";
import NetMigrationSummary from "../components/ui/NetMigrationSummary.jsx";

import "../styles/pages/StateDetail.css";

import { FaWallet, FaBuilding, FaHouse } from "react-icons/fa6";

function StateDetail() {
  const { code } = useParams();
  const location = useLocation();
  const backLink = location.state?.from || `/states${location.search}`;
  const backLabel = location.state?.label || "States";

  const [stateData, setStateData] = useState(null);
  const [history, setHistory] = useState([]);
  const [stateEconomics, setStateEconomics] = useState(null);
  const [stateMigration, setStateMigration] = useState(null);
  const [stateEducation, setStateEducation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchState() {
      try {
        const result = await getStateByCode(code);
        const historyResult = await getStateHistoryByCode(code);
        const economicsResult = await getStateEconomicsByCode(code);
        const migrationResult = await getStateMigrationByCode(code);
        const educationResult = await getStateEducationByCode(code);

        setHistory(historyResult);
        setStateData(result);
        setStateEconomics(economicsResult);
        setStateMigration(migrationResult);
        setStateEducation(educationResult);
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

  const latestMigration = stateMigration?.data.years.at(-1);

  const topInboundFlows = latestMigration?.inbound?.slice(0, 3) || [];
  const topOutboundFlows = latestMigration?.outbound?.slice(0, 3) || [];
  const totalInbound = latestMigration?.totalInbound ?? 0;
  const totalOutbound = latestMigration?.totalOutbound ?? 0;
  const netMigration = latestMigration?.netMigration ?? 0;

  const migrationHistory = stateMigration?.data?.years || [];

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

            {stateEducation && (
              <EducationSnapshot
                education={stateEducation.data}
                national={stateEducation.national}
                year={stateEducation.year}
                metadata={stateEducation.metadata}
              />
            )}

            <section className="state-detail__migration">
              <div>
                <h2>
                  Migration Snapshot{" "}
                  <InfoToolTip
                    symbol="i"
                    text={`Estimates of moves between U.S. states 
                      during ${latestMigration?.year}. Inbound states are 
                      where residents came from, while outbound states are where residents moved to.`}
                  />
                </h2>
                <p>
                  {latestMigration?.year} State-to-State Migration Estimates
                </p>
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
                  <NetMigrationSummary
                    geographyName={stateData.name}
                    netMigration={netMigration}
                  />
                </div>
              )}
            </section>

            {migrationHistory.length > 0 && (
              <section className="state-detail__migration-history">
                <h2>{stateData.name} Migration Over Time</h2>

                <div className="state-detail__history-grid">
                  <div className="state-detail__history-chart">
                    <MigrationTimeline
                      title="Net migration trend"
                      data={migrationHistory}
                    />
                  </div>

                  <div className="state-detail__history-list">
                    <MigrationHistoryTable data={migrationHistory} />
                  </div>
                </div>
              </section>
            )}

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

import { useState, useEffect } from "react";

import StatCard from "../components/ui/StatCard";
import MoverSection from "../components/ui/MoverSection";
import PopulationTimeline from "../components/ui/PopulationTimeline.jsx";
import PopulationChangeMap from "../components/ui/PopulationChangeMap.jsx";
import InfoTooltip from "../components/ui/InfoTooltip.jsx";

import { getDashboardSummary } from "../services/statesApi.js";
import {
  formatPopulation,
  formatPopulationChange,
} from "../utils/formatNumbers.js";
import "../styles/pages/Dashboard.css";

import { FaTrophy, FaChartLine, FaStar } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

function Dashboard() {
  const availableYears = [2020, 2021, 2022, 2023, 2024, 2025];

  const [summaryData, setSummaryData] = useState({});

  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2025);

  useEffect(() => {
    async function fetchDashboardSummary() {
      try {
        const result = await getDashboardSummary({ startYear, endYear });
        setSummaryData(result);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDashboardSummary();
  }, [startYear, endYear]);

  const dashboardStats = [
    {
      label: "U.S. Population",
      value: formatPopulation(summaryData.totalPopulation),
      subtitle: summaryData.totalPopulationChange
        ? `${formatPopulationChange(summaryData.totalPopulationChange)} since ${startYear}`
        : "",
      variant: "purple",
      icon: <FaPeopleGroup />,
    },
    {
      label: "Most Populous State",
      value: summaryData.topState?.name || "Loading...",
      subtitle: summaryData.topState
        ? `${formatPopulation(summaryData.topState.population)} people`
        : "",
      variant: "blue",
      icon: <FaTrophy />,
    },
    {
      label: "Growth Leader",
      value: summaryData.growthLeader?.name || "Loading...",
      subtitle: summaryData.growthLeader
        ? `+${summaryData.growthLeader.growth}% since ${startYear}`
        : "",
      variant: "green",
      icon: <FaChartLine />,
    },
    {
      label: "Biggest Population Gain",
      value: summaryData.populationGainLeader?.name || "Loading...",
      subtitle: summaryData.populationGainLeader
        ? `${formatPopulationChange(summaryData.populationGainLeader.populationChange)} since ${startYear}`
        : "",
      variant: "orange",
      icon: <FaStar />,
    },
  ];

  const topGainers = summaryData.topGainers || [];
  const topDecliners = summaryData.topDecliners || [];

  const totalPopulation = summaryData.totalPopulation || 331000000;
  const populationByRegion = summaryData.populationByRegion || {};
  const regionRows = Object.entries(populationByRegion);

  const regionColors = ["#8b5cf6", "#3b82f6", "#4ade80", "#fb923c", "#94a3b8"];

  let currentPercent = 0;

  const donutGradient = regionRows
    .map(([, population], index) => {
      const percentage = (population / totalPopulation) * 100;
      const start = currentPercent;
      const end = currentPercent + percentage;

      currentPercent = end;

      return `${regionColors[index]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="dashboard">
      <section className="dashboard__top">
        <div className="dashboard__header">
          <h1>U.S. Population Dashboard</h1>
          <p>Explore key population trends across the United States.</p>
        </div>

        <div className="dashboard__controls">
          <div className="dashboard__control">
            <label htmlFor="start-year">Start Year</label>
            <select
              id="start-year"
              name="start-year"
              value={startYear}
              onChange={(event) => setStartYear(Number(event.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year} disabled={year >= endYear}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="dashboard__control">
            <label htmlFor="end-year">End Year</label>
            <select
              id="end-year"
              name="end-year"
              value={endYear}
              onChange={(event) => setEndYear(Number(event.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year} disabled={year <= startYear}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="dashboard__stats">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            subtitle={stat.subtitle}
            variant={stat.variant}
            icon={stat.icon}
          />
        ))}
      </section>

      <section className="dashboard__analytics">
        <div className="dashboard__map-panel dashboard__panel">
          <h2>
            Population Change by State
            <InfoTooltip
              text={`Colors show each state's percentage population change from ${startYear} to ${endYear}.`}
            />
          </h2>
          <p className="dashboard__map-range">{`${startYear} to ${endYear}`}</p>
          <PopulationChangeMap states={summaryData.states || []} />

          <p className="dashboard__map-scale-label">Population Change (%)</p>
        </div>

        <div className="dashboard__side-panel dashboard__panel">
          <h2>Top Movers {`(${startYear} - ${endYear})`}</h2>

          <div className="dashboard__movers">
            <MoverSection
              title="Biggest Gains"
              states={topGainers}
              type="positive"
            />
            <MoverSection
              title="Biggest Declines"
              states={topDecliners}
              type="negative"
            />
          </div>
        </div>
      </section>

      <section className="dashboard__bottom-grid">
        <div className="dashboard__timeline dashboard__panel">
          <PopulationTimeline
            title="U.S. Population Over Time"
            data={summaryData.populationTimeline || []}
            fixedDomain={[320000000, 340000000]}
            showLabels
          />
        </div>

        <div className="dashboard__region-panel dashboard__panel">
          <h2>Population by Region ({endYear})</h2>

          <div className="dashboard__region-content">
            <div
              className="dashboard__region-donut"
              style={{ background: `conic-gradient(${donutGradient})` }}
            >
              <div className="dashboard__region-donut-center">
                <strong>{(totalPopulation / 1000000).toFixed(1)}M</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="dashboard__region-list">
              {regionRows.map(([region, population], index) => (
                <div className="dashboard__region-row" key={region}>
                  <span className="dashboard__region-name">
                    <span
                      className="dashboard__region-dot"
                      style={{ backgroundColor: regionColors[index] }}
                    ></span>
                    {region}
                  </span>

                  <span>
                    {((population / totalPopulation) * 100).toFixed(1)}%
                  </span>
                  <span>{Math.round(population / 1000000)}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard__explore-link">
        <span className="dashboard__explore-icon">💡</span>

        <p>
          Explore the <a href="/rankings">Rankings</a> page to dive deeper into
          state-by-state data.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;

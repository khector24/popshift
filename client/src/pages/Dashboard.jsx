import { useState, useEffect } from "react";
import StatCard from "../components/ui/StatCard";
import MoverSection from "../components/ui/MoverSection";
import { getDashboardSummary } from "../services/statesApi.js";
import "../styles/pages/Dashboard.css";

function Dashboard() {
  const availableYears = [2020, 2021, 2022, 2023];

  const [summaryData, setSummaryData] = useState({});

  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2023);

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
      value: summaryData.totalPopulation?.toLocaleString() || "Loading...",
    },
    {
      label: "Most Populous State",
      value: summaryData.topState?.name || "Loading...",
    },
    {
      label: "Growth Leader",
      value: summaryData.growthLeader?.name || "Loading...",
    },
    {
      label: "Biggest Population Gain",
      value: summaryData.populationGainLeader?.name || "Loading...",
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
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="dashboard__analytics">
        <div className="dashboard__map-panel dashboard__panel">
          <h2>Population Change by State</h2>
          <div className="dashboard__placeholder">U.S. Map Visualization</div>
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
          <h2>U.S. Population Over Time</h2>

          <div className="dashboard__timeline-chart">
            <div className="dashboard__timeline-line"></div>

            <div className="dashboard__timeline-labels">
              <span>2020</span>
              <span>2021</span>
              <span>2022</span>
              <span>2023</span>
            </div>
          </div>
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
    </div>
  );
}

export default Dashboard;

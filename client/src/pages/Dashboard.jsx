import { useState } from "react";
import StatCard from "../components/ui/StatCard";
import "../styles/pages/Dashboard.css";

const dashboardStats = [
  { label: "U.S. Population", value: "331M" },
  { label: "Top State", value: "California" },
  { label: "Growth Leader", value: "Texas" },
  { label: "Biggest Share Gain", value: "+1.2%" },
];

function Dashboard() {
  const availableYears = [2020, 2021, 2022, 2023];

  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2023);

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
          <h2>Top Movers</h2>
          <div className="dashboard__movers">
            <div className="dashboard__movers-section">
              <h3>Biggest Gains</h3>

              <div className="dashboard__mover-row">
                <span>Texas</span>
                <span>+4.7M</span>
              </div>

              <div className="dashboard__mover-row">
                <span>Florida</span>
                <span>+3.8M</span>
              </div>
            </div>

            <div className="dashboard__movers-section">
              <h3>Biggest Declines</h3>

              <div className="dashboard__mover-row dashboard__mover-row--negative">
                <span>California</span>
                <span>-4.7M</span>
              </div>

              <div className="dashboard__mover-row dashboard__mover-row--negative">
                <span>New York</span>
                <span>-3.8M</span>
              </div>
            </div>
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
          <h2>Population by Region</h2>
          <div className="dashboard__region-list">
            <div className="dashboard__region-row">
              <span>South</span>
              <span>38%</span>
            </div>

            <div className="dashboard__region-row">
              <span>West</span>
              <span>24%</span>
            </div>

            <div className="dashboard__region-row">
              <span>Midwest</span>
              <span>21%</span>
            </div>

            <div className="dashboard__region-row">
              <span>Northeast</span>
              <span>17%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

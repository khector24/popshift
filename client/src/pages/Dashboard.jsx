import StatCard from "../components/ui/StatCard";
import "../styles/pages/Dashboard.css";

const dashboardStats = [
  { label: "U.S. Population", value: "331M" },
  { label: "Top State", value: "California" },
  { label: "Growth Leader", value: "Texas" },
  { label: "Biggest Share Gain", value: "+1.2%" },
];

function Dashboard() {
  return (
    <div className="dashboard">
      <section className="dashboard__header">
        <h1>U.S. Population Dashboard</h1>
        <p>Explore key population trends across the United States.</p>
      </section>

      <section className="dashboard__controls">
        <div className="dashboard__control">
          <label htmlFor="metric">Metric</label>
          <select id="metric" name="metric">
            <option value="population">Population</option>
            <option value="growth">Growth</option>
            <option value="share">Share</option>
          </select>
        </div>

        <div className="dashboard__control">
          <label htmlFor="start-year">Start Year</label>
          <select id="start-year" name="start-year">
            <option>2020</option>
            <option>2021</option>
            <option>2022</option>
            <option>2023</option>
          </select>
        </div>

        <div className="dashboard__control">
          <label htmlFor="end-year">End Year</label>
          <select id="end-year" name="end-year">
            <option>2020</option>
            <option>2021</option>
            <option>2022</option>
            <option>2023</option>
          </select>
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
          <div className="dashboard__placeholder">Top movers list</div>
        </div>
      </section>

      <section className="dashboard__bottom-grid">
        <div className="dashboard__timeline dashboard__panel">
          <h2>U.S. Population Over Time</h2>
          <div className="dashboard__placeholder">Timeline Chart</div>
        </div>

        <div className="dashboard__region-panel dashboard__panel">
          <h2>Population by Region</h2>
          <div className="dashboard__placeholder">Region Chart</div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;

import StatCard from "../components/ui/StatCard";

const dashboardStats = [
  { label: "U.S. Population", value: "331M", type: "neutral" },
  { label: "Top State", value: "California", type: "neutral" },
  { label: "Growth Leader", value: "Texas", type: "positive" },
  { label: "Biggest Share Gain", value: "+1.2%", type: "positive" },
];

function Dashboard() {
  return (
    <div className="dashboard">
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
            <option>2010</option>
            <option>2015</option>
            <option>2020</option>
          </select>
        </div>

        <div className="dashboard__control">
          <label htmlFor="end-year">End Year</label>
          <select id="end-year" name="end-year">
            <option>2020</option>
            <option>2023</option>
            <option>2025</option>
          </select>
        </div>
      </section>

      <section className="dashboard__stats">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="dashboard__main">
        <div className="dashboard__map">Map Placeholder</div>
        <div className="dashboard__side-panel">Side Panel Placeholder</div>
      </section>

      <section className="dashboard__chart">
        <h2>Chart Placeholder</h2>
      </section>
    </div>
  );
}

export default Dashboard;

import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import "../styles/pages/Home.css";

const stats = [
  { label: "Total Population", value: "331M" },
  { label: "Fastest Growth", value: "Texas" },
  { label: "Biggest Gain", value: "Florida" },
  { label: "Biggest Loss", value: "New York" },
];

function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section className="home__section">
        <h1 className="home__title">PopShift</h1>

        <p className="home__subtitle">
          How America shifted, state by state
        </p>

        <p className="home__desc">
          Explore population trends across the United States from 2010 to 2025.
        </p>

        <Button text="Explore Dashboard" variant="primary" />
      </section>

      {/* STATS */}
      <section className="home__section">
        <h2 className="home__section-title">Key Stats</h2>

        <div className="home__grid">
          {stats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="home__section">
        <h2 className="home__section-title">Why It Matters</h2>

        <p className="home__muted">
          Population shifts impact key areas of American life:
        </p>

        <ul className="home__list">
          <li>Migration patterns</li>
          <li>Economic growth</li>
          <li>Political representation</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="home__section">
        <h2 className="home__section-title">
          Ready to explore the data?
        </h2>

        <div className="home__cta">
          <Button text="Go to Dashboard" variant="primary" />
        </div>
      </section>
    </div>
  );
}

export default Home;

import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";

const stats = [
  { label: "Total Population", value: "331M" },
  { label: "Fastest Growth", value: "Texas" },
  { label: "Biggest Gain", value: "Florida" },
  { label: "Biggest Loss", value: "New York" },
];

const containerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "48px 24px",
};

const sectionStyle = {
  marginBottom: "64px",
};

const heroTitleStyle = {
  fontSize: "48px",
  marginBottom: "16px",
};

const heroSubtitleStyle = {
  fontSize: "20px",
  color: "var(--text-muted)",
  marginBottom: "8px",
};

const heroDescStyle = {
  fontSize: "18px",
  color: "var(--text-muted)",
  maxWidth: "600px",
  marginBottom: "24px",
};

const sectionTitleStyle = {
  fontSize: "20px",
  marginBottom: "16px",
};

const cardGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "16px",
};

const mutedTextStyle = {
  color: "var(--text-muted)",
  marginBottom: "12px",
};

const listStyle = {
  paddingLeft: "20px",
  color: "var(--text-muted)",
  lineHeight: "1.8",
};

function Home() {
  return (
    <div style={containerStyle}>
      {/* HERO */}
      <section style={sectionStyle}>
        <h1 style={heroTitleStyle}>PopShift</h1>

        <p style={heroSubtitleStyle}>How America shifted, state by state</p>

        <p style={heroDescStyle}>
          Explore population trends across the United States from 2010 to 2025.
        </p>

        <Button text="Explore Dashboard" variant="primary" />
      </section>

      {/* STATS */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Key Stats</h2>

        <div style={cardGridStyle}>
          {stats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Why It Matters</h2>

        <p style={mutedTextStyle}>
          Population shifts impact key areas of American life:
        </p>

        <ul style={listStyle}>
          <li>Migration patterns</li>
          <li>Economic growth</li>
          <li>Political representation</li>
        </ul>
      </section>

      {/* CTA */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Ready to explore the data?</h2>

        <div style={{ marginTop: "16px" }}>
          <Button text="Go to Dashboard" variant="primary" />
        </div>
      </section>
    </div>
  );
}

export default Home;

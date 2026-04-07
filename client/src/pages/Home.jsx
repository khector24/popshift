import StatCard from "../components/ui/StatCard";

const stats = [
  { label: "Total Population", value: "331M" },
  { label: "Fastest Growing State", value: "Texas" },
  { label: "Biggest Decline", value: "New York" },
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
  fontSize: "18px",
  color: "#9fb0cc",
  maxWidth: "600px",
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

const panelStyle = {
  background: "#0f172a",
  border: "1px solid #283247",
  borderRadius: "16px",
  padding: "24px",
};

function Home() {
  return (
    <div style={containerStyle}>
      {/* HERO SECTION */}
      <section style={sectionStyle}>
        <h1 style={heroTitleStyle}>PopShift</h1>
        <p style={heroSubtitleStyle}>
          Explore population trends across the United States from 2010 to 2025.
        </p>
      </section>

      {/* STATS SECTION */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Key Stats</h2>
        <div style={cardGridStyle}>
          {stats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>

      {/* PLACEHOLDER SECTION */}
      <section>
        <h2 style={sectionTitleStyle}>More Coming Soon</h2>
      </section>
    </div>
  );
}

export default Home;

const cardStyle = {
  padding: "16px",
  background: "#121a2b",
  border: "1px solid #283247",
  flex: 1,
};

function Home() {
  return (
    <div style={{ padding: "40px 24px" }}>
      {/* HERO SECTION */}
      <section style={{ marginBottom: "40px" }}>
        <h1>PopShift</h1>
        <p>Population trends across the United States (2010–2025)</p>
      </section>

      {/* STATS SECTION */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Key Stats</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={cardStyle}>
            <p>Total Population</p>
            <h3>331M</h3>
          </div>

          <div style={cardStyle}>
            <p>Fastest Growing State</p>
            <h3>Texas</h3>
          </div>

          <div style={cardStyle}>
            <p>Biggest Decline</p>
            <h3>New York</h3>
          </div>
        </div>
      </section>

      {/* PLACEHOLDER SECTION */}
      <section>
        <h2>More Coming Soon</h2>
      </section>
    </div>
  );
}

export default Home;

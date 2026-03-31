import StatCard from "../components/ui/StatCard";

const stats = [
  { label: "Total Population", value: "331M" },
  { label: "Fastest Growing State", value: "Texas" },
  { label: "Biggest Decline", value: "New York" },
];

function Home() {
  return (
    <div style={{ padding: "40px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* HERO SECTION */}
      <section style={{ marginBottom: "40px" }}>
        <h1>PopShift</h1>
        <p>Population trends across the United States (2010–2025)</p>
      </section>

      {/* STATS SECTION */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Key Stats</h2>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {stats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
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

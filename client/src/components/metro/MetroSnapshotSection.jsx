export default function MetroSnapshotSection({ metro }) {
  return (
    <section className="metro-snapshot-section">
      <div>
        Economic Snapshot <h2>{metro.name}</h2>
      </div>
      <div>Housing & Affordability</div>
      <div>Transportation Snapshot</div>
    </section>
  );
}

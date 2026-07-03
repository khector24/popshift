export default function MetroBottomSection({ metro }) {
  return (
    <section className="metro-bottom-section">
      <div>
        Metro Overview
        <h2>{metro.name}</h2>
      </div>
      <div>Related Articles</div>
    </section>
  );
}

import "../../styles/components/metro/MetroOverview.css";

export default function MetroOverview({ metro }) {
  return (
    <section className="metro-overview">
      <h2>Metro Overview</h2>

      <div className="metro-overview__content">
        <p>{metro.name}</p>
      </div>

      <div className="metro-overview__bottom">States</div>
    </section>
  );
}

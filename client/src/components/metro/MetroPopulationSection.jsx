import MetroPopulationTimeline from "../metro/MetroPopulationTimeline.jsx";

export default function MetroPopulationSection({ metro }) {
  return (
    <section className="metro-population-section">
      <MetroPopulationTimeline data={metro.populationByYear} />
      <div>
        <h3> At a Glance</h3>
        <p>
          The {metro.name} continues to grow steadily, adding over 880,000
          residents since 2020. It remains the most populous metro in the
          country and a driving force in the national economy. Despite high
          housing costs, the region attracts global talent and investment across
          finance, media, healthcare, and technology.
        </p>
      </div>
    </section>
  );
}

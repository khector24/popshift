import MetroPopulationTimeline from "../metro/MetroPopulationTimeline.jsx";
import MetroAtAGlance from "./MetroAtAGlance.jsx";

import "../../styles/components/metro/MetroPopulationSection.css";

export default function MetroPopulationSection({ metro }) {
  return (
    <section className="metro-population-section">
      <MetroPopulationTimeline data={metro.populationByYear} />
      <MetroAtAGlance metro={metro} />
    </section>
  );
}

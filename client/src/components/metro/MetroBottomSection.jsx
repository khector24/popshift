import MetroOverview from "./MetroOverview";
import MetroRelatedArticles from "./MetroRelatedArticles";

import "../../styles/components/metro/MetroBottomSection.css";

export default function MetroBottomSection({ metro }) {
  return (
    <section className="metro-bottom-section">
      <MetroOverview metro={metro} />
      <MetroRelatedArticles />
    </section>
  );
}

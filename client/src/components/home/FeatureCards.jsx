import "../../styles/components/home/FeatureCards.css";

import {
  FaMapMarkedAlt,
  FaCity,
  FaExchangeAlt,
  FaRegNewspaper,
} from "react-icons/fa";

import FeatureCard from "./FeatureCard";

export default function FeatureCards() {
  return (
    <section className="feature-section">
      <div className="feature-section__header">
        <h2>Explore What Matters</h2>

        <p>Everything you need to explore and compare places in one place.</p>
      </div>

      <div className="feature-grid">
        <FeatureCard
          icon={<FaMapMarkedAlt />}
          title="State Profiles"
          description="Deep dives into all 50 states with population, migration, economics, housing, and education data."
          buttonText="Explore States"
          to="/states"
        />

        <FeatureCard
          icon={<FaCity />}
          title="Metro Profiles"
          description="Explore major metro areas with population, weather, commute, transit, and growth trends."
          buttonText="Explore Metros"
          to="/metros"
        />

        <FeatureCard
          icon={<FaExchangeAlt />}
          title="Explore Moving"
          description="Compare two places side-by-side to see how they stack up on what matters most."
          buttonText="Coming Soon"
          to="#"
          disabled
        />

        <FeatureCard
          icon={<FaRegNewspaper />}
          title="Articles & Insights"
          description="In-depth analysis and stories about the trends shaping where Americans live and move."
          buttonText="Coming Soon"
          to="#"
          disabled
        />
      </div>
    </section>
  );
}

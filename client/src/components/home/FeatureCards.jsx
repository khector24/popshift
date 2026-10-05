import "../../styles/components/home/FeatureCards.css";

import {
  FaMapMarkedAlt,
  FaCity,
  FaBuilding,
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
          color="blue"
        />

        <FeatureCard
          icon={<FaCity />}
          title="Metro Profiles"
          description="Explore major metro areas with population, weather, commute, transit, and growth trends."
          buttonText="Explore Metros"
          to="/metros"
          color="purple"
        />

        <FeatureCard
          icon={<FaBuilding />}
          title="City Profiles"
          description="Explore U.S. cities with population, housing, economics, climate, crime, and other local data."
          buttonText="Explore Cities"
          to="/cities"
          color="cyan"
        />

        <FeatureCard
          icon={<FaExchangeAlt />}
          title="Compare Places"
          description="Compare cities, metro areas, or states and focus on what matters most to you."
          buttonText="Start Comparing"
          to="/compare"
          color="green"
        />

        <FeatureCard
          icon={<FaRegNewspaper />}
          title="Articles & Insights"
          description="In-depth analysis and stories about the trends shaping where Americans live and move."
          buttonText="Read Articles"
          to="/articles"
          color="orange"
        />
      </div>
    </section>
  );
}

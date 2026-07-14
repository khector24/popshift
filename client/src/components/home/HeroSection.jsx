import { Link } from "react-router-dom";

import PopulationChangeMap from "../ui/PopulationChangeMap";
import MoverSection from "../ui/MoverSection";

import "../../styles/components/home/HeroSection.css";

export default function HeroSection({ summaryData }) {
  const mapStates = summaryData.states || [];
  const topGainers = summaryData.topGainers || [];

  function getHeroMapColor(growth) {
    if (growth === undefined || growth === null) return "#172039";
    if (growth >= 5) return "#393064";
    if (growth >= 2.5) return "#332b5a";
    if (growth > 0) return "#2b294f";
    if (growth === 0) return "#202840";
    if (growth > -2.5) return "#252943";
    if (growth > -5) return "#22263d";
    return "#1d2237";
  }

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Understand
          <br />
          <span>America&apos;s Movement.</span>
        </h1>

        <p className="hero-description">
          Population, migration, and economic data that helps you see the big
          picture and make smarter decisions about where to live, work, and
          invest.
        </p>

        <div className="hero-actions">
          <Link to="/states" className="btn btn-primary">
            Explore States →
          </Link>

          <Link to="/metros" className="btn btn-secondary">
            Explore Metros →
          </Link>
        </div>

        <p className="hero-note">
          Most data updated for 2025 • 50 states • Top 100 metros
        </p>
      </div>

      <div className="hero-map">
        <PopulationChangeMap
          states={mapStates}
          showLegend={false}
          getColor={getHeroMapColor}
          hoverColor="#514378"
        />
      </div>

      <div className="hero-visual__movers">
        <h2>
          Top Growing States <span>(2020–2025)</span>
        </h2>

        <MoverSection
          title="Biggest Gains"
          states={topGainers}
          type="positive"
        />
      </div>
    </section>
  );
}

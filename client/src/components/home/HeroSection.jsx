import { Link } from "react-router-dom";
import "../../styles/components/home/HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        {/* <span className="hero-badge">Population • Migration • Economics</span> */}

        <h1 className="hero-title">
          Understand
          <br />
          <span>America's Movement.</span>
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

      <div className="hero-visual">{/* Map image goes here later */}</div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StatCard from "../components/ui/StatCard";
import "../styles/pages/Home.css";

import { getDashboardSummary } from "../services/statesApi.js";
import { formatPopulation } from "../utils/formatNumbers.js";

import { FaDatabase, FaRankingStar, FaMapLocationDot } from "react-icons/fa6";
import { FaChartLine, FaMapMarkedAlt } from "react-icons/fa";

function Home() {
  const [summaryData, setSummaryData] = useState({});

  useEffect(() => {
    async function fetchHomeSummary() {
      try {
        const result = await getDashboardSummary({
          startYear: 2020,
          endYear: 2023,
        });

        setSummaryData(result);
      } catch (error) {
        console.error(error);
      }
    }

    fetchHomeSummary();
  }, []);

  return (
    <div className="home">
      <section className="home__hero">
        <p className="home__eyebrow">
          <FaMapLocationDot /> Census-backed population analytics
        </p>

        <h1 className="home__title">PopShift</h1>

        <p className="home__subtitle">
          See how America is shifting, state by state.
        </p>

        <p className="home__desc">
          Explore U.S. population trends through rankings, maps, charts,
          regional summaries, and state detail pages powered by Census-backed
          population data.
        </p>

        <div className="home__actions">
          <Link className="home__button home__button--primary" to="/dashboard">
            Explore Dashboard
          </Link>

          <Link className="home__button home__button--secondary" to="/rankings">
            View Rankings
          </Link>
        </div>
      </section>

      <section className="home__section">
        <h2 className="home__section-title">Quick Snapshot</h2>

        <div className="home__grid">
          <StatCard
            label="U.S. Population"
            value={formatPopulation(summaryData.totalPopulation)}
            variant="purple"
            icon={<FaChartLine />}
          />

          <StatCard
            label="Data Range"
            value="2020–2023"
            variant="blue"
            icon={<FaDatabase />}
          />

          <StatCard
            label="State Rankings"
            value="Sortable"
            variant="green"
            icon={<FaRankingStar />}
          />

          <StatCard
            label="Population Map"
            value="Interactive"
            variant="orange"
            icon={<FaMapMarkedAlt />}
          />
        </div>
      </section>

      <section className="home__section home__panel">
        <h2 className="home__section-title">What You Can Explore</h2>

        <ul className="home__list">
          <li>Interactive population dashboard</li>
          <li>Population change map by state</li>
          <li>Historical population trends</li>
          <li>Top population gainers and decliners</li>
          <li>Sortable state rankings</li>
          <li>Individual state detail pages</li>
        </ul>
      </section>

      <section className="home__section home__panel">
        <h2 className="home__section-title">Why It Matters</h2>

        <p className="home__muted">
          Population shifts can reveal where people are moving, which regions
          are growing, and how state-level changes may affect housing,
          infrastructure, political representation, workforce trends, and
          economic development.
        </p>

        <ul className="home__list">
          <li>Compare population growth across states.</li>
          <li>Identify regional migration patterns.</li>
          <li>Track long-term population trends.</li>
          <li>Explore detailed state-level data.</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;

import { useEffect, useState } from "react";

import HeroSection from "../components/home/HeroSection";
import FeatureCards from "../components/home/FeatureCards";
import BigPicture from "../components/home/BigPicture";

import {
  getStates,
  getStateEconomics,
  getDashboardSummary,
} from "../services/statesApi";

import "../styles/pages/Home.css";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [economics, setEconomics] = useState(null);
  const [summaryData, setSummaryData] = useState({});

  useEffect(() => {
    async function loadHome() {
      try {
        const [statesResponse, economicsResponse, summaryResponse] =
          await Promise.all([
            getStates(),
            getStateEconomics(),
            getDashboardSummary({
              startYear: 2020,
              endYear: 2025,
            }),
          ]);

        setStates(statesResponse.data);
        setEconomics(economicsResponse.national);
        setSummaryData(summaryResponse);
      } catch (error) {
        console.error("Failed to load homepage data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="home">
      <HeroSection summaryData={summaryData} />

      <FeatureCards />

      <BigPicture states={states} economics={economics} />
    </main>
  );
}

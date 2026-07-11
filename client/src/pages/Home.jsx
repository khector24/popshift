import { useEffect, useState } from "react";

import HeroSection from "../components/home/HeroSection";
import FeatureCards from "../components/home/FeatureCards";
import BigPicture from "../components/home/BigPicture";

import { getStates, getStateEconomics } from "../services/statesApi";

import "../styles/pages/Home.css";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState([]);
  const [economics, setEconomics] = useState(null);

  useEffect(() => {
    async function loadHome() {
      try {
        const [statesResponse, economicsResponse] = await Promise.all([
          getStates(),
          getStateEconomics(),
        ]);

        setStates(statesResponse.data);
        setEconomics(economicsResponse.national);
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
      <HeroSection />

      <FeatureCards />

      <BigPicture states={states} economics={economics} />
    </main>
  );
}

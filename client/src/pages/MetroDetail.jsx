import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getMetrosBySlug } from "../services/metrosApi.js";

import MetroHero from "../components/metro/MetroHero";
import MetroHighlights from "../components/metro/MetroHighlights.jsx";

import "../styles/pages/MetroDetail.css";

export default function MetroDetail() {
  const { slug } = useParams();
  const [metro, setMetro] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getMetro() {
      setIsLoading(true);

      try {
        const metroResult = await getMetrosBySlug(slug);

        setMetro(metroResult);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getMetro();
  }, [slug]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!metro) {
    return <p>Metro not found.</p>;
  }

  return (
    <main className="metro-detail">
      <MetroHero metro={metro} />
      <MetroHighlights metro={metro} />
    </main>
  );
}

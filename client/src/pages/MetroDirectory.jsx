import { useState, useEffect } from "react";
import { getStates } from "../services/statesApi.js";
import { getMetros } from "../services/metrosApi.js";

import MetroDirectoryHero from "../components/metro-directory/MetroDirectoryHero";
import MetroDirectoryToolbar from "../components/metro-directory/MetroDirectoryToolbar";
import MetroFilters from "../components/metro-directory/MetroFilters";
import MetroGrid from "../components/metro-directory/MetroGrid";
import MetroPagination from "../components/metro-directory/MetroPagination";

import "../styles/pages/MetroDirectory.css";

export default function MetroDirectory() {
  const [metros, setMetros] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const metroResult = await getMetros();
      const statesResult = await getStates({
        sortBy: "name",
        order: "asc",
      });

      setMetros(metroResult);
      setStates(statesResult.data);
    }

    fetchData();
  }, []);

  return (
    <main className="metro-directory-page">
      <MetroDirectoryHero />

      <MetroDirectoryToolbar />

      <div className="metro-directory-page__layout">
        <MetroFilters states={states} metros={metros} />

        <MetroGrid />
      </div>

      <MetroPagination />
    </main>
  );
}

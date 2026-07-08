import MetroDirectoryHero from "../components/metro-directory/MetroDirectoryHero";
import MetroDirectoryToolbar from "../components/metro-directory/MetroDirectoryToolbar";
import MetroFilters from "../components/metro-directory/MetroFilters";
import MetroGrid from "../components/metro-directory/MetroGrid";
import MetroPagination from "../components/metro-directory/MetroPagination";

import "../styles/pages/MetroDirectory.css";

export default function MetroDirectory() {
  return (
    <main className="metro-directory-page">
      <MetroDirectoryHero />

      <MetroDirectoryToolbar />

      <div className="metro-directory-page__layout">
        <MetroFilters />

        <MetroGrid />
      </div>

      <MetroPagination />
    </main>
  );
}

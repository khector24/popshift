import MetroEducationSnapshot from "./MetroEducationSnapshot.jsx";
import MetroMigrationSnapshot from "./MetroMigrationSnapshot.jsx";

import "../../styles/components/metro/MetroEducationMigrationSection.css";

export default function MetroEducationMigrationSection({ metro }) {
  return (
    <section className="metro-education-migration-section">
      <MetroEducationSnapshot
        education={metro.education}
        nationalAverages={metro.nationalAverages.education}
        year={metro.metroACSYear}
      />
      <MetroMigrationSnapshot metro={metro} />
    </section>
  );
}

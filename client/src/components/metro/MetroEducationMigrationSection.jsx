import MetroEducationSnapshot from "./MetroEducationSnapshot.jsx";
import MetroMigrationSnapshot from "./MetroMigrationSnapshot.jsx";

import "../../styles/components/metro/MetroEducationMigrationSection.css";

export default function MetroEducationMigrationSection({ metro }) {
  return (
    <section className="metro-education-migration-section">
      <MetroEducationSnapshot metro={metro} />
      <MetroMigrationSnapshot metro={metro} />
    </section>
  );
}

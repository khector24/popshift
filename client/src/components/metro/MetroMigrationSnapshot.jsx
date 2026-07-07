import MigrationFlowCard from "../ui/MigrationFlowCard.jsx";
import NetMigrationSummary from "../ui/NetMigrationSummary.jsx";

import "../../styles/components/metro/MetroMigrationSnapshot.css";

export default function MetroMigrationSnapshot({ metro }) {
  const migration = metro.migration;

  const totalInbound = migration?.totalInbound ?? 0;
  const totalOutbound = migration?.totalOutbound ?? 0;
  const netMigration = migration?.netMigration ?? 0;
  const migrationYear = migration?.metroMigrationYear;

  function getShortMetroName(name) {
    const metro = name.replace(" Metro Area", "");
    const baseName = metro.split(",")[0];

    const exceptions = {
      "Dallas-Fort Worth-Arlington": "Dallas–Fort Worth",
      "Minneapolis-St. Paul-Bloomington": "Minneapolis–St. Paul",
      "Miami-Fort Lauderdale-West Palm Beach": "Miami",
      "Los Angeles-Long Beach-Anaheim": "Los Angeles",
      "San Francisco-Oakland-Fremont": "San Francisco",
      "Washington-Arlington-Alexandria": "Washington",
      "Riverside-San Bernardino-Ontario": "Riverside",
      "Virginia Beach-Chesapeake-Norfolk": "Virginia Beach",
      "Salt Lake City-Murray": "Salt Lake City",
      "Kansas City": "Kansas City",
    };

    if (exceptions[baseName]) {
      return exceptions[baseName];
    }

    return baseName.split("-")[0].trim();
  }

  const inbound =
    migration?.inbound?.slice(0, 3).map((flow) => ({
      ...flow,
      shortName: getShortMetroName(flow.name),
    })) || [];

  const outbound =
    migration?.outbound?.slice(0, 3).map((flow) => ({
      ...flow,
      shortName: getShortMetroName(flow.name),
    })) || [];

  return (
    <article className="metro-migration-snapshot">
      <div>
        <h2>Migration Snapshot ({migrationYear})</h2>
        <p>IRS county-to-county migration, aggregated to metro areas</p>
      </div>

      <div className="metro-migration-snapshot__grid">
        <MigrationFlowCard
          label="Top metros people moved from"
          migrationType="inbound"
          flows={inbound}
          totalMovers={totalInbound}
          nameHeader="Metro Area"
        />

        <MigrationFlowCard
          label="Top metros people moved to"
          migrationType="outbound"
          flows={outbound}
          totalMovers={totalOutbound}
          nameHeader="Metro Area"
        />
      </div>

      <div className="metro-migration-snapshot__net">
        <NetMigrationSummary
          netMigration={netMigration}
          comparisonLabel="other metros"
          hideGeographyName
        />
      </div>
    </article>
  );
}

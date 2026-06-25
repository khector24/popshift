import {
  migrationYears,
  stateMigration,
} from "../data/migration/stateMigration.js";

const latestMigrationYear = migrationYears[migrationYears.length - 1];

export function getStateMigration() {
  return {
    years: migrationYears,
    latestYear: latestMigrationYear,
    data: stateMigration,
  };
}

export function getStateMigrationByCode(code) {
  return {
    years: migrationYears,
    latestYear: latestMigrationYear,
    data: stateMigration[code] || null,
  };
}

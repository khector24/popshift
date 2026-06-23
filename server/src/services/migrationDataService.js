import {
  migrationDataYear,
  stateMigration,
} from "../data/migration/stateMigration2024.js";

export function getStateMigration() {
  return {
    year: migrationDataYear,
    data: stateMigration,
  };
}

export function getStateMigrationByCode(code) {
  return {
    year: migrationDataYear,
    data: stateMigration[code] || null,
  };
}

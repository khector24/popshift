import xlsx from "xlsx";
import fs from "fs";
import { stateEconomics } from "../data/economics/stateEconomics2024.js";

const migrationFiles = [
  {
    year: 2021,
    path: "./src/data/migration/raw/State_to_State_Migrations_Table_2021.xls",
    format: "matrix",
  },
  {
    year: 2022,
    path: "./src/data/migration/raw/State_to_State_Migration_Table_2022_T13_updated_2024_06_27.xlsx",
    format: "matrix",
  },
  {
    year: 2023,
    path: "./src/data/migration/raw/State_to_State_Migration_Table_2023_T13.xlsx",
    format: "matrix",
  },
  {
    year: 2024,
    path: "./src/data/migration/raw/State_to_State_Migration_Table_2024_T13.xlsx",
    format: "long",
  },
];

const excludedPlaces = [
  "Foreign country",
  "U.S. Island Areas",
  "Puerto Rico",
  "United States",
  "United States2",
  "Abroad",
];

const codeByStateName = {};

for (const state of stateEconomics) {
  codeByStateName[state.name] = state.code;
}

function cleanStateName(value) {
  if (typeof value !== "string") return null;

  return value.replace(/\d+$/, "").trim();
}

function createStateEntry(migrationByState, name, code, year) {
  if (!migrationByState[code]) {
    migrationByState[code] = {
      name,
      code,
      year,
      inbound: [],
      outbound: [],
    };
  }
}

function addMigrationFlow({
  migrationByState,
  year,
  currentResidence,
  previousResidence,
  estimate,
}) {
  const currentResidenceCode = codeByStateName[currentResidence];
  const previousResidenceCode = codeByStateName[previousResidence];

  if (
    excludedPlaces.includes(currentResidence) ||
    excludedPlaces.includes(previousResidence)
  ) {
    return;
  }

  if (!currentResidenceCode || !previousResidenceCode) return;
  if (currentResidenceCode === previousResidenceCode) return;
  if (typeof estimate !== "number") return;

  createStateEntry(
    migrationByState,
    currentResidence,
    currentResidenceCode,
    year,
  );

  createStateEntry(
    migrationByState,
    previousResidence,
    previousResidenceCode,
    year,
  );

  migrationByState[currentResidenceCode].inbound.push({
    state: previousResidence,
    code: previousResidenceCode,
    movers: estimate,
  });

  migrationByState[previousResidenceCode].outbound.push({
    state: currentResidence,
    code: currentResidenceCode,
    movers: estimate,
  });
}

function finishYearlyMigration(migrationByState) {
  for (const code in migrationByState) {
    migrationByState[code].inbound.sort((a, b) => b.movers - a.movers);
    migrationByState[code].outbound.sort((a, b) => b.movers - a.movers);

    migrationByState[code].totalInbound = migrationByState[code].inbound.reduce(
      (total, flow) => total + flow.movers,
      0,
    );

    migrationByState[code].totalOutbound = migrationByState[
      code
    ].outbound.reduce((total, flow) => total + flow.movers, 0);

    migrationByState[code].netMigration =
      migrationByState[code].totalInbound -
      migrationByState[code].totalOutbound;
  }

  return migrationByState;
}

function parseLongMigrationFile({ year, path }) {
  const workbook = xlsx.readFile(path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
  });

  const dataRows = rows.slice(8);
  const migrationByState = {};

  for (const row of dataRows) {
    const [currentResidenceRaw, previousResidenceRaw, estimate] = row;

    const currentResidence = cleanStateName(currentResidenceRaw);
    const previousResidence = cleanStateName(previousResidenceRaw);

    if (!currentResidence || !previousResidence) continue;

    if (
      excludedPlaces.includes(currentResidence) ||
      excludedPlaces.includes(previousResidence)
    ) {
      continue;
    }

    addMigrationFlow({
      migrationByState,
      year,
      currentResidence,
      previousResidence,
      estimate,
    });
  }

  return finishYearlyMigration(migrationByState);
}

function parseMatrixMigrationFile({ year, path }) {
  const workbook = xlsx.readFile(path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
  });

  const originHeaderRow = rows[6];
  const dataRows = rows.slice(10);
  const migrationByState = {};

  for (const row of dataRows) {
    const currentResidence = cleanStateName(row[0]);

    if (!currentResidence || !codeByStateName[currentResidence]) {
      continue;
    }

    for (
      let columnIndex = 0;
      columnIndex < originHeaderRow.length;
      columnIndex++
    ) {
      const previousResidence = cleanStateName(originHeaderRow[columnIndex]);

      if (!previousResidence || !codeByStateName[previousResidence]) {
        continue;
      }

      const estimate = row[columnIndex];

      addMigrationFlow({
        migrationByState,
        year,
        currentResidence,
        previousResidence,
        estimate,
      });
    }
  }

  return finishYearlyMigration(migrationByState);
}

function buildYearlyMigration(migrationFile) {
  if (migrationFile.format === "matrix") {
    return parseMatrixMigrationFile(migrationFile);
  }

  return parseLongMigrationFile(migrationFile);
}

const stateMigration = {};

for (const migrationFile of migrationFiles) {
  const yearlyMigration = buildYearlyMigration(migrationFile);

  for (const code in yearlyMigration) {
    const yearlyState = yearlyMigration[code];

    if (!stateMigration[code]) {
      stateMigration[code] = {
        name: yearlyState.name,
        code: yearlyState.code,
        years: [],
      };
    }

    stateMigration[code].years.push({
      year: yearlyState.year,
      inbound: yearlyState.inbound,
      outbound: yearlyState.outbound,
      totalInbound: yearlyState.totalInbound,
      totalOutbound: yearlyState.totalOutbound,
      netMigration: yearlyState.netMigration,
    });
  }
}

for (const code in stateMigration) {
  stateMigration[code].years.sort((a, b) => a.year - b.year);
}

const migrationYears = migrationFiles.map((file) => file.year);

const output = `export const migrationYears = ${JSON.stringify(migrationYears)};

export const stateMigration = ${JSON.stringify(stateMigration, null, 2)};
`;

fs.writeFileSync("./src/data/migration/stateMigration.js", output);

console.log("Migration data written.");
console.log(`Years written: ${migrationYears.join(", ")}`);
console.log(`States written: ${Object.keys(stateMigration).length}`);

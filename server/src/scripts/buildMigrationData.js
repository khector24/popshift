import xlsx from "xlsx";
import fs from "fs";
import { stateEconomics } from "../data/economics/stateEconomics2024.js";

const workbook = xlsx.readFile(
  "./src/data/migration/raw/State_to_State_Migration_Table_2024_T13.xlsx",
);

const worksheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = xlsx.utils.sheet_to_json(worksheet, {
  header: 1,
});

const dataRows = rows.slice(8);

const migrationData = [];

const excludedPlaces = ["Foreign country", "U.S. Island Areas", "Puerto Rico"];

const codeByStateName = {};

for (const state of stateEconomics) {
  codeByStateName[state.name] = state.code;
}

for (const row of dataRows) {
  const [currentResidenceRaw, previousResidenceRaw, estimate, marginOfError] =
    row;

  if (typeof estimate !== "number") {
    continue;
  }

  const currentResidence = currentResidenceRaw.trim();
  const previousResidence = previousResidenceRaw.trim();

  if (
    excludedPlaces.includes(currentResidence) ||
    excludedPlaces.includes(previousResidence)
  ) {
    continue;
  }

  const currentResidenceCode = codeByStateName[currentResidence];
  const previousResidenceCode = codeByStateName[previousResidence];

  if (!currentResidenceCode || !previousResidenceCode) {
    continue;
  }

  migrationData.push({
    currentResidence,
    currentResidenceCode,
    previousResidence,
    previousResidenceCode,
    estimate,
  });
}

const migrationByState = {};

for (const item of migrationData) {
  const {
    currentResidence,
    currentResidenceCode,
    previousResidence,
    previousResidenceCode,
    estimate,
  } = item;

  if (!migrationByState[currentResidenceCode]) {
    migrationByState[currentResidenceCode] = {
      name: currentResidence,
      code: currentResidenceCode,
      inbound: [],
      outbound: [],
    };
  }

  if (!migrationByState[previousResidenceCode]) {
    migrationByState[previousResidenceCode] = {
      name: previousResidence,
      code: previousResidenceCode,
      inbound: [],
      outbound: [],
    };
  }

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

for (const state in migrationByState) {
  migrationByState[state].inbound.sort((a, b) => b.movers - a.movers);

  migrationByState[state].outbound.sort((a, b) => b.movers - a.movers);

  migrationByState[state].totalInbound = migrationByState[state].inbound.reduce(
    (total, flow) => total + flow.movers,
    0,
  );

  migrationByState[state].totalOutbound = migrationByState[
    state
  ].outbound.reduce((total, flow) => total + flow.movers, 0);

  migrationByState[state].netMigration =
    migrationByState[state].totalInbound -
    migrationByState[state].totalOutbound;
}

const output = `export const migrationDataYear = 2024;

export const stateMigration = ${JSON.stringify(migrationByState, null, 2)};
`;

fs.writeFileSync("./src/data/migration/stateMigration2024.js", output);

console.log("Migration data written.");
console.log(`States written: ${Object.keys(migrationByState).length}`);

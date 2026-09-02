import fs from "fs";
import xlsx from "xlsx";
import { cityDirectory } from "../data/cities/cityDirectory.js";

const POPULATION_PATH = "./src/data/cities/raw/SUB-IP-EST2025-ANNRNK.xlsx";

const OUTPUT_PATH = "./src/data/cities/cityPopulationHistory.js";

const YEAR_COLUMNS = {
  2020: 3,
  2021: 4,
  2022: 5,
  2023: 6,
  2024: 7,
  2025: 8,
};

function loadPopulationRows() {
  const workbook = xlsx.readFile(POPULATION_PATH);

  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  return xlsx.utils.sheet_to_json(sheet, { header: 1 });
}

function getPopulationRows(rows) {
  return rows.slice(4).filter((row) => typeof row[0] === "number");
}

function buildCityPopulationHistory() {
  const rows = loadPopulationRows();
  const populationRows = getPopulationRows(rows);

  const populationHistory = cityDirectory.map((city) => {
    const matchingRow = populationRows.find((row) => row[0] === city.rank);

    if (!matchingRow) {
      throw new Error(
        `No population-history row found for ${city.name}, ${city.stateName}`,
      );
    }

    const populations = {};

    for (const [year, columnIndex] of Object.entries(YEAR_COLUMNS)) {
      populations[year] = matchingRow[columnIndex];
    }

    return {
      geoid: city.geoid,
      name: city.name,
      stateAbbreviation: city.stateAbbreviation,
      populations,
    };
  });

  const output = `export const cityPopulationHistory = ${JSON.stringify(
    populationHistory,
    null,
    2,
  )};
`;

  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(
    `City population history written: ${populationHistory.length} cities`,
  );
}

buildCityPopulationHistory();

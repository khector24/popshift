import fs from "fs";
import xlsx from "xlsx";

const LIMIT = 100;

const METRO_POPULATION_PATH = "./src/data/metros/raw/cbsa-met-est2025-pop.xlsx";
const OUTPUT_PATH = "./src/data/metros/metroPopulation2025.js";

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

function parseNumber(value) {
  if (typeof value === "number") return value;

  const number = Number(String(value).replace(/,/g, ""));

  return Number.isNaN(number) ? null : number;
}

function slugifyMetroName(name) {
  return name
    .replace(/ Metro Area$/i, "")
    .replace(/, [A-Z]{2}(?:-[A-Z]{2})*$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getWorksheetRows(path) {
  const workbook = xlsx.readFile(path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  return xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });
}

function buildPopulationByYear(row) {
  return {
    2020: parseNumber(row[2]),
    2021: parseNumber(row[3]),
    2022: parseNumber(row[4]),
    2023: parseNumber(row[5]),
    2024: parseNumber(row[6]),
    2025: parseNumber(row[7]),
  };
}

function hasAllYearValues(populationByYear) {
  return YEARS.every((year) => Number.isFinite(populationByYear[year]));
}

function calculateChange(current, previous) {
  const amount = current - previous;
  const percent = Number(((amount / previous) * 100).toFixed(1));

  return {
    amount,
    percent,
  };
}

function buildMetroPopulation(rows) {
  const metros = [];

  for (const row of rows) {
    const name = String(row[0]).replace(/^\.+/, "").trim();

    if (!name.endsWith(" Metro Area")) continue;

    const populationByYear = buildPopulationByYear(row);

    if (!hasAllYearValues(populationByYear)) continue;

    const slug = slugifyMetroName(name);
    const population = populationByYear[2025];

    metros.push({
      name,
      slug,
      population,
      populationByYear,
      yearlyGrowth: calculateChange(
        populationByYear[2025],
        populationByYear[2024],
      ),
      growthSince2020: calculateChange(
        populationByYear[2025],
        populationByYear[2020],
      ),
    });
  }

  return metros
    .sort((a, b) => b.population - a.population)
    .slice(0, LIMIT)
    .map((metro, index) => ({
      rank: index + 1,
      ...metro,
    }));
}

function main() {
  const rows = getWorksheetRows(METRO_POPULATION_PATH);
  const metroPopulation = buildMetroPopulation(rows);

  const output = `export const metroPopulationYears = ${JSON.stringify(YEARS)};

export const metroPopulation = ${JSON.stringify(metroPopulation, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(
    `Metro population data written: ${metroPopulation.length} metros`,
  );
}

main();

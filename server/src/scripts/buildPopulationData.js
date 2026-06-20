import fs from "fs";
import path from "path";

const inputPath = path.join(
  process.cwd(),
  "src/data/population/raw/NST-EST2025-ALLDATA.csv",
);

const outputPath = path.join(
  process.cwd(),
  "src/data/population/statePopulation2025.js",
);

const populationYears = [2020, 2021, 2022, 2023, 2024, 2025];

function parseCsvLine(line) {
  return line.split(",");
}

function buildPopulationByYear(row, headers) {
  const populationByYear = {};

  populationYears.forEach((year) => {
    const columnName = `POPESTIMATE${year}`;
    const columnIndex = headers.indexOf(columnName);

    populationByYear[year] = Number(row[columnIndex]);
  });

  return populationByYear;
}

const csvText = fs.readFileSync(inputPath, "utf8").trim();

const lines = csvText.split("\n");

const headers = parseCsvLine(lines[0]);

const rows = lines.slice(1).map(parseCsvLine);

const nationalRow = rows.find(
  (row) => row[headers.indexOf("SUMLEV")] === "010",
);

const stateRows = rows.filter(
  (row) => row[headers.indexOf("SUMLEV")] === "040",
);

const nationalPopulation = {
  name: nationalRow[headers.indexOf("NAME")],
  code: nationalRow[headers.indexOf("STATE")],
  populationByYear: buildPopulationByYear(nationalRow, headers),
};

const statePopulation = stateRows.map((row) => ({
  name: row[headers.indexOf("NAME")],
  code: row[headers.indexOf("STATE")],
  populationByYear: buildPopulationByYear(row, headers),
}));

const fileContents = `export const populationYears = ${JSON.stringify(
  populationYears,
  null,
  2,
)};

export const nationalPopulation = ${JSON.stringify(
  nationalPopulation,
  null,
  2,
)};

export const statePopulation = ${JSON.stringify(statePopulation, null, 2)};
`;

fs.writeFileSync(outputPath, fileContents);

console.log(`Created ${outputPath}`);
console.log(`States written: ${statePopulation.length}`);
console.log(`Years written: ${populationYears.join(", ")}`);

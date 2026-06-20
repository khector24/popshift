import fs from "fs";
import path from "path";

const inputPath = path.join(
  process.cwd(),
  "src/data/economics/raw/acs2024-economics.json",
);

const outputPath = path.join(
  process.cwd(),
  "src/data/economics/stateEconomics2024.js",
);

const economicDataYear = 2024;

const rawData = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const dataRows = rawData.slice(1);

const stateEconomics = dataRows.map((row) => ({
  name: row[0],
  medianIncome: Number(row[1]),
  medianRent: Number(row[2]),
  medianHomeValue: Number(row[3]),
  code: row[4],
}));

const fileContents = `export const economicDataYear = ${economicDataYear};

export const stateEconomics = ${JSON.stringify(stateEconomics, null, 2)};
`;

fs.writeFileSync(outputPath, fileContents);

console.log(`Created ${outputPath}`);
console.log(`States written: ${stateEconomics.length}`);
console.log(`Economic data year: ${economicDataYear}`);

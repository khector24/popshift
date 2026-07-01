import fs from "fs";
import xlsx from "xlsx";

const LIMIT = 100;

const METRO_POPULATION_PATH = "./src/data/metros/raw/cbsa-met-est2025-pop.xlsx";
const OUTPUT_PATH = "./src/data/metros/topMetros.js";

function parseNumber(value) {
  if (typeof value === "number") return value;

  const number = Number(String(value).replace(/,/g, ""));

  if (Number.isNaN(number)) {
    return null;
  }

  return number;
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

function buildTopMetros(rows) {
  const metros = [];

  for (const row of rows) {
    const name = String(row[0]).replace(/^\.+/, "").trim();

    if (!name.endsWith(" Metro Area")) continue;

    const population2025 = parseNumber(row[6]);

    if (population2025 === null) continue;

    const slug = slugifyMetroName(name);

    metros.push({
      name,
      slug,
      population: population2025,
      image: `/images/metros/${slug}.jpg`,
      imageAuthor: "",
      imageLicense: "CC BY-SA 4.0",
      imageUrl: "",
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
  const topMetros = buildTopMetros(rows);

  const output = `export const topMetros = ${JSON.stringify(topMetros, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(`Top ${topMetros.length} metros written.`);
}

main();

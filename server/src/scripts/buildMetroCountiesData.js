import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import { topMetros } from "../data/metros/topMetros.js";

const INPUT_FILE = path.resolve("src/data/metros/raw/list1_2023.xlsx");
const OUTPUT_FILE = path.resolve("src/data/metros/metroCounties.js");

function getStateCodesFromMetroName(name) {
  const match = name.match(/,\s*([A-Z]{2}(?:-[A-Z]{2})*)\s+Metro Area$/);
  return match ? match[1].split("-") : [];
}

function buildMetroKey(name) {
  return name
    .replace(/\s+Metro Area$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildTopMetroLookup() {
  const lookup = new Map();

  for (const metro of topMetros) {
    const stateCodes = getStateCodesFromMetroName(metro.name);
    const key = buildMetroKey(metro.name);

    lookup.set(key, metro);
  }

  return lookup;
}

function buildExcelMetroKey(cbsaTitle) {
  return cbsaTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const workbook = xlsx.readFile(INPUT_FILE);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = xlsx.utils.sheet_to_json(sheet, {
  header: 1,
  defval: "",
});

const headerIndex = rows.findIndex((row) => row[0] === "CBSA Code");
const data = rows.slice(headerIndex + 1);

const topMetroLookup = buildTopMetroLookup();

const metroCounties = {};

for (const metro of topMetros) {
  metroCounties[metro.slug] = {
    cbsa: null,
    countyCount: 0,
    counties: [],
  };
}

for (const row of data) {
  const cbsaCode = String(row[0]);
  const cbsaTitle = row[3];
  const metroType = row[4];

  if (metroType !== "Metropolitan Statistical Area") continue;

  const key = buildExcelMetroKey(cbsaTitle);
  const metro = topMetroLookup.get(key);

  if (!metro) continue;

  metroCounties[metro.slug].cbsa = cbsaCode;

  const stateFips = String(row[9]).padStart(2, "0");
  const countyFips = String(row[10]).padStart(3, "0");

  metroCounties[metro.slug].counties.push({
    name: row[7],
    state: row[8],
    fips: stateFips + countyFips,
  });
}

for (const metro of Object.values(metroCounties)) {
  metro.countyCount = metro.counties.length;
  metro.counties.sort((a, b) => a.name.localeCompare(b.name));
}

const output = `export const metroCounties = ${JSON.stringify(
  metroCounties,
  null,
  2,
)};\n`;

fs.writeFileSync(OUTPUT_FILE, output);

console.log("Done.");
console.log(`Metros: ${Object.keys(metroCounties).length}`);

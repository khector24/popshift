import fs from "fs";
import path from "path";
import { metroCounties } from "../data/metros/metroCounties.js";
import { topMetros } from "../data/metros/topMetros.js";

const INPUT_FILE = path.resolve("src/data/metros/raw/countyoutflow2223.csv");
const OUTPUT_FILE = path.resolve("src/data/metros/metroMigration2023.js");

const YEAR = 2023;
const TOP_FLOW_LIMIT = 10;

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  const lines = text.split(/\r?\n/);
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows = lines.slice(1).map(parseCsvLine);

  return { headers, rows };
}

function get(row, headers, columnName) {
  return row[headers.indexOf(columnName)];
}

function buildCountyToMetroLookup() {
  const countyToMetro = {};

  for (const [slug, metro] of Object.entries(metroCounties)) {
    for (const county of metro.counties) {
      countyToMetro[county.fips] = {
        slug,
        cbsa: metro.cbsa,
      };
    }
  }

  return countyToMetro;
}

function buildEmptyMigration() {
  const migration = {};

  for (const metro of topMetros) {
    migration[metro.slug] = {
      rank: metro.rank,
      name: metro.name,
      slug: metro.slug,
      cbsa: metroCounties[metro.slug]?.cbsa ?? null,
      inbound: [],
      outbound: [],
      totalInbound: 0,
      totalOutbound: 0,
      netMigration: 0,
    };
  }

  return migration;
}

function addFlow(migration, originSlug, destinationSlug, movers) {
  if (originSlug === destinationSlug) return;

  const origin = migration[originSlug];
  const destination = migration[destinationSlug];

  if (!origin || !destination) return;

  let outboundFlow = origin.outbound.find(
    (flow) => flow.slug === destinationSlug,
  );

  if (!outboundFlow) {
    outboundFlow = {
      rank: destination.rank,
      name: destination.name,
      slug: destination.slug,
      cbsa: destination.cbsa,
      movers: 0,
    };

    origin.outbound.push(outboundFlow);
  }

  outboundFlow.movers += movers;

  let inboundFlow = destination.inbound.find(
    (flow) => flow.slug === originSlug,
  );

  if (!inboundFlow) {
    inboundFlow = {
      rank: origin.rank,
      name: origin.name,
      slug: origin.slug,
      cbsa: origin.cbsa,
      movers: 0,
    };

    destination.inbound.push(inboundFlow);
  }

  inboundFlow.movers += movers;
}

function finishMigration(migration) {
  for (const metro of Object.values(migration)) {
    metro.inbound.sort((a, b) => b.movers - a.movers);
    metro.outbound.sort((a, b) => b.movers - a.movers);

    metro.totalInbound = metro.inbound.reduce(
      (sum, flow) => sum + flow.movers,
      0,
    );
    metro.totalOutbound = metro.outbound.reduce(
      (sum, flow) => sum + flow.movers,
      0,
    );
    metro.netMigration = metro.totalInbound - metro.totalOutbound;

    metro.inbound = metro.inbound.slice(0, TOP_FLOW_LIMIT);
    metro.outbound = metro.outbound.slice(0, TOP_FLOW_LIMIT);
  }

  return migration;
}

function main() {
  const countyToMetro = buildCountyToMetroLookup();
  const migration = buildEmptyMigration();

  const { headers, rows } = readCsv(INPUT_FILE);

  let usedRows = 0;
  let skippedRows = 0;

  for (const row of rows) {
    const originState = String(get(row, headers, "y1_statefips")).padStart(
      2,
      "0",
    );
    const originCounty = String(get(row, headers, "y1_countyfips")).padStart(
      3,
      "0",
    );

    const destinationState = String(get(row, headers, "y2_statefips")).padStart(
      2,
      "0",
    );
    const destinationCounty = String(
      get(row, headers, "y2_countyfips"),
    ).padStart(3, "0");

    const movers = Number(get(row, headers, "n2"));

    if (!Number.isFinite(movers)) {
      skippedRows++;
      continue;
    }

    const originFips = originState + originCounty;
    const destinationFips = destinationState + destinationCounty;

    const originMetro = countyToMetro[originFips];
    const destinationMetro = countyToMetro[destinationFips];

    if (!originMetro || !destinationMetro) {
      skippedRows++;
      continue;
    }

    addFlow(migration, originMetro.slug, destinationMetro.slug, movers);
    usedRows++;
  }

  const finished = finishMigration(migration);

  const output = `export const metroMigrationYear = ${YEAR};

export const metroMigration = ${JSON.stringify(finished, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, output);

  console.log("Done.");
  console.log(`Metros: ${Object.keys(finished).length}`);
  console.log(`IRS rows used: ${usedRows}`);
  console.log(`IRS rows skipped: ${skippedRows}`);
}

main();

import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import XLSX from "xlsx";

import { cityDirectory } from "../data/cities/cityDirectory.js";

const ARCHIVE_PATH = "./src/data/crime/offenses-known-to-le-2024.zip";

const TABLE_FILENAME =
  "CIUS_Table_8_Offenses_Known_to_Law_Enforcement_by_State_by_City_2024.xlsx";

const OUTPUT_PATH = "./src/data/crime/cityCrime2024.js";

const DATA_YEAR = 2024;

const FBI_CITY_OVERRIDES = {
  3651000: "New York",
  "0644000": "Los Angeles2",
  1836003: "Indianapolis",
  1150000: "Washington",
  2146027: "Lexington",
  "0203000": "Anchorage",
  1608830: "Boise",
  4983470: "West Valley",
  1303440: "Athens-Clarke County",
  "0665042": "Ventura",
};

const BROADER_GEOGRAPHY_GEOIDS = new Set([
  "3712000", // Charlotte
  "4752006", // Nashville-Davidson
  "3240000", // Las Vegas
  "2148006", // Louisville/Jefferson County
  "1571550", // Urban Honolulu
]);

function normalizeName(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/\s+/g, " ");
}

function extractTable8() {
  const tempDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "regionlore-crime-"),
  );

  execFileSync(
    "unzip",
    ["-j", ARCHIVE_PATH, TABLE_FILENAME, "-d", tempDirectory],
    {
      stdio: "inherit",
    },
  );

  return {
    tempDirectory,
    workbookPath: path.join(tempDirectory, TABLE_FILENAME),
  };
}

function loadFbiRows(workbookPath) {
  const workbook = XLSX.readFile(workbookPath);

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  });

  return rows
    .slice(4)
    .filter(
      (row) =>
        typeof row[0] === "string" &&
        typeof row[1] === "string" &&
        typeof row[2] === "number",
    )
    .map((row) => ({
      state: row[0],
      city: row[1],
      population: row[2],
      violentCrime: row[3],
      murder: row[4],
      rape: row[5],
      robbery: row[6],
      aggravatedAssault: row[7],
      propertyCrime: row[8],
      burglary: row[9],
      larcenyTheft: row[10],
      motorVehicleTheft: row[11],
      arson: row[12],
    }));
}

function findMatchingFbiRows(city, fbiRows) {
  const overrideName = FBI_CITY_OVERRIDES[city.geoid];

  const cityName = normalizeName(overrideName ?? city.name);

  const stateName = normalizeName(city.stateName);

  return fbiRows.filter(
    (row) =>
      normalizeName(row.city) === cityName &&
      normalizeName(row.state) === stateName,
  );
}

function findCandidateFbiRows(city, fbiRows) {
  const cityName = normalizeName(city.name);
  const stateName = normalizeName(city.stateName);

  const meaningfulWords = cityName
    .replace(/\([^)]*\)/g, " ")
    .split(" ")
    .filter((word) => word.length >= 4)
    .filter(
      (word) =>
        ![
          "city",
          "county",
          "municipality",
          "metropolitan",
          "government",
          "consolidated",
          "unified",
          "urban",
          "balance",
        ].includes(word),
    );

  return fbiRows
    .filter((row) => normalizeName(row.state) === stateName)
    .filter((row) => {
      const fbiCityName = normalizeName(row.city);

      return meaningfulWords.some(
        (word) => fbiCityName.includes(word) || word.includes(fbiCityName),
      );
    })
    .slice(0, 10);
}

function populationDifferencePercent(cityPopulation, fbiPopulation) {
  return (Math.abs(cityPopulation - fbiPopulation) / cityPopulation) * 100;
}

function ratePer100k(count, population) {
  if (
    count === null ||
    count === undefined ||
    !Number.isFinite(Number(count)) ||
    !Number.isFinite(Number(population)) ||
    Number(population) <= 0
  ) {
    return null;
  }

  return Number(((Number(count) / Number(population)) * 100000).toFixed(1));
}

function getUnavailableReason(city) {
  if (city.stateAbbreviation === "FL") {
    return "Limited 2024 Florida data were available in FBI Table 8.";
  }

  if (BROADER_GEOGRAPHY_GEOIDS.has(city.geoid)) {
    return (
      "Available FBI reporting geography is broader than the RegionLore " +
      "Census place and was not used."
    );
  }

  return "No defensible 2024 FBI Table 8 city match was available.";
}

function buildAvailableCrimeRecord(city, fbi) {
  return {
    geoid: city.geoid,
    name: city.name,
    stateAbbreviation: city.stateAbbreviation,
    dataYear: DATA_YEAR,

    coverageStatus: "available",
    coverageNotes: FBI_CITY_OVERRIDES[city.geoid]
      ? `Reviewed FBI city-name mapping: ${fbi.city}.`
      : null,

    fbiCity: fbi.city,
    fbiPopulation: fbi.population,

    counts: {
      violentCrime: fbi.violentCrime,
      murder: fbi.murder,
      rape: fbi.rape,
      robbery: fbi.robbery,
      aggravatedAssault: fbi.aggravatedAssault,
      propertyCrime: fbi.propertyCrime,
      burglary: fbi.burglary,
      larcenyTheft: fbi.larcenyTheft,
      motorVehicleTheft: fbi.motorVehicleTheft,
    },

    rates: {
      violentCrime: ratePer100k(fbi.violentCrime, fbi.population),
      murder: ratePer100k(fbi.murder, fbi.population),
      rape: ratePer100k(fbi.rape, fbi.population),
      robbery: ratePer100k(fbi.robbery, fbi.population),
      aggravatedAssault: ratePer100k(fbi.aggravatedAssault, fbi.population),
      propertyCrime: ratePer100k(fbi.propertyCrime, fbi.population),
      burglary: ratePer100k(fbi.burglary, fbi.population),
      larcenyTheft: ratePer100k(fbi.larcenyTheft, fbi.population),
      motorVehicleTheft: ratePer100k(fbi.motorVehicleTheft, fbi.population),
    },
  };
}

function buildUnavailableCrimeRecord(city) {
  return {
    geoid: city.geoid,
    name: city.name,
    stateAbbreviation: city.stateAbbreviation,
    dataYear: DATA_YEAR,

    coverageStatus: "unavailable",
    coverageNotes: getUnavailableReason(city),

    fbiCity: null,
    fbiPopulation: null,

    counts: null,

    rates: {
      violentCrime: null,
      murder: null,
      rape: null,
      robbery: null,
      aggravatedAssault: null,
      propertyCrime: null,
      burglary: null,
      larcenyTheft: null,
      motorVehicleTheft: null,
    },
  };
}

function buildCityCrime() {
  const { tempDirectory, workbookPath } = extractTable8();

  try {
    const fbiRows = loadFbiRows(workbookPath);

    console.log(`FBI city rows loaded: ${fbiRows.length.toLocaleString()}`);

    const cityCrime = [];
    let availableCount = 0;
    let unavailableCount = 0;
    let ambiguousCount = 0;

    for (const city of cityDirectory) {
      const matches = findMatchingFbiRows(city, fbiRows);

      if (matches.length === 1) {
        cityCrime.push(buildAvailableCrimeRecord(city, matches[0]));

        availableCount += 1;
        continue;
      }

      if (matches.length > 1) {
        ambiguousCount += 1;

        throw new Error(
          `Ambiguous FBI crime mapping for ${city.name}, ` +
            `${city.stateAbbreviation}: ` +
            matches.map((match) => match.city).join(", "),
        );
      }

      cityCrime.push(buildUnavailableCrimeRecord(city));
      unavailableCount += 1;
    }

    const output = `export const cityCrime2024 = ${JSON.stringify(
      cityCrime,
      null,
      2,
    )};\n`;

    fs.writeFileSync(OUTPUT_PATH, output);

    console.log();
    console.log(`RegionLore cities: ${cityDirectory.length}`);
    console.log(`Crime data available: ${availableCount}`);
    console.log(`Crime data unavailable: ${unavailableCount}`);
    console.log(`Ambiguous mappings: ${ambiguousCount}`);
    console.log(`Crime records written: ${cityCrime.length}`);
    console.log(`Output: ${OUTPUT_PATH}`);
  } finally {
    fs.rmSync(tempDirectory, {
      recursive: true,
      force: true,
    });
  }
}

buildCityCrime();

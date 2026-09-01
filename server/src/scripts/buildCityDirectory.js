import fs from "fs";
import xlsx from "xlsx";
import { STATE_ABBREVIATIONS_BY_NAME } from "../data/stateAbbreviations.js";

const POPULATION_PATH = "./src/data/cities/raw/SUB-IP-EST2025-ANNRNK.xlsx";

const GAZETTEER_PATH = "./src/data/cities/raw/2025_Gaz_place_national.txt";

const OUTPUT_PATH = "./src/data/cities/cityDirectory.js";

function loadPopulationRows() {
  const workbook = xlsx.readFile(POPULATION_PATH);

  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  return xlsx.utils.sheet_to_json(sheet, { header: 1 });
}

function getRankedPopulationPlaces(rows) {
  return rows.slice(4).filter((row) => typeof row[0] === "number");
}

function loadGazetteerRows() {
  const file = fs.readFileSync(GAZETTEER_PATH, "utf8");

  return file
    .trim()
    .split("\n")
    .map((line) => line.split("|"));
}

function getGazetteerPlaces(rows) {
  return rows.slice(1).map((row) => ({
    stateAbbreviation: row[0],
    geoid: row[1],
    name: row[4],
    lsad: row[5],
    landArea: Number(row[7]),
    waterArea: Number(row[8]),
    latitude: Number(row[11]),
    longitude: Number(row[12]),
  }));
}

function parsePopulationGeographicArea(geographicArea) {
  const lastCommaIndex = geographicArea.lastIndexOf(",");

  const placeName = geographicArea.slice(0, lastCommaIndex).trim();
  const stateName = geographicArea.slice(lastCommaIndex + 1).trim();

  return {
    placeName,
    stateName,
  };
}

const CITY_NAME_OVERRIDES = {
  "NY|New York": "New York City",
  "DC|Washington": "Washington, DC",
};

function getCityName(gazetteerPlace, stateAbbreviation) {
  const { name, lsad } = gazetteerPlace;

  let cleanedName = name;

  if (lsad === "25" && name.endsWith(" city")) {
    cleanedName = name.slice(0, -" city".length);
  } else if (lsad === "43" && name.endsWith(" town")) {
    cleanedName = name.slice(0, -" town".length);
  } else if (lsad === "47" && name.endsWith(" village")) {
    cleanedName = name.slice(0, -" village".length);
  }

  const overrideKey = `${stateAbbreviation}|${cleanedName}`;

  return CITY_NAME_OVERRIDES[overrideKey] ?? cleanedName;
}

function buildCityDirectory() {
  const populationRows = loadPopulationRows();
  const rankedPlaces = getRankedPopulationPlaces(populationRows).slice(0, 500);

  const gazetteerRows = loadGazetteerRows();
  const gazetteerPlaces = getGazetteerPlaces(gazetteerRows);

  console.log("Top population places:", rankedPlaces.length);
  console.log("Gazetteer places:", gazetteerPlaces.length);

  const cityDirectory = rankedPlaces.map((row) => {
    const rank = row[0];
    const geographicArea = row[1];

    const { placeName, stateName } =
      parsePopulationGeographicArea(geographicArea);

    const stateAbbreviation = STATE_ABBREVIATIONS_BY_NAME[stateName];

    const gazetteerPlace = gazetteerPlaces.find(
      (place) =>
        place.stateAbbreviation === stateAbbreviation &&
        place.name === placeName,
    );

    if (!gazetteerPlace) {
      throw new Error(`No Gazetteer match found for ${geographicArea}`);
    }

    return {
      rank,
      name: getCityName(gazetteerPlace, stateAbbreviation),
      stateName,
      stateAbbreviation,
      geoid: gazetteerPlace.geoid,
      population: row[8],
      latitude: gazetteerPlace.latitude,
      longitude: gazetteerPlace.longitude,
      landArea: gazetteerPlace.landArea,
      waterArea: gazetteerPlace.waterArea,
    };
  });

  console.log("City directory entries:", cityDirectory.length);
  console.log("First city:", cityDirectory[0]);
  console.log("Last city:", cityDirectory.at(-1));

  const output = `export const cityDirectory = ${JSON.stringify(
    cityDirectory,
    null,
    2,
  )};
`;

  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(`City directory written: ${cityDirectory.length} cities`);
}

buildCityDirectory();

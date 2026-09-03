import "dotenv/config";
import fs from "fs";
import { cityDirectory } from "../data/cities/cityDirectory.js";
import {
  ACS_DATA_YEAR,
  CITY_ACS_VARIABLES,
} from "../config/cityAcsVariables.js";

const OUTPUT_PATH = "./src/data/cities/cityAcsProfile2024.js";

const ACS_VARIABLE_CODES = Object.values(CITY_ACS_VARIABLES).flatMap((domain) =>
  Object.values(domain),
);

const STATE_FIPS_CODES = [
  ...new Set(cityDirectory.map((city) => city.geoid.slice(0, 2))),
];

function buildAcsUrl(stateFips) {
  const url = new URL(
    `https://api.census.gov/data/${ACS_DATA_YEAR}/acs/acs5/profile`,
  );

  url.searchParams.set("get", ["NAME", ...ACS_VARIABLE_CODES].join(","));

  url.searchParams.set("for", "place:*");
  url.searchParams.set("in", `state:${stateFips}`);

  const CENSUS_API_KEY = process.env.CENSUS_API_KEY;

  if (!CENSUS_API_KEY) {
    throw new Error("Missing CENSUS_API_KEY environment variable.");
  }

  url.searchParams.set("key", CENSUS_API_KEY);

  return url;
}

async function fetchAcsPlacesByState(stateFips) {
  const url = buildAcsUrl(stateFips);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ACS place data for state ${stateFips}: ${response.status}`,
    );
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Census returned non-JSON data for state ${stateFips}: ${text.slice(0, 200)}`,
    );
  }
}

function rowsToObjects(rows) {
  const [headers, ...dataRows] = rows;

  return dataRows.map((row) => {
    const object = {};

    headers.forEach((header, index) => {
      object[header] = row[index];
    });

    return object;
  });
}

async function fetchAllAcsPlaces() {
  const allPlaces = [];

  for (const stateFips of STATE_FIPS_CODES) {
    console.log(`Fetching ACS places for state ${stateFips}...`);

    const rows = await fetchAcsPlacesByState(stateFips);
    const places = rowsToObjects(rows);

    console.log(`State ${stateFips}: ${places.length} places`);

    allPlaces.push(...places);
  }

  return allPlaces;
}

const CITY_GEOIDS = new Set(cityDirectory.map((city) => city.geoid));

const EXPECTED_MISSING_ACS_GEOIDS = new Set([
  "2267303", // St. George, LA — not present in 2024 ACS geography
]);

function getSupportedCityAcsPlaces(allPlaces) {
  return allPlaces.filter((place) => {
    const geoid = `${place.state}${place.place}`;

    return CITY_GEOIDS.has(geoid);
  });
}

function parseAcsNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  if (Number.isNaN(number) || number < 0) {
    return null;
  }

  return number;
}

function roundTwoDecimals(value) {
  if (value === null) {
    return null;
  }

  return Math.round(value * 100) / 100;
}

function buildCityAcsProfile(place) {
  const socioeconomicVariables = CITY_ACS_VARIABLES.socioeconomics;
  const housingVariables = CITY_ACS_VARIABLES.housing;
  const transportationVariables = CITY_ACS_VARIABLES.transportation;
  const demographicVariables = CITY_ACS_VARIABLES.demographics;

  const age45To54 = parseAcsNumber(place[demographicVariables.age45To54Share]);

  const age55To59 = parseAcsNumber(place[demographicVariables.age55To59Share]);

  const age60To64 = parseAcsNumber(place[demographicVariables.age60To64Share]);

  const under18 = parseAcsNumber(place[demographicVariables.under18Share]);

  const age25To34 = parseAcsNumber(place[demographicVariables.age25To34Share]);

  const age35To44 = parseAcsNumber(place[demographicVariables.age35To44Share]);

  const age65Plus = parseAcsNumber(place[demographicVariables.age65PlusShare]);

  const age45To64 =
    age45To54 !== null && age55To59 !== null && age60To64 !== null
      ? roundTwoDecimals(age45To54 + age55To59 + age60To64)
      : null;

  const age18To24 =
    under18 !== null &&
    age25To34 !== null &&
    age35To44 !== null &&
    age45To64 !== null &&
    age65Plus !== null
      ? roundTwoDecimals(
          100 - under18 - age25To34 - age35To44 - age45To64 - age65Plus,
        )
      : null;

  return {
    geoid: `${place.state}${place.place}`,

    socioeconomics: {
      medianHouseholdIncome: parseAcsNumber(
        place[socioeconomicVariables.medianHouseholdIncome],
      ),
      povertyRate: parseAcsNumber(place[socioeconomicVariables.povertyRate]),
      unemploymentRate: parseAcsNumber(
        place[socioeconomicVariables.unemploymentRate],
      ),
      highSchoolOrHigher: parseAcsNumber(
        place[socioeconomicVariables.highSchoolOrHigher],
      ),
      bachelorsOrHigher: parseAcsNumber(
        place[socioeconomicVariables.bachelorsOrHigher],
      ),
    },

    housing: {
      medianRent: parseAcsNumber(place[housingVariables.medianRent]),
      medianHomeValue: parseAcsNumber(place[housingVariables.medianHomeValue]),
      ownerShare: parseAcsNumber(place[housingVariables.ownerShare]),
      renterShare: parseAcsNumber(place[housingVariables.renterShare]),
    },

    transportation: {
      meanCommuteMinutes: parseAcsNumber(
        place[transportationVariables.meanCommuteMinutes],
      ),
      driveShare: parseAcsNumber(place[transportationVariables.driveShare]),
      carpoolShare: parseAcsNumber(place[transportationVariables.carpoolShare]),
      transitShare: parseAcsNumber(place[transportationVariables.transitShare]),
      walkShare: parseAcsNumber(place[transportationVariables.walkShare]),
      workFromHomeShare: parseAcsNumber(
        place[transportationVariables.workFromHomeShare],
      ),
    },

    demographics: {
      under18Share: under18,
      age18To24Share: age18To24,
      age25To34Share: age25To34,
      age35To44Share: age35To44,
      age45To64Share: age45To64,
      age65PlusShare: age65Plus,

      whiteShare: parseAcsNumber(place[demographicVariables.whiteShare]),
      blackShare: parseAcsNumber(place[demographicVariables.blackShare]),
      asianShare: parseAcsNumber(place[demographicVariables.asianShare]),
      otherRaceShare: parseAcsNumber(
        place[demographicVariables.otherRaceShare],
      ),
      hispanicLatinoShare: parseAcsNumber(
        place[demographicVariables.hispanicLatinoShare],
      ),
    },
  };
}

async function buildCityAcsProfiles() {
  const allPlaces = await fetchAllAcsPlaces();

  const supportedPlaces = getSupportedCityAcsPlaces(allPlaces);

  const fetchedGeoids = new Set(
    supportedPlaces.map((place) => `${place.state}${place.place}`),
  );

  const missingCities = cityDirectory.filter(
    (city) => !fetchedGeoids.has(city.geoid),
  );

  const unexpectedMissingCities = missingCities.filter(
    (city) => !EXPECTED_MISSING_ACS_GEOIDS.has(city.geoid),
  );

  const expectedMissingCities = missingCities.filter((city) =>
    EXPECTED_MISSING_ACS_GEOIDS.has(city.geoid),
  );

  if (unexpectedMissingCities.length > 0) {
    throw new Error(
      `Unexpected missing ACS cities: ${unexpectedMissingCities
        .map((city) => `${city.name} (${city.geoid})`)
        .join(", ")}`,
    );
  }

  if (expectedMissingCities.length !== EXPECTED_MISSING_ACS_GEOIDS.size) {
    throw new Error(
      `Expected ${EXPECTED_MISSING_ACS_GEOIDS.size} known ACS geography exception(s), found ${expectedMissingCities.length}`,
    );
  }

  console.log(
    `Expected ACS geography exceptions: ${expectedMissingCities.length}`,
  );

  for (const city of expectedMissingCities) {
    console.log(`- ${city.name}, ${city.stateAbbreviation} (${city.geoid})`);
  }

  const cityAcsProfiles = supportedPlaces
    .map((place) => buildCityAcsProfile(place))
    .sort((a, b) => a.geoid.localeCompare(b.geoid));

  const output = `export const cityAcsDataYear = ${ACS_DATA_YEAR};

export const cityAcsProfiles = ${JSON.stringify(cityAcsProfiles, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(`ACS places fetched: ${allPlaces.length}`);
  console.log(`Supported city ACS profiles: ${cityAcsProfiles.length}`);
  console.log(`ACS data year: ${ACS_DATA_YEAR}`);
  console.log(`Created ${OUTPUT_PATH}`);
}

buildCityAcsProfiles();

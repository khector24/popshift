import "dotenv/config";
import fs from "fs";
import { topMetros } from "../data/metros/topMetros.js";

const API_KEY = process.env.CENSUS_API_KEY;
const YEAR = 2024;
const OUTPUT_PATH = "./src/data/metros/metroACS2024.js";

if (!API_KEY) {
  throw new Error("Missing CENSUS_API_KEY in .env");
}

const TABLES = {
  income: {
    dataset: "subject",
    variables: {
      medianHouseholdIncome: "S1901_C01_012E",
    },
  },

  poverty: {
    dataset: "subject",
    variables: {
      povertyRate: "S1701_C03_001E",
    },
  },

  housing: {
    dataset: "profile",
    variables: {
      medianHomeValue: "DP04_0089E",
      medianGrossRent: "DP04_0134E",
    },
  },

  transportation: {
    dataset: "subject",
    variables: {
      driveAlone: "S0801_C01_003E",
      publicTransit: "S0801_C01_009E",
      workFromHome: "S0801_C01_012E",
      averageCommuteMinutes: "S0801_C01_046E",
    },
  },

  education: {
    dataset: "subject",
    variables: {
      lessThanNinthGrade: "S1501_C02_007E",
      ninthToTwelfthNoDiploma: "S1501_C02_008E",
      highSchoolGraduate: "S1501_C02_009E",
      someCollegeNoDegree: "S1501_C02_010E",
      associatesDegree: "S1501_C02_011E",
      bachelorsDegree: "S1501_C02_012E",
      graduateDegree: "S1501_C02_013E",
      highSchoolOrHigher: "S1501_C02_014E",
      bachelorsOrHigher: "S1501_C02_015E",
    },
  },
};

function slugifyMetroName(name) {
  return name
    .replace(/ Metro Area$/i, "")
    .replace(/, [A-Z]{2}(?:-[A-Z]{2})*$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseValue(value) {
  if (value === null || value === undefined) return null;

  const missingValues = new Set([
    "-666666666",
    "-777777777",
    "-888888888",
    "-999999999",
  ]);

  if (missingValues.has(String(value))) return null;

  const number = Number(value);

  return Number.isNaN(number) ? value : number;
}

function roundOneDecimal(value) {
  if (!Number.isFinite(value)) return null;

  return Number(value.toFixed(1));
}

function buildUrl({ dataset, variables }, geography) {
  const variableIds = ["NAME", ...Object.values(variables)].join(",");

  return (
    `https://api.census.gov/data/${YEAR}/acs/acs5/${dataset}` +
    `?get=${variableIds}` +
    `&for=${geography}` +
    `&key=${API_KEY}`
  );
}

function formatRows(headers, rows, variables) {
  const codeHeader =
    "metropolitan statistical area/micropolitan statistical area";

  return rows.map((row) => {
    const name = row[headers.indexOf("NAME")];
    const code = row[headers.indexOf(codeHeader)];

    const values = {
      name,
      code,
      slug: slugifyMetroName(name),
    };

    for (const [key, variableId] of Object.entries(variables)) {
      values[key] = parseValue(row[headers.indexOf(variableId)]);
    }

    return values;
  });
}

function formatNational(headers, row, variables) {
  const values = {
    name: row[headers.indexOf("NAME")],
  };

  for (const [key, variableId] of Object.entries(variables)) {
    values[key] = parseValue(row[headers.indexOf(variableId)]);
  }

  return values;
}

async function fetchTable(tableName, config) {
  const geography =
    "metropolitan%20statistical%20area/micropolitan%20statistical%20area:*";

  const response = await fetch(buildUrl(config, geography));

  if (!response.ok) {
    throw new Error(`${tableName} failed: ${response.status}`);
  }

  const [headers, ...rows] = await response.json();

  return formatRows(headers, rows, config.variables);
}

async function fetchNationalTable(tableName, config) {
  const response = await fetch(buildUrl(config, "us:1"));

  if (!response.ok) {
    throw new Error(`national ${tableName} failed: ${response.status}`);
  }

  const [headers, row] = await response.json();

  return formatNational(headers, row, config.variables);
}

function indexBySlug(rows) {
  return new Map(rows.map((row) => [row.slug, row]));
}

function buildEducation(rawEducation) {
  const lessThanHighSchool = roundOneDecimal(
    rawEducation.lessThanNinthGrade + rawEducation.ninthToTwelfthNoDiploma,
  );

  const someCollegeOrAssociate = roundOneDecimal(
    rawEducation.someCollegeNoDegree + rawEducation.associatesDegree,
  );

  return {
    highSchoolOrHigher: rawEducation.highSchoolOrHigher,
    bachelorsOrHigher: rawEducation.bachelorsOrHigher,

    attainment: {
      lessThanHighSchool,
      highSchoolGraduate: rawEducation.highSchoolGraduate,
      someCollegeOrAssociate,
      bachelorsOrHigher: rawEducation.bachelorsOrHigher,
    },
  };
}

function buildACSRecord(metro, tableMaps) {
  const income = tableMaps.income.get(metro.slug);
  const poverty = tableMaps.poverty.get(metro.slug);
  const housing = tableMaps.housing.get(metro.slug);
  const transportation = tableMaps.transportation.get(metro.slug);
  const education = tableMaps.education.get(metro.slug);

  if (!income || !poverty || !housing || !transportation || !education) {
    return null;
  }

  const rentAsPercentOfIncome = roundOneDecimal(
    ((housing.medianGrossRent * 12) / income.medianHouseholdIncome) * 100,
  );

  const homeValueToIncome = roundOneDecimal(
    housing.medianHomeValue / income.medianHouseholdIncome,
  );

  return {
    rank: metro.rank,
    name: metro.name,
    slug: metro.slug,

    economics: {
      medianHouseholdIncome: income.medianHouseholdIncome,
      povertyRate: poverty.povertyRate,
    },

    housing: {
      medianGrossRent: housing.medianGrossRent,
      medianHomeValue: housing.medianHomeValue,
      rentAsPercentOfIncome,
      homeValueToIncome,
    },

    transportation: {
      driveAlone: transportation.driveAlone,
      publicTransit: transportation.publicTransit,
      workFromHome: transportation.workFromHome,
      averageCommuteMinutes: transportation.averageCommuteMinutes,
    },

    education: buildEducation(education),
  };
}

function buildNationalACS(nationalTables) {
  const rentAsPercentOfIncome = roundOneDecimal(
    ((nationalTables.housing.medianGrossRent * 12) /
      nationalTables.income.medianHouseholdIncome) *
      100,
  );

  const homeValueToIncome = roundOneDecimal(
    nationalTables.housing.medianHomeValue /
      nationalTables.income.medianHouseholdIncome,
  );

  return {
    economics: {
      medianHouseholdIncome: nationalTables.income.medianHouseholdIncome,
      povertyRate: nationalTables.poverty.povertyRate,
    },

    housing: {
      medianGrossRent: nationalTables.housing.medianGrossRent,
      medianHomeValue: nationalTables.housing.medianHomeValue,
      rentAsPercentOfIncome,
      homeValueToIncome,
    },

    transportation: {
      driveAlone: nationalTables.transportation.driveAlone,
      publicTransit: nationalTables.transportation.publicTransit,
      workFromHome: nationalTables.transportation.workFromHome,
      averageCommuteMinutes:
        nationalTables.transportation.averageCommuteMinutes,
    },

    education: buildEducation(nationalTables.education),
  };
}

async function main() {
  const tableEntries = await Promise.all(
    Object.entries(TABLES).map(async ([tableName, config]) => {
      const rows = await fetchTable(tableName, config);

      return [tableName, indexBySlug(rows)];
    }),
  );

  const nationalEntries = await Promise.all(
    Object.entries(TABLES).map(async ([tableName, config]) => {
      const row = await fetchNationalTable(tableName, config);

      return [tableName, row];
    }),
  );

  const tableMaps = Object.fromEntries(tableEntries);
  const nationalTables = Object.fromEntries(nationalEntries);

  const metroACS = topMetros
    .map((metro) => buildACSRecord(metro, tableMaps))
    .filter(Boolean);

  const missingCount = topMetros.length - metroACS.length;

  const output = `export const metroACSYear = ${YEAR};

export const nationalACS = ${JSON.stringify(buildNationalACS(nationalTables), null, 2)};

export const metroACS = ${JSON.stringify(metroACS, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(`Metro ACS data written: ${metroACS.length} metros`);

  if (missingCount > 0) {
    console.warn(`Missing ACS data for ${missingCount} metros`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

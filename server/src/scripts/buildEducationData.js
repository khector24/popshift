import fs from "fs";
import xlsx from "xlsx";

const ACS_EDUCATION_YEAR = 2024;

const CENSUS_API_KEY = process.env.CENSUS_API_KEY;

const MATH_NAEP_PATH =
  "./src/data/education/naep/NDECoreExcel_Mathematics, Grade 8, All students_20260625160443.Xls";

const READING_NAEP_PATH =
  "./src/data/education/naep/NDECoreExcel_Reading, Grade 8, All students_20260625160700.Xls";

const ACS_FIELDS =
  "NAME,S1501_C02_007E,S1501_C02_008E,S1501_C02_009E,S1501_C02_010E,S1501_C02_011E,S1501_C02_014E,S1501_C02_015E";

if (!CENSUS_API_KEY) {
  console.error("Missing CENSUS_API_KEY environment variable.");
  process.exit(1);
}

const ACS_STATE_EDUCATION_URL =
  `https://api.census.gov/data/${ACS_EDUCATION_YEAR}/acs/acs5/subject` +
  `?get=${ACS_FIELDS}&for=state:*&key=${CENSUS_API_KEY}`;

const ACS_NATIONAL_EDUCATION_URL =
  `https://api.census.gov/data/${ACS_EDUCATION_YEAR}/acs/acs5/subject` +
  `?get=${ACS_FIELDS}&for=us:*&key=${CENSUS_API_KEY}`;

function parseNumber(value) {
  const number = Number(value);

  if (Number.isNaN(number) || number < 0) {
    return null;
  }

  return number;
}

function roundOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

function rankStates(states, getValue) {
  return [...states]
    .filter((state) => getValue(state) !== null)
    .sort((a, b) => getValue(b) - getValue(a))
    .reduce((rankings, state, index) => {
      rankings[state.code] = index + 1;
      return rankings;
    }, {});
}

async function fetchJson(url, label) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${label}: ${response.status}`);
  }

  return response.json();
}

function getWorksheetRows(path) {
  const workbook = xlsx.readFile(path);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  return xlsx.utils.sheet_to_json(worksheet, {
    header: 1,
  });
}

function buildCodeByStateName(states) {
  return states.reduce((codeByStateName, state) => {
    codeByStateName[state.name] = state.code;
    return codeByStateName;
  }, {});
}

function buildAttainment(row) {
  const [
    name,
    lessThan9thRaw,
    ninthToTwelfthNoDiplomaRaw,
    highSchoolGraduateRaw,
    someCollegeNoDegreeRaw,
    associatesRaw,
    highSchoolOrHigherRaw,
    bachelorsOrHigherRaw,
  ] = row;

  const lessThan9th = parseNumber(lessThan9thRaw);
  const ninthToTwelfthNoDiploma = parseNumber(ninthToTwelfthNoDiplomaRaw);
  const highSchoolGraduate = parseNumber(highSchoolGraduateRaw);
  const someCollegeNoDegree = parseNumber(someCollegeNoDegreeRaw);
  const associates = parseNumber(associatesRaw);
  const highSchoolOrHigher = parseNumber(highSchoolOrHigherRaw);
  const bachelorsOrHigher = parseNumber(bachelorsOrHigherRaw);

  const lessThanHighSchool =
    lessThan9th !== null && ninthToTwelfthNoDiploma !== null
      ? roundOneDecimal(lessThan9th + ninthToTwelfthNoDiploma)
      : null;

  const someCollegeOrAssociate =
    someCollegeNoDegree !== null && associates !== null
      ? roundOneDecimal(someCollegeNoDegree + associates)
      : null;

  return {
    name,
    attainment: {
      lessThanHighSchool,
      highSchoolGraduate,
      someCollegeOrAssociate,
      bachelorsOrHigher,
      highSchoolOrHigher,
    },
  };
}

function roundWholeNumber(value) {
  return Math.round(value);
}

function parseNaepScores(path, codeByStateName) {
  const rows = getWorksheetRows(path);
  const scoresByCode = {};
  let nationalScore = null;

  for (const row of rows) {
    const jurisdiction = row[1];
    const score = row[3];

    if (typeof jurisdiction !== "string") continue;

    const parsedScore = parseNumber(score);

    if (parsedScore === null) continue;

    const roundedScore = roundWholeNumber(parsedScore);

    if (jurisdiction === "National") {
      nationalScore = roundedScore;
      continue;
    }

    const code = codeByStateName[jurisdiction];

    if (!code) continue;

    scoresByCode[code] = roundedScore;
  }

  return {
    nationalScore,
    scoresByCode,
  };
}

function buildStateEducation(stateRows, nationalRows) {
  const [, ...dataRows] = stateRows;
  const [, nationalDataRow] = nationalRows;

  const states = dataRows.map((row) => {
    const { name, attainment } = buildAttainment(row);
    const code = row[row.length - 1];

    return {
      name,
      code,
      attainment,
      rankings: {
        highSchoolOrHigher: null,
        bachelorsOrHigher: null,
        readingScore: null,
        mathScore: null,
      },
      naep: {
        reading: null,
        math: null,
      },
    };
  });

  const codeByStateName = buildCodeByStateName(states);

  const mathNaep = parseNaepScores(MATH_NAEP_PATH, codeByStateName);
  const readingNaep = parseNaepScores(READING_NAEP_PATH, codeByStateName);

  for (const state of states) {
    state.naep.math = mathNaep.scoresByCode[state.code] || null;
    state.naep.reading = readingNaep.scoresByCode[state.code] || null;
  }

  const highSchoolRankings = rankStates(
    states,
    (state) => state.attainment.highSchoolOrHigher,
  );

  const bachelorsRankings = rankStates(
    states,
    (state) => state.attainment.bachelorsOrHigher,
  );

  const mathRankings = rankStates(states, (state) => state.naep.math);
  const readingRankings = rankStates(states, (state) => state.naep.reading);

  const stateEducation = {};

  for (const state of states) {
    stateEducation[state.code] = {
      ...state,
      rankings: {
        ...state.rankings,
        highSchoolOrHigher: highSchoolRankings[state.code] || null,
        bachelorsOrHigher: bachelorsRankings[state.code] || null,
        readingScore: readingRankings[state.code] || null,
        mathScore: mathRankings[state.code] || null,
      },
    };
  }

  const nationalAttainment = buildAttainment(nationalDataRow).attainment;

  const nationalEducation = {
    name: "United States",
    attainment: nationalAttainment,
    naep: {
      reading: readingNaep.nationalScore,
      math: mathNaep.nationalScore,
    },
  };

  return {
    nationalEducation,
    stateEducation,
  };
}

async function main() {
  const stateRows = await fetchJson(
    ACS_STATE_EDUCATION_URL,
    "ACS state education data",
  );

  const nationalRows = await fetchJson(
    ACS_NATIONAL_EDUCATION_URL,
    "ACS national education data",
  );

  const { nationalEducation, stateEducation } = buildStateEducation(
    stateRows,
    nationalRows,
  );

  const output = `export const educationDataYear = ${ACS_EDUCATION_YEAR};

export const educationMetadata = {
  attainmentPopulation: "Population 25 years and over",
  naepGrade: 8,
  naepSubjects: ["reading", "math"],
};

export const nationalEducation = ${JSON.stringify(nationalEducation, null, 2)};

export const stateEducation = ${JSON.stringify(stateEducation, null, 2)};
`;

  fs.writeFileSync("./src/data/education/stateEducation.js", output);

  console.log("Education data written.");
  console.log(`States written: ${Object.keys(stateEducation).length}`);
  console.log("National education written.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

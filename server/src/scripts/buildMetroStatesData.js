import fs from "fs";
import { topMetros } from "../data/metros/topMetros.js";
import { statePopulation } from "../data/population/statePopulation2025.js";

const OUTPUT_PATH = "./src/data/metros/metroStates.js";

const STATE_ABBREVIATIONS = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

const statesByName = new Map(
  statePopulation.map((state) => [state.name, state]),
);

function getStateAbbreviationsFromMetroName(name) {
  const cleanedName = name.replace(/ Metro Area$/i, "");
  const match = cleanedName.match(/, ([A-Z]{2}(?:-[A-Z]{2})*)$/);

  if (!match) {
    return [];
  }

  return match[1].split("-");
}

function buildMetroStates() {
  return topMetros.map((metro) => {
    const abbreviations = getStateAbbreviationsFromMetroName(metro.name);

    const states = abbreviations.map((abbreviation) => {
      const stateName = STATE_ABBREVIATIONS[abbreviation];
      const state = statesByName.get(stateName);

      return {
        abbreviation,
        name: stateName,
        code: state?.code ?? null,
      };
    });

    return {
      rank: metro.rank,
      name: metro.name,
      slug: metro.slug,
      states,
    };
  });
}

function main() {
  const metroStates = buildMetroStates();

  const output = `export const metroStates = ${JSON.stringify(metroStates, null, 2)};
`;

  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(`Metro states written: ${metroStates.length} metros`);
}

main();

import fs from "fs";
import { topMetros } from "../data/metros/topMetros.js";
import { statePopulation } from "../data/population/statePopulation2025.js";
import { STATE_ABBREVIATIONS } from "../data/stateAbbreviations.js";

const OUTPUT_PATH = "./src/data/metros/metroStates.js";

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

import stateRegions from "../data/stateRegions.js";

async function fetchCensusStatesByYear(year) {
  const CENSUS_API_KEY = process.env.CENSUS_API_KEY;

  const url = new URL("https://api.census.gov/data/2023/pep/charv");

  url.searchParams.append("get", "NAME,POP");
  url.searchParams.append("for", "state:*");
  url.searchParams.append("YEAR", year);
  url.searchParams.append("key", CENSUS_API_KEY);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Census data for ${year}`);
  }

  return response.json();
}

export async function getCensusStates() {
  const currentYearData = await fetchCensusStatesByYear("2023");
  const previousYearData = await fetchCensusStatesByYear("2022");

  const previousRows = previousYearData.slice(1);

  const previousPopulationByCode = {};

  previousRows.forEach((row) => {
    const code = row[3];
    const population = Number(row[1]);

    previousPopulationByCode[code] = population;
  });

  const rows = currentYearData.slice(1);

  const formattedData = rows.map((row) => {
    const currPopulation = Number(row[1]);
    const previousPopulation = previousPopulationByCode[row[3]];

    const growth = previousPopulation
      ? Number(
          (
            ((currPopulation - previousPopulation) / previousPopulation) *
            100
          ).toFixed(1),
        )
      : null;

    return {
      name: row[0],
      population: currPopulation,
      year: Number(row[2]),
      code: row[3],
      region: stateRegions[row[0]] || "Unknown",
      growth,
    };
  });

  const totalPopulation = formattedData.reduce((sum, state) => {
    return sum + state.population;
  }, 0);

  const statesWithShare = formattedData.map((state) => {
    return {
      ...state,
      share: Number(((state.population / totalPopulation) * 100).toFixed(1)),
    };
  });

  return statesWithShare;
}

export async function getCensusStateByCode(code) {
  const states = await getCensusStates();

  return states.find((state) => state.code === code);
}

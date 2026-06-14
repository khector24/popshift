import stateRegions from "../data/stateRegions.js";

const historicalYears = ["2020", "2021", "2022", "2023"];
const censusYearCache = {};

const censusRegions = ["West", "Northeast", "South", "Midwest", "Territory"];

async function fetchCensusStatesByYear(year) {
  if (censusYearCache[year]) {
    return censusYearCache[year];
  }

  const CENSUS_API_KEY = process.env.CENSUS_API_KEY;

  const url = new URL("https://api.census.gov/data/2023/pep/charv");

  url.searchParams.append("get", "NAME,POP");
  url.searchParams.append("for", "state:*");
  url.searchParams.append("YEAR", year);
  url.searchParams.append("MONTH", "7");
  url.searchParams.append("UNIVERSE", "R");
  url.searchParams.append("key", CENSUS_API_KEY);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch Census data for ${year}`);
  }

  const data = await response.json();

  censusYearCache[year] = data;

  return data;
}

function formatCensusRows(yearData) {
  const rows = yearData.slice(1);

  return rows.map((row) => ({
    name: row[0],
    population: Number(row[1]),
    year: Number(row[2]),
    code: row[5],
    region: stateRegions[row[0]] || "Unknown",
  }));
}

export async function getCensusStates() {
  const currentYearData = await fetchCensusStatesByYear("2023");
  const previousYearData = await fetchCensusStatesByYear("2022");

  const previousRows = formatCensusRows(previousYearData);
  const currentRows = formatCensusRows(currentYearData);

  const previousPopulationByCode = {};

  previousRows.forEach((state) => {
    previousPopulationByCode[state.code] = state.population;
  });

  const formattedData = currentRows.map((state) => {
    const previousPopulation = previousPopulationByCode[state.code];

    const growth = previousPopulation
      ? Number(
          (
            ((state.population - previousPopulation) / previousPopulation) *
            100
          ).toFixed(1),
        )
      : null;

    return {
      ...state,
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

export async function getCensusStateHistoryByCode(code) {
  const history = [];

  for (const year of historicalYears) {
    const yearData = await fetchCensusStatesByYear(year);

    const rows = formatCensusRows(yearData);

    const stateRow = rows.find((state) => state.code === code);

    if (stateRow) {
      history.push({
        year: stateRow.year,
        population: stateRow.population,
      });
    }
  }

  return history;
}

export async function getCensusDashboardSummary(startYear, endYear) {
  const startYearData = await fetchCensusStatesByYear(startYear);
  const endYearData = await fetchCensusStatesByYear(endYear);

  const startYearRows = formatCensusRows(startYearData);
  const endYearRows = formatCensusRows(endYearData);

  const startPopulationByCode = {};

  startYearRows.forEach((state) => {
    startPopulationByCode[state.code] = state.population;
  });

  const statesWithChange = endYearRows.map((state) => {
    const startPopulation = startPopulationByCode[state.code];

    return {
      ...state,
      startPopulation,
      endPopulation: state.population,
      populationChange: state.population - startPopulation,
      growth: Number(
        (
          ((state.population - startPopulation) / startPopulation) *
          100
        ).toFixed(1),
      ),
    };
  });

  const totalPopulation = statesWithChange.reduce((sum, state) => {
    return sum + state.endPopulation;
  }, 0);

  const totalPopulationChange = statesWithChange.reduce((sum, state) => {
    return sum + state.populationChange;
  }, 0);

  const topState = [...statesWithChange].sort((a, b) => {
    return b.endPopulation - a.endPopulation;
  })[0];

  const growthLeader = [...statesWithChange].sort((a, b) => {
    return b.growth - a.growth;
  })[0];

  const topGainers = [...statesWithChange]
    .sort((a, b) => {
      return b.growth - a.growth;
    })
    .slice(0, 5);

  const topDecliners = [...statesWithChange]
    .sort((a, b) => {
      return a.growth - b.growth;
    })
    .slice(0, 5);

  const populationGainLeader = [...statesWithChange].sort((a, b) => {
    return b.populationChange - a.populationChange;
  })[0];

  const populationByRegion = {};

  for (const region of censusRegions) {
    let currRegionPopulation = 0;
    statesWithChange.forEach((state) => {
      if (state.region === region) {
        currRegionPopulation += state.endPopulation;
      }
    });
    populationByRegion[region] = currRegionPopulation;
  }

  return {
    startYear: Number(startYear),
    endYear: Number(endYear),
    totalPopulation,
    totalPopulationChange,
    topState,
    growthLeader,
    populationGainLeader,
    topGainers,
    topDecliners,
    populationByRegion,
    states: statesWithChange,
  };
}

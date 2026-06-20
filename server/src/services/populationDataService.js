import {
  populationYears,
  nationalPopulation,
  statePopulation,
} from "../data/population/statePopulation2025.js";

import stateRegions from "../data/stateRegions.js";

const censusRegions = ["West", "Northeast", "South", "Midwest", "Territory"];

export function getCensusStates() {
  const currentYear = populationYears.at(-1);
  const previousYear = populationYears.at(-2);

  const formattedData = statePopulation.map((state) => {
    const currentPopulation = state.populationByYear[currentYear];
    const previousPopulation = state.populationByYear[previousYear];

    const growth = Number(
      (
        ((currentPopulation - previousPopulation) / previousPopulation) *
        100
      ).toFixed(1),
    );

    return {
      name: state.name,
      code: state.code,
      region: stateRegions[state.name] || "Unknown",
      population: currentPopulation,
      year: currentYear,
      growth,
    };
  });

  const totalPopulation = nationalPopulation.populationByYear[currentYear];

  return formattedData.map((state) => ({
    ...state,
    share: Number(((state.population / totalPopulation) * 100).toFixed(1)),
  }));
}

export function getCensusStateByCode(code) {
  const states = getCensusStates();

  return states.find((state) => state.code === code);
}

export function getCensusStateHistoryByCode(code) {
  const state = statePopulation.find((state) => state.code === code);

  if (!state) {
    return [];
  }

  return populationYears.map((year) => ({
    year,
    population: state.populationByYear[year],
  }));
}

export function getCensusDashboardSummary(startYear, endYear) {
  const startYearNumber = Number(startYear);
  const endYearNumber = Number(endYear);

  const statesWithChange = statePopulation.map((state) => {
    const startPopulation = state.populationByYear[startYearNumber];
    const endPopulation = state.populationByYear[endYearNumber];

    return {
      name: state.name,
      code: state.code,
      region: stateRegions[state.name] || "Unknown",
      startPopulation,
      endPopulation,
      population: endPopulation,
      populationChange: endPopulation - startPopulation,
      growth: Number(
        (((endPopulation - startPopulation) / startPopulation) * 100).toFixed(
          1,
        ),
      ),
    };
  });

  const totalPopulation = nationalPopulation.populationByYear[endYearNumber];

  const totalPopulationChange =
    nationalPopulation.populationByYear[endYearNumber] -
    nationalPopulation.populationByYear[startYearNumber];

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

  const populationTimeline = populationYears.map((year) => ({
    year,
    population: nationalPopulation.populationByYear[year],
  }));

  return {
    startYear: startYearNumber,
    endYear: endYearNumber,
    totalPopulation,
    totalPopulationChange,
    topState,
    growthLeader,
    populationGainLeader,
    topGainers,
    topDecliners,
    populationByRegion,
    populationTimeline,
    states: statesWithChange,
  };
}

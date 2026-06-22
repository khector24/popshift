import {
  economicDataYear,
  nationalEconomics,
  stateEconomics,
} from "../data/economics/stateEconomics2024.js";

function addNationalContext(state) {
  return {
    ...state,
    nationalContext: {
      incomeVsNational: Number(
        (state.medianIncome / nationalEconomics.medianIncome).toFixed(2),
      ),
      rentVsNational: Number(
        (state.medianRent / nationalEconomics.medianRent).toFixed(2),
      ),
      homeValueVsNational: Number(
        (state.medianHomeValue / nationalEconomics.medianHomeValue).toFixed(2),
      ),
    },
  };
}

export function getStateEconomics() {
  return {
    year: economicDataYear,
    national: nationalEconomics,
    data: stateEconomics.map((state) => addNationalContext(state)),
  };
}

export function getStateEconomicsByCode(code) {
  const foundState = stateEconomics.find((state) => state.code === code);

  return {
    year: economicDataYear,
    national: nationalEconomics,
    data: foundState ? addNationalContext(foundState) : null,
  };
}

export function getStateEconomicsByName(name) {
  const foundState = stateEconomics.find((state) => state.name === name);

  return {
    year: economicDataYear,
    national: nationalEconomics,
    data: foundState ? addNationalContext(foundState) : null,
  };
}

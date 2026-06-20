import {
  economicDataYear,
  stateEconomics,
} from "../data/economics/stateEconomics2024.js";

export function getStateEconomics() {
  return {
    year: economicDataYear,
    data: stateEconomics,
  };
}

export function getStateEconomicsByCode(code) {
  const state = stateEconomics.find((state) => state.code === code);

  return {
    year: economicDataYear,
    data: state || null,
  };
}

export function getStateEconomicsByName(name) {
  const state = stateEconomics.find((state) => state.name === name);

  return {
    year: economicDataYear,
    data: state || null,
  };
}

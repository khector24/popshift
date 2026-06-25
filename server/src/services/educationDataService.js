import {
  educationDataYear,
  educationMetadata,
  nationalEducation,
  stateEducation,
} from "../data/education/stateEducation.js";

export function getStateEducation() {
  return {
    year: educationDataYear,
    metadata: educationMetadata,
    national: nationalEducation,
    data: stateEducation,
  };
}
export function getStateEducationByCode(code) {
  return {
    year: educationDataYear,
    metadata: educationMetadata,
    national: nationalEducation,
    data: stateEducation[code] || null,
  };
}

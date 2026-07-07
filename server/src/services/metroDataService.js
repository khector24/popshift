import { topMetros } from "../data/metros/topMetros.js";
import { metroStates } from "../data/metros/metroStates.js";
import {
  metroPopulationYears,
  metroPopulation,
} from "../data/metros/metroPopulation2025.js";
import {
  metroACSYear,
  nationalACS,
  metroACS,
} from "../data/metros/metroACS2024.js";
import { metroCounties } from "../data/metros/metroCounties.js";
import {
  metroMigrationYear,
  metroMigration,
} from "../data/metros/metroMigration2023.js";

function getMetroStatesBySlug(slug) {
  const metroStateRecord = metroStates.find((metro) => metro.slug === slug);
  return metroStateRecord?.states || [];
}

function getMetroPopulationBySlug(slug) {
  const metroPopulationRecord = metroPopulation.find(
    (metro) => metro.slug === slug,
  );

  return {
    populationYears: metroPopulationYears,
    population: metroPopulationRecord?.population,
    populationByYear: metroPopulationRecord?.populationByYear,
    yearlyGrowth: metroPopulationRecord?.yearlyGrowth,
    growthSince2020: metroPopulationRecord?.growthSince2020,
  };
}

function getMetroACSBySlug(slug) {
  const metroACSRecord = metroACS.find((metro) => metro.slug === slug);

  return {
    metroACSYear,
    economics: metroACSRecord?.economics,
    housing: metroACSRecord?.housing,
    transportation: metroACSRecord?.transportation,
    education: metroACSRecord?.education,
  };
}

function getMetroCountiesBySlug(slug) {
  return (
    metroCounties[slug] ?? {
      cbsa: null,
      countyCount: 0,
      counties: [],
    }
  );
}

function getMetroMigrationBySlug(slug) {
  return {
    metroMigrationYear,
    ...(metroMigration[slug] ?? {
      inbound: [],
      outbound: [],
      totalInbound: 0,
      totalOutbound: 0,
      netMigration: 0,
    }),
  };
}

function buildMetro() {
  const metros = [];
  const nationalAverages = nationalACS;

  for (const metro of topMetros) {
    const { rank, name, slug } = metro;

    const states = getMetroStatesBySlug(slug);
    const populationRecord = getMetroPopulationBySlug(slug);

    const acsRecord = {
      ...getMetroACSBySlug(slug),
      nationalAverages,
    };

    const countiesRecord = getMetroCountiesBySlug(slug);
    const migrationRecord = getMetroMigrationBySlug(slug);

    const newMetro = {
      rank,
      name,
      slug,
      imageData: {
        name: metro.image,
        author: metro.imageAuthor,
        license: metro.imageLicense,
        url: metro.imageUrl,
      },

      ...populationRecord,
      ...acsRecord,

      states,

      counties: countiesRecord,
      migration: migrationRecord,
    };

    metros.push(newMetro);
  }

  return metros;
}

export function getMetros() {
  return buildMetro();
}

export function getMetroBySlug(slug) {
  return getMetros().find((metro) => metro.slug === slug) ?? null;
}

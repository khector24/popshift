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

/*
 * V1 DATA OWNERSHIP NOTE
 *
 * topMetros is currently used as the master list of metros included in V1
 * and as the source of manually curated image metadata.
 *
 * Do NOT treat topMetros.rank or topMetros.population as authoritative.
 * Those values may become stale when new Census population estimates are
 * released.
 *
 * Current rank, name, population, and population growth data should come
 * from metroPopulation2025.js.
 *
 * This duplication is intentionally being left in place for V1.
 * A future V2 data-pipeline/database refactor should establish clearer
 * canonical sources instead of duplicating fields across generated files.
 */

function getMetroStatesBySlug(slug) {
  const metroStateRecord = metroStates.find((metro) => metro.slug === slug);
  return metroStateRecord?.states || [];
}

function getMetroPopulationBySlug(slug) {
  const metroPopulationRecord = metroPopulation.find(
    (metro) => metro.slug === slug,
  );

  // Population data is authoritative for the metro's current rank and name.
  // Do not use the copies stored in topMetros for these fields.
  return {
    rank: metroPopulationRecord?.rank,
    name: metroPopulationRecord?.name,
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

  /*
   * topMetros determines which metros are included in V1.
   * We only need the slug here for joining datasets.
   *
   * Image metadata still comes directly from the metro object below.
   */
  for (const metro of topMetros) {
    const { slug } = metro;

    const states = getMetroStatesBySlug(slug);
    const populationRecord = getMetroPopulationBySlug(slug);

    const acsRecord = {
      ...getMetroACSBySlug(slug),
      nationalAverages,
    };

    const countiesRecord = getMetroCountiesBySlug(slug);
    const migrationRecord = getMetroMigrationBySlug(slug);

    const newMetro = {
      slug,

      // Image metadata is manually curated in topMetros for V1.
      imageData: {
        name: metro.image,
        author: metro.imageAuthor,
        license: metro.imageLicense,
        url: metro.imageUrl,
      },

      // Includes authoritative current rank, name, population, and growth.
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

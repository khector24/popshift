import {
  getCityBySlug,
  getCityState,
  getCityMetro,
  getCityPopulationHistory,
  getCityAcsProfile,
  getCityClimate,
  getCityCrime,
} from "./cities.service.js";

import {
  getCensusStateByCode,
  getCensusStateHistoryByCode,
} from "./populationDataService.js";
import { getStateEconomicsByCode } from "./economicsDataService.js";
import { getStateEducationByCode } from "./educationDataService.js";
import { getStateMigrationByCode } from "./migrationDataService.js";

import { getMetroBySlug } from "./metroDataService.js";

function toNumberOrNull(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

export async function buildCityComparisonProfile(slug) {
  const city = await getCityBySlug(slug);

  if (!city) {
    return null;
  }

  const [state, metro, populationHistory, acsProfile, climate, crime] =
    await Promise.all([
      getCityState(city.id),
      getCityMetro(city.id),
      getCityPopulationHistory(city.id),
      getCityAcsProfile(city.id),
      getCityClimate(city.id),
      getCityCrime(city.id),
    ]);

  const population2020 =
    populationHistory.find((record) => record.year === 2020) ?? null;
  const latestPopulation = populationHistory.at(-1) ?? null;

  let growthSince2020 = null;

  if (
    population2020 &&
    latestPopulation &&
    Number(population2020.population) !== 0
  ) {
    growthSince2020 =
      ((Number(latestPopulation.population) -
        Number(population2020.population)) /
        Number(population2020.population)) *
      100;
  }

  return {
    identity: {
      id: city.id,
      name: city.name,
      slug: city.slug,
      placeType: city.place_type,

      state: state
        ? {
            id: state.id,
            name: state.name,
            slug: state.slug,
            stateFips: state.state_fips,
            abbreviation: state.abbreviation,
          }
        : null,

      metro: metro
        ? {
            id: metro.id,
            name: metro.name,
            slug: metro.slug,
            cbsa: metro.cbsa,
          }
        : null,
    },

    population: {
      current: latestPopulation ? Number(latestPopulation.population) : null,
      year: latestPopulation?.year ?? null,
      growthSince2020:
        growthSince2020 !== null ? Number(growthSince2020.toFixed(1)) : null,
      history: populationHistory.map((record) => ({
        year: record.year,
        population: toNumberOrNull(record.population),
        source: record.source ?? null,
        datasetName: record.dataset_name ?? null,
        vintage: record.vintage ?? null,
      })),
    },

    economics: {
      year: acsProfile?.data_year ?? null,
      medianHouseholdIncome: toNumberOrNull(
        acsProfile?.median_household_income,
      ),
      povertyRate: toNumberOrNull(acsProfile?.poverty_rate),
      unemploymentRate: toNumberOrNull(acsProfile?.unemployment_rate),
    },

    education: {
      year: acsProfile?.data_year ?? null,
      highSchoolOrHigher: toNumberOrNull(acsProfile?.high_school_or_higher),
      bachelorsOrHigher: toNumberOrNull(acsProfile?.bachelors_or_higher),
    },

    housing: {
      year: acsProfile?.data_year ?? null,
      medianRent: toNumberOrNull(acsProfile?.median_rent),
      medianHomeValue: toNumberOrNull(acsProfile?.median_home_value),
      ownerShare: toNumberOrNull(acsProfile?.owner_share),
      renterShare: toNumberOrNull(acsProfile?.renter_share),
    },

    transportation: {
      year: acsProfile?.data_year ?? null,
      meanCommuteMinutes: toNumberOrNull(acsProfile?.mean_commute_minutes),
      driveShare: toNumberOrNull(acsProfile?.drive_share),
      carpoolShare: toNumberOrNull(acsProfile?.carpool_share),
      transitShare: toNumberOrNull(acsProfile?.transit_share),
      walkShare: toNumberOrNull(acsProfile?.walk_share),
      workFromHomeShare: toNumberOrNull(acsProfile?.work_from_home_share),
    },

    demographics: {
      year: acsProfile?.data_year ?? null,

      age: {
        under18Share: toNumberOrNull(acsProfile?.under_18_share),
        age18To24Share: toNumberOrNull(acsProfile?.age_18_24_share),
        age25To34Share: toNumberOrNull(acsProfile?.age_25_34_share),
        age35To44Share: toNumberOrNull(acsProfile?.age_35_44_share),
        age45To64Share: toNumberOrNull(acsProfile?.age_45_64_share),
        age65PlusShare: toNumberOrNull(acsProfile?.age_65_plus_share),
      },

      raceEthnicity: {
        whiteShare: toNumberOrNull(acsProfile?.white_share),
        blackShare: toNumberOrNull(acsProfile?.black_share),
        asianShare: toNumberOrNull(acsProfile?.asian_share),
        otherRaceShare: toNumberOrNull(acsProfile?.other_race_share),
        hispanicLatinoShare: toNumberOrNull(acsProfile?.hispanic_latino_share),
      },
    },

    climate: {
      normalPeriod: climate[0]?.normal_period ?? null,
      source: climate[0]?.source ?? null,
      datasetName: climate[0]?.dataset_name ?? null,
      vintage: climate[0]?.vintage ?? null,

      monthly: climate.map((month) => ({
        month: month.month,
        normalHigh: toNumberOrNull(month.normal_high),
        normalLow: toNumberOrNull(month.normal_low),
        normalMean: toNumberOrNull(month.normal_mean),
        precipitation: toNumberOrNull(month.precipitation),
        snowfall: toNumberOrNull(month.snowfall),
      })),
    },

    crime: {
      year: crime?.year ?? null,
      reportingPopulation: crime?.reporting_population ?? null,
      sourceJurisdictionName: crime?.source_jurisdiction_name ?? null,
      coverageStatus: crime?.coverage_status ?? null,
      coverageNotes: crime?.coverage_notes ?? null,

      violentCrime: {
        count: crime?.violent_crime_count ?? null,
        rate: toNumberOrNull(crime?.violent_crime_rate),

        murder: {
          count: crime?.murder_count ?? null,
          rate: toNumberOrNull(crime?.murder_rate),
        },

        rape: {
          count: crime?.rape_count ?? null,
          rate: toNumberOrNull(crime?.rape_rate),
        },

        robbery: {
          count: crime?.robbery_count ?? null,
          rate: toNumberOrNull(crime?.robbery_rate),
        },

        aggravatedAssault: {
          count: crime?.aggravated_assault_count ?? null,
          rate: toNumberOrNull(crime?.aggravated_assault_rate),
        },
      },

      propertyCrime: {
        count: crime?.property_crime_count ?? null,
        rate: toNumberOrNull(crime?.property_crime_rate),

        burglary: {
          count: crime?.burglary_count ?? null,
          rate: toNumberOrNull(crime?.burglary_rate),
        },

        larcenyTheft: {
          count: crime?.larceny_theft_count ?? null,
          rate: toNumberOrNull(crime?.larceny_theft_rate),
        },

        motorVehicleTheft: {
          count: crime?.motor_vehicle_theft_count ?? null,
          rate: toNumberOrNull(crime?.motor_vehicle_theft_rate),
        },
      },

      source: crime?.source ?? null,
      datasetName: crime?.dataset_name ?? null,
      vintage: crime?.vintage ?? null,
    },

    sources: {
      acs: {
        source: acsProfile?.source ?? null,
        datasetName: acsProfile?.dataset_name ?? null,
        vintage: acsProfile?.vintage ?? null,
      },
    },
  };
}

export async function buildCityComparison(slugs) {
  if (slugs.length < 2) {
    return null;
  }

  if (new Set(slugs).size !== slugs.length) {
    return null;
  }

  const places = await Promise.all(
    slugs.map((slug) => buildCityComparisonProfile(slug)),
  );

  if (places.some((place) => place === null)) {
    return null;
  }

  return {
    places,
  };
}

export function buildStateComparisonProfile(code) {
  const state = getCensusStateByCode(code);

  if (!state) {
    return null;
  }

  const populationHistory = getCensusStateHistoryByCode(code);
  const economics = getStateEconomicsByCode(code);
  const education = getStateEducationByCode(code);
  const migration = getStateMigrationByCode(code);

  const population2020 =
    populationHistory.find((record) => record.year === 2020) ?? null;

  let growthSince2020 = null;

  if (population2020 && Number(population2020.population) !== 0) {
    growthSince2020 =
      ((Number(state.population) - Number(population2020.population)) /
        Number(population2020.population)) *
      100;
  }

  const latestMigration =
    migration?.data?.years?.find(
      (record) => record.year === migration.latestYear,
    ) ?? null;

  return {
    identity: {
      name: state.name,
      code: state.code,
      placeType: "state",
      region: state.region ?? null,
    },

    population: {
      current: toNumberOrNull(state.population),
      year: state.year ?? null,
      growthSince2020:
        growthSince2020 !== null ? Number(growthSince2020.toFixed(1)) : null,
      history: populationHistory.map((record) => ({
        year: record.year,
        population: toNumberOrNull(record.population),
      })),
    },

    economics: {
      year: economics?.year ?? null,
      medianHouseholdIncome: toNumberOrNull(economics?.data?.medianIncome),
      medianRent: toNumberOrNull(economics?.data?.medianRent),
      medianHomeValue: toNumberOrNull(economics?.data?.medianHomeValue),
    },

    education: {
      year: education?.year ?? null,
      highSchoolOrHigher: toNumberOrNull(
        education?.data?.attainment?.highSchoolOrHigher,
      ),
      bachelorsOrHigher: toNumberOrNull(
        education?.data?.attainment?.bachelorsOrHigher,
      ),
      readingScore: toNumberOrNull(education?.data?.naep?.reading),
      mathScore: toNumberOrNull(education?.data?.naep?.math),
    },

    migration: {
      latestYear: migration?.latestYear ?? null,

      inbound:
        latestMigration?.inbound?.map((record) => ({
          state: record.state,
          code: record.code,
          movers: record.movers,
        })) ?? [],

      outbound:
        latestMigration?.outbound?.map((record) => ({
          state: record.state,
          code: record.code,
          movers: record.movers,
        })) ?? [],

      totalInbound: latestMigration?.totalInbound ?? null,
      totalOutbound: latestMigration?.totalOutbound ?? null,
      netMigration: latestMigration?.netMigration ?? null,

      history:
        migration?.data?.years?.map((record) => ({
          year: record.year,
          totalInbound: record.totalInbound,
          totalOutbound: record.totalOutbound,
          netMigration: record.netMigration,

          topInbound: [...record.inbound]
            .sort((a, b) => b.movers - a.movers)
            .slice(0, 5)
            .map((flow) => ({
              state: flow.state,
              code: flow.code,
              movers: flow.movers,
            })),

          topOutbound: [...record.outbound]
            .sort((a, b) => b.movers - a.movers)
            .slice(0, 5)
            .map((flow) => ({
              state: flow.state,
              code: flow.code,
              movers: flow.movers,
            })),
        })) ?? [],
    },
  };
}

export function buildStateComparison(codes) {
  if (codes.length < 2) {
    return null;
  }

  if (new Set(codes).size !== codes.length) {
    return null;
  }

  const places = codes.map((code) => buildStateComparisonProfile(code));

  if (places.some((place) => place === null)) {
    return null;
  }

  return {
    places,
  };
}

export function buildMetroComparisonProfile(slug) {
  const metro = getMetroBySlug(slug);

  if (!metro) {
    return null;
  }

  return {
    identity: {
      name: metro.name,
      slug: metro.slug,
      placeType: "metro",
      cbsa: metro.migration?.cbsa ?? metro.counties?.cbsa ?? null,
      states:
        metro.states?.map((state) => ({
          name: state.name,
          code: state.code,
          abbreviation: state.abbreviation,
        })) ?? [],
    },

    population: {
      current: toNumberOrNull(metro.population),
      year:
        metro.populationYears?.length > 0
          ? metro.populationYears[metro.populationYears.length - 1]
          : null,
      growthSince2020: toNumberOrNull(metro.growthSince2020?.percent),

      history:
        metro.populationYears?.map((year) => ({
          year,
          population: toNumberOrNull(metro.populationByYear?.[year]),
        })) ?? [],
    },

    economics: {
      year: metro.metroACSYear ?? null,
      medianHouseholdIncome: toNumberOrNull(
        metro.economics?.medianHouseholdIncome,
      ),
      povertyRate: toNumberOrNull(metro.economics?.povertyRate),
    },

    education: {
      year: metro.metroACSYear ?? null,
      highSchoolOrHigher: toNumberOrNull(metro.education?.highSchoolOrHigher),
      bachelorsOrHigher: toNumberOrNull(metro.education?.bachelorsOrHigher),
    },

    housing: {
      year: metro.metroACSYear ?? null,
      medianRent: toNumberOrNull(metro.housing?.medianGrossRent),
      medianHomeValue: toNumberOrNull(metro.housing?.medianHomeValue),
      rentAsPercentOfIncome: toNumberOrNull(
        metro.housing?.rentAsPercentOfIncome,
      ),
      homeValueToIncome: toNumberOrNull(metro.housing?.homeValueToIncome),
    },

    transportation: {
      year: metro.metroACSYear ?? null,
      driveShare: toNumberOrNull(metro.transportation?.driveAlone),
      transitShare: toNumberOrNull(metro.transportation?.publicTransit),
      workFromHomeShare: toNumberOrNull(metro.transportation?.workFromHome),
      meanCommuteMinutes: toNumberOrNull(
        metro.transportation?.averageCommuteMinutes,
      ),
    },

    migration: {
      year: metro.migration?.metroMigrationYear ?? null,
      totalInbound: toNumberOrNull(metro.migration?.totalInbound),
      totalOutbound: toNumberOrNull(metro.migration?.totalOutbound),
      netMigration: toNumberOrNull(metro.migration?.netMigration),

      inbound:
        metro.migration?.inbound?.map((record) => ({
          name: record.name,
          slug: record.slug,
          cbsa: record.cbsa,
          movers: toNumberOrNull(record.movers),
        })) ?? [],

      outbound:
        metro.migration?.outbound?.map((record) => ({
          name: record.name,
          slug: record.slug,
          cbsa: record.cbsa,
          movers: toNumberOrNull(record.movers),
        })) ?? [],
    },
  };
}

export function buildMetroComparison(slugs) {
  if (slugs.length < 2) {
    return null;
  }

  if (new Set(slugs).size !== slugs.length) {
    return null;
  }

  const places = slugs.map((slug) => buildMetroComparisonProfile(slug));

  if (places.some((place) => place === null)) {
    return null;
  }

  return {
    places,
  };
}

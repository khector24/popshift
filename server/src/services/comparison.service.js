import {
  getCityBySlug,
  getCityState,
  getCityMetro,
  getCityPopulationHistory,
  getCityAcsProfile,
  getCityClimate,
  getCityCrime,
} from "./cities.service.js";

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

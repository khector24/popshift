import fs from "fs";
import path from "path";
import shp from "shpjs";
import intersect from "@turf/intersect";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { featureCollection, point } from "@turf/helpers";
import { cityDirectory } from "../data/cities/cityDirectory.js";
import { metroCounties } from "../data/metros/metroCounties.js";

const TIGER_DIR = "./src/data/cities/raw/tiger2025";
const COUNTY_PATH = path.join(TIGER_DIR, "tl_2025_us_county.zip");
const OUTPUT_PATH = "./src/data/cities/cityMetroMembership.js";

async function loadShapefile(zipPath) {
  const zipBuffer = fs.readFileSync(zipPath);

  return shp(zipBuffer);
}

function getPlaceZipPath(stateFips) {
  return path.join(TIGER_DIR, `tl_2025_${stateFips}_place.zip`);
}

function groupCountiesByState(countyFeatures) {
  const countiesByState = new Map();

  for (const countyFeature of countyFeatures) {
    const stateFips = countyFeature.properties.STATEFP;

    if (!countiesByState.has(stateFips)) {
      countiesByState.set(stateFips, []);
    }

    countiesByState.get(stateFips).push(countyFeature);
  }

  return countiesByState;
}

function getMetroMatches(countyFips) {
  return Object.entries(metroCounties)
    .map(([slug, metro]) => {
      const matchingCountyFips = metro.counties
        .filter((county) => countyFips.includes(county.fips))
        .map((county) => county.fips);

      if (matchingCountyFips.length === 0) {
        return null;
      }

      return {
        slug,
        cbsa: metro.cbsa,
        matchingCountyFips,
      };
    })
    .filter(Boolean);
}

function findInternalPointCounty(cityFeature, countyFeatures) {
  const longitude = Number(cityFeature.properties.INTPTLON);
  const latitude = Number(cityFeature.properties.INTPTLAT);

  const internalPoint = point([longitude, latitude]);

  return countyFeatures.find((countyFeature) =>
    booleanPointInPolygon(internalPoint, countyFeature),
  );
}

function choosePrimaryMetro(cityFeature, countyFeatures, metroMatches) {
  if (metroMatches.length === 0) {
    return null;
  }

  if (metroMatches.length === 1) {
    return metroMatches[0];
  }

  const internalPointCounty = findInternalPointCounty(
    cityFeature,
    countyFeatures,
  );

  if (!internalPointCounty) {
    throw new Error(
      `Could not find internal-point county for ${cityFeature.properties.NAME}`,
    );
  }

  const internalPointCountyFips = internalPointCounty.properties.GEOID;

  const primaryMetro = metroMatches.find((metro) =>
    metro.matchingCountyFips.includes(internalPointCountyFips),
  );

  if (!primaryMetro) {
    throw new Error(
      `Could not resolve primary metro for ${cityFeature.properties.NAME}`,
    );
  }

  return primaryMetro;
}

async function buildCityMetroMembership() {
  console.log("Loading national county geography...");

  const countyGeoJson = await loadShapefile(COUNTY_PATH);
  const countiesByState = groupCountiesByState(countyGeoJson.features);

  const citiesByState = new Map();

  for (const city of cityDirectory) {
    const stateFips = city.geoid.slice(0, 2);

    if (!citiesByState.has(stateFips)) {
      citiesByState.set(stateFips, []);
    }

    citiesByState.get(stateFips).push(city);
  }

  const memberships = [];
  const unsupportedCities = [];
  const multipleMetroCities = [];

  for (const [stateFips, cities] of citiesByState) {
    console.log(`Processing state ${stateFips}: ${cities.length} cities...`);

    const placeGeoJson = await loadShapefile(getPlaceZipPath(stateFips));

    const placesByGeoid = new Map(
      placeGeoJson.features.map((feature) => [
        feature.properties.GEOID,
        feature,
      ]),
    );

    const stateCountyFeatures = countiesByState.get(stateFips) ?? [];

    for (const city of cities) {
      const cityFeature = placesByGeoid.get(city.geoid);

      if (!cityFeature) {
        throw new Error(
          `No TIGER place geometry found for ${city.name}, ${city.stateAbbreviation}`,
        );
      }

      const overlappingCountyFeatures = stateCountyFeatures.filter(
        (countyFeature) => {
          try {
            return Boolean(
              intersect(featureCollection([cityFeature, countyFeature])),
            );
          } catch {
            return false;
          }
        },
      );

      const counties = overlappingCountyFeatures.map((countyFeature) => ({
        fips: countyFeature.properties.GEOID,
        name: countyFeature.properties.NAME,
      }));

      if (counties.length === 0) {
        throw new Error(
          `No county overlap found for ${city.name}, ${city.stateAbbreviation}`,
        );
      }

      const countyFips = counties.map((county) => county.fips);

      const metroMatches = getMetroMatches(countyFips);

      const primaryMetro = choosePrimaryMetro(
        cityFeature,
        overlappingCountyFeatures,
        metroMatches,
      );

      if (metroMatches.length === 0) {
        unsupportedCities.push({
          rank: city.rank,
          name: city.name,
          state: city.stateAbbreviation,
          counties,
        });
      }

      if (metroMatches.length > 1) {
        multipleMetroCities.push({
          rank: city.rank,
          name: city.name,
          state: city.stateAbbreviation,
          counties,
          metroMatches,
          selectedMetro: primaryMetro,
        });
      }

      memberships.push({
        geoid: city.geoid,
        cityName: city.name,
        stateAbbreviation: city.stateAbbreviation,
        counties,
        metroSlug: primaryMetro?.slug ?? null,
        cbsa: primaryMetro?.cbsa ?? null,
      });
    }
  }

  console.log(`\nCities processed: ${memberships.length}`);

  console.log(
    `Cities with supported metro: ${
      memberships.filter((city) => city.cbsa !== null).length
    }`,
  );

  console.log(
    `Cities without supported metro: ${
      memberships.filter((city) => city.cbsa === null).length
    }`,
  );

  console.log(
    `Cities requiring multi-metro resolution: ${multipleMetroCities.length}`,
  );

  console.log("\nResolved multi-metro cities:");
  console.dir(multipleMetroCities, { depth: null });

  const output = `export const cityMetroMembership = ${JSON.stringify(
    memberships,
    null,
    2,
  )};\n`;

  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(`\nCity metro membership written: ${memberships.length} cities`);
}

buildCityMetroMembership();

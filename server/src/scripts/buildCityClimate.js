import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { cityDirectory } from "../data/cities/cityDirectory.js";
import { parse } from "csv-parse/sync";

const ARCHIVE_PATH =
  "./src/data/climate/raw/" +
  "us-climate-normals_1991-2020_v1.0.1_" +
  "monthly_multivariate_by-station_c20230404.tar.gz";

const OUTPUT_PATH = "./src/data/climate/cityClimate1991_2020.js";

const NORMAL_PERIOD = "1991-2020";

const REQUIRED_FIELDS = [
  "MLY-TMAX-NORMAL",
  "MLY-TMIN-NORMAL",
  "MLY-TAVG-NORMAL",
  "MLY-PRCP-NORMAL",
];

const ACCEPTABLE_FLAGS = new Set(["S", "R", "P"]);

const STATION_OVERRIDES = {
  "0667000": "USW00023272",
};

const EARTH_RADIUS_MILES = 3958.7613;

function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);

  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}

function extractArchive() {
  const tempDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "regionlore-climate-"),
  );

  execFileSync("tar", ["-xzf", ARCHIVE_PATH, "-C", tempDirectory], {
    stdio: "inherit",
  });

  return tempDirectory;
}

function findCsvFiles(directory) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...findCsvFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".csv")) {
      files.push(fullPath);
    }
  }

  return files;
}

function loadEligibleStations(directory) {
  const csvFiles = findCsvFiles(directory);
  const stations = [];

  for (const filePath of csvFiles) {
    const text = fs.readFileSync(filePath, "utf8");

    const rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      trim: true,
    });

    if (rows.length !== 12) {
      continue;
    }

    const first = rows[0];

    if (!REQUIRED_FIELDS.every((field) => field in first)) {
      continue;
    }

    let qualifies = true;

    for (const row of rows) {
      for (const field of REQUIRED_FIELDS) {
        const value = row[field];

        if (value === undefined || value === null || value === "") {
          qualifies = false;
          break;
        }

        const flag = row[`comp_flag_${field}`];

        if (!ACCEPTABLE_FLAGS.has(flag)) {
          qualifies = false;
          break;
        }
      }

      if (!qualifies) {
        break;
      }
    }

    if (!qualifies) {
      continue;
    }

    stations.push({
      station: first.STATION,
      name: first.NAME,
      latitude: Number(first.LATITUDE),
      longitude: Number(first.LONGITUDE),
      rows,
    });
  }

  return stations;
}

function findNearestStation(city, stations) {
  const overrideStationId = STATION_OVERRIDES[city.geoid];

  if (overrideStationId) {
    const overrideStation = stations.find(
      (station) => station.station === overrideStationId,
    );

    if (!overrideStation) {
      throw new Error(
        `Climate station override ${overrideStationId} not found for ${city.name}`,
      );
    }

    return {
      station: overrideStation,
      distance: haversineMiles(
        city.latitude,
        city.longitude,
        overrideStation.latitude,
        overrideStation.longitude,
      ),
      override: true,
    };
  }

  let nearestStation = null;
  let nearestDistance = Infinity;

  for (const station of stations) {
    const distance = haversineMiles(
      city.latitude,
      city.longitude,
      station.latitude,
      station.longitude,
    );

    if (distance < nearestDistance) {
      nearestStation = station;
      nearestDistance = distance;
    }
  }

  if (!nearestStation) {
    throw new Error(`No climate station found for ${city.name}`);
  }

  return {
    station: nearestStation,
    distance: nearestDistance,
    override: false,
  };
}

function buildCityClimate() {
  const tempDirectory = extractArchive();

  try {
    const stations = loadEligibleStations(tempDirectory);

    console.log(`Eligible S/R/P stations: ${stations.length.toLocaleString()}`);

    const mappings = cityDirectory.map((city) => {
      const result = findNearestStation(city, stations);

      return {
        city,
        ...result,
      };
    });

    console.log(`Cities mapped: ${mappings.length}`);

    console.log();
    console.log("Mappings beyond 15 miles");
    console.log("------------------------");

    for (const mapping of mappings
      .filter((mapping) => mapping.distance > 15)
      .sort((a, b) => b.distance - a.distance)) {
      console.log(
        `${mapping.city.name.padEnd(28)} ` +
          `${mapping.distance.toFixed(1).padStart(5)} mi  ` +
          `${mapping.station.station}  ` +
          `${mapping.station.name}` +
          (mapping.override ? "  [OVERRIDE]" : ""),
      );
    }

    const cityClimate = mappings.map(buildClimateRecord);

    const output = `export const cityClimate1991_2020 = ${JSON.stringify(
      cityClimate,
      null,
      2,
    )};
    `;

    fs.writeFileSync(OUTPUT_PATH, output);

    const monthlyRows = cityClimate.reduce(
      (total, city) => total + city.months.length,
      0,
    );

    console.log();
    console.log(`Climate cities written: ${cityClimate.length}`);
    console.log(`Monthly climate rows written: ${monthlyRows}`);
    console.log(`Output: ${OUTPUT_PATH}`);
  } finally {
    fs.rmSync(tempDirectory, {
      recursive: true,
      force: true,
    });
  }
}

function buildMonthlyClimate(mapping) {
  return mapping.station.rows.map((row) => ({
    month: Number(row.DATE),
    normalHigh: Number(row["MLY-TMAX-NORMAL"]),
    normalLow: Number(row["MLY-TMIN-NORMAL"]),
    normalMean: Number(row["MLY-TAVG-NORMAL"]),
    precipitation: Number(row["MLY-PRCP-NORMAL"]),
  }));
}

function buildClimateRecord(mapping) {
  return {
    geoid: mapping.city.geoid,
    name: mapping.city.name,
    stateAbbreviation: mapping.city.stateAbbreviation,
    normalPeriod: NORMAL_PERIOD,

    station: {
      id: mapping.station.station,
      name: mapping.station.name,
      latitude: mapping.station.latitude,
      longitude: mapping.station.longitude,
      distanceMiles: Number(mapping.distance.toFixed(1)),
      override: mapping.override,
    },

    months: buildMonthlyClimate(mapping),
  };
}

buildCityClimate();

import fs from "fs";
import path from "path";
import { execFileSync } from "node:child_process";
import { cityDirectory } from "../data/cities/cityDirectory.js";

const TIGER_YEAR = 2025;

const OUTPUT_DIR = `./src/data/cities/raw/tiger${TIGER_YEAR}`;

function downloadFile(url, outputPath) {
  if (fs.existsSync(outputPath)) {
    console.log(`Already exists: ${path.basename(outputPath)}`);
    return;
  }

  console.log(`Downloading ${path.basename(outputPath)}...`);

  execFileSync("curl", ["-L", url, "-o", outputPath], {
    stdio: "inherit",
  });
}

function downloadCityMetroSources() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const countyFileName = `tl_${TIGER_YEAR}_us_county.zip`;

  downloadFile(
    `https://www2.census.gov/geo/tiger/TIGER${TIGER_YEAR}/COUNTY/${countyFileName}`,
    path.join(OUTPUT_DIR, countyFileName),
  );

  const stateFips = [
    ...new Set(cityDirectory.map((city) => city.geoid.slice(0, 2))),
  ].sort();

  console.log(
    `Downloading PLACE files for ${stateFips.length} jurisdictions...`,
  );

  for (const fips of stateFips) {
    const fileName = `tl_${TIGER_YEAR}_${fips}_place.zip`;

    downloadFile(
      `https://www2.census.gov/geo/tiger/TIGER${TIGER_YEAR}/PLACE/${fileName}`,
      path.join(OUTPUT_DIR, fileName),
    );
  }

  console.log("City metro source downloads complete.");
}

downloadCityMetroSources();

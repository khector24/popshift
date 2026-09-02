import pool from "../db/index.js";

const DATA_SOURCES = [
  {
    name: "U.S. Census Bureau",
    organization: "U.S. Department of Commerce",
    baseUrl: "https://www.census.gov/",
  },
  {
    name: "National Center for Education Statistics",
    organization: "U.S. Department of Education",
    baseUrl: "https://nces.ed.gov/",
  },
  {
    name: "Internal Revenue Service",
    organization: "U.S. Department of the Treasury",
    baseUrl: "https://www.irs.gov/",
  },
  {
    name: "National Oceanic and Atmospheric Administration",
    organization: "U.S. Department of Commerce",
    baseUrl: "https://www.noaa.gov/",
  },
  {
    name: "Federal Bureau of Investigation",
    organization: "U.S. Department of Justice",
    baseUrl: "https://www.fbi.gov/",
  },
  {
    name: "OpenWeather",
    organization: "OpenWeather",
    baseUrl: "https://openweathermap.org/",
  },
];

async function seedDataSources() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const source of DATA_SOURCES) {
      await client.query(
        `
          INSERT INTO data_sources (
            name,
            organization,
            base_url
          )
          VALUES ($1, $2, $3)
          ON CONFLICT (name)
          DO UPDATE SET
            organization = EXCLUDED.organization,
            base_url = EXCLUDED.base_url;
        `,
        [source.name, source.organization, source.baseUrl],
      );
    }

    await client.query("COMMIT");

    console.log(`Data sources seeded: ${DATA_SOURCES.length}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Data source seed failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDataSources();

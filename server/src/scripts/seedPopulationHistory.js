import pool from "../db/index.js";
import { cityPopulationHistory } from "../data/cities/cityPopulationHistory.js";

async function getCityPopulationReleaseId(client) {
  const result = await client.query(
    `
      SELECT dr.id
      FROM data_releases dr
      JOIN data_sources ds
        ON ds.id = dr.source_id
      WHERE ds.name = 'U.S. Census Bureau'
        AND dr.dataset_name = 'City and Town Population Estimates'
        AND dr.data_year = 2025
        AND dr.vintage = '2025';
    `,
  );

  if (result.rows.length === 0) {
    throw new Error("City population data release not found.");
  }

  return result.rows[0].id;
}

async function seedPopulationHistory() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const dataReleaseId = await getCityPopulationReleaseId(client);

    let insertedRows = 0;

    for (const city of cityPopulationHistory) {
      const cityResult = await client.query(
        `
          SELECT place_id
          FROM cities
          WHERE geoid = $1;
        `,
        [city.geoid],
      );

      if (cityResult.rows.length === 0) {
        throw new Error(
          `No database city found for ${city.name} (${city.geoid})`,
        );
      }

      const placeId = cityResult.rows[0].place_id;

      for (const [year, population] of Object.entries(city.populations)) {
        await client.query(
          `
            INSERT INTO population_history (
              place_id,
              year,
              population,
              data_release_id
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (place_id, year)
            DO UPDATE SET
              population = EXCLUDED.population,
              data_release_id = EXCLUDED.data_release_id;
          `,
          [placeId, Number(year), population, dataReleaseId],
        );

        insertedRows += 1;
      }
    }

    await client.query("COMMIT");

    console.log(`Population history seeded: ${insertedRows} rows`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Population history seed failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedPopulationHistory();

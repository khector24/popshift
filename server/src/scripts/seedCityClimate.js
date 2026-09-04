import pool from "../db/index.js";
import { cityClimate1991_2020 } from "../data/climate/cityClimate1991_2020.js";

async function getClimateReleaseId(client) {
  const result = await client.query(
    `
      SELECT dr.id
      FROM data_releases dr
      JOIN data_sources ds
        ON ds.id = dr.source_id
      WHERE ds.name = 'National Oceanic and Atmospheric Administration'
        AND dr.dataset_name = 'U.S. Monthly Climate Normals'
        AND dr.data_year = 2020
        AND dr.vintage = '1991-2020';
    `,
  );

  if (result.rows.length === 0) {
    throw new Error("NOAA climate data release not found.");
  }

  return result.rows[0].id;
}

async function seedCityClimate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const dataReleaseId = await getClimateReleaseId(client);

    let insertedRows = 0;

    for (const city of cityClimate1991_2020) {
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

      for (const month of city.months) {
        await client.query(
          `
            INSERT INTO climate_monthly (
              place_id,
              month,
              normal_period,
              normal_high,
              normal_low,
              normal_mean,
              precipitation,
              snowfall,
              data_release_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (place_id, month, normal_period)
            DO UPDATE SET
              normal_high = EXCLUDED.normal_high,
              normal_low = EXCLUDED.normal_low,
              normal_mean = EXCLUDED.normal_mean,
              precipitation = EXCLUDED.precipitation,
              snowfall = EXCLUDED.snowfall,
              data_release_id = EXCLUDED.data_release_id;
          `,
          [
            placeId,
            month.month,
            city.normalPeriod,
            month.normalHigh,
            month.normalLow,
            month.normalMean,
            month.precipitation,
            null,
            dataReleaseId,
          ],
        );

        insertedRows += 1;
      }
    }

    await client.query("COMMIT");

    console.log(`City climate seeded: ${insertedRows} rows`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("City climate seed failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedCityClimate();

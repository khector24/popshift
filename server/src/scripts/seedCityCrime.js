import pool from "../db/index.js";
import { cityCrime2024 } from "../data/crime/cityCrime2024.js";

async function getCrimeReleaseId(client) {
  const result = await client.query(`
    SELECT dr.id
    FROM data_releases dr
    JOIN data_sources ds
      ON ds.id = dr.source_id
    WHERE ds.name = 'Federal Bureau of Investigation'
      AND dr.dataset_name = 'Offenses Known to Law Enforcement by State by City'
      AND dr.data_year = 2024
      AND dr.vintage = '2024'
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    throw new Error("FBI 2024 crime data release not found.");
  }

  return result.rows[0].id;
}

async function getPlaceIdByGeoid(client, geoid) {
  const result = await client.query(
    `
      SELECT place_id
      FROM cities
      WHERE geoid = $1
      LIMIT 1
    `,
    [geoid],
  );

  if (result.rows.length === 0) {
    throw new Error(`City not found for GEOID ${geoid}.`);
  }

  return result.rows[0].place_id;
}

async function seedCityCrime() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const dataReleaseId = await getCrimeReleaseId(client);

    let seededCount = 0;

    for (const city of cityCrime2024) {
      const placeId = await getPlaceIdByGeoid(client, city.geoid);

      await client.query(
        `
          INSERT INTO crime_statistics (
            place_id,
            year,
            reporting_population,
            source_jurisdiction_name,
            coverage_status,
            coverage_notes,

            violent_crime_count,
            violent_crime_rate,

            murder_count,
            murder_rate,

            rape_count,
            rape_rate,

            robbery_count,
            robbery_rate,

            aggravated_assault_count,
            aggravated_assault_rate,

            property_crime_count,
            property_crime_rate,

            burglary_count,
            burglary_rate,

            larceny_theft_count,
            larceny_theft_rate,

            motor_vehicle_theft_count,
            motor_vehicle_theft_rate,

            data_release_id
          )
          VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8,
            $9, $10,
            $11, $12,
            $13, $14,
            $15, $16,
            $17, $18,
            $19, $20,
            $21, $22,
            $23, $24,
            $25
          )
          ON CONFLICT (place_id, year)
          DO UPDATE SET
            reporting_population = EXCLUDED.reporting_population,
            source_jurisdiction_name = EXCLUDED.source_jurisdiction_name,
            coverage_status = EXCLUDED.coverage_status,
            coverage_notes = EXCLUDED.coverage_notes,

            violent_crime_count = EXCLUDED.violent_crime_count,
            violent_crime_rate = EXCLUDED.violent_crime_rate,

            murder_count = EXCLUDED.murder_count,
            murder_rate = EXCLUDED.murder_rate,

            rape_count = EXCLUDED.rape_count,
            rape_rate = EXCLUDED.rape_rate,

            robbery_count = EXCLUDED.robbery_count,
            robbery_rate = EXCLUDED.robbery_rate,

            aggravated_assault_count = EXCLUDED.aggravated_assault_count,
            aggravated_assault_rate = EXCLUDED.aggravated_assault_rate,

            property_crime_count = EXCLUDED.property_crime_count,
            property_crime_rate = EXCLUDED.property_crime_rate,

            burglary_count = EXCLUDED.burglary_count,
            burglary_rate = EXCLUDED.burglary_rate,

            larceny_theft_count = EXCLUDED.larceny_theft_count,
            larceny_theft_rate = EXCLUDED.larceny_theft_rate,

            motor_vehicle_theft_count =
              EXCLUDED.motor_vehicle_theft_count,
            motor_vehicle_theft_rate =
              EXCLUDED.motor_vehicle_theft_rate,

            data_release_id = EXCLUDED.data_release_id
        `,
        [
          placeId,
          city.dataYear,
          city.fbiPopulation,
          city.fbiCity,
          city.coverageStatus,
          city.coverageNotes,

          city.counts?.violentCrime ?? null,
          city.rates.violentCrime,

          city.counts?.murder ?? null,
          city.rates.murder,

          city.counts?.rape ?? null,
          city.rates.rape,

          city.counts?.robbery ?? null,
          city.rates.robbery,

          city.counts?.aggravatedAssault ?? null,
          city.rates.aggravatedAssault,

          city.counts?.propertyCrime ?? null,
          city.rates.propertyCrime,

          city.counts?.burglary ?? null,
          city.rates.burglary,

          city.counts?.larcenyTheft ?? null,
          city.rates.larcenyTheft,

          city.counts?.motorVehicleTheft ?? null,
          city.rates.motorVehicleTheft,

          dataReleaseId,
        ],
      );

      seededCount += 1;
    }

    await client.query("COMMIT");

    console.log(`Crime rows seeded: ${seededCount}`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedCityCrime().catch((error) => {
  console.error(error);
  process.exit(1);
});

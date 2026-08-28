import pool from "../db/index.js";

async function seedUnitedStates(client) {
  const placeResult = await client.query(`
    INSERT INTO places (name, slug, place_type)
    VALUES ('United States', 'united-states', 'country')
    ON CONFLICT (slug)
    DO UPDATE SET
      name = EXCLUDED.name,
      place_type = EXCLUDED.place_type,
      updated_at = current_timestamp
    RETURNING id;
  `);

  const unitedStatesPlaceId = placeResult.rows[0].id;

  await client.query(
    `
    INSERT INTO countries (place_id, iso2, iso3)
    VALUES ($1, 'US', 'USA')
    ON CONFLICT (place_id)
    DO UPDATE SET
        iso2 = EXCLUDED.iso2,
        iso3 = EXCLUDED.iso3;
    `,
    [unitedStatesPlaceId],
  );

  return unitedStatesPlaceId;
}

async function seedGeographyIdentities() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const unitedStatesPlaceId = await seedUnitedStates(client);

    console.log(`United States place ID: ${unitedStatesPlaceId}`);

    await client.query("COMMIT");

    console.log("Geography identity seed complete.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Geography identity seed failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedGeographyIdentities();

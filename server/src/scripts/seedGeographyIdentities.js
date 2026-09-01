import pool from "../db/index.js";
import { statePopulation } from "../data/population/statePopulation2025.js";
import { topMetros } from "../data/metros/topMetros.js";
import { metroCounties } from "../data/metros/metroCounties.js";
import { STATE_ABBREVIATIONS_BY_NAME } from "../data/stateAbbreviations.js";
import { cityDirectory } from "../data/cities/cityDirectory.js";

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

  await seedPlaceAlias(client, unitedStatesPlaceId, "United States");
  await seedPlaceAlias(client, unitedStatesPlaceId, "United States of America");
  await seedPlaceAlias(client, unitedStatesPlaceId, "US");
  await seedPlaceAlias(client, unitedStatesPlaceId, "USA");

  console.log(`United States seeded. Place ID: ${unitedStatesPlaceId}`);

  return unitedStatesPlaceId;
}

function getStateLevelPlaceType(state) {
  if (state.code === "11") {
    return "federal_district";
  }

  if (state.code === "72") {
    return "territory";
  }

  return "state";
}

function normalizeAlias(alias) {
  return alias.trim().toLowerCase().replace(/\s+/g, " ");
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getRelationshipTypeId(client, code) {
  const result = await client.query(
    `
        SELECT id
        FROM relationship_types
        WHERE code = $1;
    `,
    [code],
  );

  return result.rows[0].id;
}

async function seedPlaceAlias(client, placeId, alias) {
  const cleanAlias = alias.trim().replace(/\s+/g, " ");
  const normalizedAlias = normalizeAlias(cleanAlias);

  await client.query(
    `
    INSERT INTO place_aliases (
        place_id,
        alias,
        normalized_alias
    )
    VALUES ($1, $2, $3)
    ON CONFLICT (place_id, normalized_alias)
    DO UPDATE SET
        alias = EXCLUDED.alias;
    `,
    [placeId, cleanAlias, normalizedAlias],
  );
}

async function seedStateLevelPlaces(
  client,
  unitedStatesPlaceId,
  locatedInRelationshipTypeId,
) {
  for (const state of statePopulation) {
    const placeType = getStateLevelPlaceType(state);
    const slug = slugify(state.name);

    const placeResult = await client.query(
      `
        INSERT INTO places (name, slug, place_type)
        VALUES ($1, $2, $3)
        ON CONFLICT (slug)
        DO UPDATE SET
            name = EXCLUDED.name,
            place_type = EXCLUDED.place_type,
            updated_at = current_timestamp
        RETURNING id;
     `,
      [state.name, slug, placeType],
    );

    const placeId = placeResult.rows[0].id;

    const abbreviation = STATE_ABBREVIATIONS_BY_NAME[state.name];

    await seedPlaceAlias(client, placeId, state.name);

    if (abbreviation) {
      await seedPlaceAlias(client, placeId, abbreviation);
    }

    if (state.code === "11") {
      await seedPlaceAlias(client, placeId, "Washington DC");
      await seedPlaceAlias(client, placeId, "Washington, DC");
    }

    if (placeType === "state") {
      await client.query(
        `
            INSERT INTO states (place_id, state_fips, abbreviation)
            VALUES ($1, $2, $3)
            ON CONFLICT (place_id)
            DO UPDATE SET
                state_fips = EXCLUDED.state_fips,
                abbreviation = EXCLUDED.abbreviation;
        `,
        [placeId, state.code, abbreviation],
      );
    }

    await client.query(
      `
        INSERT INTO place_relationships (
            from_place_id,
            to_place_id,
            relationship_type_id
        )
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING;
      `,
      [placeId, unitedStatesPlaceId, locatedInRelationshipTypeId],
    );
  }

  console.log(`State-level places seeded: ${statePopulation.length}`);
}

async function seedMetros(client) {
  for (const metro of topMetros) {
    const slug = metro.slug;
    const metroCountyRecord = metroCounties[slug];
    const cbsa = metroCountyRecord.cbsa;

    const placeResult = await client.query(
      `
        INSERT INTO places (name, slug, place_type)
        VALUES ($1, $2, 'metro')
        ON CONFLICT (slug)
        DO UPDATE SET
            name = EXCLUDED.name,
            place_type = EXCLUDED.place_type,
            updated_at = current_timestamp
        RETURNING id;
      `,
      [metro.name, slug],
    );

    const placeId = placeResult.rows[0].id;

    await client.query(
      `
        INSERT INTO metros (place_id, cbsa)
        VALUES ($1, $2)
        ON CONFLICT (place_id)
        DO UPDATE SET
            cbsa = EXCLUDED.cbsa;
      `,
      [placeId, cbsa],
    );
  }

  console.log(`Metros seeded: ${topMetros.length}`);
}

async function seedCities(client, locatedInRelationshipTypeId) {
  for (const city of cityDirectory) {
    const slug = `${slugify(city.name)}-${city.stateAbbreviation.toLowerCase()}`;

    const placeResult = await client.query(
      `
        INSERT INTO places (name, slug, place_type)
        VALUES ($1, $2, 'city')
        ON CONFLICT (slug)
        DO UPDATE SET
            name = EXCLUDED.name,
            place_type = EXCLUDED.place_type,
            updated_at = current_timestamp
        RETURNING id;
      `,
      [city.name, slug],
    );

    const placeId = placeResult.rows[0].id;

    const stateFips = city.geoid.slice(0, 2);
    const placeFips = city.geoid.slice(2);

    await client.query(
      `
        INSERT INTO cities (
            place_id, state_fips, place_fips, geoid,
            latitude, longitude, land_area, water_area)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (place_id)
        DO UPDATE SET
            state_fips = EXCLUDED.state_fips,
            place_fips = EXCLUDED.place_fips,
            geoid = EXCLUDED.geoid,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            land_area = EXCLUDED.land_area,
            water_area = EXCLUDED.water_area;
      `,
      [
        placeId,
        stateFips,
        placeFips,
        city.geoid,
        city.latitude,
        city.longitude,
        city.landArea,
        city.waterArea,
      ],
    );

    const statePlaceResult = await client.query(
      `
        SELECT id
        FROM places
        WHERE name = $1
            AND place_type IN ('state', 'federal_district', 'territory');
      `,
      [city.stateName],
    );

    const statePlaceId = statePlaceResult.rows[0].id;

    await client.query(
      `
        INSERT INTO place_relationships (
            from_place_id,
            to_place_id,
            relationship_type_id
        )
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING;
      `,
      [placeId, statePlaceId, locatedInRelationshipTypeId],
    );
  }

  console.log(`Cities seeded: ${cityDirectory.length}`);
}

async function seedGeographyIdentities() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("Seeding geography identities...");

    const unitedStatesPlaceId = await seedUnitedStates(client);

    const locatedInRelationshipTypeId = await getRelationshipTypeId(
      client,
      "located_in",
    );

    const partOfMetroRelationshipTypeId = await getRelationshipTypeId(
      client,
      "part_of_metro",
    );

    await seedStateLevelPlaces(
      client,
      unitedStatesPlaceId,
      locatedInRelationshipTypeId,
    );

    await seedMetros(client);

    await seedCities(
      client,
      locatedInRelationshipTypeId,
      partOfMetroRelationshipTypeId,
    );

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

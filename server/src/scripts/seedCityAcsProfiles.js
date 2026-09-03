import pool from "../db/index.js";
import {
  cityAcsDataYear,
  cityAcsProfiles,
} from "../data/cities/cityAcsProfile2024.js";

async function getAcsDataReleaseId(client) {
  const result = await client.query(
    `
      SELECT dr.id
      FROM data_releases dr
      JOIN data_sources ds
        ON ds.id = dr.source_id
      WHERE ds.name = 'U.S. Census Bureau'
        AND dr.dataset_name = 'American Community Survey 5-Year'
        AND dr.data_year = $1
        AND dr.vintage = $2;
    `,
    [cityAcsDataYear, String(cityAcsDataYear)],
  );

  if (result.rows.length === 0) {
    throw new Error(
      `ACS 5-Year data release not found for ${cityAcsDataYear}.`,
    );
  }

  return result.rows[0].id;
}

async function getCityPlaceId(client, geoid) {
  const result = await client.query(
    `
      SELECT place_id
      FROM cities
      WHERE geoid = $1;
    `,
    [geoid],
  );

  if (result.rows.length === 0) {
    throw new Error(`City not found for GEOID ${geoid}.`);
  }

  return result.rows[0].place_id;
}

async function upsertSocioeconomics(client, placeId, profile, dataReleaseId) {
  const data = profile.socioeconomics;

  await client.query(
    `
      INSERT INTO socioeconomics (
        place_id,
        data_year,
        median_household_income,
        poverty_rate,
        unemployment_rate,
        high_school_or_higher,
        bachelors_or_higher,
        data_release_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (place_id, data_year)
      DO UPDATE SET
        median_household_income = EXCLUDED.median_household_income,
        poverty_rate = EXCLUDED.poverty_rate,
        unemployment_rate = EXCLUDED.unemployment_rate,
        high_school_or_higher = EXCLUDED.high_school_or_higher,
        bachelors_or_higher = EXCLUDED.bachelors_or_higher,
        data_release_id = EXCLUDED.data_release_id;
    `,
    [
      placeId,
      cityAcsDataYear,
      data.medianHouseholdIncome,
      data.povertyRate,
      data.unemploymentRate,
      data.highSchoolOrHigher,
      data.bachelorsOrHigher,
      dataReleaseId,
    ],
  );
}

async function upsertHousing(client, placeId, profile, dataReleaseId) {
  const data = profile.housing;

  await client.query(
    `
      INSERT INTO housing (
        place_id,
        data_year,
        median_rent,
        median_home_value,
        owner_share,
        renter_share,
        data_release_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (place_id, data_year)
      DO UPDATE SET
        median_rent = EXCLUDED.median_rent,
        median_home_value = EXCLUDED.median_home_value,
        owner_share = EXCLUDED.owner_share,
        renter_share = EXCLUDED.renter_share,
        data_release_id = EXCLUDED.data_release_id;
    `,
    [
      placeId,
      cityAcsDataYear,
      data.medianRent,
      data.medianHomeValue,
      data.ownerShare,
      data.renterShare,
      dataReleaseId,
    ],
  );
}

async function upsertTransportation(client, placeId, profile, dataReleaseId) {
  const data = profile.transportation;

  await client.query(
    `
      INSERT INTO transportation (
        place_id,
        data_year,
        mean_commute_minutes,
        drive_share,
        carpool_share,
        transit_share,
        walk_share,
        work_from_home_share,
        data_release_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (place_id, data_year)
      DO UPDATE SET
        mean_commute_minutes = EXCLUDED.mean_commute_minutes,
        drive_share = EXCLUDED.drive_share,
        carpool_share = EXCLUDED.carpool_share,
        transit_share = EXCLUDED.transit_share,
        walk_share = EXCLUDED.walk_share,
        work_from_home_share = EXCLUDED.work_from_home_share,
        data_release_id = EXCLUDED.data_release_id;
    `,
    [
      placeId,
      cityAcsDataYear,
      data.meanCommuteMinutes,
      data.driveShare,
      data.carpoolShare,
      data.transitShare,
      data.walkShare,
      data.workFromHomeShare,
      dataReleaseId,
    ],
  );
}

async function upsertDemographics(client, placeId, profile, dataReleaseId) {
  const data = profile.demographics;

  await client.query(
    `
      INSERT INTO demographics (
        place_id,
        data_year,
        under_18_share,
        age_18_24_share,
        age_25_34_share,
        age_35_44_share,
        age_45_64_share,
        age_65_plus_share,
        white_share,
        black_share,
        asian_share,
        other_race_share,
        hispanic_latino_share,
        data_release_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14
      )
      ON CONFLICT (place_id, data_year)
      DO UPDATE SET
        under_18_share = EXCLUDED.under_18_share,
        age_18_24_share = EXCLUDED.age_18_24_share,
        age_25_34_share = EXCLUDED.age_25_34_share,
        age_35_44_share = EXCLUDED.age_35_44_share,
        age_45_64_share = EXCLUDED.age_45_64_share,
        age_65_plus_share = EXCLUDED.age_65_plus_share,
        white_share = EXCLUDED.white_share,
        black_share = EXCLUDED.black_share,
        asian_share = EXCLUDED.asian_share,
        other_race_share = EXCLUDED.other_race_share,
        hispanic_latino_share = EXCLUDED.hispanic_latino_share,
        data_release_id = EXCLUDED.data_release_id;
    `,
    [
      placeId,
      cityAcsDataYear,
      data.under18Share,
      data.age18To24Share,
      data.age25To34Share,
      data.age35To44Share,
      data.age45To64Share,
      data.age65PlusShare,
      data.whiteShare,
      data.blackShare,
      data.asianShare,
      data.otherRaceShare,
      data.hispanicLatinoShare,
      dataReleaseId,
    ],
  );
}

async function seedCityAcsProfiles() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const dataReleaseId = await getAcsDataReleaseId(client);

    for (const profile of cityAcsProfiles) {
      const placeId = await getCityPlaceId(client, profile.geoid);

      await upsertSocioeconomics(client, placeId, profile, dataReleaseId);

      await upsertHousing(client, placeId, profile, dataReleaseId);

      await upsertTransportation(client, placeId, profile, dataReleaseId);

      await upsertDemographics(client, placeId, profile, dataReleaseId);
    }

    await client.query("COMMIT");

    console.log(`City ACS profiles seeded: ${cityAcsProfiles.length}`);
    console.log(`ACS metric rows seeded: ${cityAcsProfiles.length * 4}`);
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("City ACS profile seed failed:", error);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedCityAcsProfiles();

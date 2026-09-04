import pool from "../db/index.js";

export async function getCityByGeoid(geoid) {
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.place_type,
        c.state_fips,
        c.place_fips,
        c.geoid,
        c.latitude,
        c.longitude,
        c.land_area,
        c.water_area
      FROM places p
      JOIN cities c
        ON c.place_id = p.id
      WHERE c.geoid = $1;
    `,
    [geoid],
  );

  return result.rows[0] ?? null;
}

export async function getCityBySlug(slug) {
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.place_type,
        c.state_fips,
        c.place_fips,
        c.geoid,
        c.latitude,
        c.longitude,
        c.land_area,
        c.water_area
      FROM places p
      JOIN cities c
        ON c.place_id = p.id
      WHERE p.slug = $1;
    `,
    [slug],
  );

  return result.rows[0] ?? null;
}

export async function getCityState(placeId) {
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.slug,
        s.state_fips,
        s.abbreviation
      FROM place_relationships pr
      JOIN relationship_types rt
        ON rt.id = pr.relationship_type_id
      JOIN places p
        ON p.id = pr.to_place_id
      JOIN states s
        ON s.place_id = p.id
      WHERE pr.from_place_id = $1
        AND rt.code = 'located_in';
    `,
    [placeId],
  );

  return result.rows[0] ?? null;
}

export async function getCityMetro(placeId) {
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.slug,
        m.cbsa
      FROM place_relationships pr
      JOIN relationship_types rt
        ON rt.id = pr.relationship_type_id
      JOIN places p
        ON p.id = pr.to_place_id
      JOIN metros m
        ON m.place_id = p.id
      WHERE pr.from_place_id = $1
        AND rt.code = 'part_of_metro';
    `,
    [placeId],
  );

  return result.rows[0] ?? null;
}

export async function getCityPopulationHistory(placeId) {
  const result = await pool.query(
    `
      SELECT
        ph.year,
        ph.population,
        ds.name AS source,
        dr.dataset_name,
        dr.vintage
      FROM population_history ph
      JOIN data_releases dr
        ON dr.id = ph.data_release_id
      JOIN data_sources ds
        ON ds.id = dr.source_id
      WHERE ph.place_id = $1
      ORDER BY ph.year;
    `,
    [placeId],
  );

  return result.rows;
}

export async function getCityAcsProfile(placeId, dataYear = 2024) {
  const result = await pool.query(
    `
      SELECT
        s.data_year,

        s.median_household_income,
        s.poverty_rate,
        s.unemployment_rate,
        s.high_school_or_higher,
        s.bachelors_or_higher,

        h.median_rent,
        h.median_home_value,
        h.owner_share,
        h.renter_share,

        t.mean_commute_minutes,
        t.drive_share,
        t.carpool_share,
        t.transit_share,
        t.walk_share,
        t.work_from_home_share,

        d.under_18_share,
        d.age_18_24_share,
        d.age_25_34_share,
        d.age_35_44_share,
        d.age_45_64_share,
        d.age_65_plus_share,
        d.white_share,
        d.black_share,
        d.asian_share,
        d.other_race_share,
        d.hispanic_latino_share,

        ds.name AS source,
        dr.dataset_name,
        dr.vintage

      FROM places p

      LEFT JOIN socioeconomics s
        ON s.place_id = p.id
       AND s.data_year = $2

      LEFT JOIN housing h
        ON h.place_id = p.id
       AND h.data_year = $2

      LEFT JOIN transportation t
        ON t.place_id = p.id
       AND t.data_year = $2

      LEFT JOIN demographics d
        ON d.place_id = p.id
       AND d.data_year = $2

      LEFT JOIN data_releases dr
        ON dr.id = s.data_release_id

      LEFT JOIN data_sources ds
        ON ds.id = dr.source_id

      WHERE p.id = $1;
    `,
    [placeId, dataYear],
  );

  return result.rows[0] ?? null;
}

export async function getCities() {
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.slug,
        c.geoid,
        sp.name AS state,
        s.abbreviation AS state_abbreviation,
        ph.population,
        ph.year AS population_year,
        ph2020.population AS population_2020,
        ROUND(
          (
            (ph.population - ph2020.population)::numeric
            / NULLIF(ph2020.population, 0)
          ) * 100,
          1
        ) AS growth_since_2020
      FROM places p
      JOIN cities c
        ON c.place_id = p.id
      LEFT JOIN states s
        ON s.state_fips = c.state_fips
      LEFT JOIN places sp
        ON sp.id = s.place_id
      JOIN population_history ph
        ON ph.place_id = p.id
       AND ph.year = 2025
      JOIN population_history ph2020
        ON ph2020.place_id = p.id
       AND ph2020.year = 2020
      ORDER BY ph.population DESC;
    `,
  );

  return result.rows;
}

export async function getCityClimate(placeId, normalPeriod = "1991-2020") {
  const result = await pool.query(
    `
      SELECT
        cm.month,
        cm.normal_period,
        cm.normal_high,
        cm.normal_low,
        cm.normal_mean,
        cm.precipitation,
        cm.snowfall,
        ds.name AS source,
        dr.dataset_name,
        dr.vintage
      FROM climate_monthly cm
      JOIN data_releases dr
        ON dr.id = cm.data_release_id
      JOIN data_sources ds
        ON ds.id = dr.source_id
      WHERE cm.place_id = $1
        AND cm.normal_period = $2
      ORDER BY cm.month;
    `,
    [placeId, normalPeriod],
  );

  return result.rows;
}

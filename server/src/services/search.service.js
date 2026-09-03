import pool from "../db/index.js";

export async function searchPlaces(query) {
  const normalizedQuery = query.trim().toLowerCase().replace(/\s+/g, " ");

  if (!normalizedQuery) {
    return [];
  }

  const result = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.place_type,

        CASE
          WHEN p.place_type = 'federal_district'
            AND p.slug = 'district-of-columbia'
            THEN '11'
          ELSE s.state_fips
        END AS state_fips,

        MIN(
          CASE
            WHEN pa.normalized_alias = $1 THEN 0
            ELSE 1
          END
        ) AS match_rank,

        MAX(ph.population) FILTER (
          WHERE ph.year = (
            SELECT MAX(ph2.year)
            FROM population_history ph2
            WHERE ph2.place_id = p.id
          )
        ) AS population

      FROM places p

      JOIN place_aliases pa
        ON pa.place_id = p.id

      LEFT JOIN states s
        ON s.place_id = p.id

      LEFT JOIN population_history ph
        ON ph.place_id = p.id

      WHERE pa.normalized_alias LIKE $1 || '%'

      GROUP BY
        p.id,
        p.name,
        p.slug,
        p.place_type,
        s.state_fips

      ORDER BY
        match_rank,
        population DESC NULLS LAST,
        p.name

      LIMIT 10;
    `,
    [normalizedQuery],
  );

  return result.rows;
}

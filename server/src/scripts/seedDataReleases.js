import pool from "../db/index.js";

const DATA_RELEASES = [
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "State Population Estimates",
    dataYear: 2025,
    vintage: "2025",
    notes: "Source file: NST-EST2025-ALLDATA.csv",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "Metropolitan Statistical Area Population Estimates",
    dataYear: 2025,
    vintage: "2025",
    notes: "Source file: cbsa-met-est2025-pop.xlsx",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "City and Town Population Estimates",
    dataYear: 2025,
    vintage: "2025",
    notes: "Source file: SUB-IP-EST2025-ANNRNK.xlsx",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "American Community Survey 1-Year",
    dataYear: 2024,
    vintage: "2024",
    notes:
      "Used for state and metro economic, housing, and transportation measures.",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "American Community Survey 5-Year",
    dataYear: 2024,
    vintage: "2024",
    notes: "Used for educational-attainment measures.",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "Gazetteer Files - Places",
    dataYear: 2025,
    vintage: "2025",
    notes: "Source file: 2025_Gaz_place_national.txt",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "TIGER/Line PLACE and COUNTY",
    dataYear: 2025,
    vintage: "2025",
    notes:
      "Used to determine county intersections and supported city-to-metro membership.",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "State-to-State Migration Flows",
    dataYear: 2021,
    vintage: "2021",
    notes: "Source file: State_to_State_Migrations_Table_2021.xls",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "State-to-State Migration Flows",
    dataYear: 2022,
    vintage: "2022",
    notes:
      "Source file: State_to_State_Migration_Table_2022_T13_updated_2024_06_27.xlsx",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "State-to-State Migration Flows",
    dataYear: 2023,
    vintage: "2023",
    notes: "Source file: State_to_State_Migration_Table_2023_T13.xlsx",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "State-to-State Migration Flows",
    dataYear: 2024,
    vintage: "2024",
    notes: "Source file: State_to_State_Migration_Table_2024_T13.xlsx",
  },
  {
    sourceName: "U.S. Census Bureau",
    datasetName: "2023 CBSA Delineation File",
    dataYear: 2023,
    vintage: "2023",
    notes:
      "Source file: list1_2023.xlsx. Used for county-to-CBSA metro membership.",
  },
  {
    sourceName: "Internal Revenue Service",
    datasetName: "County-to-County Migration",
    dataYear: 2023,
    vintage: "2022-2023",
    notes: "Source files: countyinflow2223.csv and countyoutflow2223.csv",
  },
  {
    sourceName: "National Center for Education Statistics",
    datasetName: "NAEP Grade 8 Reading",
    dataYear: 2024,
    vintage: "2024",
    notes: "2024 NAEP Grade 8 reading assessment results.",
  },
  {
    sourceName: "National Center for Education Statistics",
    datasetName: "NAEP Grade 8 Mathematics",
    dataYear: 2024,
    vintage: "2024",
    notes: "2024 NAEP Grade 8 mathematics assessment results.",
  },
  {
    sourceName: "National Oceanic and Atmospheric Administration",
    datasetName: "U.S. Monthly Climate Normals",
    dataYear: 2020,
    vintage: "1991-2020",
    notes:
      "NOAA/NCEI U.S. Climate Normals monthly normals for the official 1991-2020 normal period.",
  },
];

async function seedDataReleases() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const release of DATA_RELEASES) {
      const sourceResult = await client.query(
        `
          SELECT id
          FROM data_sources
          WHERE name = $1;
        `,
        [release.sourceName],
      );

      if (sourceResult.rows.length === 0) {
        throw new Error(`Data source not found: ${release.sourceName}`);
      }

      const sourceId = sourceResult.rows[0].id;

      await client.query(
        `
          INSERT INTO data_releases (
            source_id,
            dataset_name,
            data_year,
            vintage,
            notes
          )
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (
            source_id,
            dataset_name,
            data_year,
            vintage
          )
          DO UPDATE SET
            notes = EXCLUDED.notes;
        `,
        [
          sourceId,
          release.datasetName,
          release.dataYear,
          release.vintage,
          release.notes,
        ],
      );
    }

    await client.query("COMMIT");

    console.log(`Data releases seeded: ${DATA_RELEASES.length}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Data release seed failed:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDataReleases();

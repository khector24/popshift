/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("crime_statistics", {
    place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "cascade",
    },

    year: {
      type: "integer",
      notNull: true,
    },

    reporting_population: {
      type: "integer",
    },

    source_jurisdiction_name: {
      type: "varchar(255)",
    },

    coverage_status: {
      type: "varchar(20)",
      notNull: true,
    },

    coverage_notes: {
      type: "text",
    },

    violent_crime_count: {
      type: "integer",
    },

    violent_crime_rate: {
      type: "numeric(10,1)",
    },

    murder_count: {
      type: "integer",
    },

    murder_rate: {
      type: "numeric(10,1)",
    },

    rape_count: {
      type: "integer",
    },

    rape_rate: {
      type: "numeric(10,1)",
    },

    robbery_count: {
      type: "integer",
    },

    robbery_rate: {
      type: "numeric(10,1)",
    },

    aggravated_assault_count: {
      type: "integer",
    },

    aggravated_assault_rate: {
      type: "numeric(10,1)",
    },

    property_crime_count: {
      type: "integer",
    },

    property_crime_rate: {
      type: "numeric(10,1)",
    },

    burglary_count: {
      type: "integer",
    },

    burglary_rate: {
      type: "numeric(10,1)",
    },

    larceny_theft_count: {
      type: "integer",
    },

    larceny_theft_rate: {
      type: "numeric(10,1)",
    },

    motor_vehicle_theft_count: {
      type: "integer",
    },

    motor_vehicle_theft_rate: {
      type: "numeric(10,1)",
    },

    data_release_id: {
      type: "integer",
      notNull: true,
      references: "data_releases",
      onDelete: "restrict",
    },
  });

  pgm.addConstraint("crime_statistics", "crime_statistics_pkey", {
    primaryKey: ["place_id", "year"],
  });

  pgm.addConstraint(
    "crime_statistics",
    "crime_statistics_coverage_status_check",
    {
      check: "coverage_status IN ('available', 'unavailable')",
    },
  );

  pgm.createIndex("crime_statistics", "data_release_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("crime_statistics");
};

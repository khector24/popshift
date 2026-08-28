/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("countries", {
    place_id: {
      type: "integer",
      primaryKey: true,
      references: "places",
      onDelete: "CASCADE",
    },

    iso2: {
      type: "varchar(2)",
      unique: true,
    },

    iso3: {
      type: "varchar(3)",
      unique: true,
    },
  });

  pgm.createTable("states", {
    place_id: {
      type: "integer",
      primaryKey: true,
      references: "places",
      onDelete: "CASCADE",
    },

    state_fips: {
      type: "varchar(2)",
      notNull: true,
      unique: true,
    },

    abbreviation: {
      type: "varchar(10)",
    },
  });

  pgm.createTable("cities", {
    place_id: {
      type: "integer",
      primaryKey: true,
      references: "places",
      onDelete: "CASCADE",
    },

    state_fips: {
      type: "varchar(2)",
    },

    place_fips: {
      type: "varchar(5)",
    },

    geoid: {
      type: "varchar(20)",
      unique: true,
    },

    latitude: {
      type: "numeric(9,6)",
    },

    longitude: {
      type: "numeric(9,6)",
    },

    land_area: {
      type: "numeric",
    },

    water_area: {
      type: "numeric",
    },
  });

  pgm.createTable("metros", {
    place_id: {
      type: "integer",
      primaryKey: true,
      references: "places",
      onDelete: "CASCADE",
    },

    cbsa: {
      type: "varchar(5)",
      notNull: true,
      unique: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("metros");
  pgm.dropTable("cities");
  pgm.dropTable("states");
  pgm.dropTable("countries");
};

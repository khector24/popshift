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
  pgm.createTable("population_history", {
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

    population: {
      type: "bigint",
      notNull: true,
    },

    data_release_id: {
      type: "integer",
      notNull: true,
      references: "data_releases",
      onDelete: "restrict",
    },
  });

  pgm.addConstraint("population_history", "population_history_pkey", {
    primaryKey: ["place_id", "year"],
  });

  pgm.createIndex("population_history", "data_release_id");
};

export const down = (pgm) => {
  pgm.dropTable("population_history");
};

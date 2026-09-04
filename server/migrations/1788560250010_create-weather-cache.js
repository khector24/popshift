/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("weather_cache", {
    place_id: {
      type: "integer",
      primaryKey: true,
      references: "places",
      onDelete: "cascade",
    },

    temperature: {
      type: "numeric(6,2)",
      notNull: true,
    },

    feels_like: {
      type: "numeric(6,2)",
      notNull: true,
    },

    condition_code: {
      type: "integer",
      notNull: true,
    },

    condition: {
      type: "varchar(100)",
      notNull: true,
    },

    description: {
      type: "varchar(255)",
      notNull: true,
    },

    humidity: {
      type: "integer",
      notNull: true,
    },

    wind_speed: {
      type: "numeric(8,2)",
      notNull: true,
    },

    fetched_at: {
      type: "timestamptz",
      notNull: true,
    },

    expires_at: {
      type: "timestamptz",
      notNull: true,
    },
  });

  pgm.createIndex("weather_cache", "expires_at");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("weather_cache");
};

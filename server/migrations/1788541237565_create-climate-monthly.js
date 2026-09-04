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
  pgm.createTable("climate_monthly", {
    place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "cascade",
    },

    month: {
      type: "integer",
      notNull: true,
    },

    normal_period: {
      type: "varchar(20)",
      notNull: true,
    },

    normal_high: {
      type: "numeric(6,2)",
    },

    normal_low: {
      type: "numeric(6,2)",
    },

    normal_mean: {
      type: "numeric(6,2)",
    },

    precipitation: {
      type: "numeric(8,2)",
    },

    snowfall: {
      type: "numeric(8,2)",
    },

    data_release_id: {
      type: "integer",
      notNull: true,
      references: "data_releases",
      onDelete: "restrict",
    },
  });

  pgm.addConstraint("climate_monthly", "climate_monthly_pkey", {
    primaryKey: ["place_id", "month", "normal_period"],
  });

  pgm.addConstraint("climate_monthly", "climate_monthly_month_check", {
    check: "month BETWEEN 1 AND 12",
  });

  pgm.createIndex("climate_monthly", "data_release_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("climate_monthly");
};

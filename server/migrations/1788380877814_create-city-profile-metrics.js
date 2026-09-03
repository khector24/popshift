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
  pgm.createTable("socioeconomics", {
    place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "cascade",
    },

    data_year: {
      type: "integer",
      notNull: true,
    },

    median_household_income: {
      type: "integer",
    },

    poverty_rate: {
      type: "numeric(5,2)",
    },

    unemployment_rate: {
      type: "numeric(5,2)",
    },

    high_school_or_higher: {
      type: "numeric(5,2)",
    },

    bachelors_or_higher: {
      type: "numeric(5,2)",
    },

    data_release_id: {
      type: "integer",
      notNull: true,
      references: "data_releases",
      onDelete: "restrict",
    },
  });

  pgm.addConstraint("socioeconomics", "socioeconomics_pkey", {
    primaryKey: ["place_id", "data_year"],
  });

  pgm.createIndex("socioeconomics", "data_release_id");

  pgm.createTable("housing", {
    place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "cascade",
    },

    data_year: {
      type: "integer",
      notNull: true,
    },

    median_rent: {
      type: "integer",
    },

    median_home_value: {
      type: "integer",
    },

    owner_share: {
      type: "numeric(5,2)",
    },

    renter_share: {
      type: "numeric(5,2)",
    },

    data_release_id: {
      type: "integer",
      notNull: true,
      references: "data_releases",
      onDelete: "restrict",
    },
  });

  pgm.addConstraint("housing", "housing_pkey", {
    primaryKey: ["place_id", "data_year"],
  });

  pgm.createIndex("housing", "data_release_id");

  pgm.createTable("transportation", {
    place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "cascade",
    },

    data_year: {
      type: "integer",
      notNull: true,
    },

    mean_commute_minutes: {
      type: "numeric(5,2)",
    },

    drive_share: {
      type: "numeric(5,2)",
    },

    carpool_share: {
      type: "numeric(5,2)",
    },

    transit_share: {
      type: "numeric(5,2)",
    },

    walk_share: {
      type: "numeric(5,2)",
    },

    work_from_home_share: {
      type: "numeric(5,2)",
    },

    data_release_id: {
      type: "integer",
      notNull: true,
      references: "data_releases",
      onDelete: "restrict",
    },
  });

  pgm.addConstraint("transportation", "transportation_pkey", {
    primaryKey: ["place_id", "data_year"],
  });

  pgm.createIndex("transportation", "data_release_id");

  pgm.createTable("demographics", {
    place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "cascade",
    },

    data_year: {
      type: "integer",
      notNull: true,
    },

    under_18_share: {
      type: "numeric(5,2)",
    },

    age_18_24_share: {
      type: "numeric(5,2)",
    },

    age_25_34_share: {
      type: "numeric(5,2)",
    },

    age_35_44_share: {
      type: "numeric(5,2)",
    },

    age_45_64_share: {
      type: "numeric(5,2)",
    },

    age_65_plus_share: {
      type: "numeric(5,2)",
    },

    white_share: {
      type: "numeric(5,2)",
    },

    black_share: {
      type: "numeric(5,2)",
    },

    asian_share: {
      type: "numeric(5,2)",
    },

    other_race_share: {
      type: "numeric(5,2)",
    },

    hispanic_latino_share: {
      type: "numeric(5,2)",
    },

    data_release_id: {
      type: "integer",
      notNull: true,
      references: "data_releases",
      onDelete: "restrict",
    },
  });

  pgm.addConstraint("demographics", "demographics_pkey", {
    primaryKey: ["place_id", "data_year"],
  });

  pgm.createIndex("demographics", "data_release_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("demographics");
  pgm.dropTable("transportation");
  pgm.dropTable("housing");
  pgm.dropTable("socioeconomics");
};

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
  pgm.createTable("data_sources", {
    id: "id",

    name: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },

    organization: {
      type: "varchar(255)",
    },

    base_url: {
      type: "text",
    },
  });

  pgm.createTable("data_releases", {
    id: "id",

    source_id: {
      type: "integer",
      notNull: true,
      references: "data_sources",
      onDelete: "cascade",
    },

    dataset_name: {
      type: "varchar(255)",
      notNull: true,
    },

    data_year: {
      type: "integer",
    },

    vintage: {
      type: "varchar(100)",
    },

    retrieved_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    notes: {
      type: "text",
    },
  });

  pgm.createIndex("data_releases", "source_id");

  pgm.addConstraint(
    "data_releases",
    "data_releases_source_dataset_vintage_unique",
    {
      unique: ["source_id", "dataset_name", "data_year", "vintage"],
    },
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("data_releases");
  pgm.dropTable("data_sources");
};

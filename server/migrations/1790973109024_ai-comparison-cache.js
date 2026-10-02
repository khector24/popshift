/**
 * @type {import("node-pg-migrate").ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import("node-pg-migrate").MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable("ai_comparison_cache", {
    id: "id",

    cache_key: {
      type: "varchar(64)",
      notNull: true,
      unique: true,
    },

    geography_type: {
      type: "varchar(20)",
      notNull: true,
    },

    place_identifiers: {
      type: "jsonb",
      notNull: true,
    },

    personalization: {
      type: "jsonb",
      notNull: true,
      default: pgm.func("'{}'::jsonb"),
    },

    provider: {
      type: "varchar(50)",
      notNull: true,
    },

    model: {
      type: "varchar(100)",
      notNull: true,
    },

    prompt_version: {
      type: "varchar(50)",
      notNull: true,
    },

    context_version: {
      type: "varchar(50)",
      notNull: true,
    },

    data_fingerprint: {
      type: "varchar(64)",
      notNull: true,
    },

    response_text: {
      type: "text",
      notNull: true,
    },

    input_tokens: {
      type: "integer",
    },

    output_tokens: {
      type: "integer",
    },

    estimated_cost: {
      type: "numeric(12,8)",
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },

    expires_at: {
      type: "timestamptz",
      notNull: true,
    },
  });

  pgm.createIndex("ai_comparison_cache", "expires_at");
};

/**
 * @param pgm {import("node-pg-migrate").MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("ai_comparison_cache");
};

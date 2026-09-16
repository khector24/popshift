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
  pgm.createTable("articles", {
    id: "id",

    title: {
      type: "varchar(255)",
      notNull: true,
    },

    slug: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },

    body: {
      type: "text",
      notNull: true,
    },

    status: {
      type: "varchar(20)",
      notNull: true,
      default: "draft",
    },

    published_at: {
      type: "timestamptz",
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("articles", "articles_status_check", {
    check: "status IN ('draft', 'published', 'archived')",
  });

  pgm.createTable("tags", {
    id: "id",

    name: {
      type: "varchar(100)",
      notNull: true,
      unique: true,
    },

    slug: {
      type: "varchar(100)",
      notNull: true,
      unique: true,
    },
  });

  pgm.createTable("article_places", {
    article_id: {
      type: "integer",
      notNull: true,
      references: "articles",
      onDelete: "cascade",
    },

    place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "cascade",
    },
  });

  pgm.addConstraint("article_places", "article_places_pkey", {
    primaryKey: ["article_id", "place_id"],
  });

  pgm.createIndex("article_places", "place_id");

  pgm.createTable("article_tags", {
    article_id: {
      type: "integer",
      notNull: true,
      references: "articles",
      onDelete: "cascade",
    },

    tag_id: {
      type: "integer",
      notNull: true,
      references: "tags",
      onDelete: "cascade",
    },
  });

  pgm.addConstraint("article_tags", "article_tags_pkey", {
    primaryKey: ["article_id", "tag_id"],
  });

  pgm.createIndex("article_tags", "tag_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("article_tags");
  pgm.dropTable("article_places");
  pgm.dropTable("tags");
  pgm.dropTable("articles");
};

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
  pgm.createTable("relationship_types", {
    id: "id",

    code: {
      type: "varchar(50)",
      notNull: true,
      unique: true,
    },

    description: {
      type: "text",
    },
  });

  pgm.createTable("place_relationships", {
    from_place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "CASCADE",
    },

    to_place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "CASCADE",
    },

    relationship_type_id: {
      type: "integer",
      notNull: true,
      references: "relationship_types",
      onDelete: "RESTRICT",
    },
  });

  pgm.addConstraint("place_relationships", "place_relationships_pkey", {
    primaryKey: ["from_place_id", "to_place_id", "relationship_type_id"],
  });

  pgm.createTable("place_aliases", {
    id: "id",

    place_id: {
      type: "integer",
      notNull: true,
      references: "places",
      onDelete: "CASCADE",
    },

    alias: {
      type: "varchar(255)",
      notNull: true,
    },

    normalized_alias: {
      type: "varchar(255)",
      notNull: true,
    },
  });

  pgm.addConstraint("place_aliases", "place_aliases_place_normalized_unique", {
    unique: ["place_id", "normalized_alias"],
  });

  pgm.sql(`
    INSERT INTO relationship_types (code, description)
    VALUES
      ('located_in', 'A place is geographically located within another place'),
      ('part_of_metro', 'A place belongs to a metropolitan area');
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("place_aliases");
  pgm.dropTable("place_relationships");
  pgm.dropTable("relationship_types");
};

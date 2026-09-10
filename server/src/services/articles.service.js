import pool from "../db/index.js";
import { slugify } from "../utils/slugify.js";

export async function getPublishedArticles() {
  const result = await pool.query(`
    SELECT
      id,
      title,
      slug,
      body,
      status,
      published_at,
      created_at,
      updated_at
    FROM articles
    WHERE status = 'published'
    ORDER BY published_at DESC, id DESC;
  `);

  return result.rows;
}

export async function getPublishedArticleBySlug(slug) {
  const result = await pool.query(
    `
      SELECT
        id,
        title,
        slug,
        body,
        status,
        published_at,
        created_at,
        updated_at
      FROM articles
      WHERE slug = $1
        AND status = 'published'
      LIMIT 1;
    `,
    [slug],
  );

  return result.rows[0] ?? null;
}

export async function getPublishedArticlesByPlaceId(placeId) {
  const result = await pool.query(
    `
      SELECT
        a.id,
        a.title,
        a.slug,
        a.body,
        a.status,
        a.published_at,
        a.created_at,
        a.updated_at
      FROM articles a
      INNER JOIN article_places ap
        ON ap.article_id = a.id
      WHERE ap.place_id = $1
        AND a.status = 'published'
      ORDER BY a.published_at DESC, a.id DESC;
    `,
    [placeId],
  );

  return result.rows;
}

export async function getArticlePlaces(articleId) {
  const result = await pool.query(
    `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.place_type
      FROM places p
      INNER JOIN article_places ap
        ON ap.place_id = p.id
      WHERE ap.article_id = $1
      ORDER BY p.place_type, p.name;
    `,
    [articleId],
  );

  return result.rows;
}

export async function getArticleTags(articleId) {
  const result = await pool.query(
    `
      SELECT
        t.id,
        t.name,
        t.slug
      FROM tags t
      INNER JOIN article_tags at
        ON at.tag_id = t.id
      WHERE at.article_id = $1
      ORDER BY t.name;
    `,
    [articleId],
  );

  return result.rows;
}

export async function createArticle({ title, body, status = "draft" }) {
  const articleSlug = slugify(title);

  const result = await pool.query(
    `
      INSERT INTO articles (
        title,
        slug,
        body,
        status,
        published_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        CASE
          WHEN $4 = 'published' THEN CURRENT_TIMESTAMP
          ELSE NULL
        END
      )
      RETURNING
        id,
        title,
        slug,
        body,
        status,
        published_at,
        created_at,
        updated_at;
    `,
    [title, articleSlug, body, status],
  );

  return result.rows[0];
}

export async function updateArticle(articleId, { title, body, status }) {
  const articleSlug = title !== undefined ? slugify(title) : null;

  const result = await pool.query(
    `
      UPDATE articles
      SET
        title = COALESCE($2, title),
        slug = COALESCE($3, slug),
        body = COALESCE($4, body),
        status = COALESCE($5, status),
        published_at = CASE
          WHEN $5 = 'published' AND published_at IS NULL
            THEN CURRENT_TIMESTAMP
          WHEN $5 = 'draft'
            THEN NULL
          ELSE published_at
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING
        id,
        title,
        slug,
        body,
        status,
        published_at,
        created_at,
        updated_at;
    `,
    [articleId, title, articleSlug, body, status],
  );

  return result.rows[0] ?? null;
}

export async function createTag({ name }) {
  const tagSlug = slugify(name);

  const result = await pool.query(
    `
      INSERT INTO tags (name, slug)
      VALUES ($1, $2)
      RETURNING id, name, slug;
    `,
    [name, tagSlug],
  );

  return result.rows[0];
}

export async function findOrCreateTag({ name }) {
  const tagSlug = slugify(name);

  const existingResult = await pool.query(
    `
      SELECT id, name, slug
      FROM tags
      WHERE name = $1
         OR slug = $2
      LIMIT 1;
    `,
    [name, tagSlug],
  );

  if (existingResult.rows[0]) {
    return existingResult.rows[0];
  }

  return createTag({ name });
}

export async function attachArticleToPlace(articleId, placeId) {
  await pool.query(
    `
      INSERT INTO article_places (article_id, place_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `,
    [articleId, placeId],
  );
}

export async function attachTagToArticle(articleId, tagId) {
  await pool.query(
    `
      INSERT INTO article_tags (article_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `,
    [articleId, tagId],
  );
}

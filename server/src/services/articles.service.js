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

export async function createArticle(client, { title, body, status = "draft" }) {
  const articleSlug = slugify(title);

  const result = await client.query(
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
          WHEN $4::varchar = 'published' THEN CURRENT_TIMESTAMP
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

export async function updateArticle(
  client,
  articleId,
  { title, body, status },
) {
  const articleSlug = title !== undefined ? slugify(title) : null;

  const result = await client.query(
    `
      UPDATE articles
      SET
        title = COALESCE($2, title),
        slug = COALESCE($3, slug),
        body = COALESCE($4, body),
        status = COALESCE($5, status),
        published_at = CASE
          WHEN $5::varchar = 'published' AND published_at IS NULL
            THEN CURRENT_TIMESTAMP
          WHEN $5::varchar = 'draft'
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

export async function setArticlePlaces(client, articleId, placeIds) {
  await client.query(
    `
      DELETE FROM article_places
      WHERE article_id = $1;
    `,
    [articleId],
  );

  const uniquePlaceIds = [...new Set(placeIds)];

  for (const placeId of uniquePlaceIds) {
    await attachArticleToPlace(client, articleId, placeId);
  }
}

export async function createTag(client, { name }) {
  const tagSlug = slugify(name);

  const result = await client.query(
    `
      INSERT INTO tags (name, slug)
      VALUES ($1, $2)
      RETURNING id, name, slug;
    `,
    [name, tagSlug],
  );

  return result.rows[0];
}

export async function findOrCreateTag(client, { name }) {
  const tagSlug = slugify(name);

  const existingResult = await client.query(
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

  return createTag(client, { name });
}

export async function attachArticleToPlace(client, articleId, placeId) {
  await client.query(
    `
      INSERT INTO article_places (article_id, place_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `,
    [articleId, placeId],
  );
}

export async function attachTagToArticle(client, articleId, tagId) {
  await client.query(
    `
      INSERT INTO article_tags (article_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `,
    [articleId, tagId],
  );
}

export async function setArticleTags(client, articleId, tags) {
  await client.query(
    `
      DELETE FROM article_tags
      WHERE article_id = $1;
    `,
    [articleId],
  );

  const uniqueTagsBySlug = new Map();

  for (const tag of tags) {
    const name = tag.trim();

    if (!name) {
      continue;
    }

    const tagSlug = slugify(name);

    if (!uniqueTagsBySlug.has(tagSlug)) {
      uniqueTagsBySlug.set(tagSlug, name);
    }
  }

  const uniqueTagNames = [...uniqueTagsBySlug.values()];

  for (const name of uniqueTagNames) {
    const tag = await findOrCreateTag(client, { name });

    await attachTagToArticle(client, articleId, tag.id);
  }
}

export async function getAdminArticles() {
  const result = await pool.query(`
    SELECT
      id,
      title,
      slug,
      status,
      published_at,
      created_at,
      updated_at
    FROM articles
    ORDER BY created_at DESC;
  `);

  return result.rows;
}

export async function createArticleWithRelations({
  title,
  body,
  status = "draft",
  tags = [],
  placeIds = [],
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const article = await createArticle(client, {
      title,
      body,
      status,
    });

    await setArticleTags(client, article.id, tags);
    await setArticlePlaces(client, article.id, placeIds);

    await client.query("COMMIT");

    return getAdminArticleById(article.id);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getAdminArticleById(articleId) {
  const articleResult = await pool.query(
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
      WHERE id = $1;
    `,
    [articleId],
  );

  const article = articleResult.rows[0];

  if (!article) {
    return null;
  }

  const tags = await getArticleTags(articleId);
  const places = await getArticlePlaces(articleId);

  return {
    ...article,
    tags,
    places,
  };
}

export async function updateArticleWithRelations(articleId, updates) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const article = await updateArticle(client, articleId, updates);

    if (!article) {
      await client.query("ROLLBACK");
      return null;
    }

    if (updates.tags !== undefined) {
      await setArticleTags(client, articleId, updates.tags);
    }

    if (updates.placeIds !== undefined) {
      await setArticlePlaces(client, articleId, updates.placeIds);
    }

    await client.query("COMMIT");

    return getAdminArticleById(articleId);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

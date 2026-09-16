import { describe, test, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { app } from "../app.js";
import pool from "../db/index.js";

const TEST_EMAIL = "regionlore-articles-test@example.com";
const TEST_PASSWORD = "RegionLoreTestPassword123!";

const TEST_TAG_SLUGS = [
  "article-test-population",
  "article-test-housing",
  "article-test-migration",
];

const agent = request.agent(app);

let californiaId;
let coloradoId;

async function deleteTestData() {
  await pool.query(
    `
      DELETE FROM articles
      WHERE title LIKE 'Article Integration Test%';
    `,
  );

  await pool.query(
    `
      DELETE FROM tags
      WHERE slug = ANY($1::text[]);
    `,
    [TEST_TAG_SLUGS],
  );

  await pool.query(
    `
      DELETE FROM users
      WHERE email = $1;
    `,
    [TEST_EMAIL],
  );
}

async function createTestArticle(overrides = {}) {
  const response = await agent.post("/api/admin/articles").send({
    title: "Article Integration Test",
    body: "Temporary article used by the automated article integration tests.",
    status: "draft",
    tags: ["Article Test Population"],
    placeIds: [californiaId],
    ...overrides,
  });

  expect(response.status).toBe(201);

  return response.body.data;
}

beforeAll(async () => {
  await deleteTestData();

  const placesResult = await pool.query(`
    SELECT id, slug
    FROM places
    WHERE slug IN ('california', 'colorado');
  `);

  californiaId = placesResult.rows.find(
    (place) => place.slug === "california",
  )?.id;

  coloradoId = placesResult.rows.find((place) => place.slug === "colorado")?.id;

  expect(californiaId).toBeDefined();
  expect(coloradoId).toBeDefined();

  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);

  await pool.query(
    `
      INSERT INTO users (
        email,
        password_hash,
        role,
        is_active
      )
      VALUES ($1, $2, 'admin', true);
    `,
    [TEST_EMAIL, passwordHash],
  );

  const loginResponse = await agent.post("/api/admin/auth/login").send({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  expect(loginResponse.status).toBe(200);
});

describe("admin article authentication", () => {
  test("rejects article requests without an admin cookie", async () => {
    const response = await request(app).get("/api/admin/articles");

    expect(response.status).toBe(401);
  });

  test("logs in the disposable test admin and keeps the cookie", async () => {
    const response = await agent.get("/api/admin/auth/me");

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(TEST_EMAIL);
    expect(response.body.data.role).toBe("admin");
  });
});

describe("POST /api/admin/articles", () => {
  test("creates a draft article with tags and a place", async () => {
    const article = await createTestArticle();

    expect(article.title).toBe("Article Integration Test");
    expect(article.slug).toBe("article-integration-test");
    expect(article.status).toBe("draft");
    expect(article.published_at).toBeNull();

    expect(article.tags).toHaveLength(1);
    expect(article.tags[0].name).toBe("Article Test Population");

    expect(article.places).toHaveLength(1);
    expect(article.places[0].slug).toBe("california");
  });
});

describe("GET /api/admin/articles/:id", () => {
  test("returns the complete article with tags and places", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Get",
    });

    const response = await agent.get(`/api/admin/articles/${article.id}`);

    expect(response.status).toBe(200);

    expect(response.body.data.id).toBe(article.id);
    expect(response.body.data.title).toBe("Article Integration Test Get");

    expect(response.body.data.tags).toHaveLength(1);
    expect(response.body.data.places).toHaveLength(1);
  });

  test("returns 404 for a missing article", async () => {
    const response = await agent.get("/api/admin/articles/999999999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Article not found");
  });
});

describe("PATCH /api/admin/articles/:id", () => {
  test("updates only the title without changing tags or places", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Title",
    });

    const response = await agent
      .patch(`/api/admin/articles/${article.id}`)
      .send({
        title: "Article Integration Test Title Updated",
      });

    expect(response.status).toBe(200);

    expect(response.body.data.title).toBe(
      "Article Integration Test Title Updated",
    );

    expect(response.body.data.slug).toBe(
      "article-integration-test-title-updated",
    );

    expect(response.body.data.tags).toHaveLength(1);
    expect(response.body.data.tags[0].name).toBe("Article Test Population");

    expect(response.body.data.places).toHaveLength(1);
    expect(response.body.data.places[0].slug).toBe("california");
  });

  test("replaces tags without changing places", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Tags",
    });

    const response = await agent
      .patch(`/api/admin/articles/${article.id}`)
      .send({
        tags: ["Article Test Population", "Article Test Housing"],
      });

    expect(response.status).toBe(200);

    expect(response.body.data.tags.map((tag) => tag.slug)).toEqual([
      "article-test-housing",
      "article-test-population",
    ]);

    expect(response.body.data.places).toHaveLength(1);
    expect(response.body.data.places[0].slug).toBe("california");
  });

  test("replaces places without changing tags", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Places",
    });

    const response = await agent
      .patch(`/api/admin/articles/${article.id}`)
      .send({
        placeIds: [californiaId, coloradoId],
      });

    expect(response.status).toBe(200);

    expect(response.body.data.tags).toHaveLength(1);
    expect(response.body.data.tags[0].slug).toBe("article-test-population");

    expect(response.body.data.places.map((place) => place.slug)).toEqual([
      "california",
      "colorado",
    ]);
  });

  test("clears tags when tags is an empty array", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Clear Tags",
    });

    const response = await agent
      .patch(`/api/admin/articles/${article.id}`)
      .send({
        tags: [],
      });

    expect(response.status).toBe(200);
    expect(response.body.data.tags).toEqual([]);

    expect(response.body.data.places).toHaveLength(1);
  });

  test("clears places when placeIds is an empty array", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Clear Places",
    });

    const response = await agent
      .patch(`/api/admin/articles/${article.id}`)
      .send({
        placeIds: [],
      });

    expect(response.status).toBe(200);
    expect(response.body.data.places).toEqual([]);

    expect(response.body.data.tags).toHaveLength(1);
  });

  test("publishes a draft and sets published_at", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Publish",
    });

    const response = await agent
      .patch(`/api/admin/articles/${article.id}`)
      .send({
        status: "published",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("published");
    expect(response.body.data.published_at).not.toBeNull();
  });

  test("rejects an empty PATCH body", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Empty Patch",
    });

    const response = await agent
      .patch(`/api/admin/articles/${article.id}`)
      .send({});

    expect(response.status).toBe(400);
  });

  test("returns 404 when updating an article that does not exist", async () => {
    const response = await agent.patch("/api/admin/articles/999999999").send({
      title: "Article Integration Test Missing",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Article not found");
  });

  test("rolls back the entire update when a place relationship fails", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Rollback",
    });

    const failedResponse = await agent
      .patch(`/api/admin/articles/${article.id}`)
      .send({
        title: "Article Integration Test Should Not Persist",
        tags: ["Article Test Migration"],
        placeIds: [999999999],
      });

    expect(failedResponse.status).toBe(500);

    const finalResponse = await agent.get(`/api/admin/articles/${article.id}`);

    expect(finalResponse.status).toBe(200);

    expect(finalResponse.body.data.title).toBe(
      "Article Integration Test Rollback",
    );

    expect(finalResponse.body.data.slug).toBe(
      "article-integration-test-rollback",
    );

    expect(finalResponse.body.data.tags).toHaveLength(1);

    expect(finalResponse.body.data.tags[0].slug).toBe(
      "article-test-population",
    );

    expect(finalResponse.body.data.places).toHaveLength(1);

    expect(finalResponse.body.data.places[0].slug).toBe("california");
  });
});

describe("DELETE /api/admin/articles/:id", () => {
  test("rejects delete requests without an admin cookie", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Delete Unauthorized",
    });

    const response = await request(app).delete(
      `/api/admin/articles/${article.id}`,
    );

    expect(response.status).toBe(401);
  });

  test("rejects an invalid article id", async () => {
    const response = await agent.delete("/api/admin/articles/not-a-number");

    expect(response.status).toBe(400);
  });

  test("returns 404 when deleting an article that does not exist", async () => {
    const response = await agent.delete("/api/admin/articles/999999999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Article not found");
  });

  test("deletes an article and its relationships", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Delete",
    });

    const beforePlaces = await pool.query(
      `
        SELECT *
        FROM article_places
        WHERE article_id = $1;
      `,
      [article.id],
    );

    const beforeTags = await pool.query(
      `
        SELECT *
        FROM article_tags
        WHERE article_id = $1;
      `,
      [article.id],
    );

    expect(beforePlaces.rows).toHaveLength(1);
    expect(beforeTags.rows).toHaveLength(1);

    const response = await agent.delete(`/api/admin/articles/${article.id}`);

    expect(response.status).toBe(200);
    expect(response.body.articleId).toBe(article.id);

    const articleResult = await pool.query(
      `
        SELECT id
        FROM articles
        WHERE id = $1;
      `,
      [article.id],
    );

    const afterPlaces = await pool.query(
      `
        SELECT *
        FROM article_places
        WHERE article_id = $1;
      `,
      [article.id],
    );

    const afterTags = await pool.query(
      `
        SELECT *
        FROM article_tags
        WHERE article_id = $1;
      `,
      [article.id],
    );

    expect(articleResult.rows).toHaveLength(0);
    expect(afterPlaces.rows).toHaveLength(0);
    expect(afterTags.rows).toHaveLength(0);
  });
});

describe("GET /api/articles", () => {
  test("returns only published articles without authentication", async () => {
    const publishedArticle = await createTestArticle({
      title: "Article Integration Test Public Published",
      status: "published",
    });

    const draftArticle = await createTestArticle({
      title: "Article Integration Test Public Draft",
      status: "draft",
    });

    const archivedArticle = await createTestArticle({
      title: "Article Integration Test Public Archived",
      status: "archived",
    });

    const response = await request(app).get("/api/articles");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);

    const articleIds = response.body.data.map((article) => article.id);

    expect(articleIds).toContain(publishedArticle.id);
    expect(articleIds).not.toContain(draftArticle.id);
    expect(articleIds).not.toContain(archivedArticle.id);
  });
});

describe("GET /api/articles/:slug", () => {
  test("returns a published article by slug", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Public Slug",
      status: "published",
      tags: ["Article Test Population", "Article Test Housing"],
    });

    const response = await request(app).get(`/api/articles/${article.slug}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(article.id);
    expect(response.body.data.slug).toBe(article.slug);
    expect(response.body.data.status).toBe("published");

    expect(response.body.data.tags.map((tag) => tag.slug)).toEqual([
      "article-test-housing",
      "article-test-population",
    ]);
  });

  test("returns 404 for a draft article", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Public Draft Slug",
      status: "draft",
    });

    const response = await request(app).get(`/api/articles/${article.slug}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Article not found");
  });

  test("returns 404 for an archived article", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Public Archived Slug",
      status: "archived",
    });

    const response = await request(app).get(`/api/articles/${article.slug}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Article not found");
  });

  test("returns 404 for a missing slug", async () => {
    const response = await request(app).get(
      "/api/articles/article-integration-test-does-not-exist",
    );

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Article not found");
  });
});

describe("GET /api/places/:placeId/articles", () => {
  test("returns an empty array when a place has no published articles", async () => {
    await createTestArticle({
      title: "Article Integration Test Colorado Draft Only",
      status: "draft",
      placeIds: [coloradoId],
    });

    const response = await request(app).get(
      `/api/places/${coloradoId}/articles`,
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  test("returns only published articles attached to the requested place", async () => {
    const californiaPublished = await createTestArticle({
      title: "Article Integration Test California Published",
      status: "published",
      placeIds: [californiaId],
    });

    const californiaDraft = await createTestArticle({
      title: "Article Integration Test California Draft",
      status: "draft",
      placeIds: [californiaId],
    });

    const californiaArchived = await createTestArticle({
      title: "Article Integration Test California Archived",
      status: "archived",
      placeIds: [californiaId],
    });

    const coloradoPublished = await createTestArticle({
      title: "Article Integration Test Colorado Published",
      status: "published",
      placeIds: [coloradoId],
    });

    const response = await request(app).get(
      `/api/places/${californiaId}/articles`,
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);

    const articleIds = response.body.data.map((article) => article.id);

    expect(articleIds).toContain(californiaPublished.id);
    expect(articleIds).not.toContain(californiaDraft.id);
    expect(articleIds).not.toContain(californiaArchived.id);
    expect(articleIds).not.toContain(coloradoPublished.id);
  });

  test("returns published articles attached to multiple places", async () => {
    const article = await createTestArticle({
      title: "Article Integration Test Multi Place Public",
      status: "published",
      placeIds: [californiaId, coloradoId],
    });

    const californiaResponse = await request(app).get(
      `/api/places/${californiaId}/articles`,
    );

    const coloradoResponse = await request(app).get(
      `/api/places/${coloradoId}/articles`,
    );

    expect(californiaResponse.status).toBe(200);
    expect(coloradoResponse.status).toBe(200);

    expect(californiaResponse.body.data.map((item) => item.id)).toContain(
      article.id,
    );

    expect(coloradoResponse.body.data.map((item) => item.id)).toContain(
      article.id,
    );
  });

  test("rejects an invalid place id", async () => {
    const response = await request(app).get(
      "/api/places/not-a-number/articles",
    );

    expect(response.status).toBe(400);
  });
});

afterAll(async () => {
  await deleteTestData();
});

import { describe, expect, test } from "vitest";
import request from "supertest";

import { app } from "../app.js";

import {
  createAiComparisonCacheKey,
  createDataFingerprint,
} from "../services/aiComparison/cacheKey.js";

describe("AI comparison cache keys", () => {
  test("produces the same data fingerprint regardless of object key order", () => {
    const first = {
      places: [
        { name: "Austin", population: 100 },
        { name: "Raleigh", population: 90 },
      ],
    };

    const second = {
      places: [
        { population: 100, name: "Austin" },
        { population: 90, name: "Raleigh" },
      ],
    };

    expect(createDataFingerprint(first)).toBe(
      createDataFingerprint(second),
    );
  });

  test("changes the data fingerprint when RegionLore facts change", () => {
    const first = {
      places: [{ name: "Austin", population: 100 }],
    };

    const second = {
      places: [{ name: "Austin", population: 101 }],
    };

    expect(createDataFingerprint(first)).not.toBe(
      createDataFingerprint(second),
    );
  });

  test("changes the cache key when generation inputs change", () => {
    const base = {
      geographyType: "city",
      placeIdentifiers: ["austin-tx", "raleigh-nc"],
      personalization: {
        reason: "moving",
        priorities: ["housing"],
      },
      provider: "openai",
      model: "gpt-5.6-luna",
      promptVersion: "conversation-style-v1",
      contextVersion: "v1",
      dataFingerprint: "abc123",
    };

    const first = createAiComparisonCacheKey(base);

    const second = createAiComparisonCacheKey({
      ...base,
      personalization: {
        reason: "moving",
        priorities: ["climate"],
      },
    });

    expect(first).not.toBe(second);
    expect(first).toHaveLength(64);
  });
});


describe("POST /api/comparisons/ai validation", () => {
  test("rejects fewer than two places", async () => {
    const response = await request(app)
      .post("/api/comparisons/ai")
      .send({
        geographyType: "city",
        placeIdentifiers: ["new-york-city-ny"],
      });

    expect(response.status).toBe(400);
  });

  test("rejects more than four places", async () => {
    const response = await request(app)
      .post("/api/comparisons/ai")
      .send({
        geographyType: "city",
        placeIdentifiers: ["one", "two", "three", "four", "five"],
      });

    expect(response.status).toBe(400);
  });

  test("rejects duplicate places", async () => {
    const response = await request(app)
      .post("/api/comparisons/ai")
      .send({
        geographyType: "state",
        placeIdentifiers: ["36", "36"],
      });

    expect(response.status).toBe(400);
  });

  test("rejects an unsupported geography type", async () => {
    const response = await request(app)
      .post("/api/comparisons/ai")
      .send({
        geographyType: "county",
        placeIdentifiers: ["one", "two"],
      });

    expect(response.status).toBe(400);
  });

  test("rejects an unsupported priority", async () => {
    const response = await request(app)
      .post("/api/comparisons/ai")
      .send({
        geographyType: "state",
        placeIdentifiers: ["36", "48"],
        personalization: {
          priorities: ["robot-mama-quality"],
        },
      });

    expect(response.status).toBe(400);
  });

  test("rejects an unsupported climate preference", async () => {
    const response = await request(app)
      .post("/api/comparisons/ai")
      .send({
        geographyType: "state",
        placeIdentifiers: ["36", "48"],
        personalization: {
          priorities: ["climate"],
          preferences: {
            climate: "volcano",
          },
        },
      });

    expect(response.status).toBe(400);
  });

  test("rejects an other reason longer than 200 characters", async () => {
    const response = await request(app)
      .post("/api/comparisons/ai")
      .send({
        geographyType: "state",
        placeIdentifiers: ["36", "48"],
        personalization: {
          reason: "other",
          otherReason: "x".repeat(201),
        },
      });

    expect(response.status).toBe(400);
  });
});

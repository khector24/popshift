import { describe, test, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import pool from "../db/index.js";

describe("GET /api/cities", () => {
  test("returns 200 and the city directory", async () => {
    const response = await request(app).get("/api/cities");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(500);

    const newYork = response.body.data.find(
      (city) => city.slug === "new-york-city-ny",
    );

    expect(newYork).toBeDefined();
    expect(newYork.name).toBe("New York City");
    expect(newYork.geoid).toBe("3651000");
    expect(newYork.population_year).toBe(2025);
  });
});

describe("GET /api/cities/:slug", () => {
  test("returns 200 and the requested city", async () => {
    const response = await request(app).get("/api/cities/new-york-city-ny");

    expect(response.status).toBe(200);

    expect(response.body.city.name).toBe("New York City");
    expect(response.body.city.slug).toBe("new-york-city-ny");
    expect(response.body.city.geoid).toBe("3651000");

    expect(response.body.state.name).toBe("New York");
    expect(response.body.state.abbreviation).toBe("NY");

    expect(response.body.metro).toBeDefined();

    expect(Array.isArray(response.body.populationHistory)).toBe(true);
    expect(response.body.populationHistory.length).toBeGreaterThan(0);

    expect(response.body.acsProfile).toBeDefined();
    expect(response.body.acsProfile.data_year).toBe(2024);
  });

  test("returns St. George even without a 2024 ACS profile", async () => {
    const response = await request(app).get("/api/cities/st-george-la");

    expect(response.status).toBe(200);
    expect(response.body.city.name).toBe("St. George");

    expect(response.body.acsProfile.data_year).toBeNull();
    expect(response.body.acsProfile.median_household_income).toBeNull();
  });

  test("returns 404 when the city does not exist", async () => {
    const response = await request(app).get("/api/cities/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("City not found");
  });

  test("returns Washington, DC even without a state extension row", async () => {
    const response = await request(app).get("/api/cities/washington-dc-dc");

    expect(response.status).toBe(200);
    expect(response.body.city.name).toBe("Washington, DC");
    expect(response.body.state).toBeNull();
  });
});
afterAll(async () => {
  await pool.end();
});

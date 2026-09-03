import { describe, test, expect, afterAll } from "vitest";
import request from "supertest";
import { app } from "../app.js";
import pool from "../db/index.js";

describe("GET /api/search", () => {
  test("returns an empty array for an empty query", async () => {
    const response = await request(app).get("/api/search?q=");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  test("finds a city by curated alias", async () => {
    const response = await request(app).get("/api/search?q=NYC");

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);

    const newYorkCity = response.body.data[0];

    expect(newYorkCity.name).toBe("New York City");
    expect(newYorkCity.slug).toBe("new-york-city-ny");
    expect(newYorkCity.place_type).toBe("city");
    expect(newYorkCity.match_rank).toBe(0);
  });

  test("returns exact ambiguous aliases before prefix matches", async () => {
    const response = await request(app).get("/api/search?q=LA");

    expect(response.status).toBe(200);

    const losAngeles = response.body.data.find(
      (place) => place.name === "Los Angeles",
    );

    const louisiana = response.body.data.find(
      (place) => place.name === "Louisiana",
    );

    expect(losAngeles).toBeDefined();
    expect(losAngeles.place_type).toBe("city");
    expect(losAngeles.match_rank).toBe(0);

    expect(louisiana).toBeDefined();
    expect(louisiana.place_type).toBe("state");
    expect(louisiana.state_fips).toBe("22");
    expect(louisiana.match_rank).toBe(0);
  });

  test("returns state, city, and metro matches for New York", async () => {
    const response = await request(app).get("/api/search?q=New%20York");

    expect(response.status).toBe(200);

    const newYorkState = response.body.data.find(
      (place) => place.name === "New York" && place.place_type === "state",
    );

    const newYorkCity = response.body.data.find(
      (place) => place.name === "New York City" && place.place_type === "city",
    );

    const newYorkMetro = response.body.data.find(
      (place) => place.place_type === "metro",
    );

    expect(newYorkState).toBeDefined();
    expect(newYorkState.state_fips).toBe("36");
    expect(newYorkState.match_rank).toBe(0);

    expect(newYorkCity).toBeDefined();
    expect(newYorkCity.slug).toBe("new-york-city-ny");

    expect(newYorkMetro).toBeDefined();
    expect(newYorkMetro.slug).toBe("new-york-newark-jersey-city");
  });

  test("does not return duplicate places when multiple aliases match", async () => {
    const response = await request(app).get("/api/search?q=New%20York%20City");

    expect(response.status).toBe(200);

    const matches = response.body.data.filter(
      (place) => place.slug === "new-york-city-ny",
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].match_rank).toBe(0);
  });

  test("supports the District of Columbia state-page bridge", async () => {
    const response = await request(app).get("/api/search?q=DC");

    expect(response.status).toBe(200);

    const dcCity = response.body.data.find(
      (place) => place.place_type === "city",
    );

    const dcDistrict = response.body.data.find(
      (place) => place.place_type === "federal_district",
    );

    expect(dcCity).toBeDefined();
    expect(dcCity.slug).toBe("washington-dc-dc");

    expect(dcDistrict).toBeDefined();
    expect(dcDistrict.name).toBe("District of Columbia");
    expect(dcDistrict.state_fips).toBe("11");
  });

  test("ranks prominent cities ahead of smaller prefix matches", async () => {
    const response = await request(app).get("/api/search?q=san");

    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe("San Antonio");
    expect(response.body.data[1].name).toBe("San Diego");
  });
});

afterAll(async () => {
  await pool.end();
});

import { describe, test, expect } from "vitest";
import request from "supertest";
import { app } from "../app.js";

describe("GET /api/comparisons/cities", () => {
  test("returns a structured comparison for two cities", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny,los-angeles-ca",
    );

    expect(response.status).toBe(200);

    expect(response.body.places).toHaveLength(2);

    expect(response.body.places[0].identity.name).toBe("New York City");
    expect(response.body.places[0].identity.slug).toBe("new-york-city-ny");

    expect(response.body.places[1].identity.name).toBe("Los Angeles");
    expect(response.body.places[1].identity.slug).toBe("los-angeles-ca");
  });

  test("returns normalized structured data for each city", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny,los-angeles-ca",
    );

    expect(response.status).toBe(200);

    const [newYork, losAngeles] = response.body.places;

    expect(newYork.population.current).toBe(8584629);
    expect(newYork.population.year).toBe(2025);
    expect(newYork.population.growthSince2020).toBe(-1.9);

    expect(newYork.economics.medianHouseholdIncome).toBe(80483);
    expect(newYork.housing.medianRent).toBe(1821);
    expect(newYork.transportation.meanCommuteMinutes).toBe(40.3);

    expect(newYork.climate.monthly).toHaveLength(12);
    expect(newYork.crime.year).toBe(2024);
    expect(newYork.crime.coverageStatus).toBe("available");

    expect(losAngeles.population.current).toBe(3869089);
    expect(losAngeles.economics.medianHouseholdIncome).toBe(81939);
    expect(losAngeles.housing.medianHomeValue).toBe(921200);
  });

  test("preserves zero values instead of treating them as missing", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny,los-angeles-ca",
    );

    expect(response.status).toBe(200);

    const losAngeles = response.body.places[1];

    const august = losAngeles.climate.monthly.find(
      (month) => month.month === 8,
    );

    expect(august).toBeDefined();
    expect(august.precipitation).toBe(0);
    expect(august.snowfall).toBeNull();
  });

  test("represents missing city data as null", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny,st-george-la",
    );

    expect(response.status).toBe(200);

    const stGeorge = response.body.places[1];

    expect(stGeorge.identity.name).toBe("St. George");

    expect(stGeorge.economics.year).toBeNull();
    expect(stGeorge.economics.medianHouseholdIncome).toBeNull();
    expect(stGeorge.economics.povertyRate).toBeNull();

    expect(stGeorge.education.highSchoolOrHigher).toBeNull();
    expect(stGeorge.housing.medianRent).toBeNull();
    expect(stGeorge.transportation.meanCommuteMinutes).toBeNull();

    expect(stGeorge.demographics.age.under18Share).toBeNull();
  });

  test("preserves unavailable crime coverage without inventing crime values", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny,miami-fl",
    );

    expect(response.status).toBe(200);

    const miami = response.body.places[1];

    expect(miami.identity.name).toBe("Miami");

    expect(miami.crime.year).toBe(2024);
    expect(miami.crime.coverageStatus).toBe("unavailable");

    expect(miami.crime.reportingPopulation).toBeNull();
    expect(miami.crime.violentCrime.rate).toBeNull();
    expect(miami.crime.propertyCrime.rate).toBeNull();
    expect(miami.crime.violentCrime.murder.rate).toBeNull();

    expect(miami.crime.coverageNotes).toBe(
      "Limited 2024 Florida data were available in FBI Table 8.",
    );

    expect(miami.crime.source).toBe("Federal Bureau of Investigation");
  });

  test("rejects a request without city slugs", async () => {
    const response = await request(app).get("/api/comparisons/cities");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("City slugs are required");
  });

  test("rejects a comparison with fewer than two cities", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid city comparison");
  });

  test("rejects duplicate cities", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny,new-york-city-ny",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid city comparison");
  });

  test("rejects a comparison containing a city that does not exist", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny,robot-mama-city",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid city comparison");
  });

  test("returns normalized city identity data", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny,los-angeles-ca",
    );

    expect(response.status).toBe(200);

    const newYork = response.body.places[0];

    expect(newYork.identity.state).toEqual({
      id: expect.any(Number),
      name: "New York",
      slug: "new-york",
      stateFips: "36",
      abbreviation: "NY",
    });

    expect(newYork.identity.state.state_fips).toBeUndefined();

    expect(newYork.identity.metro).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      slug: expect.any(String),
      cbsa: expect.any(String),
    });
  });

  test("preserves a missing state relationship as null", async () => {
    const response = await request(app).get(
      "/api/comparisons/cities?slugs=new-york-city-ny,washington-dc-dc",
    );

    expect(response.status).toBe(200);

    const washington = response.body.places[1];

    expect(washington.identity.name).toBe("Washington, DC");
    expect(washington.identity.state).toBeNull();
  });
});

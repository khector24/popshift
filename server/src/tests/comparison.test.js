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

describe("GET /api/comparisons/states", () => {
  test("returns a structured comparison for two states", async () => {
    const response = await request(app).get(
      "/api/comparisons/states?codes=36,48",
    );

    expect(response.status).toBe(200);
    expect(response.body.places).toHaveLength(2);

    expect(response.body.places[0].identity).toEqual({
      name: "New York",
      code: "36",
      placeType: "state",
      region: "Northeast",
    });

    expect(response.body.places[1].identity).toEqual({
      name: "Texas",
      code: "48",
      placeType: "state",
      region: "South",
    });
  });

  test("returns normalized state population, economics, and education data", async () => {
    const response = await request(app).get(
      "/api/comparisons/states?codes=36,48",
    );

    expect(response.status).toBe(200);

    const [newYork, texas] = response.body.places;

    expect(newYork.population.current).toBe(20002427);
    expect(newYork.population.year).toBe(2025);
    expect(newYork.population.growthSince2020).toBe(-0.6);
    expect(newYork.population.history).toHaveLength(6);

    expect(newYork.economics.year).toBe(2024);
    expect(newYork.economics.medianHouseholdIncome).toBe(85820);
    expect(newYork.economics.medianRent).toBe(1634);
    expect(newYork.economics.medianHomeValue).toBe(449800);

    expect(newYork.education.year).toBe(2024);
    expect(newYork.education.highSchoolOrHigher).toBe(88);
    expect(newYork.education.bachelorsOrHigher).toBe(40.2);
    expect(newYork.education.readingScore).toBe(257);
    expect(newYork.education.mathScore).toBe(271);

    expect(texas.population.current).toBe(31709821);
    expect(texas.population.growthSince2020).toBe(8.5);
    expect(texas.economics.medianHouseholdIncome).toBe(79721);
    expect(texas.education.bachelorsOrHigher).toBe(33.8);
  });

  test("returns full latest migration flows and top five historical flows", async () => {
    const response = await request(app).get(
      "/api/comparisons/states?codes=36,48",
    );

    expect(response.status).toBe(200);

    const [newYork, texas] = response.body.places;

    expect(newYork.migration.latestYear).toBe(2024);
    expect(newYork.migration.totalInbound).toBe(284868);
    expect(newYork.migration.totalOutbound).toBe(415304);
    expect(newYork.migration.netMigration).toBe(-130436);

    expect(newYork.migration.inbound.length).toBeGreaterThan(5);
    expect(newYork.migration.outbound.length).toBeGreaterThan(5);

    expect(newYork.migration.inbound[0]).toEqual({
      state: "New Jersey",
      code: "34",
      movers: 36002,
    });

    expect(newYork.migration.history).toHaveLength(4);

    for (const year of newYork.migration.history) {
      expect(year.topInbound).toHaveLength(5);
      expect(year.topOutbound).toHaveLength(5);

      expect(year).toHaveProperty("totalInbound");
      expect(year).toHaveProperty("totalOutbound");
      expect(year).toHaveProperty("netMigration");
    }

    expect(newYork.migration.history[0].topInbound[0]).toEqual({
      state: "New Jersey",
      code: "34",
      movers: 38222,
    });

    expect(texas.migration.latestYear).toBe(2024);
    expect(texas.migration.totalInbound).toBe(556156);
    expect(texas.migration.totalOutbound).toBe(483476);
    expect(texas.migration.netMigration).toBe(72680);

    expect(texas.migration.history).toHaveLength(4);

    for (const year of texas.migration.history) {
      expect(year.topInbound).toHaveLength(5);
      expect(year.topOutbound).toHaveLength(5);
    }
  });

  test("rejects a request without state codes", async () => {
    const response = await request(app).get("/api/comparisons/states");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("State codes are required");
  });

  test("rejects a comparison with fewer than two states", async () => {
    const response = await request(app).get("/api/comparisons/states?codes=36");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid state comparison");
  });

  test("rejects duplicate states", async () => {
    const response = await request(app).get(
      "/api/comparisons/states?codes=36,36",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid state comparison");
  });

  test("rejects a comparison containing a state that does not exist", async () => {
    const response = await request(app).get(
      "/api/comparisons/states?codes=36,99",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid state comparison");
  });
});

describe("GET /api/comparisons/metros", () => {
  test("returns a structured comparison for two metros", async () => {
    const response = await request(app).get(
      "/api/comparisons/metros?slugs=new-york-newark-jersey-city,los-angeles-long-beach-anaheim",
    );

    expect(response.status).toBe(200);
    expect(response.body.places).toHaveLength(2);

    const [newYork, losAngeles] = response.body.places;

    expect(newYork.identity).toEqual({
      name: "New York-Newark-Jersey City, NY-NJ Metro Area",
      slug: "new-york-newark-jersey-city",
      placeType: "metro",
      cbsa: "35620",
      states: [
        { name: "New York", code: "36", abbreviation: "NY" },
        { name: "New Jersey", code: "34", abbreviation: "NJ" },
      ],
    });

    expect(losAngeles.identity).toEqual({
      name: "Los Angeles-Long Beach-Anaheim, CA Metro Area",
      slug: "los-angeles-long-beach-anaheim",
      placeType: "metro",
      cbsa: "31080",
      states: [{ name: "California", code: "06", abbreviation: "CA" }],
    });
  });

  test("returns normalized metro data", async () => {
    const response = await request(app).get(
      "/api/comparisons/metros?slugs=new-york-newark-jersey-city,los-angeles-long-beach-anaheim",
    );

    expect(response.status).toBe(200);

    const [newYork, losAngeles] = response.body.places;

    expect(newYork.population.current).toBe(20112448);
    expect(newYork.population.year).toBe(2025);
    expect(newYork.population.growthSince2020).toBe(0.6);
    expect(newYork.population.history).toHaveLength(6);

    expect(newYork.economics).toEqual({
      year: 2024,
      medianHouseholdIncome: 99155,
      povertyRate: 12.7,
    });

    expect(newYork.education).toEqual({
      year: 2024,
      highSchoolOrHigher: 87.6,
      bachelorsOrHigher: 44.2,
    });

    expect(newYork.housing.medianRent).toBe(1830);
    expect(newYork.housing.medianHomeValue).toBe(614200);

    expect(newYork.transportation.transitShare).toBe(24.1);
    expect(newYork.transportation.meanCommuteMinutes).toBe(35.6);

    expect(losAngeles.population.current).toBe(12844441);
    expect(losAngeles.population.growthSince2020).toBe(-2.6);
    expect(losAngeles.housing.medianHomeValue).toBe(871300);
    expect(losAngeles.transportation.transitShare).toBe(3.2);
  });

  test("returns metro migration flows", async () => {
    const response = await request(app).get(
      "/api/comparisons/metros?slugs=new-york-newark-jersey-city,los-angeles-long-beach-anaheim",
    );

    expect(response.status).toBe(200);

    const [newYork, losAngeles] = response.body.places;

    expect(newYork.migration.year).toBe(2023);
    expect(newYork.migration.totalInbound).toBe(156471);
    expect(newYork.migration.totalOutbound).toBe(277271);
    expect(newYork.migration.netMigration).toBe(-120800);
    expect(newYork.migration.inbound).toHaveLength(10);
    expect(newYork.migration.outbound).toHaveLength(10);

    expect(newYork.migration.inbound[0]).toEqual({
      name: "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD Metro Area",
      slug: "philadelphia-camden-wilmington",
      cbsa: "37980",
      movers: 15116,
    });

    expect(losAngeles.migration.year).toBe(2023);
    expect(losAngeles.migration.totalInbound).toBe(174048);
    expect(losAngeles.migration.totalOutbound).toBe(261230);
    expect(losAngeles.migration.netMigration).toBe(-87182);
    expect(losAngeles.migration.inbound).toHaveLength(10);
    expect(losAngeles.migration.outbound).toHaveLength(10);
  });

  test("rejects a request without metro slugs", async () => {
    const response = await request(app).get("/api/comparisons/metros");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Metro slugs are required");
  });

  test("rejects a comparison with fewer than two metros", async () => {
    const response = await request(app).get(
      "/api/comparisons/metros?slugs=new-york-newark-jersey-city",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid metro comparison");
  });

  test("rejects duplicate metros", async () => {
    const response = await request(app).get(
      "/api/comparisons/metros?slugs=new-york-newark-jersey-city,new-york-newark-jersey-city",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid metro comparison");
  });

  test("rejects a comparison containing a metro that does not exist", async () => {
    const response = await request(app).get(
      "/api/comparisons/metros?slugs=new-york-newark-jersey-city,robot-mama-metro",
    );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid metro comparison");
  });
});

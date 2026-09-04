# RegionLore — V2 Implementation Plan

**Status:** Proposed implementation sequence  
**Created:** August 27, 2026  
**Related:** `PRODUCT_VISION.md`, `V2_SCOPE.md`, `V2_DATA_REQUIREMENTS.md`, `V2_ARCHITECTURE.md`

---

## 1. Purpose

This document defines the recommended implementation order for RegionLore V2.

The goal is to turn the approved V2 scope and architecture into a sequence of
small, testable milestones.

The implementation should prioritize:

1. stable geographic identity;
2. reusable data pipelines;
3. normalized city data;
4. useful city pages;
5. articles and AI comparison;
6. moving comparison;
7. stretch features only after the core V2 release is healthy.

V2 should not become a full rewrite of V1 before delivering visible new product value.

---

# 2. Guiding Implementation Principles

## Build foundations before features

Do not begin AI, moving recommendations, or article/place experiences before the
underlying geographic and metric data is reliable.

## Preserve working V1 functionality

Existing state and metro pages should remain operational throughout V2 development.

## Prefer small commits and small milestones

Each logical change should be independently understandable, testable, and
revertible.

## Automate repeated data work

Supporting 500 cities should come from reusable ingestion/build pipelines rather
than manual record creation.

## Avoid premature infrastructure

Use PostgreSQL for V2 persistence and current-weather caching unless traffic or
operational requirements later justify additional infrastructure.

## Document non-obvious decisions

Data-source mapping, geographic exceptions, and architecture tradeoffs should
remain discoverable in the repository.

---

# 3. Phase 0 — Planning Completion

Before implementation begins:

- confirm `V2_SCOPE.md`;
- confirm `V2_DATA_REQUIREMENTS.md`;
- confirm `V2_ARCHITECTURE.md`;
- confirm this implementation plan;
- merge the V2 planning branch into `main`;
- create the first implementation branch.

Recommended first implementation branch:

```text
feature/v2-geography-foundation
```

No production behavior should change in this phase.

---

# 4. Phase 1 — Core Geographic Schema

Build the universal geographic identity foundation first.

Initial tables:

```text
places
countries
states
cities
metros
relationship_types
place_relationships
place_aliases
```

## Goals

- create migrations;
- define primary keys and foreign keys;
- implement `place_id` PK/FK extension pattern;
- seed initial relationship types;
- establish uniqueness constraints;
- test referential integrity.

Initial V2 relationship types:

```text
located_in
part_of_metro
```

Do not add future relationship types until needed.

## Exit criteria

Phase 1 is complete when:

- migrations run cleanly from an empty database;
- place extension tables reference `places.id`;
- duplicate identities/relationships are rejected appropriately;
- basic database tests pass.

---

# 5. Phase 2 — Seed Existing V1 Geographic Identities

Move geographic identities into PostgreSQL without migrating V1 metrics.

Seed:

- United States;
- existing supported states;
- existing supported metros;
- useful aliases;
- state/country relationships where applicable;
- metro relationships when available and defensible.

Preserve existing identifiers:

- state FIPS;
- metro CBSA;
- RegionLore slugs.

## Important rule

This is an **identity migration**, not a metric migration.

Existing V1 state/metro metrics remain in generated files/services.

## Exit criteria

- every currently supported V1 state has a `place_id`;
- every currently supported V1 metro has a `place_id`;
- FIPS/CBSA identifiers remain traceable;
- existing V1 APIs still work.

---

# 6. Phase 3 — Build the 500-City Identity Pipeline

Create an automated city ingestion pipeline using official Census geography and
population sources.

The pipeline should:

1. ingest Census city/place population data;
2. select the initial 500-city universe;
3. preserve state FIPS;
4. preserve place FIPS;
5. generate/store Census GEOID;
6. store latitude/longitude;
7. store land/water area where available;
8. create RegionLore slugs;
9. insert/update `places`;
10. insert/update `cities`;
11. create city → state `located_in` relationships;
12. prepare city → metro mapping.

Do not manually maintain 500 city rows.

## Metro relationship work

City → metro mapping should be generated during the ingestion/build process rather
than inferred inside the PostgreSQL identity seed.

For the initial U.S. city universe, the pipeline should:

1. determine the county or county-equivalent geography intersecting each Census place;
2. preserve all intersecting counties because a place may cross county boundaries;
3. match those county FIPS codes against RegionLore's existing metro county-membership data;
4. determine the corresponding CBSA;
5. generate reusable city-to-metro membership data;
6. seed supported relationships into PostgreSQL using `part_of_metro`.

Conceptually:

```text
Census place
→ intersecting county FIPS
→ RegionLore metro county membership
→ CBSA
→ part_of_metro
```

### City-to-metro refresh workflow

City-to-metro membership is generated from Census TIGER/Line geography rather than inferred during database seeding.

The refresh pipeline is:

```text
cityDirectory.js
→ download current TIGER COUNTY and PLACE files
→ spatially match Census places to counties
→ map county FIPS to supported RegionLore CBSAs
→ generate cityMetroMembership.js
→ seed part_of_metro relationships
```

Commands:

```bash
cd server
npm run download:city-metro
npm run build:city-metro
npm run seed:geography
```

Raw TIGER files are stored under `server/src/data/cities/raw/tigerYYYY/` and are intentionally excluded from Git because they can be downloaded again for the applicable Census TIGER year.

The generated `cityMetroMembership.js` is committed to Git.

Cities whose metros are not currently included in RegionLore's supported metro set receive no `part_of_metro` relationship.

For cities crossing county/metro boundaries, the build pipeline uses the Census place internal point to select the primary metro while preserving all intersecting county information in the generated data.

## Exit criteria

- approximately 500 city identities are reproducibly generated;
- each city has a stable `place_id`;
- each city has valid Census identifiers;
- each city is connected to its state;
- metro relationships are populated where defensible;
- rerunning the pipeline is safe and deterministic.

---

# 7. Phase 4 — Add Data Provenance

Create:

```text
data_sources
data_releases
```

Seed initial providers:

- U.S. Census Bureau;
- National Oceanic and Atmospheric Administration;
- Federal Bureau of Investigation;
- National Center for Education Statistics;
- Internal Revenue Service;
- OpenWeather.

Provider organizations belong in `data_sources`.

Specific dataset editions belong in `data_releases`. Examples include:

- Census Population Estimates, 2025;
- Census ACS 5-Year, 2024;
- Census Gazetteer Files, 2025;
- Census TIGER/Line, 2025.

Additional NOAA, FBI, OpenWeather, or international releases should be added when RegionLore actually ingests those datasets.

The architecture should be ready to record future international sources later.

## Exit criteria

- data providers exist uniquely in `data_sources`;
- ingested dataset editions can be represented as `data_releases`;
- multiple releases can reference the same provider;
- metric pipelines can reference their specific source release.

---

# 8. Phase 5 — Population History

Create and populate:

```text
population_history
```

Load current/recent city population data.

Use the authoritative Census Population Estimates series rather than ACS
population for the primary current-city population metric.

Calculate application-level values such as:

- current population;
- current rank;
- latest annual change;
- latest annual growth;
- growth since 2020.

Derived values do not necessarily need to be stored if they are cheap and safe
to calculate from stored history.

### Implemented City Population Refresh Pipeline

The V2 city population pipeline uses the Census City and Town Population
Estimates as the authoritative source for recent city population history.

Current flow:

`SUB-IP-ESTYYYY-ANNRNK.xlsx`
→ `buildCityPopulationHistory.js`
→ `cityPopulationHistory.js`
→ `seedPopulationHistory.js`
→ PostgreSQL `population_history`

Implementation details:

- retain annual July 1 population estimates for 2020 through the current
  adopted Census vintage;
- do not treat the April 1, 2020 Estimates Base as an additional annual
  population observation;
- use the source-file population rank only during the build step to reconnect
  the supported city set to rows from the same Census ranking file;
- preserve Census GEOID in the generated population-history data;
- match generated city population data to PostgreSQL cities by GEOID during
  database seeding rather than by city name or population rank;
- associate stored observations with the appropriate `data_releases` record;
- commit the generated `cityPopulationHistory.js` artifact so runtime and
  database seeding do not require Excel parsing;
- install `xlsx` only when rebuilding Excel-derived source data and remove it
  afterward rather than keeping it as a runtime dependency;
- make population-history seeding idempotent through upserts so rerunning the
  seed updates existing observations rather than creating duplicates.

For the current Vintage 2025 implementation, the supported city set contains
500 cities with six annual observations per city (2020–2025), producing 3,000
`population_history` rows.

## Exit criteria

- all supported cities have current population where available;
- recent history is retained;
- current rankings can be generated;
- yearly refresh can be repeated from source data.

---

# 9. Phase 6 — ACS City Profile Pipeline

Create normalized city metric ingestion using ACS 5-Year data.

Initial domain tables:

```text
socioeconomics
housing
transportation
demographics
```

## Socioeconomics

Initial fields include:

- median household income;
- poverty rate;
- unemployment rate;
- high-school-or-higher attainment;
- bachelor's-or-higher attainment.

## Housing

Initial fields include:

- median rent;
- median home value;
- owner share;
- renter share.

## Transportation

Initial fields include:

- mean commute time;
- drive share;
- carpool share;
- transit share;
- walking share;
- work-from-home share.

## Demographics

Initial V2 age/race/ethnicity fields should follow the final ACS mapping.

V2 should use practical U.S. groupings now and preserve the ability to evolve
them later.

### Implemented City ACS Refresh Pipeline

The initial V2 city-profile pipeline uses the Census American Community Survey
5-Year Data Profiles as the authoritative source for socioeconomic, housing,
transportation, and demographic city metrics.

Current flow:

`2024 ACS 5-Year Data Profile API`
→ `cityAcsVariables.js`
→ `buildCityAcsProfile.js`
→ `cityAcsProfile2024.js`
→ `seedCityAcsProfiles.js`
→ PostgreSQL domain tables

Implementation details:

- request ACS place geography by state rather than issuing one request per city;
- combine Census state FIPS and place FIPS to reconstruct the Census GEOID;
- filter ACS results against the supported RegionLore city GEOID set;
- use Census identifiers rather than city-name matching;
- normalize ACS API string values into numeric application data;
- preserve unavailable or Census sentinel values as `null` rather than zero;
- derive the V2 age groupings from the adopted ACS profile variables where
  direct matching bands are not available;
- store annual observations using `(place_id, data_year)` composite primary
  keys;
- associate all stored observations with the applicable ACS `data_releases`
  record;
- seed socioeconomic, housing, transportation, and demographic data
  idempotently through upserts;
- commit the generated `cityAcsProfile2024.js` artifact so runtime/database
  seeding does not depend on live Census API requests.

For the current 2024 ACS 5-Year implementation, 499 of the 500 supported cities
have valid ACS place profiles. St. George, Louisiana (`2267303`) is an explicit
known geography-vintage exception because the city is present in the newer
RegionLore/Census city universe but is not represented as that incorporated
place in the 2024 ACS geography. No substitute geography or fabricated values
are used for that city.

The current database load therefore produces 499 rows in each of:

- `socioeconomics`;
- `housing`;
- `transportation`;
- `demographics`.

This produces 1,996 ACS metric rows for the current city universe.

## Exit criteria

- ACS pipeline works by Census identifiers rather than city-name matching;
- domain tables are populated for supported cities;
- missing values remain null/unavailable instead of becoming fake zeroes;
- `data_release_id` is retained.

---

# 10. Phase 7 — City Backend/API

Build the service and API layer for cities.

Potential responsibilities:

- list/search cities;
- get city by slug/place ID;
- load geographic identity;
- load relationships;
- load population;
- load socioeconomic data;
- load housing;
- load transportation;
- load demographics.

Exact endpoint naming should remain consistent with existing RegionLore API style.

The service layer should hide database details from routes.

### Implemented City API Foundation

The initial city API now exposes `GET /api/cities` and `GET /api/cities/:slug` using the existing RegionLore route/controller/service structure. The directory returns all 500 supported cities with state metadata where available, 2025 and 2020 population, and growth since 2020. The detail endpoint assembles city geography, state and metro relationships, population history, and the current ACS profile. City PostgreSQL access is isolated in `cities.service.js`; controllers assemble API responses; routes define HTTP endpoints. Centralized Express error middleware handles API failures, with Express 5 automatically forwarding errors from async controllers. Washington, DC remains in the directory with null state fields because the current `states` extension table has no FIPS 11 row. Manual checks confirm the city list, city detail, and 404 behavior; automated API tests now cover the city directory, city detail, missing-city 404 behavior, Washington, DC without a state extension row, and cities without a current ACS profile. All Phase 7 exit criteria are satisfied.


## Exit criteria

- city list endpoint works;
- city detail endpoint works;
- individual city data domains can be retrieved;
- 404/error handling matches the existing API;
- API tests pass.

---

# 11. Phase 8 — Search and Place Discovery

Use:

```text
places
place_aliases
```

to create place search.

V2 search should support at least:

- cities;
- states;
- metros.

Examples:

```text
NYC
New York
Cleveland
New York Metro
```

Search should return enough metadata for the UI to distinguish place types.

### Implemented Place Search Foundation

The initial V2 universal place search is implemented through the existing
RegionLore route → controller → service structure.

Current API:

`GET /api/search?q={query}`

Search uses PostgreSQL `places` and `place_aliases` as the universal geographic
identity and discovery layer.

Current behavior:

- supports cities, states, federal districts, and metros through the universal
  place identity model;
- resolves canonical aliases generated during geography seeding;
- supports curated common aliases such as `NYC`, `LA`, `Philly`, `SF`, and `DC`;
- supports exact alias matches and prefix search;
- ranks exact matches ahead of prefix matches;
- uses the latest available `population_history` observation as a prominence
  signal where population data is currently available;
- prevents the same place from appearing multiple times when more than one alias
  matches the query;
- returns `place_type` so the frontend can distinguish geographic result types;
- returns the canonical RegionLore `slug` for each result;
- returns `state_fips` for state-level results so the existing V1 state route can
  continue using its current state-code navigation during the V1/V2 transition;
- preserves legitimate ambiguous aliases rather than forcing one interpretation.
  For example, `LA` may match both Los Angeles and Louisiana;
- treats Washington, DC city and the District of Columbia geographic identity as
  separate valid search results when both match;
- returns an empty result set for an empty normalized query.

The initial search API is intentionally a backend foundation. Frontend integration
with the global search component and navigation into city pages belongs to the
city frontend phase rather than this phase.

Automated API tests cover exact aliases, ambiguous aliases, prefix search,
duplicate prevention, empty queries, mixed place types, and relevant navigation
metadata.

All Phase 8 exit criteria are satisfied.

## Exit criteria

- aliases resolve correctly;
- multiple place types can appear in results;
- search uses universal place identity.

---

# 12. Phase 9 — City Frontend

Build the initial city experience.

Core work:

- city directory/search;
- city detail page;
- population/history section;
- economics;
- housing;
- demographics;
- transportation;
- state relationship;
- metro relationship where available;
- source/methodology context where useful.

Do not block initial city pages on climate, crime, articles, or AI.

### City Frontend Design Decisions

The Phase 9 city experience should use the existing RegionLore dark navy/blue
visual language as its primary design system. Purple may remain as a secondary
accent, but city pages should move toward the blue-forward direction intended
for the future shared light/dark design system.

Phase 9 introduces two primary city pages:

- `/cities` for city discovery and directory browsing;
- `/cities/:slug` for the city detail profile.

The city directory should prioritize discovery rather than heavy analytics. It
should support city search and a practical initial set of filters/sorting using
data already available in V2, such as state, metro, region, population, and
population-based ordering. The initial implementation does not require advanced
economic, housing, poverty, commute, or other metric filters, nor does it
require both card and table views.

The city detail page should be modular so later phases can add new domains
without redesigning the page. The intended Phase 9 structure is:

- compact city hero with state and metro context;
- headline metrics;
- population/history;
- economic snapshot;
- housing and affordability;
- demographics;
- transportation;
- about/source context;
- related state and metro navigation where supported.

The layout should reserve sensible future insertion points without requiring
unfinished features to be implemented during Phase 9:

- Phase 10 climate content belongs in a full page section below the core Phase 9
  domains;
- Phase 11 current weather should appear as a compact hero or hero-adjacent
  treatment rather than a large standalone content section;
- Phase 12 crime and safety should plug into the page as another domain section;
- Phase 13 related articles should use a reserved lower-page article area.

Mockups are visual references only. Actual V2 backend-supported fields determine
which metrics appear. Do not add new backend pipelines solely to match a mockup.

Phase 9 does not require city migration, top employers, county profiles,
incorporation dates, elevation, municipal websites, separate domain-detail
routes, or expandable "view full section" behavior. These remain deferred unless
promoted into a later version-specific scope.

## Exit criteria

A user can:

1. search for a city;
2. open a city page;
3. understand its core population/demographic/economic/housing/transportation profile;
4. navigate related geography where supported.

---

# 13. Phase 10 — Climate

Create/populate:

```text
climate_monthly
```

Use NOAA Climate Normals where mapping is defensible.

Store monthly values and derive simpler seasonal summaries in the UI.

Potential initial fields:

- normal high;
- normal low;
- normal mean;
- precipitation;
- snowfall.

## Exit criteria

- climate mapping methodology is documented;
- supported cities display sensible climate summaries;
- unsupported/ambiguous cases remain unavailable.

---

# 14. Phase 11 — Current Weather

Implement current weather through the RegionLore backend.

Use OpenWeather by stored latitude/longitude.

Use PostgreSQL as the V2 weather cache.

Freshness policy:

```text
60 minutes
```

Behavior:

```text
missing → fetch → cache → return
fresh   → return cached value
stale   → fetch → update → return
```

Do not proactively refresh all cities.

## Exit criteria

- API key stays server-side;
- repeated requests within the freshness window reuse cached data;
- stale data triggers refresh;
- frontend never talks directly to OpenWeather.

---

# 15. Phase 12 — Crime

Create/populate:

```text
crime_statistics
```

Use FBI data where reporting/geographic mapping is defensible.

Include coverage information.

The product should be comfortable displaying:

```text
Crime data unavailable for this city.
```

rather than presenting misleading data.

## Exit criteria

- crime source/mapping methodology is documented;
- supported city crime data is defensible;
- unsupported cities degrade gracefully.

---

# 16. Phase 13 — Articles and Tags

Create:

```text
articles
article_places
tags
article_tags
```

Build a lightweight editorial workflow.

Core requirements:

- draft/publish article;
- article slug;
- article body;
- article tags;
- attach one article to one or more places;
- show related articles on place pages.

Do not build a large CMS.

## Exit criteria

- an article can be associated with city/state/metro place IDs;
- one article can relate to multiple places;
- tags work independently from places;
- place pages can display related articles.

---

# 17. Phase 14 — Structured Place Comparison

Before AI, build the deterministic comparison layer.

The comparison service should assemble normalized RegionLore data for two
supported places.

Initial focus:

- city vs city;
- existing state vs state;
- existing metro vs metro where useful.

Comparison context may include:

- population/growth;
- income;
- housing;
- demographics;
- transportation;
- climate;
- crime where available.

## Exit criteria

- comparison works without AI;
- the backend produces a clean structured comparison object;
- missing fields are handled explicitly.

---

# 18. Phase 15 — AI Comparison

Add the AI layer only after structured comparison data is reliable.

The model should receive RegionLore-provided context rather than independently
inventing geographic facts.

AI responsibilities:

- summarize;
- interpret;
- explain tradeoffs;
- personalize based on user-selected preferences.

Architecture decisions during this phase should include:

- provider/model selection;
- prompt/context structure;
- token/cost controls;
- response caching/precomputation strategy;
- safety and error handling.

Do not train a proprietary foundation model for V2.

## Exit criteria

- AI explanations use RegionLore data;
- factual metric values come from RegionLore;
- provider failure degrades gracefully;
- common comparisons can later be cached without changing the UI contract.

---

# 19. Phase 16 — “If I Move From X to Y”

Build the first moving-comparison experience on top of the structured comparison
and AI layers.

Initial experience may let users select:

- current place;
- destination;
- important preferences.

Potential comparison factors:

- income;
- rent/home value;
- commute;
- transportation;
- weather/climate;
- demographics;
- crime when available;
- population/growth.

V2 does not need:

- occupation-specific salary modeling;
- custom RegionLore cost-of-living calculations;
- full personal financial simulation.

## Exit criteria

A user can compare an origin and destination and receive:

1. structured differences;
2. an AI explanation of tradeoffs;
3. a useful summary grounded in RegionLore data.

---

# 20. Phase 17 — Stretch: Anonymous Moving Survey

Only after the core V2 experience works.

Possible fields:

- current location;
- destination considered;
- reason for moving;
- seriousness/intent;
- whether the move already happened.

No account system is required for the first survey.

Survey data should be aggregate-oriented and privacy-conscious.

V2 is complete even if this phase is skipped.

---

# 21. Phase 18 — Stretch: Officials

Only after the core release is complete and only if sourcing is easy enough to
justify the work.

Potential architecture:

```text
people
place_officials
```

Possible V2 additions:

- city mayors;
- state governors.

Do not delay the V2 release for political-office data.

If data collection or maintenance becomes annoying, defer the entire feature.

---

# 22. Explicitly Deferred

The following should not distract from the implementation plan:

- full V1 metric migration;
- accounts;
- favorites;
- personalized feeds;
- comments/community;
- longitudinal surveys;
- neighborhoods;
- landmarks/sites;
- walkability;
- nightlife;
- sports;
- attractions;
- occupation-specific salary engine;
- custom cost-of-living engine;
- advanced GIS;
- international rollout;
- Redis/ElastiCache unless justified by actual load.

---

# 23. Later V1 Metric Migration

After V2 is stable, existing V1 state/metro metrics can gradually move into the
new place-based metric architecture.

Possible targets:

```text
population_history
socioeconomics
housing
transportation
demographics
specialized education/migration tables
```

This should be treated as a later cleanup/refactor rather than a prerequisite
for V2.

The existing `place_id` identity layer should make this migration substantially
easier.

---

# 24. Recommended Branch Strategy

Use focused implementation branches.

Examples:

```text
feature/v2-geography-foundation
feature/v2-city-pipeline
feature/v2-city-metrics
feature/v2-city-api
feature/v2-city-ui
feature/v2-weather
feature/v2-articles
feature/v2-ai-comparison
feature/v2-moving-comparison
```

Exact branch boundaries may change based on implementation size.

Avoid one enormous `feature/v2` branch containing the entire release.

---

# 25. Recommended Commit Strategy

Continue using small logical commits.

Examples:

```text
Create places and city geography tables
Seed V1 state identities
Seed V1 metro identities
Add Census city identity builder
Add city population history ingestion
Add ACS housing ingestion
Add place search service
Add city detail endpoint
Add weather cache service
Add article-place relationships
```

One logical change may touch multiple files.

Do not force one commit per file.

---

# 26. V2 Completion Checkpoint

The core V2 release is complete when:

- the geography foundation is stable;
- approximately 500 cities are supported;
- city pages work;
- core city metrics are populated;
- current weather works;
- climate works where defensible;
- crime works where defensible;
- articles can attach to places;
- structured comparisons work;
- AI comparison works;
- moving X → Y works;
- existing V1 state/metro functionality remains healthy;
- the deployed application demonstrates the full core V2 flow.

The following do **not** block V2 completion:

- anonymous survey;
- mayors;
- governors;
- accounts/favorites;
- full V1 metric migration.

---

# 27. Implementation Summary

Recommended order:

```text
1. Geography schema
2. Seed V1 identities
3. 500-city identity pipeline
4. Data provenance
5. Population history
6. ACS city metrics
7. City API
8. Search
9. City frontend
10. Climate
11. Current weather
12. Crime
13. Articles/tags
14. Structured comparison
15. AI comparison
16. Moving X → Y
17. Stretch survey
18. Stretch officials
19. Later V1 metric migration
```

This sequence deliberately delivers visible product value before optional
cleanup and future-facing features.

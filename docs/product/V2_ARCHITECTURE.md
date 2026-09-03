# RegionLore — V2 Architecture

**Status:** Proposed architecture  
**Created:** August 27, 2026  
**Related:** `PRODUCT_VISION.md`, `V2_SCOPE.md`, `V2_DATA_REQUIREMENTS.md`

---

## 1. Purpose

This document defines the proposed RegionLore V2 architecture before implementation begins.

The primary goals are to:

1. establish a stable geographic identity model;
2. support 500 U.S. cities without breaking existing V1 state/metro functionality;
3. preserve historical data cleanly;
4. support articles, tags, search, AI comparison, and future geographic expansion;
5. avoid overbuilding infrastructure that V2 does not need;
6. keep the system understandable enough to explain during software engineering interviews.

The architecture should support future expansion without forcing V2 to implement every future feature now.

---

# 2. Architecture Decision: Hybrid Geographic Model

RegionLore V2 will use a **hybrid geographic architecture**.

A universal `places` table will own the identity of every geographic entity.

Specialized geographic tables will extend that identity only when a place type requires type-specific fields.

Conceptually:

```text
places
│
├── countries
├── states
├── cities
├── metros
└── future place types
```

Future place types may include:

- provinces;
- prefectures;
- territories;
- counties;
- neighborhoods;
- parks;
- landmarks;
- museums;
- historical sites.

V2 does not need to implement all of these.

---

# 3. Universal Geographic Identity

## `places`

The `places` table is the canonical geographic identity layer.

```text
places
------
id PK
name
slug UNIQUE
place_type
created_at
updated_at
```

Example:

| id | name | slug | place_type |
|---:|---|---|---|
| 1 | United States | united-states | country |
| 10 | New York | new-york | state |
| 20 | New York City | new-york-city | city |
| 30 | New York-Newark-Jersey City | new-york-metro | metro |

A geographic place uses the same `places.id` throughout RegionLore.

For example:

```text
place_id 20 = New York City
```

Articles, aliases, relationships, metric tables, and future features that refer to New York City should all use that same place ID.

---

# 4. Specialized Geographic Extension Tables

Specialized tables extend a place rather than inventing a second identity.

The `place_id` column is both:

- the primary key of the specialized row;
- a foreign key to `places.id`.

This creates a one-to-one extension relationship.

## `countries`

```text
countries
---------
place_id PK, FK → places.id
iso2 UNIQUE
iso3 UNIQUE
```

Countries are included in the architecture from the beginning because RegionLore is expected to expand internationally later.

V2 may only seed the United States initially.

## `states`

```text
states
------
place_id PK, FK → places.id
state_fips UNIQUE
abbreviation
```

The state table stores state-specific identity metadata, not all state metrics.

## `cities`

```text
cities
------
place_id PK, FK → places.id
state_fips
place_fips
geoid UNIQUE
latitude
longitude
land_area
water_area
```

The `cities` table is a city identity/geography table.

It should not become a giant container for every city metric.

## `metros`

```text
metros
------
place_id PK, FK → places.id
cbsa UNIQUE
```

Existing V1 metros should receive Postgres identities in V2 even if their metrics remain in the existing generated V1 files temporarily.

---

# 5. Place Relationships

Geographic relationships should be modeled explicitly rather than inferred from names.

The relationship model is directional.

Every row reads:

> `from_place` → relationship → `to_place`

Example:

```text
New York City → located_in → New York State
New York City → part_of_metro → New York Metro
```

## `relationship_types`

Use a lookup table rather than a literal PostgreSQL ENUM.

```text
relationship_types
------------------
id PK
code UNIQUE
description
```

Initial V2 relationship types:

```text
located_in
part_of_metro
```

Future types may include:

```text
capital_of
principal_city_of
county_seat_of
borders
```

Only add relationship types when a real product feature requires them.

## `place_relationships`

```text
place_relationships
-------------------
from_place_id FK → places.id
to_place_id FK → places.id
relationship_type_id FK → relationship_types.id

PRIMARY KEY (
  from_place_id,
  to_place_id,
  relationship_type_id
)
```

Do not store duplicate reciprocal facts by default.

For example, store:

```text
New York City → located_in → New York State
```

but do not also store:

```text
New York State → contains → New York City
```

unless a future requirement genuinely needs both as independent relationship types.

A reverse query can determine which places are located in New York State.

---

# 6. Aliases and Search

## `place_aliases`

```text
place_aliases
-------------
id PK
place_id FK → places.id
alias
normalized_alias

UNIQUE(place_id, normalized_alias)
```

Examples:

```text
New York City → NYC
New York Metro → NYC Metro
New York Metro → New York Metropolitan Area
```

Aliases improve search without creating duplicate place identities.

---

# 7. Data Provenance

RegionLore should preserve the origin of important data from the beginning.

This is especially important for future international expansion, because different countries and agencies will provide similar metrics using different methodologies and release schedules.

## Provider vs. dataset release

`data_sources` represents the provider or organization that publishes data.

Examples:

```text
U.S. Census Bureau
National Oceanic and Atmospheric Administration
Federal Bureau of Investigation
National Center for Education Statistics
Internal Revenue Service
OpenWeather
```

A provider may publish many different datasets.

`data_releases` represents the specific dataset edition, year, or vintage that RegionLore actually consumed.

For example:

```text
U.S. Census Bureau
├── Population Estimates — 2025
├── ACS 5-Year — 2024
├── Gazetteer Files — 2025
└── TIGER/Line — 2025
```

## `data_sources`

```text
data_sources
------------
id PK
name UNIQUE
organization
base_url
```

## `data_releases`

```text
data_releases
-------------
id PK
source_id FK → data_sources.id
dataset_name
data_year
vintage
retrieved_at
notes
```

A source/provider should normally exist once in `data_sources`, while new dataset editions are represented by additional `data_releases` rows.

Metric rows should reference the specific release when appropriate.

---

# 8. Metric Architecture Principle

RegionLore should organize data by **what the metric means**, not by geographic type, whenever the metric is genuinely portable.

Avoid unnecessary duplication such as:

```text
city_population
state_population
metro_population
```

if all three represent the same concept.

Instead, shared domain tables should use `place_id`.

However, specialized datasets should remain specialized when their methodology or structure materially differs.

Examples of potentially specialized datasets:

- U.S.-specific assessment systems such as NAEP;
- state migration;
- metro migration;
- metro county membership.

The database should not force every place type to have every possible metric.

Missing or non-applicable data is acceptable.

---

# 9. Historical Data Strategy

For annual data, RegionLore should preserve history rather than overwrite the latest value.

A common pattern is:

```text
PRIMARY KEY (place_id, data_year)
```

This is a composite primary key.

Example:

| place_id | data_year | median_rent |
|---:|---:|---:|
| 20 | 2023 | 1750 |
| 20 | 2024 | 1850 |
| 20 | 2025 | 1925 |

These are three distinct rows because the combination of place and year is unique.

If RegionLore later needs multiple competing sources for the same place/year, the uniqueness strategy can evolve to include `data_release_id` or a separate row identifier.

V2 assumes one authoritative source per metric domain unless requirements demand otherwise.

---

# 10. Shared Domain Tables

The exact final columns should follow the final ingestion mapping, especially for ACS variables.

## `population_history`

```text
population_history
------------------
place_id FK → places.id
year
population
data_release_id FK → data_releases.id

PRIMARY KEY (place_id, year)
```

## `socioeconomics`

```text
socioeconomics
--------------
place_id FK → places.id
data_year
median_household_income
poverty_rate
unemployment_rate
high_school_or_higher
bachelors_or_higher
data_release_id FK → data_releases.id

PRIMARY KEY (place_id, data_year)
```

## `housing`

```text
housing
-------
place_id FK → places.id
data_year
median_rent
median_home_value
owner_share
renter_share
data_release_id FK → data_releases.id

PRIMARY KEY (place_id, data_year)
```

Housing is separated because RegionLore is expected to expand housing considerably later.

Potential future housing data may include:

- construction;
- permits;
- vacancy;
- affordability;
- homeownership trends;
- price trends.

## `transportation`

```text
transportation
--------------
place_id FK → places.id
data_year
mean_commute_minutes
drive_share
carpool_share
transit_share
walk_share
work_from_home_share
data_release_id FK → data_releases.id

PRIMARY KEY (place_id, data_year)
```

Not every country or place will necessarily have every field.

Unavailable values may remain null.

## `demographics`

```text
demographics
------------
place_id FK → places.id
data_year

under_18_share
age_18_24_share
age_25_34_share
age_35_44_share
age_45_64_share
age_65_plus_share

white_share
black_share
asian_share
other_race_share
hispanic_latino_share

data_release_id FK → data_releases.id

PRIMARY KEY (place_id, data_year)
```

These exact demographic categories are not permanently locked.

For V2, RegionLore should use practical ACS-based groupings.

Future international expansion may require additional ethnicity/race categories, different source mappings, normalization changes, or revised age bands.

RegionLore should not delay V2 to solve every possible international demographic model now.

---

# 11. Education Architecture

Resident educational attainment belongs in shared place-based socioeconomics or education-attainment data because it describes the residents of a place.

RegionLore should not assume that all education systems use U.S.-specific assessments.

For example, NAEP is an American assessment and should not become a universal column.

A future assessment model may resemble:

```text
assessment_results
------------------
place_id
assessment
subject
grade_or_level
year
score
data_release_id
```

A place where an assessment does not apply simply has no record.

V2 does not need to implement the full assessment architecture immediately.

---

# 12. Climate

## `climate_monthly`

```text
climate_monthly
---------------
place_id FK → places.id
month
normal_period
normal_high
normal_low
normal_mean
precipitation
snowfall
data_release_id FK → data_releases.id

PRIMARY KEY (
  place_id,
  month,
  normal_period
)
```

Climate is treated as a place-based concept rather than a city-only concept.

V2 may initially populate climate only for cities.

Monthly storage allows the UI to derive seasonal summaries without discarding the more detailed monthly values.

---

# 13. Crime

## `crime_statistics`

```text
crime_statistics
----------------
place_id FK → places.id
data_year
violent_crime_rate
property_crime_rate
homicide_rate
coverage_status
coverage_notes
data_release_id FK → data_releases.id

PRIMARY KEY (place_id, data_year)
```

For V2, FBI data may populate U.S. city crime where geography and reporting coverage are defensible.

If not defensible:

```text
coverage_status = unavailable
```

RegionLore should not silently substitute another geography.

---

# 14. Current Weather Cache

For V2, PostgreSQL will be used as the current weather cache.

This is a deliberate simplicity decision.

RegionLore already requires PostgreSQL, and the expected cache workload is small:

- approximately 500 initial cities;
- one small record per place;
- demand-driven refresh;
- 60-minute freshness window.

Adding Redis or another caching service is unnecessary for this workload.

The cache implementation should remain behind the backend service layer so it can be replaced later without changing the frontend contract.

## `weather_cache`

```text
weather_cache
-------------
place_id PK, FK → places.id
temperature
feels_like
condition_code
condition
description
humidity
wind_speed
fetched_at
expires_at
```

Backend policy:

```text
missing record
→ fetch OpenWeather
→ insert
→ return

fresh record (< 60 minutes)
→ return cache

stale record
→ fetch OpenWeather
→ update
→ return
```

No scheduled process should proactively refresh all supported places.

If nobody requests weather for a place, RegionLore should make no provider call for that place.

---

# 15. Articles

## `articles`

```text
articles
--------
id PK
title
slug UNIQUE
body
status
published_at
created_at
updated_at
```

Potential status values:

```text
draft
published
archived
```

## `article_places`

```text
article_places
--------------
article_id FK → articles.id
place_id FK → places.id

PRIMARY KEY (article_id, place_id)
```

An article can relate to any supported place type.

---

# 16. Tags

## `tags`

```text
tags
----
id PK
name
slug UNIQUE
```

## `article_tags`

```text
article_tags
------------
article_id FK → articles.id
tag_id FK → tags.id

PRIMARY KEY (article_id, tag_id)
```

Places answer:

> Where is this article about?

Tags answer:

> What is this article about?

---

# 17. Future People / Officials Model

Mayor, governor, president, prime minister, and similar data should not permanently live as plain text fields on geographic tables.

A future model may use:

## `people`

```text
people
------
id PK
name
slug UNIQUE
```

## `place_officials`

```text
place_officials
---------------
id PK
place_id FK → places.id
person_id FK → people.id
role
start_date
end_date
```

Implementation priority is low.

V2 should only implement this if the core product is complete and the data is easy to maintain.

---

# 18. V1 Migration Strategy

RegionLore should not migrate every V1 metric into PostgreSQL during initial V2 development.

Instead, V2 will perform an **identity migration first**.

## Move into PostgreSQL immediately

Existing supported V1 geographies should receive:

- `places` records;
- `states` or `metros` extension rows;
- aliases where useful;
- relationships where applicable.

This gives every supported state and metro a universal `place_id`.

## Leave in V1 generated files temporarily

Existing V1 metrics may continue using the current generated files/services.

### State

- population;
- economics;
- education;
- migration.

### Metro

- population;
- ACS;
- migration;
- counties.

The backend service layer can combine:

```text
Postgres identity
+
V1 metric service
```

into an API response.

## Later migration

When useful, existing V1 metrics can migrate into:

- `population_history`;
- `socioeconomics`;
- `housing`;
- `transportation`;
- `demographics`;
- specialized migration/education tables.

Because the `place_id` identity already exists, later metric migration does not require reinventing geography.

---

# 19. Temporary V2 Architecture During Migration

```text
                    RegionLore API
                         │
              ┌──────────┴──────────┐
              │                     │
              ↓                     ↓
          PostgreSQL            V1 generated data
              │                     │
              │                     ├── state metrics
              │                     └── metro metrics
              │
              ├── places
              ├── states
              ├── metros
              ├── cities
              ├── relationships
              ├── aliases
              ├── new V2 metrics
              ├── articles
              └── weather cache
```

The API/service layer should hide the storage difference from React.

Backend request handling currently follows a thin route → controller → service structure. Routes define HTTP endpoints, controllers orchestrate API responses, and services own PostgreSQL/storage-specific access. RegionLore uses centralized Express error middleware; with Express 5, errors from async controllers are forwarded automatically to that middleware without requiring controller-level `try/catch` + `next(error)` wrappers solely for async error propagation.

---

# 20. Future International Expansion

V2 is U.S.-focused, but the architecture should avoid unnecessary U.S.-only assumptions.

Examples:

- not every country has states;
- some countries use provinces, prefectures, territories, or regions;
- demographic categories differ;
- transportation datasets differ;
- education assessments differ;
- crime providers and methodologies differ.

RegionLore should prioritize the U.S. implementation now while preserving enough flexibility to expand later.

The project should not delay V2 to solve international normalization in advance.

---

# 21. Deferred V2 Architecture Areas

The following may be added later and should not block the core V2 implementation:

- `people`;
- `place_officials`;
- user accounts;
- favorites;
- survey tables;
- advanced assessment tables;
- international geographic types;
- advanced historical-site metadata;
- Redis/ElastiCache;
- full V1 metric migration.

---

# 22. Proposed Core V2 Tables

```text
GEOGRAPHY
---------
places
countries
states
cities
metros
relationship_types
place_relationships
place_aliases

PROVENANCE
----------
data_sources
data_releases

METRICS
-------
population_history
socioeconomics
housing
transportation
demographics
climate_monthly
crime_statistics
weather_cache

CONTENT
-------
articles
article_places
tags
article_tags
```

Not every table must be implemented in the first migration.

Implementation order should be defined separately.

---

# 23. Architecture Summary

RegionLore V2 uses a universal place identity system with specialized geographic extension tables.

The central design principles are:

1. **One geographic identity per place.**
2. **`place_id` is reused throughout the system.**
3. **Specialized tables extend places rather than replace them.**
4. **Relationships are explicit and directional.**
5. **Metric tables are organized by domain, not duplicated by geography unless necessary.**
6. **Historical values are preserved using place + time keys.**
7. **Data provenance is retained.**
8. **V1 state/metro identities move to PostgreSQL before their metrics do.**
9. **The backend hides mixed storage during migration.**
10. **PostgreSQL is sufficient for V2 weather caching.**
11. **Articles relate to places through one universal join table.**
12. **International expansion is supported structurally without delaying the U.S.-focused V2 release.**

This architecture should remain understandable, extensible, and practical rather than maximizing abstraction for its own sake.

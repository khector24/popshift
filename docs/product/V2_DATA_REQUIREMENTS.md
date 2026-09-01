# RegionLore --- V2 Data Requirements

**Status:** Initial data contract\
**Created:** August 26, 2026\
**Related:** `PRODUCT_VISION.md`, `V2_SCOPE.md`

------------------------------------------------------------------------

## 1. Purpose

This document defines the data RegionLore V2 needs before the PostgreSQL
schema, API design, and implementation plan are finalized.

The guiding rule is:

> RegionLore should normalize external data into its own stable metric
> names and geographic identifiers before the data reaches the API,
> React UI, or AI layer.

External source-specific codes belong in ingestion/build pipelines, not
in UI code.

------------------------------------------------------------------------

## 2. Geographic Identity

### States

Use the official two-digit Census state FIPS code as the primary
external government identifier.

Example:

-   New York: `36`

### Cities / Census Places

Use the Census place geography and retain:

-   state FIPS;
-   place FIPS;
-   concatenated Census GEOID (`state FIPS + place FIPS`);
-   Census fully qualified GEOID where useful;
-   official Census name;
-   RegionLore display name;
-   RegionLore slug;
-   state abbreviation;
-   latitude;
-   longitude;
-   land area;
-   water area.

Example:

-   New York city, New York
-   state FIPS: `36`
-   place FIPS: `51000`
-   place GEOID: `3651000`

The Census Gazetteer defines place GEOID as the concatenation of state
FIPS and place FIPS and supplies representative latitude/longitude and
area measurements.

### Metros

Retain the official five-digit CBSA code for metropolitan areas.

Example:

-   New York-Newark-Jersey City metro: CBSA `35620`

CBSA is **not** the same identifier as state FIPS or place FIPS.

### Internal RegionLore IDs

PostgreSQL should eventually use its own internal IDs in addition to
official external identifiers.

The exact table structure is intentionally **not decided in this
document**.

The later architecture decision will compare:

1.  separate `states`, `metros`, and `cities`;
2.  generalized `places` + relationships;
3.  a hybrid `places` identity layer with type-specific tables.

------------------------------------------------------------------------

## 3. Initial City Universe

### V2 target

**500 U.S. cities**

The starting population universe should be derived from the Census
Bureau Vintage 2025 incorporated-place population estimates.

The Census Vintage 2025 files provide annual population estimates from
2020 through 2025 and a ranked table for incorporated places with
populations of 20,000 or more.

### Selection rule

The initial pipeline should:

1.  ingest official Vintage 2025 incorporated-place estimates;
2.  identify supported incorporated cities/places;
3.  rank by July 1, 2025 population;
4.  select approximately the largest 500 supported cities;
5.  preserve Census geographic identifiers;
6.  document any exclusions or substitutions.

Do not maintain the Top 500 manually.

### Refresh

Population ranking should be regenerated when a new completed Census
population estimate vintage is adopted by RegionLore.

------------------------------------------------------------------------

## 4. Core Source Strategy

  Domain                    Primary V2 source                 Ingestion
  ------------------------- --------------------------------- ------------------------
  City identity/geography   Census Gazetteer                  Batch
  Population/history        Census Population Estimates       Batch
  Demographics              ACS 5-Year                        Batch
  Economics                 ACS 5-Year                        Batch
  Housing                   ACS 5-Year                        Batch
  Transportation            ACS 5-Year                        Batch
  Educational attainment    ACS 5-Year                        Batch
  Current weather           OpenWeather                       Live/cached API
  Typical climate           NOAA Climate Normals              Batch
  Crime                     FBI UCR/CDE                       Batch, with validation
  Mayor                     Optional source/manual strategy   TBD

------------------------------------------------------------------------

## 5. Census Population Requirements

### RegionLore fields

At minimum:

-   `population`
-   `populationRank`
-   `populationByYear`
-   `yearlyGrowth`
-   `growthSince2020`
-   `populationDataYear`

### Source

Census Bureau Vintage 2025 city/town population estimates.

### Notes

Population estimates should remain distinct from ACS population
estimates when RegionLore is presenting the current official population
figure.

The annual Census Population Estimates series should remain the
authoritative V2 source for current city population and recent
population growth.

------------------------------------------------------------------------

## 6. ACS 5-Year Requirements

### Why ACS 5-Year

Use ACS 5-Year rather than ACS 1-Year as the common city-profile
baseline.

The ACS 5-Year Data Profiles publish data for **all places** and expose
place geography using:

`state -> place`

Example Census API geography:

`for=place:51000&in=state:36`

This lets the pipeline join ACS data using official geographic codes
rather than city-name matching.

### Relevant profile families

-   `DP02` --- Selected Social Characteristics
-   `DP03` --- Selected Economic Characteristics
-   `DP04` --- Selected Housing Characteristics
-   `DP05` --- ACS Demographic and Housing Estimates

Exact variables should be centralized in the city ACS builder/config
rather than scattered throughout application code.

------------------------------------------------------------------------

## 7. Core City Metrics

### Population

RegionLore should expose:

-   current population;
-   population rank;
-   annual population history beginning in 2020;
-   latest annual change;
-   latest annual growth percentage;
-   growth since 2020.

**Source:** Census Population Estimates.

### Income and poverty

Expose:

-   median household income;
-   poverty rate.

**Source:** ACS 5-Year.

### Housing

Expose:

-   median gross rent;
-   median home value;
-   owner-occupied share;
-   renter-occupied share.

**Source:** ACS 5-Year.

### Employment

Expose:

-   employment-related population/share as selected during builder
    implementation;
-   unemployment rate;
-   work-from-home share.

**Source:** ACS 5-Year.

V2 does not require monthly BLS city unemployment data. A later release
may add BLS if higher-frequency labor-market information becomes a
product requirement.

### Transportation / commute

Expose:

-   mean commute time;
-   drive-alone share;
-   carpool share if useful;
-   public-transit share;
-   walking share;
-   work-from-home share.

**Source:** ACS 5-Year.

### Age

Expose a normalized age profile suitable for RegionLore comparisons.

The initial implementation may store either Census-derived age bands or
a RegionLore-normalized set of bands, provided the transformation is
documented.

Potential RegionLore groups include:

-   under 18;
-   18--24;
-   25--34;
-   35--44;
-   45--64;
-   65+.

Do not permanently lock these exact bands until the ACS variable mapping
is implemented and checked.

**Source:** ACS 5-Year.

### Race and ethnicity

Expose a small, clearly labeled demographic profile rather than every
possible ACS race table field.

The implementation must distinguish race from Hispanic/Latino ethnicity
and must preserve Census definitions in methodology documentation.

**Source:** ACS 5-Year.

### Educational attainment

Expose city-level resident attainment such as:

-   high school graduate or higher;
-   bachelor's degree or higher;
-   optionally other broad attainment categories.

**Source:** ACS 5-Year.

This is a demographic characteristic of residents and is **not** a
school quality score.

------------------------------------------------------------------------

## 8. Current Weather

### Source

OpenWeather Current Weather API.

### Location lookup

Call weather by the city's stored latitude and longitude rather than by
city name.

Conceptually:

`lat={city.latitude}&lon={city.longitude}`

### RegionLore fields

Initial current-weather fields may include:

-   current temperature;
-   feels-like temperature;
-   weather condition;
-   description;
-   humidity;
-   wind;
-   icon/condition code;
-   observation/update time.

### Fetching and freshness policy

Current weather should not be treated like annual Census data.

For V2, RegionLore should use a **backend-owned, demand-driven cache with a
60-minute freshness window**:

-   the frontend requests current weather from the RegionLore backend, not
    directly from OpenWeather;
-   if a cached city-weather record exists and is no more than 60 minutes
    old, return that cached record;
-   if the cached record is stale or missing, the backend calls OpenWeather,
    stores/replaces the cached result, and returns it;
-   cities are **not** proactively refreshed when nobody requests them.

The 60-minute window is the V2 product policy because RegionLore uses
weather as current place context rather than as a minute-by-minute weather
service. It can be revisited later if product needs change.

The freshness window is separate from physical cache deletion. The exact
cache technology and record-expiration mechanism remain architecture
decisions.

------------------------------------------------------------------------

## 9. Typical / Seasonal Climate

### Source

NOAA/NCEI U.S. Climate Normals, currently using the official 1991--2020
normals as the baseline candidate.

### Purpose

This answers:

> "What is this place normally like?"

rather than:

> "What is the weather right now?"

### RegionLore storage and presentation rule

RegionLore should ingest and retain **monthly** climate normals. Candidate
monthly fields include:

-   normal daily high;
-   normal daily low;
-   normal mean temperature;
-   precipitation;
-   snowfall where useful.

The V2 UI does not need to display all twelve months. It may derive simpler
seasonal summaries from the stored monthly values. Keeping monthly data
preserves flexibility without forcing a more detailed V2 presentation.

### Geographic caveat

NOAA normals are station-based rather than Census-place records.

The ingestion pipeline therefore needs a documented rule for selecting
an appropriate station or otherwise mapping climate observations to each
city.

This mapping must be validated before climate becomes a guaranteed V2
field.

------------------------------------------------------------------------

## 10. Crime

### Status

**V2 target, subject to reliable mapping and coverage.**

### Source

FBI Uniform Crime Reporting / Crime Data Explorer data.

### Important geography rule

A law-enforcement agency is not automatically equivalent to a Census
city.

RegionLore must not assume:

`police agency name == city boundary`

### Requirements before publishing a city crime metric

The pipeline must establish:

-   which reporting agency/agencies represent the city;
-   the population/area represented by those agencies;
-   whether reporting is sufficiently complete for the selected period;
-   whether the metric is comparable across cities;
-   what year the data represents.

### Candidate fields

After validation, possible fields include:

-   violent crime count/rate;
-   property crime count/rate;
-   homicide count/rate;
-   source year;
-   reporting/coverage metadata.

### Product rule

If a city cannot be represented responsibly, return the metric as
unavailable rather than inventing or silently substituting a
county/metro number.

A future methodology page should explain the crime-data limitations.

------------------------------------------------------------------------

## 11. Mayor

### Status

**Optional --- include only if maintainable.**

The U.S. Conference of Mayors maintains a searchable database of more
than 1,500 mayors representing cities of 30,000+ population, which
indicates that mayoral coverage is feasible for the V2 city universe.

However, RegionLore should not create a fragile scraping dependency
merely to display a mayor's name.

Possible implementation strategies:

-   a maintainable public source;
-   a small curated administrative dataset;
-   later editorial/admin tooling.

Mayor data changes on an irregular election/appointment schedule and
therefore requires a different refresh strategy from Census metrics.

V2 is not blocked if mayor data is deferred.

------------------------------------------------------------------------

## 12. Homelessness

### Status

**Deferred from V2 city requirements.**

### Reason

HUD Point-in-Time homelessness data is commonly organized around
Continuums of Care (CoCs). CoC geography does not reliably equal
municipal Census-place geography.

RegionLore should not label a CoC statistic as a city homelessness rate
unless the geography and methodology genuinely support that claim.

Revisit this feature when RegionLore has a geography-aware homelessness
methodology.

------------------------------------------------------------------------

## 13. School Performance and Education Spending

### Status

**Deferred from V2 city requirements.**

### Reason

School districts are separate geographic entities and do not reliably
map one-to-one to municipal boundaries.

A city may:

-   contain multiple districts;
-   overlap only part of a district;
-   be served by districts extending beyond city boundaries.

Therefore V2 should not attach district spending or school performance
directly to a city without a proper district/place relationship model.

### What remains in V2

Resident **educational attainment** from ACS remains core.

School quality, district performance, and per-student spending are
future features.

------------------------------------------------------------------------

## 14. City ↔ State Relationship

Every V2 city must have an explicit relationship to its state.

At minimum, the data model must preserve:

-   city internal ID;
-   city Census place identity;
-   state internal ID;
-   state FIPS.

This should be a real relationship in PostgreSQL rather than a
relationship inferred from display names.

------------------------------------------------------------------------

## 15. City ↔ Metro Relationship

City-to-metro membership must not be inferred from similar city and metro
names.

For the initial U.S. city universe, RegionLore will derive city-to-metro
membership using current Census geography and the existing RegionLore
metro-to-county / CBSA data.

The V2 pipeline will:

1. use 2025 Census place geography for supported cities;
2. determine the county or county-equivalent geography intersecting each place;
3. match those county FIPS codes against the existing RegionLore metro
   county-membership data;
4. determine the corresponding CBSA;
5. generate reusable city-to-metro membership data;
6. store supported relationships in PostgreSQL using `part_of_metro`.

Because Census places may cross county boundaries, the pipeline must support
a city intersecting more than one county.

The geographic matching should happen during the ingestion/build process
rather than inside the PostgreSQL identity seed.

Conceptually:

Census place geography
→ intersecting county/county-equivalent FIPS
→ RegionLore metro county membership
→ CBSA
→ `part_of_metro`

A city may have no supported RegionLore metro relationship. In that case,
RegionLore should leave the relationship unavailable rather than infer one
from names or substitute an unsupported geography.

---

## 16. Source IDs vs RegionLore Fields

Provider fields must be normalized.

Example:

External Census variable:

`B25064_001E`

should become a stable RegionLore concept such as:

`medianRent`

The frontend and AI context builder should not need to know the Census
variable code.

Conceptually:

External sources \| v Ingestion / builders \| v RegionLore normalized
metrics \| v PostgreSQL / data layer \| v API \| +----\> React \|
+----\> AI context

This separation allows Census variable selections, source years, or
providers to change without forcing unnecessary frontend changes.

------------------------------------------------------------------------

## 17. Data Provenance

For important metrics, RegionLore should be able to identify:

-   source/provider;
-   source dataset;
-   data year/vintage;
-   last ingestion/update time;
-   geography used;
-   methodology/caveat where relevant.

V2 does not necessarily require every provenance field to appear in
every API response.

The data model should nevertheless avoid throwing this information away.

------------------------------------------------------------------------

## 18. Refresh Strategy

  Data                            Expected refresh style
  ------------------------------- --------------------------------
  Census population estimates     Annual batch
  ACS city profile                Annual batch
  Gazetteer/geographic metadata   Annual/as needed
  NOAA climate normals            Rare/static batch
  FBI crime                       Annual/periodic batch
  Current weather                 On demand + 60-minute freshness cache
  Mayor                           Event/periodic/manual strategy

Builders should be rerunnable and should avoid requiring manual edits to
hundreds of city records.

------------------------------------------------------------------------

## 19. Missing Data Policy

Missing data is acceptable.

RegionLore should prefer:

`null / unavailable + explanation`

over:

-   guessing;
-   silently substituting another geography;
-   stale values presented as current;
-   fabricated comparisons;
-   misleading zeroes.

This rule is especially important for crime, climate mapping, and future
geographically complex datasets.

------------------------------------------------------------------------

## 20. Data Requirements Locked for V2

### Core

-   500-city universe;
-   Census geographic identity;
-   state relationship;
-   population and recent growth;
-   income;
-   rent;
-   home value;
-   age;
-   race/ethnicity;
-   educational attainment;
-   poverty;
-   employment/unemployment;
-   work from home;
-   commute time;
-   commute modes;
-   owner/renter share;
-   current weather.

### Core if mapping/data quality is acceptable

-   typical/seasonal climate;
-   city crime.

### Optional

-   mayor.

### Deferred

-   homelessness;
-   school performance;
-   education spending;
-   walkability;
-   nightlife;
-   sports;
-   attractions;
-   custom cost of living;
-   occupation-specific salaries;
-   advanced GIS/maps;
-   deep historical city timelines.

------------------------------------------------------------------------

## 21. Questions Reserved for Architecture Design

This document intentionally does **not** answer:

-   whether RegionLore uses a generalized `places` table;
-   whether it uses separate `states`, `cities`, and `metros` tables;
-   whether it uses a hybrid model;
-   exact PostgreSQL table definitions;
-   whether normalized metrics live in wide tables, domain tables, or
    another structure;
-   how articles relate to geographic entities;
-   exact REST endpoints;
-   whether V1 generated state/metro files move into PostgreSQL;
-   exact weather caching technology and physical expiration mechanism;
-   exact AI cache/precomputation design.

Those decisions come next.

------------------------------------------------------------------------

## 22. Primary Research References

-   U.S. Census Bureau, Vintage 2025 City and Town Population Estimates:
    https://www.census.gov/data/tables/time-series/demo/popest/2020s-total-cities-and-towns.html
-   U.S. Census Bureau, 2025 Gazetteer Files:
    https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2025.html
-   U.S. Census Bureau, 2025 Gazetteer Record Layouts:
    https://www.census.gov/programs-surveys/geography/technical-documentation/records-layout/gaz-record-layouts/gaz25-record-layouts.html
-   U.S. Census Bureau, 2024 ACS 5-Year:
    https://www.census.gov/data/developers/data-sets/acs-5year/2024.html
-   Census API, ACS 5-Year Data Profiles:
    https://api.census.gov/data/2024/acs/acs5/profile.html
-   Census API, ACS place geography examples:
    https://api.census.gov/data/2024/acs/acs5/profile/examples.html
-   Census Bureau, Metropolitan/Micropolitan Delineation Files:
    https://www.census.gov/programs-surveys/metro-micro/about/delineation-files.html
-   OpenWeather Current Weather API:
    https://openweathermap.org/api/current
-   U.S. Conference of Mayors, Meet the Mayors:
    https://www.usmayors.org/mayors/meet-the-mayors/

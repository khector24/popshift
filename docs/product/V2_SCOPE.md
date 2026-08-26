# RegionLore — Version 2 Scope

**Status:** Planning / Scope Locked  
**Created:** August 26, 2026  
**Product Vision:** `docs/product/PRODUCT_VISION.md`

---

## 1. Purpose of V2

Version 2 is the first major expansion of RegionLore beyond its original
state- and metro-focused implementation.

V2 should demonstrate the broader direction of RegionLore without attempting
to build the entire long-term product at once.

The primary goals are to:

1. Introduce cities as a first-class geographic entity.
2. Establish a PostgreSQL-backed foundation for new V2 systems.
3. Introduce lightweight editorial content through articles.
4. Add useful AI-powered geographic comparison.
5. Begin the "If I Move From X to Y" experience.
6. Preserve the working V1 state and metro experience.
7. Strengthen RegionLore as a portfolio project demonstrating full-stack,
   database, cloud, data-pipeline, and AI engineering skills.

V2 is not intended to implement the complete RegionLore product vision.

---

## 2. V2 Product Principle

V2 should be the smallest release that clearly proves RegionLore's future
direction.

New systems should be designed so they can grow later, but features should
not be built merely because they may eventually be useful.

Where possible:

- build extensible foundations;
- implement only the functionality V2 actually needs;
- preserve working V1 functionality;
- avoid premature migration of working systems;
- avoid speculative complexity.

---

## 3. Cities

Cities become a first-class geographic entity alongside states and metros.

### Initial target: 500 U.S. cities

The initial city set should contain approximately the 500 largest supported
U.S. cities by population, subject to final data-quality and geography checks.

The city pipeline should be automated wherever practical so that supporting
500 cities does not require maintaining 500 records manually.

Each city should have stable identifiers and explicit relationships to its
state and, where applicable, metro area.

---

## 4. Core City Data

The following categories are V2 core city data:

- population;
- recent population history and growth;
- median household income;
- median rent;
- median home value;
- age demographics;
- race and ethnicity demographics;
- educational attainment;
- poverty rate;
- employment / unemployment;
- work-from-home share;
- average commute time;
- driving commute share;
- public-transit commute share;
- walking commute share;
- homeownership / renter share;
- current weather.

### Core when practical and reliable

The following should be included when a reliable and reasonably simple source
is available:

- seasonal climate / typical highs and lows;
- comparable city-level crime data.

If either becomes disproportionately difficult or methodologically weak, it
may be deferred without blocking V2.

### Add if easy and defensible

The following are desirable but should not become major V2 projects:

- mayor;
- homelessness data;
- city/local education spending;
- school/education performance.

RegionLore should not invent a proprietary school-performance score merely to
fill this section. If no clean and defensible comparable source exists, these
features should be deferred.

---

## 5. City Pages

Users should be able to search for and open individual city pages.

City pages should present the V2 city data that is available and reliable.

They should also support relationships to:

- the city's state;
- the city's metro area where applicable;
- related RegionLore articles.

Not every possible RegionLore metric needs to ship in V2.

---

## 6. PostgreSQL Foundation

V2 introduces PostgreSQL for new systems that benefit from relational,
queryable, persistent storage.

PostgreSQL should support new V2 systems such as:

- cities and city metadata;
- geographic relationships;
- articles;
- article/place relationships;
- tags;
- future survey data if the stretch survey is implemented.

This does NOT mean every existing V1 dataset must immediately move into
PostgreSQL.

Existing state and metro systems may continue using their current generated
data files while they remain stable and useful.

Migration of V1 systems should happen only when there is a clear technical or
product reason.

---

## 7. Articles

V2 introduces RegionLore's editorial/content layer.

The article system should remain lightweight.

Articles should support:

- title;
- slug;
- article content;
- publication information;
- tags/categories;
- relationships to one or more geographic entities.

An article may relate to a city, state, metro, or multiple places.

Place pages should be capable of displaying related RegionLore articles.

V2 does not require a large WordPress-style CMS.

---

## 8. AI Geographic Comparison

AI-powered geographic comparison is a core V2 feature.

Examples include:

- New York vs. Chicago;
- Texas vs. Florida;
- Cleveland vs. Pittsburgh;
- "Should I move from City X to City Y?"

RegionLore should gather its own structured data first and provide that
structured context to an existing AI model.

The AI layer should primarily:

- interpret;
- compare;
- summarize;
- explain tradeoffs;
- personalize an answer using user-selected preferences.

The AI model should not be treated as the authoritative source for RegionLore's
geographic statistics.

Provider selection, caching, precomputed comparisons, model-call strategy, and
storage strategy are architecture decisions to be made after scope is locked.

---

## 9. Moving Comparison

V2 should implement the first meaningful version of:

**If I Move From X to Y**

Users should be able to compare supported locations and see relevant
differences using RegionLore's structured data.

Potential comparison dimensions include:

- population and growth;
- income;
- rent;
- home value;
- housing;
- demographics;
- employment;
- transportation / commute;
- weather;
- crime where available.

The structured comparison may then be interpreted by the AI layer.

V2 does not require occupation-specific salary estimates, a custom RegionLore
cost-of-living model, or a complete personal financial simulation.

---

## 10. Moving Survey — Stretch Goal

A small anonymous moving-interest survey is a V2 stretch goal.

It may ask simple questions such as:

- Where do you currently live?
- Where are you considering moving?
- Why are you considering the move?
- Have you already moved?

The survey should not require a full account system merely to exist.

More sophisticated longitudinal surveys and later follow-up with identified
users belong to a future release.

V2 is complete even if this stretch goal is not implemented.

---

## 11. Accounts and Favorites — Later

Accounts are not required for V2.

Favorites are not required for V2.

Authentication should not be added merely to demonstrate authentication.

Accounts may be introduced in a later release when they materially support
features such as:

- favorites;
- saved preferences;
- survey follow-up;
- personalized feeds;
- persistent moving profiles.

---

## 12. Search and Geographic Relationships

Users should be able to find supported geographic entities through search.

V2 should understand relationships such as:

City -> State

City -> Metro, when applicable

Metro -> State(s)

Article -> One or more geographic entities

The model should be extensible enough to support future geographic levels
without requiring those levels to be implemented in V2.

---

## 13. Existing V1 Functionality

V2 should preserve the working V1 state and metro experience.

Existing features should not be rewritten simply because a new architecture
exists.

V1 currently provides the foundation for:

- states;
- metros;
- population;
- migration;
- economics/housing;
- education;
- rankings;
- comparisons;
- geographic detail pages;
- dashboards and visualization.

Replacing working V1 systems is not itself a V2 objective.

---

## 14. Explicitly Out of Scope for V2

The following are not V2 requirements:

- international expansion;
- neighborhoods;
- landmarks/sites as first-class geographic entities;
- attractions database;
- walkability scoring;
- nightlife;
- sports-team/scene data;
- custom RegionLore cost-of-living index;
- occupation-specific salary estimates;
- deep historical place timelines;
- advanced GIS functionality;
- new city-map functionality unless it proves extremely easy and valuable;
- automatic breaking-news aggregation;
- full social/community functionality;
- personalized Reddit-style feeds;
- comments;
- full account/profile system;
- favorites;
- sophisticated longitudinal surveys;
- training a proprietary AI model;
- migrating every V1 dataset into PostgreSQL;
- implementing every possible city metric.

These remain candidates for later releases.

---

## 15. Architecture Questions Intentionally Deferred

The following are important but are not product-scope decisions:

- exact Census/ACS datasets and variables;
- current-weather provider implementation;
- historical/seasonal climate source;
- crime-data source and comparability rules;
- PostgreSQL schema;
- which data remains generated/static versus stored in PostgreSQL;
- AI provider/model;
- AI context assembly;
- precomputed AI comparisons;
- AI response caching;
- cache/storage technology;
- API-call and cost-control strategy;
- deployment changes required for V2.

These should be decided during data-requirements and architecture planning.

---

## 16. V2 Portfolio Goals

RegionLore V2 should demonstrate experience with:

- React;
- Node / Express;
- REST APIs;
- PostgreSQL;
- relational data modeling;
- AWS/cloud deployment;
- external data ingestion;
- data transformation pipelines;
- AI API integration;
- structured prompting/context assembly;
- production-oriented engineering decisions.

The architecture and tradeoffs should remain understandable enough to explain
clearly during a software engineering interview.

---

## 17. Definition of Done

V2 is complete when:

1. Cities exist as a working first-class geographic entity.
2. The initial city set contains approximately 500 supported U.S. cities.
3. Users can search for and view useful city pages.
4. Core city datasets are populated from reliable sources.
5. PostgreSQL supports the new relational V2 systems that require it.
6. Articles can be stored and associated with geographic entities.
7. Related articles can appear on appropriate place pages.
8. Users can compare supported places using structured RegionLore data.
9. AI can explain meaningful geographic comparisons using RegionLore-provided
   context.
10. A meaningful "If I Move From X to Y" experience exists.
11. Existing V1 state and metro functionality remains operational.
12. The deployed application demonstrates the complete core V2 flow.
13. Major architecture and data-source decisions are documented.

The moving survey is a stretch goal and is not required for V2 completion.

---

## 18. After V2

Possible future releases may include:

- accounts and favorites;
- longitudinal moving surveys;
- larger city coverage;
- neighborhoods;
- landmarks and significant places;
- walkability;
- nightlife;
- sports;
- attractions;
- historical place timelines;
- occupation-specific moving analysis;
- RegionLore's own cost-of-living methodology;
- community/following systems;
- international locations;
- broader geographic hierarchies;
- more sophisticated AI recommendations;
- large-scale migration of existing geographic data into PostgreSQL.

# RegionLore Product Vision

**Long-Term Product Vision**\
_Vision document --- intentionally broader than Version 2_

## 1. Product Thesis

RegionLore is a place-intelligence and editorial platform for
understanding where people live, why places are changing, and whether
one place may fit a person better than another.

**The core object is a place.** Today that primarily means U.S. states
and metropolitan areas; cities are the next major expansion. Over time,
the concept may extend to counties, neighborhoods, historically or
culturally significant sites, U.S. territories, and eventually places
outside the United States.

**RegionLore should answer three central questions:**

1.  What is this place like?
2.  How and why is this place changing?
3.  Would this place make sense for me?

## 2. Product Principles

### Context, not just statistics

A raw number is rarely enough. RegionLore should explain whether a value
is high or low, how it compares with national or peer-place benchmarks,
whether it is rising or falling, and---where appropriate---what may
explain the trend.

### Data + Lore + Experience

RegionLore can combine three complementary kinds of knowledge:
structured data from trustworthy sources; original editorial analysis
and explainers; and anonymized or aggregated experiences reported by
users through surveys.

### AI as a synthesis layer

AI should sit on top of RegionLore's own structured knowledge rather
than replace it. The product should remain useful without AI; AI adds
explanation, comparison, personalization, and synthesis.

### Source transparency

Statistics should preserve source, year or period, geography, and
methodology where practical. RegionLore should make it possible to
distinguish current data from older data and official statistics from
editorial interpretation or survey results.

### Build for extension, ship narrowly

The long-term model should not unnecessarily block future geographic
levels or features, but each release should implement only the scope
that can be built and maintained well.

## 3. Geographic Model

Long-term geographic scope may include:

- Country
- State / territory or equivalent first-level region
- Metropolitan area
- County or equivalent subregion where useful
- City
- Neighborhood
- Specific landmark, institution, historic site, or other notable
  place

These levels do not all need first-class support at the same time.
Version 2 remains U.S.-focused, with cities as the next major addition.
The architecture should avoid assuming that every country uses the same
state → metro → city hierarchy.

## 4. Place Intelligence

A RegionLore place profile should grow into a rich reference page that
teaches the user about the place rather than merely listing facts.

### Potential subject areas

- Population, growth, density, and historical change
- Demographics, age structure, households, families, and poverty
- Income, employment, unemployment, work-from-home, jobs, and major
  industries
- Housing, rent, home values, housing burden, construction, and
  eventually a RegionLore cost-of-living model
- Education spending, attainment, outcomes, and rankings/context
- Crime and public-safety indicators
- Weather, climate, seasonal conditions, precipitation/snow, and
  potentially air quality
- Transportation, commute patterns, driving, transit, and walkability
- Government and civic facts such as mayor or other relevant
  leadership
- Quality-of-life context such as nightlife, sports access,
  homelessness, attractions, and culture where useful
- Migration and movement into, out of, and between places
- Basic metadata such as county, area, elevation, incorporation date,
  and time zone where relevant

Not every geography needs every metric, and not every metric belongs in
Version 2. The system should permit subject areas to be added gradually.

## 5. Editorial and Lore

RegionLore is also an editorial publication focused on geography,
cities, regions, migration, policy, history, and the forces shaping
places.

- Data-driven analysis explaining why a place ranks or changes the way
  it does
- Local and regional policy analysis
- Historical explainers and timelines
- Short facts and contextual lore
- Serious reporting/analysis as well as occasional playful or cultural
  pieces
- Related articles surfaced on relevant place pages

An article may relate to one or many places, and those relationships
should be editorially chosen rather than automatically inherited through
geographic parents. For example, an article about New York City is not
automatically an article about New York State.

External-news aggregation or automatic surfacing of third-party
reporting remains an open future possibility, not a committed
requirement.

## 6. Search, Discovery, and Following

Users should be able to search for and browse places even when names
overlap across geographic types. Search should understand the difference
between a state, city, metro, and future place types.

- Directories and filters for supported geographic levels
- Global place search
- Rankings and contextual discovery
- Future saved/favorite places and comparisons
- Future topic/tag following
- Future feeds or notifications for new RegionLore articles and data
  updates tied to followed places/topics

Advanced recommendation/discovery filters---such as finding affordable
large cities with mild winters and high work-from-home rates---are
future possibilities rather than a Version 2 commitment.

## 7. Comparison and Relocation

### General place comparison

Users should be able to compare supported states, metros, and cities
across relevant data. AI can eventually explain tradeoffs rather than
merely displaying side-by-side numbers.

### Directional move analysis

A separate but related experience answers: **"What changes if I move
from here to there?"** The direction matters because origin and
destination can be compared in terms of housing, income, commute,
weather, transportation, crime, taxes, cost of living, and other
available factors.

Future versions may include occupation-specific comparisons---for
example, expected software-engineering compensation and purchasing-power
changes---but this is intentionally outside the initial Version 2 scope.

### Migration Explorer

A future standalone migration-exploration experience may let users
investigate flows and patterns without first choosing a specific
comparison.

## 8. Surveys and First-Party Move Data

RegionLore may collect voluntary survey information from people who are
considering, planning, completing, or reflecting on a move.

- Where a respondent is considering moving from and to
- Whether they are exploring, planning, have moved, or later moved
  again
- Reasons for considering or completing the move
- Follow-up questions after a period of time
- Whether expectations were met and whether the respondent would make
  the move again

Public reporting should emphasize anonymous or aggregated results rather
than exposing an individual's moving history. Some surveys may be
anonymous; account-associated responses may be used privately to support
continuity and future follow-ups.

Over time, this can create a distinctive first-party RegionLore dataset
that complements official migration statistics.

## 9. Personalization

RegionLore can eventually tailor place recommendations and comparisons
to a user's priorities. Early implementations can deliberately use
simple, pre-approved categories rather than requiring highly granular
personal information.

- Age group / life stage
- Children or household context
- Housing budget and preferences
- Weather preferences
- Driving, transit, and walkability preferences
- Nightlife and lifestyle priorities
- Retirement or family considerations
- Future occupation/income context

A 22-year-old without children, a family with children, and a retiree
may reasonably receive different interpretations of the same place data.

## 10. Historical Change

RegionLore should eventually explain not only what a place is like now
but how it got there. Historical data should be preserved where feasible
rather than simply overwritten by the newest value.

Long-term profiles may connect timelines, statistical change, historical
events, and editorial analysis---for example, explaining a city's rise,
decline, and recovery.

## 11. AI Strategy

RegionLore does not require training a foundation model. It can use
existing model providers and feed them structured RegionLore context.

- Structured place data
- RegionLore articles and editorial context
- Aggregated survey findings
- User-selected preferences and comparison context

Stable, common comparisons may be precomputed or cached, while highly
personalized analyses can be generated on demand. The eventual choice of
model provider, cache, PostgreSQL, DynamoDB, object storage, or other
persistence is an architecture decision---not part of this product
vision.

## 12. Accounts and Community Layer

Accounts are a long-term personalization and continuity mechanism rather
than a requirement for every RegionLore interaction.

- Favorite or follow places
- Follow topics/tags
- Save comparisons and moving shortlists
- Receive relevant new articles or data updates
- Maintain continuity across voluntary move surveys
- Potentially return for follow-up questions after a move

RegionLore is not envisioned primarily as a social network. The
community value comes from useful aggregate experience and personalized
continuity.

## 13. Long-Term Geographic Expansion

The near-term product remains U.S.-focused. Long-term expansion may
include Washington, D.C., Puerto Rico, Guam and other territories,
followed eventually by international places.

International expansion should be treated as a later product phase with
country-specific geographic structures and data availability rather than
forced into Version 2.

## 14. What Version 2 Is Not

This vision document is intentionally larger than Version 2. The
following are not automatic Version 2 requirements:

- International geography
- Neighborhoods or individual sites as first-class entities
- More than roughly 350--500 initial cities
- A custom RegionLore cost-of-living index
- Occupation-specific salary engines
- Full historical reconstruction of every place
- A sophisticated longitudinal survey ecosystem
- Advanced external-news aggregation
- A full GIS/mapping platform
- A public developer API
- Every possible place metric or quality-of-life dataset
- A fully developed social/feed system

## 15. Version 2 Product Intent

Version 2 should be a deliberately smaller, coherent release that
advances RegionLore while also demonstrating strong software-engineering
skills. Its exact feature scope will be defined in a separate Version 2
document after this vision is reviewed and approved.

Likely architectural/portfolio themes to evaluate for Version 2 include
a proper PostgreSQL-backed backend, schema/migrations, richer Express
APIs, city data ingestion, articles/tags, selective account
functionality, a small survey proof of concept, AI-assisted comparison,
caching, testing, and deployment. These are candidates---not
commitments---until the Version 2 scope is explicitly chosen.

## 16. Existing V1 Foundation to Preserve

RegionLore already has meaningful state and metro functionality. Version
2 should build from working V1 capabilities rather than rewrite them
without a concrete benefit.

- State profiles, rankings, comparisons, migration, population,
  economics, and education
- Metro directory and metro detail experiences
- Existing population/migration/ACS data builders and services
- Global search and directory patterns
- Methodology and data-source transparency
- Current design language, charts, contextual indicators, and
  related-article concepts

Existing state/metro static data and pipelines can migrate toward newer
architecture gradually when doing so creates a real product or
maintenance benefit.

## 17. Open Questions for Later Planning

- Should the first city release target 350, 500, or use a rule-based
  inclusion threshold?
- Which city datasets are reliable enough to justify Version 2
  inclusion?
- Which subset of articles, tags, accounts, surveys, and AI belongs in
  the first V2 release?
- How should a generic place model coexist with specialized
  state/metro/city data?
- How should historical statistics be modeled without overengineering
  the initial release?
- Which comparison results should be precomputed versus generated on
  demand?
- What privacy and minimum-sample rules should govern survey
  reporting?
- When, if ever, should counties become first-class RegionLore
  profiles?
- Should attractions remain simple metadata or eventually become
  searchable place entities?
- Should external reporting/news ever be surfaced automatically?

## 18. One-Sentence North Star

> **RegionLore helps people understand places---what they are like, why
> they are changing, how they compare, and what those differences may
> mean for the people considering life there.**

---

_RegionLore Product Vision — Draft 1 — August 26, 2026_

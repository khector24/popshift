# RegionLore - Post-V2 Roadmap

**Status:** Directional / Not Locked Scope\
**Created:** September 3, 2026\
**Related:** `PRODUCT_VISION.md`, `V2_SCOPE.md`,
`V2_IMPLEMENTATION_PLAN.md`

------------------------------------------------------------------------

## 1. Purpose

This document preserves important RegionLore ideas that should **not**
expand or delay Version 2.

V2 remains intentionally focused. Ideas listed here are candidates for
later releases, not promises, requirements, or current implementation
work.

The purpose of this roadmap is to:

-   prevent useful ideas from being forgotten;
-   keep speculative work out of the active V2 scope;
-   provide a likely direction after V2;
-   separate future data, architecture, design, and coverage work into
    manageable releases;
-   allow priorities to change as RegionLore matures.

Post-V2 version numbers and feature groupings are **directional rather
than locked**.

------------------------------------------------------------------------

## 2. Guiding Principle

Do not build a feature merely because it would look useful on a mockup.

Future additions should be evaluated based on:

1.  user value;
2.  data quality and defensibility;
3.  implementation and maintenance cost;
4.  fit with the existing RegionLore architecture;
5.  whether the feature belongs in the current release or should remain
    deferred.

When a feature requires a large new data pipeline, difficult geographic
inference, or substantial manual maintenance, it should be allowed to
wait.

------------------------------------------------------------------------

## 3. Version 3 - State and Metro Data Migration

### Goal

Move the existing V1 state and metro metric systems gradually into the
newer PostgreSQL-backed, place-based architecture established during V2.

V2 already establishes universal `place_id` identities while
intentionally preserving working V1 state and metro metric systems. V3
is the likely release for completing more of that migration.

### Likely work

Potential migration targets include:

-   population history;
-   socioeconomic metrics;
-   housing;
-   transportation;
-   demographics;
-   education;
-   state migration;
-   metro migration;
-   other specialized state/metro datasets already supported by
    RegionLore.

### Principles

-   Preserve working state and metro pages throughout the migration.
-   Reuse the universal place identity and provenance systems created in
    V2.
-   Prefer incremental migration over a single large rewrite.
-   Do not redesign every frontend page simply because its backend data
    source changes.
-   Verify migrated metrics against the existing V1 outputs before
    retiring old generated-file paths.

### Definition of success

V3 should leave RegionLore with a more consistent data architecture
across cities, states, and metros without sacrificing existing
functionality.

------------------------------------------------------------------------

## 4. Version 4 - Frontend and Design-System Refinement

### Goal

Revisit the RegionLore frontend after the V2 product surface and V3 data
architecture have had time to stabilize.

This should remain separate from V3 unless the eventual amount of work
proves small enough to combine safely.

### Likely work

-   introduce light and dark appearance modes;
-   manage appearance through React Context or the most appropriate
    frontend state architecture at that time;
-   make the existing navy/blue RegionLore palette the primary dark-mode
    visual language;
-   use white/light surfaces in light mode;
-   reduce unnecessary dependence on purple while retaining purple as a
    secondary/accent color where it works;
-   redesign or substantially improve the home page;
-   align city, state, and metro profile layouts;
-   refine navigation;
-   improve responsive behavior;
-   improve typography, spacing, cards, and visual hierarchy;
-   clean up components that become awkward after V2 features are fully
    integrated.

### Current design direction

The present city-detail work should already move toward the blue/navy
design language so that V4 does not require rebuilding the city
experience from scratch.

Current weather should eventually appear as a compact part of the city
hero or hero-adjacent identity area.

Historical/seasonal climate information should remain a fuller content
section lower on the page.

------------------------------------------------------------------------

## 5. Version 5 - Coverage Expansion and Profile Enrichment

### Goal

Expand the number of places RegionLore supports and begin selectively
enriching profiles with additional datasets.

This is not a commitment that every feature below ships in V5. V5 should
select the highest-value additions that are practical and defensible.

### Coverage candidates

Possible targets:

-   expand metro coverage toward roughly 350 U.S. metros;
-   expand city coverage from roughly 500 toward roughly 1,000 cities;
-   reuse established ingestion pipelines rather than manually
    maintaining additional places.

Exact counts should remain flexible based on source coverage and data
quality.

### Profile-enrichment candidates

Potential later additions include:

-   city migration;
-   top employers;
-   incorporation/founding information;
-   elevation;
-   official city website;
-   major industries;
-   major airports;
-   universities and colleges;
-   richer local geography;
-   local government information;
-   attractions and significant places;
-   additional affordability measures;
-   additional quality-of-life indicators;
-   richer economic indicators;
-   expanded education information;
-   other city context that proves useful and maintainable.

These are backlog candidates, not V5 requirements.

------------------------------------------------------------------------

## 6. City Migration - Explicitly Deferred

City migration is desirable, but it should **not** be added to V2 merely
to match the existing state and metro experiences.

RegionLore currently has migration approaches for larger geographies,
including state migration and metro migration built from county-level
flows. A city-level system may require a different methodology or
additional geographic inference.

Before implementing city migration, RegionLore should answer:

-   What source actually supports a defensible city-level measure?
-   If county flows are used, how are multi-city counties handled?
-   How are independent cities or unusual geographies handled?
-   Would an estimate be presented as city migration when it is actually
    county-derived?
-   Is the methodology understandable enough to explain honestly to
    users?
-   Is the resulting value worth the pipeline and maintenance cost?

If those questions do not have clean answers, city migration should
remain unavailable rather than presenting misleading precision.

------------------------------------------------------------------------

## 7. Top Employers and Other Local Context - Explicitly Deferred

Top employers would be useful on city pages but are not currently part
of the V2 data architecture.

Before adding them, RegionLore should determine whether a sufficiently
consistent national source exists or whether the feature would require
manual/local sourcing.

The same caution applies to:

-   incorporation dates;
-   municipal websites;
-   elevation;
-   airports;
-   universities;
-   major industries;
-   attractions;
-   local government details.

A visually attractive card is not enough reason to create a fragile
data-maintenance burden.

------------------------------------------------------------------------

## 8. Compare Places - Post-V2 Direction

V2 establishes one coherent **Compare Places** product with structured
RegionLore facts, optional comparison context, and AI-assisted explanation.

Post-V2 work can deepen that same foundation rather than creating disconnected
comparison products.

### Directional Move Analysis

Preserve **Directional Move Analysis** as a named capability within Compare
Places.

The central question is:

> **What changes if I move from here to there?**

Unlike a symmetric A-vs-B comparison, directional analysis treats one place as
the origin and another as the destination. Future versions can explain changes
from the user's starting point across dimensions such as:

-   housing costs and housing options;
-   income and employment context;
-   commute and transportation;
-   climate;
-   crime or safety data where defensible;
-   taxes;
-   cost of living;
-   other RegionLore-supported quality-of-life dimensions.

Possible later personalization includes:

-   saved/private comparison preferences;
-   occupation or career field;
-   actual salary or job-offer inputs;
-   household context;
-   purchasing-power changes;
-   RegionLore's own transparent cost-of-living methodology;
-   richer personal financial context.

These features should remain evidence-first. RegionLore should provide or
calculate the underlying facts; AI should explain differences and tradeoffs
rather than independently inventing data or deciding where a user should live.

### Comparison Engine Upgrades

Possible later upgrades include:

-   cross-geography comparison, such as city vs. metro or metro vs. state;
-   richer priority weighting rather than only selecting important dimensions;
-   explicit tradeoff modeling, such as affordability vs. location, career
    opportunity vs. housing cost, or transit access vs. driving;
-   additional defensible datasets and comparison dimensions;
-   cached or precomputed AI explanations where they improve cost, speed, or
    consistency;
-   saved comparisons and reusable preference profiles if accounts are added.

Cross-geography comparison should only be added when RegionLore can clearly
communicate differences in geographic definitions and metric availability.

### Place-Detail AI Summaries

A later detail-page enhancement may generate short, readable **At a Glance**
prose from RegionLore's structured data.

This could be generated and cached when data is refreshed rather than requiring
a model call on every page view. The purpose would be to make place pages easier
to read, not to replace the underlying metrics or provenance.

### Travel-Oriented Comparison

The same preference-and-tradeoff engine may eventually support travel questions
without becoming part of V2.

Travel comparison could emphasize:

-   history and cultural attractions;
-   beaches and relaxation;
-   food;
-   nightlife;
-   nature;
-   weather;
-   budget;
-   major attractions and things to do.

This is a longer-term extension of RegionLore's place-understanding model, not a
committed near-term release.

------------------------------------------------------------------------

## 9. Longer-Term Backlog

Ideas already discussed or deferred elsewhere may include:

-   accounts and favorites;
-   longitudinal moving surveys;
-   neighborhoods;
-   landmarks and significant places;
-   walkability;
-   nightlife;
-   sports;
-   attractions;
-   historical place timelines;
-   occupation-specific moving analysis;
-   RegionLore's own cost-of-living methodology;
-   community/following systems;
-   international locations;
-   broader geographic hierarchies;
-   more sophisticated AI recommendations;
-   account-linked feedback on AI-generated comparisons/recommendations,
    such as like, dislike, or flag actions that can help evaluate output quality
    and improve later product behavior;
-   county profiles if they eventually become useful;
-   richer comparison and recommendation tools.

These ideas should remain outside active release scope until
intentionally promoted into a version plan.

------------------------------------------------------------------------

## 10. Technical Cleanup and Publishing Enhancements

The following technical improvements are intentionally deferred beyond
V2. They are not required to complete the current release.

### Shared slug generation

V2 introduces a shared `src/utils/slugify.js` utility as part of the
articles and tags implementation.

Some older geography and metro build/seed scripts contain their own
slug-generation helpers. A future cleanup may consolidate generic
slug-generation behavior around the shared utility.

When doing so:

-   preserve geography-specific preprocessing where required;
-   do not replace unrelated normalization logic used for search, aliases,
    source matching, or data cleanup;
-   verify existing place slugs before changing generated outputs;
-   avoid unintentionally breaking existing place URLs.

### Article URL history and redirects

In V2, article slugs are generated programmatically from article titles.
When an article title changes, its slug changes with the title.

If RegionLore later needs stronger URL permanence for published
articles, add an explicit article-slug history and redirect system rather
than complicating the lightweight V2 editorial workflow.

Possible future behavior could include preserving previous slugs and
redirecting old article URLs to the article's current canonical URL.

------------------------------------------------------------------------

### Database-backed article authors

V2 currently assumes a single RegionLore writer and displays `Kenny Hector`
directly in the public article frontend. Authorship is not yet stored on the
article record.

Before RegionLore supports multiple writers, add a proper database-backed
author model rather than continuing to hardcode author names in the frontend.

The eventual implementation should:

- represent article authors explicitly in PostgreSQL;
- associate articles with their author through a stable relationship;
- backfill existing RegionLore articles to Kenny Hector;
- allow the admin article workflow to select an author when multiple authors
  become supported;
- keep article authorship conceptually separate from the current V2 `users`
  table unless a future authentication/account design provides a clear reason
  to unify them.

The current `users` table exists to authenticate private administrators. An
editorial author identity and a login identity should not be assumed to be the
same concept merely because the initial RegionLore administrator is also the
initial writer.

### Tag-based article discovery

V2 stores reusable article tags and exposes them on public article detail
responses, but public tag pills are intentionally informational rather than
clickable.

A later publishing/discovery enhancement should allow users to browse or filter
RegionLore articles by tag.

Possible product behavior may include:

- filtering the article directory by tag;
- linking article-detail tag pills into filtered article results;
- tag-specific browsing pages if they become useful;
- incorporating tags into broader article search/discovery;
- eventually connecting article tags with future topic-following features.

The exact URL design may use query parameters such as `/articles?tag=...` or
dedicated tag routes. That decision should be made when tag discovery is
implemented rather than creating unused V2 routes now.

## 11. Promotion Rule

A feature should move from this roadmap into a version-specific scope
only when RegionLore is ready to answer:

1.  What user problem does it solve?
2.  What source supplies the data?
3.  Is the methodology defensible?
4.  What schema/API/frontend work is required?
5.  What are the missing-data and failure behaviors?
6.  How will the data be refreshed?
7.  Does it fit the release without turning that release into an
    uncontrolled rewrite?

Until then, the feature stays here.

------------------------------------------------------------------------

## 12. Current Direction Summary

``` text
V2
Cities + universal place foundation + climate + current weather +
crime where defensible + articles + unified Compare Places setup +
AI-assisted comparison

V3
Migrate/normalize existing state and metro metric systems into the
newer place-based PostgreSQL architecture

V4
Frontend/design-system refinement + light/dark mode + home-page
redesign + cross-place visual consistency

V5
Coverage expansion + selective profile enrichment
(~350 metros / ~1,000 cities as directional targets)
```

This sequence is intentionally flexible.

The important rule is simpler:

**Finish the current release before turning interesting future ideas
into current obligations.**

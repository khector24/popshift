# RegionLore Documentation

This directory contains the product, release, operational, and historical documentation for RegionLore.

## Structure

### `product/`

Living product-direction documents.

- `PRODUCT_VISION.md` — long-term RegionLore product vision and principles.
- `POST_V2_ROADMAP.md` — directional roadmap for work after V2. Version groupings remain flexible until a release scope is formally defined.

### `releases/v2/`

The completed Version 2 planning, architecture, implementation, and evaluation record.

- `V2_SCOPE.md` — shipped V2 product scope and definition of done.
- `V2_DATA_REQUIREMENTS.md` — implemented V2 data contract and source strategy.
- `V2_ARCHITECTURE.md` — implemented V2 application and data architecture.
- `V2_IMPLEMENTATION_PLAN.md` — historical implementation plan with completed phase checkpoints.
- `AI_COMPARISON_EVALUATION.md` — evaluation record behind the V2 AI comparison model and product decisions.

Future version folders should be created only when that version has an intentionally defined scope.

### `operations/`

Documentation for running the deployed application.

- `PRODUCTION_DEPLOYMENT.md` — AWS production architecture, deployment procedures, database access rules, admin bootstrap, environment configuration, and smoke testing.

### `archive/`

Historical documents that are useful for understanding the evolution of the project but should no longer guide current implementation.

- `archive/popshift/POPSHIFT_ROADMAP.md` — early roadmap from the original PopShift stage of the project.

## Documentation Principle

Keep current product direction separate from completed release records and operational procedures.

Historical documents should be preserved when they provide useful project context, but they should not remain in locations where they can be mistaken for current plans.

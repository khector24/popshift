# PopShift Roadmap

## Current Status

### Population (Completed)

- Dashboard
- Rankings
- State Detail page
- State Comparison
- Population timeline
- Population growth
- Population share
- National and regional summaries

### Economics (Completed)

- Median household income
- Median rent
- Median home value
- National context comparisons

### Migration Flows (Completed)

- Top inbound states
- Top outbound states
- Total inbound movers
- Total outbound movers
- Net migration
- Migration snapshot card
- State-to-state migration data

---

# Immediate Next Step

- Merge migration branch into main.
- Continue development from there.

---

# UI / Design Notes

- State Detail page is "good enough" for now.
- Minor CSS issues and polish can wait.
- Revisit design later during final polish.
- Keep the project moving instead of endlessly tweaking CSS.

---

# Future Features

## Metro Area Layer

### Major metros by state

Examples:

- New York → NYC metro
- Texas → Dallas, Houston, Austin

### Fastest-growing metro by state

### Metro population pages (later)

---

## Migration Expansion

### State-to-state corridors

Examples:

California → Texas

New York → Florida

Illinois → Indiana

### "X people moved since 2020"

### Richer migration explanations

### "If I move from X to Y"

Examples:

New York → North Carolina

California → Texas

Later:
Metro-to-metro comparisons.

---

## State Comparison Improvements

Continue improving compare page.

Eventually support:

- Population
- Income
- Rent
- Home value
- Migration
- Major metros

---

## Climate / Weather (Possible)

Possible addition to state pages:

- Average temperatures
- Climate summaries
- Weather notes

Not a priority.

---

## Tax Burden / Value Feature (Parking Lot)

Idea inspired by discussions about taxes and value received.

Not a priority.

---

# Final Polish Phase

Very late in development.

### Revisit:

- State Detail design
- Dashboard polish
- Branding
- Colors
- Naming
- Animations
- Home page
- Overall consistency

The goal is to focus on features first and polish later.

---

# Development Philosophy

Do not overengineer.

Do not chase perfect CSS.

Keep shipping features.

Polish comes later.

Current / near-term:

- Finish and merge migration flows.
- Keep State Detail design acceptable for now.
- CSS polish can wait.

Future PopShift ideas:

- National median context for income/rent/home value.
- Major metros.
- Fastest-growing metros by state.
- Migration layer:
  - state-to-state flows
  - top inbound/outbound
  - corridors
  - “X people moved since 2020”
- “If I move from X to Y” comparisons.
- Later metro-to-metro emphasis.
- State comparison feature stays.
- Possible weather/climate info on state detail.
- Possible tax burden/value feature later.
- Final branding/polish phase later:
  - name/brand refinement
  - visual polish
  - likely after core data features are stable

PopShift handoff:

We just finished the migration flows feature on branch feature/phase-3-migration-flows. The branch name is not important right now; the feature is migration flows.

Committed:
4bdaf84 Add migration snapshot to state detail
d9c1135 Add migration data service and API route
9b1e359 Add state migration data generation script

Immediate next step:
Test briefly, merge into main, then continue PopShift.

Broader roadmap:

- Keep improving migration flows later.
- Add major metro data later.
- Add fastest-growing metros by state.
- Add migration corridors and richer inbound/outbound explanations.
- Eventually add “If I move from X to Y” comparisons.
- Later emphasize metro-to-metro comparisons.
- Keep State Detail layout acceptable for now, but revisit design later.
- Final polish/branding phase comes much later after the core features are stable.

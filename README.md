# RegionLore

RegionLore is a full-stack U.S. regional data and comparison platform built to make public geographic data easier to explore, compare, and understand.

The application brings together population, migration, economic, housing, education, transportation, demographic, climate, weather, crime, and geographic data across U.S. states, metropolitan areas, and cities.

RegionLore combines searchable place directories, detailed profiles, structured comparisons, AI-assisted explanations, rankings, and articles in one application.

---

## Features

### City Directory and Profiles

- Searchable directory covering hundreds of U.S. cities
- Population estimates and historical trends
- Economic and housing indicators
- Demographic and education data
- Transportation and commuting measures
- NOAA climate normals
- Current weather
- FBI city crime statistics where defensible city-level data is available
- State and metro relationships

### State Directory and Profiles

- Search, sort, and filter U.S. states
- Population estimates and historical trends
- Population rankings and growth
- Interstate migration flows and migration history
- Economic and housing indicators
- Education measures
- National comparisons
- State flags and geographic context

### Metro Directory and Profiles

- Searchable U.S. metropolitan-area directory
- Population estimates and growth
- Economic and housing indicators
- Education measures
- Transportation and commuting statistics
- Current weather
- Geographic coverage and connected-state navigation
- Metro migration connections

### Compare Places

RegionLore supports structured comparisons of **two to four places of the same geographic type**:

- City vs. city
- Metro vs. metro
- State vs. state

Users can optionally provide context about why they are comparing places and which factors matter most to them.

The comparison experience combines:

- Structured RegionLore data
- Geography-specific comparison sections
- Optional personalization
- AI-generated explanations based on RegionLore comparison context
- Graceful fallback to the structured data if AI generation is unavailable

The AI layer is used to explain and synthesize RegionLore data. It is not treated as the authoritative source of the underlying geographic metrics.

### Articles & Insights

- Published articles and analysis
- Tagging and related-place connections
- Administrative publishing workflow
- Draft, published, and archived article states

### Rankings and Exploration

- Search, filtering, sorting, and pagination
- URL-preserved directory state
- Population and growth rankings
- Interactive maps and charts
- Responsive navigation and reusable UI components

---

## Current Scope

RegionLore V2 focuses on:

- The 50 U.S. states and the District of Columbia
- Major U.S. metropolitan statistical areas
- Hundreds of U.S. cities
- Population estimates through 2025
- Economic and housing measures
- Migration data
- Education measures
- Transportation and commuting data
- Demographic data
- Climate normals
- Current weather
- City crime data where supported
- Same-type structured and AI-assisted place comparisons
- Articles and analysis

Different datasets are released on different schedules, so not every measure uses the same reference year. RegionLore preserves source-year and availability information where appropriate rather than treating all data as contemporaneous.

---

## Tech Stack

### Frontend

- React
- React Router
- Vite
- Recharts
- React Icons
- React-based mapping tools
- Custom CSS

### Backend

- Node.js
- Express
- PostgreSQL

### AI Comparison Layer

- Backend-managed AI comparison service
- OpenAI `gpt-5.6-luna`
- Server-side reconstruction of authoritative RegionLore comparison context
- PostgreSQL response cache
- Versioned prompt/context and data-aware cache identity
- Structured-data fallback when AI generation fails

### Data Processing

- Custom JavaScript data pipelines
- Census and other public-source ingestion
- Geographic identity and relationship mapping
- Processed application datasets
- PostgreSQL-backed data where appropriate

---

## Data Sources

Major sources and resources include:

- U.S. Census Bureau Population Estimates Program
- American Community Survey (ACS)
- Census migration datasets
- National Assessment of Educational Progress (NAEP)
- NOAA U.S. Climate Normals
- OpenWeather
- FBI Crime Data Explorer / Crime in the United States
- U.S. Census geographic reference data
- us-atlas
- TopoJSON
- Wikimedia Commons
- Flagpedia

Source years, geographic coverage, and methodology vary by dataset.

See the application's **Data Sources** and **Methodology** pages for detailed source information, limitations, geographic definitions, and calculation notes.

---

## Project Structure

```text
client/
  src/
    assets/
    components/
    pages/
    services/
    styles/
    utils/

server/
  src/
    controllers/
    data/
    db/
    middleware/
    routes/
    scripts/
    services/
    tests/

docs/
  product/
```

The application separates frontend presentation, backend routing and controllers, domain services, data-processing pipelines, persistence, and provider-specific integrations.

---

## API

The Express backend provides APIs for:

- City directories and profiles
- Metro directories and profiles
- State directories and profiles
- Population history
- Migration data
- Search, filtering, sorting, and pagination
- Articles and related-place data
- Structured city, metro, and state comparisons
- AI-generated comparison explanations
- Current weather
- Administrative article workflows

Structured geographic data remains separate from the AI explanation layer so AI availability does not determine whether the underlying comparison data can be used.

---

## Design Goals

RegionLore is designed to:

- Make public regional data easier to understand
- Keep factual geographic data traceable to documented sources
- Make states, metros, and cities easy to explore
- Help users compare places without reducing them to a single score
- Preserve missing or unavailable data rather than inventing values
- Keep AI explanation separate from authoritative structured data
- Present complex information through a clean, approachable interface
- Document important methodology, geographic definitions, and limitations

---

## Data and AI Limitations

RegionLore combines datasets with different methodologies, release schedules, geographic definitions, and levels of uncertainty.

Survey estimates may contain sampling uncertainty. Population estimates may be revised. Metropolitan boundaries can change. Crime reporting coverage varies by jurisdiction. Climate normals describe long-term historical conditions rather than current weather.

AI-generated comparison explanations can also make interpretive or comparative mistakes. The structured RegionLore data displayed with a comparison should be treated as the factual reference.

RegionLore is an informational and exploratory project and is not an official government website or a substitute for professional financial, legal, real-estate, or relocation advice.

---

## Status

RegionLore is an actively developed portfolio project.

V2 expands the project from its original state-and-metro population focus into a broader regional research platform with city coverage, structured place comparisons, AI-assisted explanations, articles, climate and weather information, crime data, and a PostgreSQL-backed application architecture.

The repository retains the historical `popshift` name, while the application is branded as **RegionLore**.

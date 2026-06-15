# PopShift

PopShift is a full-stack population analytics dashboard built with React and Express. The project focuses on exploring U.S. state population trends through rankings, growth analysis, regional filtering, and historical Census-backed data.

## Features

- U.S. state population rankings
- Year-over-year population growth analysis
- Share of total tracked U.S. population
- Search and region filtering
- Pagination for rankings
- Individual state detail pages
- Historical state population data (2020–2023)
- Reusable UI components and tooltip system
- Responsive modern dashboard layout

## Current Scope

The current version of PopShift focuses on statewide population analytics powered by the U.S. Census API. Users can compare states by:

- Population
- Growth rate
- Population share
- Region

The application currently includes historical population tracking from 2020–2023 using Census population estimate data.

## Future Plans

Planned future improvements include:

- Expanded historical dataset coverage (targeting 2000–2025)
- Region summary and comparison views
- Interactive charts and visual analytics
- Improved mobile table experience
- Additional dashboard insights and trend analysis
- State icons and enhanced visual presentation
- More advanced filtering and comparison tools

## Tech Stack

### Frontend

- React
- React Router
- Vite
- Custom CSS

### Backend

- Node.js
- Express

### Data

- U.S. Census API

## Project Structure

```text
client/
  src/
    components/
    pages/
    services/
    styles/
    utils/

server/
  src/
    routes/
    services/
    data/
```

## API Features

The Express backend currently supports:

- State rankings
- Search filtering
- Region filtering
- Sorting
- Pagination
- Historical population lookups by state
- Census API response caching

## Development Notes

PopShift uses reusable UI components for consistency across the application, including:

- StatusMessage
- InfoTooltip
- StatCard
- DetailStatCard

The project also includes Census API caching to reduce repeated requests and improve performance during historical data lookups.

## Status

This project is actively being expanded and refined as part of an ongoing full-stack development portfolio.

## Data and Third-Party Resources

PopShift uses the U.S. Census API for state-level population estimate data.

- U.S. Census API: https://www.census.gov/data/developers/data-sets.html
- Census Population Estimates API: https://api.census.gov/data/2023/pep/charv

The population change map uses a TopoJSON geography file from the `us-atlas` package.

- us-atlas package: https://www.npmjs.com/package/us-atlas
- states-10m.json source: https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json

PopShift also uses visualization libraries for charts and maps.

- Recharts: https://recharts.org/
- react19-simple-maps: https://www.npmjs.com/package/@vnedyalk0v/react19-simple-maps
- topojson-client: https://www.npmjs.com/package/topojson-client

# PopShift

PopShift is a full-stack U.S. population and migration analytics platform built with **React**, **Node.js**, and **Express**. It helps users explore U.S. states and metropolitan areas through population trends, migration patterns, economic indicators, housing data, education metrics, transportation statistics, and interactive geographic profiles.

The goal of PopShift is to make complex public datasets easier to explore by transforming government data into fast, searchable, and visually accessible tools.

---

## Features

### State Directory
- Search, sort, and filter all U.S. states
- Population rankings
- Growth and population share
- Pagination
- State flags
- URL-preserved search and filter state

### Metro Directory
- Searchable metro directory
- Population and growth statistics
- Economic and housing indicators
- Region and state filtering
- Pagination
- URL-preserved search and filter state

### State Profiles
- Current population
- Historical population trends
- Population growth
- Interstate migration
- Economic indicators
- Housing indicators
- Education metrics
- National comparisons

### Metro Profiles
- Population overview
- Economic indicators
- Housing indicators
- Education metrics
- Transportation statistics
- Geographic coverage
- Connected state navigation

---

## Current Scope

Version 1 currently includes:

- State directory
- Metro directory
- Individual state pages
- Individual metro pages
- Historical population charts
- Migration summaries
- Economic data
- Housing data
- Education data
- Transportation data
- Search, filtering, sorting, and pagination
- Responsive navigation and reusable UI components

---

## Planned Features

- Explore Moving
- Compare States
- Compare Metros
- Articles and research library
- Expanded migration history
- Additional demographic datasets
- Climate and weather information
- Tax comparisons
- Additional quality-of-life metrics
- Mobile polish and accessibility improvements

---

## Tech Stack

### Frontend

- React
- React Router
- Vite
- Recharts
- React Icons
- Custom CSS

### Backend

- Node.js
- Express

### Data Processing

- Custom JavaScript build scripts
- Preprocessed datasets served by Express

### Data Sources

- U.S. Census Bureau Population Estimates Program
- American Community Survey (ACS)
- National Assessment of Educational Progress (NAEP)
- Census State-to-State Migration Flows
- us-atlas
- TopoJSON
- Wikimedia Commons
- Flagpedia

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
    data/
    routes/
    services/
```

---

## API Features

The Express backend currently provides:

- State directory endpoints
- Metro directory endpoints
- State detail endpoints
- Metro detail endpoints
- Historical population data
- Migration summaries
- Search
- Filtering
- Sorting
- Pagination
- Processed datasets optimized for frontend use

---

## Design Goals

PopShift is designed to:

- Make public demographic data easier to understand
- Present information through clean, modern interfaces
- Preserve search and filter state during navigation
- Keep profile pages fast through preprocessed datasets
- Provide transparent methodology and source documentation

---

## Data Attribution

PopShift uses publicly available datasets and resources including:

- U.S. Census Bureau
- American Community Survey (ACS)
- National Assessment of Educational Progress (NAEP)
- Census State-to-State Migration Flows
- us-atlas
- TopoJSON
- Wikimedia Commons
- Flagpedia

Additional details and source links are available in the application's **Data Sources** page.

---

## Status

PopShift is an actively developed portfolio project. Version 1 focuses on providing a fast, searchable platform for exploring population and migration data across U.S. states and metropolitan areas, with additional analytical tools planned for future releases.

import "../styles/pages/Methodology.css";

function Methodology() {
  return (
    <div className="methodology">
      <div className="methodology__header">
        <h1>Methodology</h1>

        <p>
          PopShift uses Census-backed population data to compare state
          population totals, growth, and population share. This page explains
          where the data comes from, how key values are calculated, and what
          limitations currently exist.
        </p>
      </div>

      <section className="methodology__section">
        <h2>Data Source</h2>

        <p>
          PopShift uses annual population estimates published by the U.S. Census
          Bureau. Earlier versions of PopShift retrieved population data
          directly from the Census Population Estimates API. As the project
          grew, the backend was migrated to use locally processed Census Vintage
          2025 data files.
        </p>

        <p>
          The raw Census data is downloaded from the U.S. Census Bureau and
          converted into a JavaScript data file during development. This removes
          API limitations, improves performance, and allows PopShift to support
          annual state population estimates from 2020 through 2025.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Growth Calculation</h2>

        <p>
          Population growth compares the ending population against the starting
          population for the selected years.
        </p>

        <div className="methodology__formula">
          growth = ((ending population - starting population) / starting
          population) × 100
        </div>

        <p>
          In the Rankings page, year-over-year growth compares the latest
          available estimate, 2025, against the previous estimate, 2024. On the
          Dashboard, users can compare any available years from 2020 through
          2025.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Population Share</h2>

        <p>
          Population share shows how much of the tracked U.S. population belongs
          to each state.
        </p>

        <div className="methodology__formula">
          share = (state population / total U.S. population) × 100
        </div>

        <p>
          Values are rounded for display so the interface stays readable and
          easy to compare.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Data and Visualization Resources</h2>

        <p>
          PopShift uses a few different resources to collect, process, and
          visualize the population data shown throughout the app.
        </p>

        <h3>Census population data</h3>
        <p>
          The population data displayed throughout PopShift originates from the
          U.S. Census Bureau&apos;s Population Estimates Program. PopShift uses
          a local copy of the Census Vintage 2025 state population dataset,
          which is processed by the backend and used to power the dashboard,
          rankings, comparison tools, and state detail pages.
        </p>

        <ul>
          <li>
            U.S. Census Population Estimates Program:
            https://www.census.gov/programs-surveys/popest.html
          </li>
          <li>
            Vintage 2025 State Population Tables:
            https://www.census.gov/data/tables/time-series/demo/popest/2020s-state-total.html
          </li>
        </ul>

        <h3>Map geography data</h3>
        <p>
          The population change map uses a TopoJSON map file from the us-atlas
          package. This file provides the state shapes that PopShift colors
          based on each state&apos;s percentage population change.
        </p>

        <ul>
          <li>us-atlas: https://www.npmjs.com/package/us-atlas</li>
          <li>
            states-10m.json:
            https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json
          </li>
        </ul>

        <h3>Map rendering</h3>
        <p>
          PopShift uses react19-simple-maps to render the interactive U.S. map
          inside React. The topojson-client package converts the downloaded
          TopoJSON map data into GeoJSON features that the map component can
          render.
        </p>

        <ul>
          <li>
            react19-simple-maps:
            https://www.npmjs.com/package/@vnedyalk0v/react19-simple-maps
          </li>
          <li>
            topojson-client: https://www.npmjs.com/package/topojson-client
          </li>
        </ul>

        <h3>Charts</h3>
        <p>
          The population timeline chart is built with Recharts. Recharts handles
          the responsive chart layout, axes, area chart, gradient fill, and line
          rendering used in the dashboard.
        </p>

        <ul>
          <li>Recharts: https://recharts.org/</li>
        </ul>
      </section>

      <section className="methodology__section">
        <h2>Current Limitations</h2>

        <ul>
          <li>
            The app currently focuses on state-level population estimates.
          </li>
          <li>County, city, and metro-level data are not included yet.</li>
          <li>The current historical range covers 2020 through 2025.</li>
          <li>Longer historical coverage may be added in a future version.</li>
          <li>
            Growth and share values are rounded, so displayed percentages may
            not show every decimal place.
          </li>
        </ul>
      </section>

      <section className="methodology__section">
        <h2>Future Improvements</h2>

        <p>
          Future versions of PopShift may include expanded historical data,
          regional summaries, charts, mobile-friendly ranking layouts, and
          stronger visual tools for comparing population changes over time.
        </p>

        <p>
          Future versions of PopShift may also include additional demographic
          and quality-of-life datasets such as median income, wage trends,
          climate data, housing trends, migration patterns, and other
          state-level analytics.
        </p>
      </section>
    </div>
  );
}

export default Methodology;

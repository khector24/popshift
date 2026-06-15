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
          PopShift uses population estimate data from the U.S. Census API. The
          backend requests state-level population data, processes the results,
          and sends the formatted data to the React frontend.
        </p>

        <p>
          The current historical detail view uses available Census population
          estimate data for 2020 through 2023. A future goal is to expand the
          historical range toward a broader 2000–2025 timeline.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Growth Calculation</h2>

        <p>
          Year-over-year growth compares a state's current population estimate
          against its previous year population estimate.
        </p>

        <div className="methodology__formula">
          growth = ((current population - previous population) / previous
          population) × 100
        </div>

        <p>
          In the current rankings view, growth compares the 2023 population
          estimate against the 2022 population estimate.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Population Share</h2>

        <p>
          Population share shows how much of the tracked U.S. population belongs
          to each state.
        </p>

        <div className="methodology__formula">
          share = (state population / total tracked population) × 100
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
          The main population data comes from the U.S. Census API. PopShift
          requests state-level population estimates from the Census Population
          Estimates endpoint, then the Express backend formats that data for the
          dashboard, rankings page, and state detail pages.
        </p>

        <ul>
          <li>
            U.S. Census API:
            https://www.census.gov/data/developers/data-sets.html
          </li>
          <li>
            Census Population Estimates API:
            https://api.census.gov/data/2023/pep/charv
          </li>
        </ul>

        <h3>Map geography data</h3>
        <p>
          The population change map uses a TopoJSON map file from the us-atlas
          package. This file provides the state shapes that PopShift colors
          based on each state's percentage population change.
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
          <li>The app currently focuses on state-level population totals.</li>

          <li>County, city, and metro-level data are not included yet.</li>

          <li>The current historical detail range is 2020 through 2023.</li>

          <li>
            Longer historical coverage, including a possible 2000–2025 range, is
            planned for a future version.
          </li>

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

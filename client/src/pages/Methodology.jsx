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
      </section>
    </div>
  );
}

export default Methodology;

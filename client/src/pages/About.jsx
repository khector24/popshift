import "../styles/pages/About.css";

function About() {
  return (
    <div className="about">
      <h1>About PopShift</h1>

      <section>
        <h2>What is PopShift?</h2>
        <p>
          PopShift is a population analytics app designed to make U.S. state
          population trends easier to explore. The app lets users compare states
          by population, year-over-year growth, share of the tracked U.S.
          population, and region.
        </p>

        <p>
          The goal is to turn Census population data into a cleaner, more
          interactive experience for exploring how states are growing,
          shrinking, and shifting over time.
        </p>
      </section>

      <section>
        <h2>Why It Matters</h2>
        <p>
          Population shifts can reflect larger changes in the country, including
          migration patterns, housing demand, economic opportunity, cost of
          living, and regional development. When a state gains or loses
          population, that change can influence public planning, business
          investment, political representation, and long-term growth.
        </p>

        <p>
          PopShift was built to make those changes easier to compare at a glance
          while still giving users the ability to dig into individual state
          details.
        </p>
      </section>

      <section>
        <h2>Current Scope</h2>
        <p>
          The current version of PopShift focuses on state-level population
          rankings and state detail pages. It includes Census-backed population
          rankings, search, sorting, region filtering, pagination, and
          historical population detail data for 2020 through 2023.
        </p>

        <p>
          On each state detail page, users can view recent population history
          and growth since the baseline year currently available in the app.
        </p>
      </section>

      <section>
        <h2>Future Direction</h2>
        <p>
          A major goal for PopShift is to expand the historical dataset toward a
          broader 2000–2025 timeline. This would allow the app to show longer
          population trends, deeper comparisons, and more meaningful regional
          changes over time.
        </p>

        <p>
          Planned future improvements also include region summaries, dashboard
          analytics, charts, mobile-friendly ranking views, and stronger visual
          storytelling around state population changes.
        </p>
      </section>

      <section>
        <h2>Data Source</h2>
        <p>
          PopShift uses U.S. Census population data and processes it through an
          Express backend before displaying it in the React frontend. The app
          currently focuses on state-level population totals, yearly growth,
          regional comparisons, and each state's share of the tracked U.S.
          population.
        </p>
      </section>

      <section>
        <h2>Tech Stack</h2>
        <p>
          PopShift is built with React, React Router, Node.js, Express, the U.S.
          Census API, and custom CSS organized by page and reusable component.
        </p>
      </section>
    </div>
  );
}

export default About;

import "../styles/pages/About.css";

function About() {
  return (
    <div className="about">
      <h1>About PopShift</h1>

      <section>
        <h2>What is PopShift?</h2>
        <p>
          PopShift is a state analytics app designed to make U.S. population and
          economic trends easier to explore. It turns Census-backed population
          and housing data into rankings, charts, maps, regional summaries,
          comparison tools, and state detail pages.
        </p>

        <p>
          The goal is to help users quickly understand which states are growing,
          shrinking, gaining population, or changing compared with other parts
          of the country.
        </p>
      </section>

      <section>
        <h2>What You Can Explore</h2>
        <p>
          The current version includes an interactive dashboard with summary
          stat cards, top population movers, a population change map, a U.S.
          population timeline, and a regional population breakdown.
        </p>

        <p>
          Users can also browse sortable state rankings, compare up to four
          states, filter by region, search for specific states, and open
          individual state detail pages with population history and economic
          snapshots.
        </p>
      </section>

      <section>
        <h2>Why It Matters</h2>
        <p>
          Population shifts can reflect larger changes in the country, including
          migration patterns, housing demand, economic opportunity, cost of
          living, and regional development.
        </p>

        <p>
          When a state gains or loses population, that change can influence
          public planning, business investment, political representation, and
          long-term growth.
        </p>
      </section>

      <section>
        <h2>Current Scope</h2>
        <p>
          PopShift currently focuses on state-level analytics using Census
          population estimates from 2020 through 2025 and selected 2024 American
          Community Survey economic metrics.
        </p>

        <p>
          The app compares population totals, growth rates, population share,
          median household income, median gross rent, median home value, and
          regional population distribution.
        </p>
      </section>

      <section>
        <h2>Data Source</h2>
        <p>
          PopShift uses locally processed Census Vintage 2025 population data
          and 2024 American Community Survey data. The Express backend serves
          the processed datasets to the React frontend.
        </p>

        <p>
          For more details about the data source, formulas, map resources, chart
          libraries, and current limitations, visit the Methodology page.
        </p>
      </section>

      <section>
        <h2>Future Direction</h2>
        <p>
          Future versions may expand the historical range toward a broader
          2000–2025 timeline and add county, city, or metro-level population
          views.
        </p>

        <p>
          Additional improvements may include more demographic datasets,
          stronger comparison tools, enhanced state detail pages, and more ways
          to visualize long-term population change.
        </p>
      </section>

      <section>
        <h2>Tech Stack</h2>
        <p>
          PopShift is built with React, React Router, Node.js, Express, locally
          processed Census datasets, Recharts, React-based map rendering tools,
          and custom CSS organized by page and reusable component.
        </p>
      </section>
    </div>
  );
}

export default About;

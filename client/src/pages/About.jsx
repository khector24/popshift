import "../styles/pages/About.css";

function About() {
  return (
    <div className="about">
      <h1>About PopShift</h1>

      <section>
        <h2>What is PopShift?</h2>
        <p>
          PopShift is a population analytics app designed to make U.S. state
          population trends easier to explore. It turns Census-backed population
          data into rankings, charts, maps, regional summaries, and state detail
          pages.
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
          Users can also browse sortable state rankings, filter by region,
          search for specific states, and open individual state detail pages for
          more focused population history.
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
          PopShift currently focuses on state-level population analytics using
          available Census population estimate data from 2020 through 2023.
        </p>

        <p>
          The app compares population totals, percentage growth, raw population
          change, regional population distribution, and each state&apos;s share
          of the tracked U.S. population.
        </p>
      </section>

      <section>
        <h2>Data Source</h2>
        <p>
          PopShift uses U.S. Census population estimate data. The Express
          backend requests and processes the Census data before sending
          formatted results to the React frontend.
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
          PopShift is built with React, React Router, Node.js, Express, the U.S.
          Census API, Recharts, React-based map rendering tools, and custom CSS
          organized by page and reusable component.
        </p>
      </section>
    </div>
  );
}

export default About;

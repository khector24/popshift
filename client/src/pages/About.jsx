import { Link } from "react-router-dom";

import "../styles/pages/About.css";

export default function About() {
  return (
    <main className="about">
      <header>
        <h1>About PopShift</h1>

        <p>
          PopShift is a U.S. population and migration analytics platform
          designed to make public data easier to explore, compare, and
          understand.
        </p>
      </header>

      <section>
        <h2>What Is PopShift?</h2>

        <p>
          PopShift brings together population, migration, economic, housing,
          education, transportation, and geographic data for U.S. states and
          metropolitan areas.
        </p>

        <p>
          Instead of requiring users to search through large government tables
          and disconnected datasets, PopShift organizes important information
          into searchable directories, interactive profiles, charts, tables,
          rankings, and migration summaries.
        </p>
      </section>

      <section>
        <h2>What You Can Explore</h2>

        <p>
          State profiles provide population estimates, annual growth, historical
          population trends, economic and housing indicators, education data,
          interstate migration flows, and migration history.
        </p>

        <p>
          Metro profiles include population trends, economic and housing
          measures, transportation information, education indicators, geographic
          coverage, and migration connections between metropolitan areas.
        </p>

        <p>
          The state and metro directories also allow users to search, filter,
          sort, and navigate between places while preserving their selected
          directory options in the URL.
        </p>
      </section>

      <section>
        <h2>Why Population Change Matters</h2>

        <p>
          Population change can reveal where people and economic activity are
          concentrating, which communities are expanding, and which places may
          be experiencing slower growth or population decline.
        </p>

        <p>
          These shifts can influence housing demand, infrastructure needs,
          business investment, labor markets, public services, transportation,
          political representation, and long-term regional development.
        </p>

        <p>
          Population numbers alone do not explain why a place is changing, but
          combining them with migration, housing, income, education, and
          transportation data provides a more useful picture.
        </p>
      </section>

      <section>
        <h2>Current Scope</h2>

        <p>
          PopShift currently focuses on the 50 U.S. states, the District of
          Columbia, and a directory of major U.S. metropolitan statistical
          areas.
        </p>

        <p>
          The current population timeline covers 2020 through 2025. Many of the
          supporting economic, housing, transportation, and education measures
          use 2024 data, while migration datasets may use earlier years based on
          the latest compatible source available for that feature.
        </p>

        <p>
          Because the source years can differ, each profile identifies the year
          associated with the data being displayed whenever possible.
        </p>
      </section>

      <section>
        <h2>How the Data Is Used</h2>

        <p>
          PopShift uses publicly available datasets from organizations such as
          the U.S. Census Bureau. Source files are downloaded and processed into
          application-ready datasets before being served by the PopShift
          backend.
        </p>

        <p>
          This approach makes the application faster, reduces dependence on live
          third-party API requests, and allows the frontend to use consistent
          data structures across state and metro pages.
        </p>

        <p>
          Visit the <Link to="/methodology">Methodology</Link> page to learn how
          major calculations and geographic comparisons work. Visit the{" "}
          <Link to="/data-sources">Data Sources</Link> page for source links and
          acknowledgments.
        </p>
      </section>

      <section>
        <h2>What PopShift Is Not</h2>

        <p>
          PopShift is an informational and exploratory project. It is not an
          official government website, and it does not provide financial, legal,
          real-estate, or relocation advice.
        </p>

        <p>
          Users making important decisions should review the original source
          documentation and consider additional local information that may not
          be represented in a national dataset.
        </p>
      </section>

      <section>
        <h2>Future Direction</h2>

        <p>
          Planned additions include an Explore Moving experience that compares
          two places, articles explaining important population and migration
          trends, expanded comparison tools for states and metros, and
          additional historical and quality-of-life data.
        </p>

        <p>
          PopShift may also expand its coverage of housing, education, taxes,
          climate, transportation, demographics, and the reasons people choose
          to move.
        </p>
      </section>

      <section>
        <h2>Technology</h2>

        <p>
          PopShift is built with React, React Router, Node.js, Express, custom
          data-processing scripts, locally generated JavaScript datasets,
          Recharts, React-based mapping tools, and custom CSS.
        </p>
      </section>
    </main>
  );
}

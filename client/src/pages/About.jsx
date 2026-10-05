import { Link } from "react-router-dom";

import "../styles/pages/About.css";

export default function About() {
  return (
    <main className="about">
      <header>
        <h1>About RegionLore</h1>

        <p>
          RegionLore is a U.S. regional data platform designed to make public
          data easier to explore, compare, and understand.
        </p>
      </header>

      <section>
        <h2>What Is RegionLore?</h2>

        <p>
          RegionLore brings together population, migration, economic, housing,
          education, transportation, demographic, climate, crime, and geographic
          data for U.S. states, metropolitan areas, and cities.
        </p>

        <p>
          Instead of requiring users to search through large government tables
          and disconnected datasets, RegionLore organizes useful information
          into searchable directories, place profiles, charts, tables,
          comparisons, rankings, and articles.
        </p>

        <p>
          The goal is not to reduce a place to a single score. RegionLore is
          designed to make it easier to examine the tradeoffs, differences, and
          trends that matter when learning about a place or comparing it with
          somewhere else.
        </p>
      </section>

      <section>
        <h2>What You Can Explore</h2>

        <p>
          State profiles include population estimates and trends, migration,
          economic and housing indicators, education data, and other measures
          that help show how states are changing.
        </p>

        <p>
          Metro profiles provide regional population, economic, housing,
          transportation, education, weather, and other information for major
          metropolitan areas.
        </p>

        <p>
          City profiles bring the analysis to the local level with population,
          housing, economic, demographic, transportation, education, climate,
          crime, and other available city data.
        </p>

        <p>
          Compare Places lets users compare two to four cities, metropolitan
          areas, or states. Users can optionally tell RegionLore why they are
          comparing places and what matters most to them. RegionLore presents
          the underlying structured data alongside an AI-generated explanation
          of the comparison.
        </p>

        <p>
          Articles &amp; Insights provide another way to explore the data through
          stories and analysis about the trends shaping where Americans live
          and move.
        </p>
      </section>

      <section>
        <h2>Why Place Data Matters</h2>

        <p>
          Population change can reveal where people and economic activity are
          concentrating, which communities are expanding, and which places may
          be experiencing slower growth or population decline.
        </p>

        <p>
          But population is only part of the picture. Housing costs, income,
          migration, transportation, education, climate, demographics, and other
          local conditions can change what growth or decline means for the people
          who live there.
        </p>

        <p>
          Looking at several measures together provides more context than any
          single ranking or statistic can provide.
        </p>
      </section>

      <section>
        <h2>Current Scope</h2>

        <p>
          RegionLore currently covers the 50 U.S. states, the District of
          Columbia, major U.S. metropolitan statistical areas, and hundreds of
          U.S. cities.
        </p>

        <p>
          Population estimates currently extend through 2025. Other datasets use
          the most appropriate available source years for their subject, so
          economic, housing, migration, education, climate, crime, and other
          measures do not necessarily share the same reference year.
        </p>

        <p>
          RegionLore identifies source years and availability where appropriate
          rather than treating data from different programs and time periods as
          though they were collected at the same time.
        </p>
      </section>

      <section>
        <h2>How the Data Is Used</h2>

        <p>
          RegionLore uses public datasets from sources including the U.S. Census
          Bureau, the FBI, and NOAA, along with other documented sources used for
          specific features.
        </p>

        <p>
          Source data is processed into consistent application-ready structures
          and stored or served through the RegionLore data and backend layers.
          Some features also use external services when live or frequently
          changing information is appropriate.
        </p>

        <p>
          RegionLore treats its structured geographic data as the factual basis
          for comparisons. AI may help explain and synthesize that information,
          but it is not the authoritative source of the underlying geographic
          metrics.
        </p>

        <p>
          Visit the <Link to="/methodology">Methodology</Link> page to learn how
          major calculations, geographic definitions, and comparisons work.
          Visit the <Link to="/data-sources">Data Sources</Link> page for source
          links, data notes, and acknowledgments.
        </p>
      </section>

      <section>
        <h2>What RegionLore Is Not</h2>

        <p>
          RegionLore is an informational and exploratory project. It is not an
          official government website, and it does not provide financial, legal,
          real-estate, or relocation advice.
        </p>

        <p>
          Data can contain limitations, revisions, missing values, and differences
          in methodology or reference year. AI-generated explanations can also
          make mistakes. Users making important decisions should review the
          underlying RegionLore data, original source documentation, and
          additional local information when appropriate.
        </p>
      </section>

      <section>
        <h2>Future Direction</h2>

        <p>
          RegionLore will continue to expand the depth and consistency of its
          state, metro, and city data while improving how users explore and
          compare places.
        </p>

        <p>
          Future versions may add new datasets, longer historical coverage,
          additional comparison capabilities, and improvements to the site's
          design and presentation as the platform develops.
        </p>
      </section>

      <section>
        <h2>Technology</h2>

        <p>
          RegionLore is built with React, React Router, Node.js, Express,
          PostgreSQL, custom data-processing pipelines, Recharts, React-based
          mapping tools, and custom CSS. Its comparison experience also uses an
          AI service layer to generate explanations from structured RegionLore
          data.
        </p>
      </section>
    </main>
  );
}

import { Link } from "react-router-dom";

import "../styles/pages/Methodology.css";

export default function Methodology() {
  return (
    <main className="methodology">
      <header className="methodology__header">
        <h1>Methodology</h1>

        <p>
          RegionLore combines multiple public datasets to describe population,
          migration, economics, housing, education, transportation, and
          geographic relationships across U.S. states and metropolitan areas.
          This page explains how the application processes and presents that
          information.
        </p>
      </header>

      <section className="methodology__section">
        <h2>Data Processing</h2>

        <p>
          Most RegionLore datasets are downloaded from their original source and
          processed locally during development. Build scripts clean the source
          files, match geographic identifiers, calculate derived values, and
          generate JavaScript data files used by the Express backend.
        </p>

        <p>
          The React frontend requests these processed datasets from RegionLore’s
          own API rather than repeatedly requesting the original source on every
          page visit.
        </p>

        <p>
          This improves application performance and makes the data structures
          used throughout the state and metro pages more consistent.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Population Estimates</h2>

        <p>
          State and metro population figures represent annual population
          estimates rather than complete counts from the decennial census.
        </p>

        <p>
          The current population history covers 2020 through 2025. The latest
          population displayed on a profile is the ending value in that
          timeline.
        </p>

        <p>
          Estimates can be revised when the Census Bureau publishes a newer
          vintage. As a result, a historical estimate shown in a newer dataset
          may differ slightly from an estimate released in an earlier year.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Annual Population Growth</h2>

        <p>
          Annual population growth compares the latest population estimate with
          the immediately preceding year.
        </p>

        <div className="methodology__formula">
          annual growth = ((current population - previous population) / previous
          population) × 100
        </div>

        <p>
          A positive value indicates estimated population growth. A negative
          value indicates estimated population decline. A value of zero
          indicates no change after rounding.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Growth Since 2020</h2>

        <p>
          Metro directory cards and other long-range comparisons may show
          population growth from the 2020 baseline through the latest available
          estimate.
        </p>

        <div className="methodology__formula">
          growth since 2020 = ((latest population - 2020 population) / 2020
          population) × 100
        </div>

        <p>
          The displayed amount represents the numeric population difference,
          while the percentage represents the size of that change relative to
          the starting population.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Population Share</h2>

        <p>
          Population share shows the percentage of the tracked national
          population represented by a state.
        </p>

        <div className="methodology__formula">
          population share = (state population / tracked U.S. population) × 100
        </div>

        <p>
          Percentages are rounded for display. Because of rounding, displayed
          state shares may not add to exactly 100%.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Economic and Housing Measures</h2>

        <p>
          State and metro profiles include selected American Community Survey
          measures such as:
        </p>

        <ul>
          <li>Median household income</li>
          <li>Poverty rate</li>
          <li>Median gross rent</li>
          <li>Median owner-occupied home value</li>
        </ul>

        <p>
          Median values describe the midpoint of the reported distribution, not
          an average. Half of the measured households or housing units fall
          above the median and half fall below it.
        </p>

        <p>
          ACS estimates are survey-based and contain sampling uncertainty. Small
          differences between two places should not automatically be treated as
          statistically meaningful.
        </p>
      </section>

      <section className="methodology__section">
        <h2>National Comparisons</h2>

        <p>
          Some state profile cards compare a state value with the corresponding
          national value.
        </p>

        <div className="methodology__formula">
          difference from national value = state value - national value
        </div>

        <p>
          The wording used to describe that difference depends on the measure.
          For income, a higher value is described as above the national figure.
          For rent or home value, the comparison describes whether the measured
          cost is higher or lower.
        </p>

        <p>
          These labels provide context but do not by themselves determine
          affordability or quality of life.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Migration Data</h2>

        <p>
          State migration sections summarize estimated moves between U.S.
          states. Inbound flows describe where current residents moved from,
          while outbound flows describe where former residents moved to.
        </p>

        <div className="methodology__formula">
          net migration = total inbound movers - total outbound movers
        </div>

        <p>
          A positive result means estimated inbound migration exceeded outbound
          migration. A negative result means estimated outbound migration
          exceeded inbound migration.
        </p>

        <p>
          Metro migration sections use processed geographic flow data to
          summarize movement between metropolitan areas. Metro boundaries can
          cross state lines, and flows are grouped according to the geographic
          definitions used during processing.
        </p>

        <p>
          Migration estimates describe movement during a specified period. They
          should not be interpreted as a live count of every person currently
          entering or leaving a place.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Education Measures</h2>

        <p>
          RegionLore combines two different types of education data for state
          profiles: adult educational attainment from the American Community
          Survey and student assessment results from the National Assessment of
          Educational Progress.
        </p>

        <p>
          Educational-attainment measures come from the American Community
          Survey 5-Year Estimates. These measures describe the civilian
          population age 25 and older and include:
        </p>

        <ul>
          <li>Less than a high school diploma</li>
          <li>High school graduate or GED</li>
          <li>Some college or an associate degree</li>
          <li>Bachelor&apos;s degree or higher</li>
          <li>High school graduate or higher</li>
        </ul>

        <p>
          Reading and mathematics scores come from the National Assessment of
          Educational Progress, commonly known as NAEP or The Nation&apos;s
          Report Card. RegionLore currently displays average Grade 8 reading and
          mathematics scores on a 0–500 scale.
        </p>

        <p>
          State education cards may also show a state&apos;s national rank and
          its difference from the corresponding U.S. average.
        </p>

        <div className="methodology__formula">
          difference from U.S. average = state value - U.S. average
        </div>

        <p>
          ACS attainment percentages and NAEP assessment scores measure
          different populations and should not be interpreted as interchangeable
          measures. Educational attainment describes credentials held by adults,
          while NAEP measures student performance on standardized assessments.
        </p>

        <p>
          NAEP scores are estimates based on samples of students rather than
          test results for every student in a state. Rankings should therefore
          be interpreted alongside the underlying scores, assessment year, and
          NAEP documentation.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Transportation Measures</h2>

        <p>
          Metro profiles include selected commuting measures such as driving
          alone, public-transit use, working from home, and average commute
          time.
        </p>

        <p>
          Transportation percentages describe the measured worker population in
          the underlying survey. They do not describe every trip taken within a
          metro area or the full quality of its transportation network.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Metro and State Geography</h2>

        <p>
          States use Census geographic codes. Metropolitan areas use Core Based
          Statistical Area identifiers and may contain counties from more than
          one state.
        </p>

        <p>
          A metro appearing under multiple states is counted once in the metro
          directory but can match each state or region represented in its
          geographic coverage.
        </p>

        <p>
          Metro boundaries are statistical definitions and are not necessarily
          the same as city limits, local cultural definitions, or media-market
          boundaries.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Rankings, Filtering, and Sorting</h2>

        <p>
          State ranks are calculated from the currently requested sort order.
          Directory filters narrow the available records before pagination is
          applied.
        </p>

        <p>
          Metro results are filtered first, sorted second, and divided into
          pages last. When a filter or sorting option changes, the directory
          returns to the first page so that the current page remains valid.
        </p>

        <p>
          Search, filter, sort, and page selections may be stored in URL query
          parameters so users can return to the same directory view.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Rounding and Display Formatting</h2>

        <p>
          RegionLore rounds many percentages to one decimal place and adds
          thousands separators to large values. Some headline numbers may be
          abbreviated using thousands or millions.
        </p>

        <p>
          Formatting affects how a value is displayed but does not change the
          underlying stored number used for sorting or calculations.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Current Limitations</h2>

        <ul>
          <li>
            Different features may use different source years because datasets
            are not all released on the same schedule.
          </li>

          <li>
            Survey estimates contain uncertainty and may later be revised.
          </li>

          <li>
            National and state-level figures may hide important local
            differences within a geography.
          </li>

          <li>
            Metro definitions can change when official geographic definitions
            are updated.
          </li>

          <li>Migration flows do not explain every reason a person moved.</li>

          <li>
            RegionLore does not yet provide a complete measure of affordability,
            opportunity, transportation quality, school quality, or overall
            quality of life.
          </li>
        </ul>
      </section>

      <section className="methodology__section">
        <h2>Sources and Documentation</h2>

        <p>
          A complete list of the major government datasets, geographic
          resources, visualization libraries, and image sources used by
          RegionLore is available on the{" "}
          <Link to="/data-sources">Data Sources</Link> page.
        </p>
      </section>
    </main>
  );
}

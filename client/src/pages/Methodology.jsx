import { Link } from "react-router-dom";

import "../styles/pages/Methodology.css";

export default function Methodology() {
  return (
    <main className="methodology">
      <header className="methodology__header">
        <h1>Methodology</h1>

        <p>
          RegionLore combines multiple public datasets to describe population,
          migration, economics, housing, education, transportation, climate,
          weather, crime, and geographic relationships across U.S. states,
          metropolitan areas, and cities. This page explains how the application
          processes and presents that information.
        </p>
      </header>

      <section className="methodology__section">
        <h2>Data Processing</h2>

        <p>
          Most RegionLore datasets are downloaded from their original source and
          processed locally during development. Build scripts clean source
          files, match geographic identifiers, calculate derived values, and
          prepare data that is stored in RegionLore’s backend data layer,
          including PostgreSQL tables and generated data files where
          appropriate.
        </p>

        <p>
          The React frontend requests processed RegionLore datasets from
          RegionLore’s own API. Current weather is handled separately: the
          backend requests live conditions from OpenWeather and caches recent
          responses before returning them to the frontend.
        </p>

        <p>
          This improves application performance, keeps source-specific
          processing in the backend, and makes the data structures used
          throughout state, metro, and city pages more consistent.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Population Estimates</h2>

        <p>
          State, metro, and city population figures represent annual population
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
          State, metro, and city profiles include selected American Community
          Survey measures such as:
        </p>

        <ul>
          <li>Median household income</li>
          <li>Poverty rate</li>
          <li>Median gross rent</li>
          <li>Median owner-occupied home value</li>
        </ul>

        <p>
          RegionLore may use different ACS products for different geographic
          levels. City profiles use 5-Year Estimates, which provide broader
          geographic coverage than the 1-Year product.
        </p>

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
          Metro and city profiles include selected commuting measures such as
          driving alone, public-transit use, working from home, and average
          commute time.
        </p>

        <p>
          Transportation percentages describe the measured worker population in
          the underlying survey. They do not describe every trip taken within a
          city or metro area or the full quality of its transportation network.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Climate Normals</h2>

        <p>
          City climate sections use NOAA 1991–2020 U.S. Climate Normals. These
          values describe long-term typical monthly conditions rather than
          current weather.
        </p>

        <p>
          RegionLore matches supported cities to reviewed NOAA weather stations
          and stores monthly temperature and precipitation normals for the
          selected station. Station selection is reviewed when a simple
          nearest-station match would not reasonably represent the city.
        </p>

        <p>
          Climate normals should be interpreted as historical baseline
          conditions, not a forecast and not a measurement of conditions
          occurring today.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Current Weather</h2>

        <p>
          Current city weather is retrieved from the OpenWeather Current Weather
          API using the city’s location.
        </p>

        <p>
          RegionLore requests current conditions through its backend rather than
          exposing the external weather service directly to the browser. Recent
          responses are cached for a limited period to reduce repeated external
          API requests.
        </p>

        <p>
          Current weather can change quickly and may differ from nearby
          observing stations or other weather providers. It should not be
          interpreted as the city’s long-term climate.
        </p>
      </section>

      <section className="methodology__section">
        <h2>Crime Statistics</h2>

        <p>
          City crime sections use 2024 FBI Crime Data Explorer / Crime in the
          United States data from Offenses Known to Law Enforcement by State by
          City.
        </p>

        <p>
          RegionLore stores reported offense counts and calculates rates per
          100,000 residents using the FBI reporting population associated with
          the source jurisdiction.
        </p>

        <p>
          A law-enforcement reporting jurisdiction is not automatically
          equivalent to a Census place. RegionLore uses exact matches or
          explicitly reviewed equivalent city mappings and does not use fuzzy
          matching to select production crime data.
        </p>

        <p>
          When the available FBI reporting geography is broader than the
          RegionLore city, or when no defensible city-level match is available,
          crime data is shown as unavailable rather than substituted from
          another geography.
        </p>
      </section>

      <section className="methodology__section">
        <h2>City, Metro, and State Geography</h2>

        <p>
          States, cities, and metropolitan areas represent different geographic
          concepts and should not be treated as interchangeable.
        </p>

        <p>
          States use Census geographic codes. RegionLore cities are represented
          as Census places and are linked to their state and, when applicable, a
          metropolitan area. Metropolitan areas use Core Based Statistical Area
          identifiers and may contain counties from more than one state.
        </p>

        <p>
          A city is not the same geography as its surrounding metro area. Metro
          areas commonly include the principal city plus additional cities,
          suburbs, and counties.
        </p>

        <p>
          A metro appearing under multiple states is counted once in the metro
          directory but can match each state or region represented in its
          geographic coverage.
        </p>

        <p>
          Official Census-place and metro boundaries may differ from local
          cultural definitions, postal addresses, media markets, or other
          commonly understood ideas of a city or region.
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
            Climate normals describe long-term historical conditions and should
            not be interpreted as current weather or a forecast.
          </li>

          <li>
            Current weather is time-sensitive and may change shortly after the
            page is loaded.
          </li>

          <li>
            FBI crime coverage and reporting geography vary by city, so some
            supported cities intentionally display crime data as unavailable.
          </li>

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
          A complete list of the major datasets, external services, geographic
          resources, visualization libraries, and image sources used by
          RegionLore is available on the{" "}
          <Link to="/data-sources">Data Sources</Link> page.
        </p>
      </section>
    </main>
  );
}

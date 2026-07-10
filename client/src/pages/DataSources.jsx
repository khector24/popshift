import "../styles/pages/DataSources.css";

const sourceGroups = [
  {
    title: "Population",
    description:
      "Population estimates power the state and metro population totals, annual histories, growth calculations, national summaries, and rankings.",
    sources: [
      {
        name: "U.S. Census Bureau Population Estimates Program",
        organization: "U.S. Census Bureau",
        description:
          "Official annual population estimates for the United States, states, counties, cities, towns, and metropolitan areas.",
        url: "https://www.census.gov/programs-surveys/popest.html",
      },
      {
        name: "Vintage 2025 State Population Estimates",
        organization: "U.S. Census Bureau",
        description:
          "State population totals and components of change covering the 2020–2025 period.",
        url: "https://www.census.gov/data/tables/time-series/demo/popest/2020s-state-total.html",
      },
    ],
  },
  {
    title: "Economics, Housing, and Transportation",
    description:
      "American Community Survey data supports many of the economic, housing, and commuting measures displayed in state and metro profiles.",
    sources: [
      {
        name: "2024 American Community Survey 1-Year Data",
        organization: "U.S. Census Bureau",
        description:
          "Detailed annual estimates covering income, poverty, housing, education, commuting, and other social and economic characteristics.",
        url: "https://www.census.gov/data/developers/data-sets/acs-1year/2024.html",
      },
      {
        name: "2024 ACS 1-Year Census Data API",
        organization: "U.S. Census Bureau",
        description:
          "API dataset used to retrieve selected 2024 ACS detailed-table variables.",
        url: "https://api.census.gov/data/2024/acs/acs1.html",
      },
    ],
  },
  {
    title: "Education",
    description:
      "State education profiles combine adult educational-attainment measures from the American Community Survey with Grade 8 reading and mathematics results from the National Assessment of Educational Progress.",
    sources: [
      {
        name: "American Community Survey 5-Year Estimates",
        organization: "U.S. Census Bureau",
        description:
          "Source for adult educational-attainment measures, including high-school completion, college attainment, and the detailed attainment breakdown for people age 25 and older.",
        url: "https://www.census.gov/programs-surveys/acs/",
      },
      {
        name: "The Nation’s Report Card",
        organization: "National Center for Education Statistics",
        description:
          "Official source for National Assessment of Educational Progress results, including state Grade 8 reading and mathematics scores.",
        url: "https://www.nationsreportcard.gov/",
      },
      {
        name: "NAEP Data Explorer",
        organization: "National Center for Education Statistics",
        description:
          "Interactive tool for reviewing NAEP scores, achievement levels, jurisdictions, subjects, grades, and assessment years.",
        url: "https://www.nationsreportcard.gov/ndecore/",
      },
    ],
  },
  {
    title: "Migration",
    description:
      "Migration datasets are processed into inbound, outbound, and net-migration summaries for state and metro profiles.",
    sources: [
      {
        name: "Migration and Geographic Mobility",
        organization: "U.S. Census Bureau",
        description:
          "Census migration resources describing movement between states, counties, and other U.S. geographies.",
        url: "https://www.census.gov/topics/population/migration.html",
      },
      {
        name: "State-to-State Migration Flows",
        organization: "U.S. Census Bureau",
        description:
          "Migration-flow tables used to summarize where state residents moved from and where departing residents moved to.",
        url: "https://www.census.gov/data/tables/time-series/demo/geographic-mobility/state-to-state-migration.html",
      },
    ],
  },
  {
    title: "Geographic Boundaries and Maps",
    description:
      "Geographic files provide the state shapes used by PopShift’s interactive map visualizations.",
    sources: [
      {
        name: "us-atlas",
        organization: "TopoJSON",
        description:
          "Prebuilt TopoJSON derived from U.S. Census Bureau cartographic boundary files.",
        url: "https://www.npmjs.com/package/us-atlas",
      },
      {
        name: "TopoJSON Client",
        organization: "TopoJSON",
        description:
          "Utilities used to convert and manipulate TopoJSON geographic data for rendering.",
        url: "https://github.com/topojson/topojson-client",
      },
    ],
  },
  {
    title: "State Flags",
    description:
      "State flags appear in the States directory to help users identify each state visually.",
    sources: [
      {
        name: "Flags of U.S. States",
        organization: "Flagpedia",
        description:
          "Downloadable SVG state-flag package based on vector files from Wikimedia Commons.",
        url: "https://flagpedia.net/us-states/download",
      },
      {
        name: "SVG Flags of U.S. States",
        organization: "Wikimedia Commons",
        description:
          "Collection of scalable state-flag artwork and related licensing information.",
        url: "https://commons.wikimedia.org/wiki/Category:SVG_flags_of_states_of_the_United_States",
      },
    ],
  },
  {
    title: "Metro Images",
    description:
      "Metro profile and directory images are stored locally. Individual image credits and license information are recorded with the corresponding metro data.",
    sources: [
      {
        name: "Wikimedia Commons",
        organization: "Wikimedia Foundation",
        description:
          "Primary source for many metro skyline and location images used throughout the application.",
        url: "https://commons.wikimedia.org/",
      },
    ],
  },
  {
    title: "Visualization and Application Libraries",
    description:
      "Open-source libraries support PopShift’s charts, maps, routing, icons, and user-interface components.",
    sources: [
      {
        name: "Recharts",
        organization: "Recharts",
        description:
          "React charting library used for population and migration timeline visualizations.",
        url: "https://recharts.org/",
      },
      {
        name: "React Router",
        organization: "Remix Software",
        description:
          "Routing library used for page navigation, route parameters, query parameters, and navigation state.",
        url: "https://reactrouter.com/",
      },
      {
        name: "React Icons",
        organization: "React Icons",
        description:
          "Icon library used throughout PopShift’s cards, controls, navigation, and data summaries.",
        url: "https://react-icons.github.io/react-icons/",
      },
    ],
  },
];

export default function DataSources() {
  return (
    <main className="data-sources">
      <header className="data-sources__header">
        <h1>Data Sources</h1>

        <p>
          PopShift combines public government datasets, geographic resources,
          open-source software, and properly attributed visual assets. This page
          identifies the principal sources used throughout the application.
        </p>
      </header>

      <section className="data-sources__notice">
        <h2>About Source Years</h2>

        <p>
          Government datasets are published on different schedules. Population,
          migration, economic, housing, education, and transportation values
          shown together on a profile may therefore represent different years.
          PopShift displays the applicable year near each section whenever
          possible.
        </p>
      </section>

      <div className="data-sources__groups">
        {sourceGroups.map((group) => (
          <section className="data-sources__group" key={group.title}>
            <div className="data-sources__group-header">
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </div>

            <div className="data-sources__grid">
              {group.sources.map((source) => (
                <article className="data-sources__card" key={source.name}>
                  <span className="data-sources__organization">
                    {source.organization}
                  </span>

                  <h3>{source.name}</h3>
                  <p>{source.description}</p>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${source.name} in a new tab`}
                  >
                    Visit source <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="data-sources__disclaimer">
        <h2>Independent Project</h2>

        <p>
          PopShift is an independent project and is not affiliated with,
          sponsored by, or endorsed by the U.S. Census Bureau or any other
          organization listed on this page.
        </p>

        <p>
          Source organizations retain responsibility for their original data and
          documentation. PopShift is responsible for its own processing,
          calculations, presentation, and any errors introduced during those
          steps.
        </p>
      </section>
    </main>
  );
}

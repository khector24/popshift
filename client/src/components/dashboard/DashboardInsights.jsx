import { Link } from "react-router-dom";
import { FaGraduationCap, FaHouse } from "react-icons/fa6";

import "../../styles/components/dashboard/DashboardInsights.css";

export default function DashboardInsights({
  educationData,
  economicsData,
  educationYear,
  economicsYear,
  loading,
}) {
  if (loading) {
    return (
      <section className="dashboard-insights">
        <div className="dashboard-insights__header">
          <h2>Beyond Population</h2>
          <p>Loading education and affordability insights...</p>
        </div>
      </section>
    );
  }

  /*
   * Education comes back as an object:
   *
   * {
   *   "01": {...},
   *   "02": {...}
   * }
   *
   * Economics comes back as an array.
   */

  const educationStates = Object.values(educationData || {})
    // Exclude Washington, D.C. so the heading can accurately say "states."
    .filter((state) => state.code !== "11")
    .filter((state) => typeof state.attainment?.bachelorsOrHigher === "number")
    .sort(
      (a, b) => b.attainment.bachelorsOrHigher - a.attainment.bachelorsOrHigher,
    )
    .slice(0, 5);

  const affordableRentStates = [...(economicsData || [])]
    .filter((state) => typeof state.medianRent === "number")
    .filter((state) => state.code !== "11")
    .sort((a, b) => a.medianRent - b.medianRent)
    .slice(0, 5);

  return (
    <section className="dashboard-insights">
      <div className="dashboard-insights__header">
        <div>
          <h2>Beyond Population</h2>
          <p>A quick look at education attainment and housing affordability.</p>
        </div>
      </div>

      <div className="dashboard-insights__grid">
        <article className="dashboard-insights__panel">
          <div className="dashboard-insights__panel-header">
            <div className="dashboard-insights__icon dashboard-insights__icon--education">
              <FaGraduationCap />
            </div>

            <div>
              <h3>Education Leaders</h3>
              <p>
                Bachelor&apos;s degree or higher
                {educationYear ? ` · ${educationYear}` : ""}
              </p>
            </div>
          </div>

          <ol className="dashboard-insights__list">
            {educationStates.map((state, index) => (
              <li key={state.code} className="dashboard-insights__row">
                <span className="dashboard-insights__rank">{index + 1}</span>

                <Link
                  className="dashboard-insights__state"
                  to={`/states/${state.code}`}
                  state={{
                    from: "/dashboard",
                    label: "Dashboard",
                  }}
                >
                  {state.name}
                </Link>

                <strong className="dashboard-insights__value">
                  {state.attainment.bachelorsOrHigher.toFixed(1)}%
                </strong>
              </li>
            ))}
          </ol>
        </article>

        <article className="dashboard-insights__panel">
          <div className="dashboard-insights__panel-header">
            <div className="dashboard-insights__icon dashboard-insights__icon--rent">
              <FaHouse />
            </div>

            <div>
              <h3>Most Affordable Rents</h3>
              <p>
                Lowest statewide median gross rent
                {economicsYear ? ` · ${economicsYear}` : ""}
              </p>
            </div>
          </div>

          <ol className="dashboard-insights__list">
            {affordableRentStates.map((state, index) => (
              <li key={state.code} className="dashboard-insights__row">
                <span className="dashboard-insights__rank">{index + 1}</span>

                <Link
                  className="dashboard-insights__state"
                  to={`/states/${state.code}`}
                  state={{
                    from: "/dashboard",
                    label: "Dashboard",
                  }}
                >
                  {state.name}
                </Link>

                <strong className="dashboard-insights__value">
                  ${state.medianRent.toLocaleString()}
                </strong>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}

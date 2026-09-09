import { FaCar, FaHouse, FaPerson, FaShieldHalved } from "react-icons/fa6";

import "../../styles/components/city/CityCrimeSection.css";

function formatRate(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatCount(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return Number(value).toLocaleString("en-US");
}

const CRIME_ROWS = [
  {
    label: "Violent crime",
    countKey: "violent_crime_count",
    rateKey: "violent_crime_rate",
  },
  {
    label: "Murder & nonnegligent manslaughter",
    countKey: "murder_count",
    rateKey: "murder_rate",
  },
  {
    label: "Rape",
    countKey: "rape_count",
    rateKey: "rape_rate",
  },
  {
    label: "Robbery",
    countKey: "robbery_count",
    rateKey: "robbery_rate",
  },
  {
    label: "Aggravated assault",
    countKey: "aggravated_assault_count",
    rateKey: "aggravated_assault_rate",
  },
  {
    label: "Property crime",
    countKey: "property_crime_count",
    rateKey: "property_crime_rate",
  },
  {
    label: "Burglary",
    countKey: "burglary_count",
    rateKey: "burglary_rate",
  },
  {
    label: "Larceny-theft",
    countKey: "larceny_theft_count",
    rateKey: "larceny_theft_rate",
  },
  {
    label: "Motor vehicle theft",
    countKey: "motor_vehicle_theft_count",
    rateKey: "motor_vehicle_theft_rate",
  },
];

export default function CityCrimeSection({ crime }) {
  if (!crime) {
    return null;
  }

  const isAvailable = crime.coverage_status === "available";

  return (
    <section className="city-domain-section city-crime">
      <div className="city-domain-section__header">
        <div>
          <span>Crime</span>
          <h2>Crime Statistics</h2>
        </div>

        <p>{crime.year} FBI reported offenses</p>
      </div>

      {!isAvailable ? (
        <div className="city-crime__unavailable">
          <FaShieldHalved />

          <div>
            <strong>Crime statistics unavailable</strong>

            <p>
              {crime.coverage_notes ??
                "No defensible FBI city-level crime data were available."}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="city-crime__highlights">
            <article className="city-crime__highlight">
              <FaPerson />

              <div>
                <span>Violent Crime</span>
                <strong>{formatRate(crime.violent_crime_rate)}</strong>
                <small>per 100,000 residents</small>
              </div>
            </article>

            <article className="city-crime__highlight">
              <FaHouse />

              <div>
                <span>Property Crime</span>
                <strong>{formatRate(crime.property_crime_rate)}</strong>
                <small>per 100,000 residents</small>
              </div>
            </article>

            <article className="city-crime__highlight">
              <FaShieldHalved />

              <div>
                <span>Murder</span>
                <strong>{formatRate(crime.murder_rate)}</strong>
                <small>per 100,000 residents</small>
              </div>
            </article>

            <article className="city-crime__highlight">
              <FaCar />

              <div>
                <span>Motor Vehicle Theft</span>
                <strong>{formatRate(crime.motor_vehicle_theft_rate)}</strong>
                <small>per 100,000 residents</small>
              </div>
            </article>
          </div>

          <div className="city-crime__table-wrap">
            <table className="city-crime__table">
              <thead>
                <tr>
                  <th>Offense</th>
                  <th>Reported offenses</th>
                  <th>Rate per 100,000</th>
                </tr>
              </thead>

              <tbody>
                {CRIME_ROWS.map((row) => (
                  <tr key={row.rateKey}>
                    <td>{row.label}</td>
                    <td>{formatCount(crime[row.countKey])}</td>
                    <td>{formatRate(crime[row.rateKey])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="city-crime__coverage">
            <span>
              FBI reporting population:{" "}
              <strong>{formatCount(crime.reporting_population)}</strong>
            </span>

            {crime.source_jurisdiction_name && (
              <span>
                Reporting jurisdiction:{" "}
                <strong>{crime.source_jurisdiction_name}</strong>
              </span>
            )}

            {crime.coverage_notes && <p>{crime.coverage_notes}</p>}
          </div>
        </>
      )}

      <p className="city-crime__source">
        Source: {crime.source} · {crime.dataset_name} · {crime.vintage}
      </p>
    </section>
  );
}

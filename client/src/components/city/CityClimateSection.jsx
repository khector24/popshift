import { FaCloudRain, FaTemperatureHalf } from "react-icons/fa6";

import "../../styles/components/city/CityClimateSection.css";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatTemperature(value) {
  return `${Number(value).toFixed(1)}°F`;
}

function formatPrecipitation(value) {
  return `${Number(value).toFixed(2)} in`;
}

export default function CityClimateSection({ climate }) {
  if (!climate?.length) {
    return null;
  }

  const coldestMonth = climate.reduce((coldest, month) =>
    Number(month.normal_mean) < Number(coldest.normal_mean) ? month : coldest,
  );

  const warmestMonth = climate.reduce((warmest, month) =>
    Number(month.normal_mean) > Number(warmest.normal_mean) ? month : warmest,
  );

  const wettestMonth = climate.reduce((wettest, month) =>
    Number(month.precipitation) > Number(wettest.precipitation)
      ? month
      : wettest,
  );

  const annualPrecipitation = climate.reduce(
    (total, month) => total + Number(month.precipitation),
    0,
  );

  const source = climate[0];

  return (
    <section className="city-domain-section city-climate">
      <div className="city-domain-section__header">
        <div>
          <span>Climate</span>
          <h2>Climate & Seasons</h2>
        </div>

        <p>{source.normal_period} NOAA Climate Normals</p>
      </div>

      <div className="city-climate__highlights">
        <article className="city-climate__highlight">
          <FaTemperatureHalf />

          <div>
            <span>Warmest Month</span>
            <strong>{MONTH_NAMES[warmestMonth.month - 1]}</strong>
            <small>
              {formatTemperature(warmestMonth.normal_high)} normal high
            </small>
          </div>
        </article>

        <article className="city-climate__highlight">
          <FaTemperatureHalf />

          <div>
            <span>Coldest Month</span>
            <strong>{MONTH_NAMES[coldestMonth.month - 1]}</strong>
            <small>
              {formatTemperature(coldestMonth.normal_low)} normal low
            </small>
          </div>
        </article>

        <article className="city-climate__highlight">
          <FaCloudRain />

          <div>
            <span>Wettest Month</span>
            <strong>{MONTH_NAMES[wettestMonth.month - 1]}</strong>
            <small>{formatPrecipitation(wettestMonth.precipitation)}</small>
          </div>
        </article>

        <article className="city-climate__highlight">
          <FaCloudRain />

          <div>
            <span>Annual Precipitation</span>
            <strong>{annualPrecipitation.toFixed(1)} in</strong>
            <small>Average yearly total</small>
          </div>
        </article>
      </div>

      <div className="city-climate__table-wrap">
        <table className="city-climate__table">
          <thead>
            <tr>
              <th>Month</th>
              <th>High</th>
              <th>Low</th>
              <th>Mean</th>
              <th>Precipitation</th>
            </tr>
          </thead>

          <tbody>
            {climate.map((month) => (
              <tr key={month.month}>
                <td>{MONTH_NAMES[month.month - 1]}</td>
                <td>{formatTemperature(month.normal_high)}</td>
                <td>{formatTemperature(month.normal_low)}</td>
                <td>{formatTemperature(month.normal_mean)}</td>
                <td>{formatPrecipitation(month.precipitation)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="city-climate__source">
        Source: {source.source} · {source.dataset_name} · {source.vintage}
      </p>
    </section>
  );
}

import { Link } from "react-router-dom";
import {
  FaCity,
  FaCloud,
  FaDroplet,
  FaLocationDot,
  FaTemperatureHalf,
  FaWind,
} from "react-icons/fa6";

import "../../styles/components/city/CityHero.css";

function formatTemperature(value) {
  return `${Math.round(Number(value))}°F`;
}

function formatWindSpeed(value) {
  return `${Number(value).toFixed(1)} mph`;
}

export default function CityHero({
  city,
  state,
  metro,
  weather,
  weatherError,
}) {
  return (
    <section className="city-hero">
      <div className="city-hero__content">
        <Link className="city-hero__back" to="/cities">
          ← Back to Cities
        </Link>

        <h1>
          {city.name}
          {state?.name ? `, ${state.name}` : ""}
        </h1>

        <div className="city-hero__meta">
          {state && (
            <span>
              <FaLocationDot />
              {state.name}
            </span>
          )}

          {metro && (
            <span>
              <FaCity />
              Part of {metro.name}
            </span>
          )}
        </div>

        <p className="city-hero__estimate">2025 Population Estimate</p>
      </div>

      <div className="city-hero__visual">
        {weather ? (
          <div className="city-hero__weather">
            <div className="city-hero__weather-heading">
              <div>
                <span>Current Weather</span>
                <strong>{formatTemperature(weather.temperature)}</strong>
              </div>

              <FaCloud />
            </div>

            <p className="city-hero__weather-condition">
              {weather.description}
            </p>

            <div className="city-hero__weather-grid">
              <div>
                <FaTemperatureHalf />
                <span>Feels Like</span>
                <strong>{formatTemperature(weather.feels_like)}</strong>
              </div>

              <div>
                <FaDroplet />
                <span>Humidity</span>
                <strong>{weather.humidity}%</strong>
              </div>

              <div>
                <FaWind />
                <span>Wind</span>
                <strong>{formatWindSpeed(weather.wind_speed)}</strong>
              </div>
            </div>
          </div>
        ) : weatherError ? (
          <div className="city-hero__weather-unavailable">
            <FaCloud />
            <span>Current weather unavailable</span>
          </div>
        ) : (
          <div className="city-hero__weather-unavailable">
            <FaCloud />
            <span>Loading current weather...</span>
          </div>
        )}
      </div>
    </section>
  );
}

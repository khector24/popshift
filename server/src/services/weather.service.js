import pool from "../db/index.js";

const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const WEATHER_CACHE_MINUTES = 60;

export async function getCachedWeather(placeId) {
  const result = await pool.query(
    `
      SELECT
        place_id,
        temperature,
        feels_like,
        condition_code,
        condition,
        description,
        humidity,
        wind_speed,
        fetched_at,
        expires_at
      FROM weather_cache
      WHERE place_id = $1;
    `,
    [placeId],
  );

  return result.rows[0] ?? null;
}

export async function fetchOpenWeather(latitude, longitude) {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY is not configured.");
  }

  const url = new URL(OPENWEATHER_BASE_URL);

  url.searchParams.set("lat", latitude);
  url.searchParams.set("lon", longitude);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("units", "imperial");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `OpenWeather request failed with status ${response.status}`,
    );
  }

  const data = await response.json();

  return {
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    conditionCode: data.weather[0].id,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
}

export async function saveWeatherCache(placeId, weather) {
  const result = await pool.query(
    `
      INSERT INTO weather_cache (
        place_id,
        temperature,
        feels_like,
        condition_code,
        condition,
        description,
        humidity,
        wind_speed,
        fetched_at,
        expires_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        NOW(),
        NOW() + ($9 * INTERVAL '1 minute')
      )
      ON CONFLICT (place_id)
      DO UPDATE SET
        temperature = EXCLUDED.temperature,
        feels_like = EXCLUDED.feels_like,
        condition_code = EXCLUDED.condition_code,
        condition = EXCLUDED.condition,
        description = EXCLUDED.description,
        humidity = EXCLUDED.humidity,
        wind_speed = EXCLUDED.wind_speed,
        fetched_at = EXCLUDED.fetched_at,
        expires_at = EXCLUDED.expires_at
      RETURNING
        place_id,
        temperature,
        feels_like,
        condition_code,
        condition,
        description,
        humidity,
        wind_speed,
        fetched_at,
        expires_at;
    `,
    [
      placeId,
      weather.temperature,
      weather.feelsLike,
      weather.conditionCode,
      weather.condition,
      weather.description,
      weather.humidity,
      weather.windSpeed,
      WEATHER_CACHE_MINUTES,
    ],
  );

  return result.rows[0];
}

export async function getCurrentWeather(city) {
  const cachedWeather = await getCachedWeather(city.id);

  if (
    cachedWeather &&
    new Date(cachedWeather.expires_at).getTime() > Date.now()
  ) {
    return {
      ...cachedWeather,
      cache_status: "cache_used",
    };
  }

  const weather = await fetchOpenWeather(city.latitude, city.longitude);

  const savedWeather = await saveWeatherCache(city.id, weather);

  return {
    ...savedWeather,
    cache_status: cachedWeather ? "cache_expired_refreshed" : "cache_empty",
  };
}

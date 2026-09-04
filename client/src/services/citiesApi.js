const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getCities() {
  const response = await fetch(`${API_URL}/api/cities`);

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }

  return response.json();
}

export async function getCityBySlug(slug) {
  const response = await fetch(`${API_URL}/api/cities/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch city");
  }

  return response.json();
}

export async function getCityWeather(slug) {
  const response = await fetch(`${API_URL}/api/cities/${slug}/weather`);

  if (!response.ok) {
    throw new Error("Failed to fetch city weather");
  }

  return response.json();
}

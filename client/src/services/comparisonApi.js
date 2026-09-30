const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function getComparison(endpoint, params) {
  const searchParams = new URLSearchParams(params);

  const response = await fetch(
    `${API_URL}/api/comparisons/${endpoint}?${searchParams.toString()}`,
  );

  if (!response.ok) {
    throw new Error(`Unable to load ${endpoint} comparison`);
  }

  return response.json();
}

export function getCityComparison(slugs) {
  return getComparison("cities", {
    slugs: slugs.join(","),
  });
}

export function getMetroComparison(slugs) {
  return getComparison("metros", {
    slugs: slugs.join(","),
  });
}

export function getStateComparison(codes) {
  return getComparison("states", {
    codes: codes.join(","),
  });
}

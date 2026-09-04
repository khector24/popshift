const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function searchPlaces(query) {
  const params = new URLSearchParams({
    q: query,
  });

  const response = await fetch(`${API_URL}/api/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to search places");
  }

  return response.json();
}

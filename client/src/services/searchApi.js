const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function searchPlaces(query, geographyType = null) {
  const params = new URLSearchParams({
    q: query,
  });

  if (geographyType) {
    params.set("type", geographyType);
  }

  const response = await fetch(`${API_URL}/api/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to search places");
  }

  return response.json();
}

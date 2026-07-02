const API_URL = "http://localhost:3000";

export async function getMetrosBySlug(slug) {
  const response = await fetch(`${API_URL}/api/metros/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch metro");
  }

  return response.json();
}

const API_URL = import.meta.env.VITE_API_URL;

export async function getMetros() {
  const response = await fetch(`${API_URL}/api/metros/`);

  if (!response.ok) {
    throw new Error("Failed to fetch metros");
  }

  return response.json();
}

export async function getMetrosBySlug(slug) {
  const response = await fetch(`${API_URL}/api/metros/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch metro");
  }

  return response.json();
}

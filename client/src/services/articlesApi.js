const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getPublishedArticles() {
  const response = await fetch(`${API_URL}/api/articles`);

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  return response.json();
}

export async function getPublishedArticleBySlug(slug) {
  const response = await fetch(`${API_URL}/api/articles/${slug}`);

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return response.json();
}

export async function getPublishedArticlesByPlaceId(placeId) {
  const response = await fetch(`${API_URL}/api/places/${placeId}/articles`);

  if (!response.ok) {
    throw new Error("Failed to fetch related articles");
  }

  return response.json();
}

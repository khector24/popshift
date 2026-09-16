const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getAdminArticles() {
  const response = await fetch(`${API_URL}/api/admin/articles`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Failed to fetch admin articles");
    error.status = response.status;

    throw error;
  }

  return result;
}

export async function createAdminArticle(articleData) {
  const response = await fetch(`${API_URL}/api/admin/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(articleData),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Failed to create article");
    error.status = response.status;

    throw error;
  }

  return result;
}

export async function getAdminArticleById(id) {
  const response = await fetch(`${API_URL}/api/admin/articles/${id}`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Failed to fetch article");
    error.status = response.status;

    throw error;
  }

  return result;
}

export async function updateAdminArticle(id, articleData) {
  const response = await fetch(`${API_URL}/api/admin/articles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(articleData),
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Failed to update article");
    error.status = response.status;

    throw error;
  }

  return result;
}

export async function deleteAdminArticle(id) {
  const response = await fetch(`${API_URL}/api/admin/articles/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Failed to delete article");
    error.status = response.status;

    throw error;
  }

  return result;
}

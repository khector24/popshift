const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function loginAdmin(email, password) {
  const response = await fetch(`${API_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to log in");
  }

  return result;
}

export async function getCurrentAdmin() {
  const response = await fetch(`${API_URL}/api/admin/auth/me`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Failed to get current admin");
    error.status = response.status;

    throw error;
  }

  return result;
}

export async function logoutAdmin() {
  const response = await fetch(`${API_URL}/api/admin/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to log out");
  }

  return result;
}

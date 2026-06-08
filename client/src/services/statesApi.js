const API_URL = "http://localhost:3000";

export async function getStates({
  sortBy,
  order,
  region,
  search,
  limit,
  page,
}) {
  const params = new URLSearchParams({
    sortBy,
    order,
  });

  if (region) {
    params.append("region", region);
  }

  if (search) {
    params.append("search", search);
  }

  if (limit) {
    params.append("limit", limit);
  }

  if (page) {
    params.append("page", page);
  }

  const response = await fetch(`${API_URL}/api/states?${params}`);

  if (!response.ok) {
    throw new Error("Failed to fetch states");
  }

  return response.json();
}

export async function getStateByCode(code) {
  const response = await fetch(`${API_URL}/api/states/${code}`);

  if (!response.ok) {
    throw new Error("Failed to fetch state");
  }

  return response.json();
}

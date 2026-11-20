const BASE_URL = "https://dummyjson.com/products";

// fetch does not reject on 404 / 500, so we check response.ok ourselves
async function getJson(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function fetchProducts(signal) {
  const data = await getJson(`${BASE_URL}?limit=100`, signal);
  return data.products;
}

export async function fetchProduct(id, signal) {
  return getJson(`${BASE_URL}/${id}`, signal);
}

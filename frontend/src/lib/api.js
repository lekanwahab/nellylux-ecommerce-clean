// Base URL for Django backend
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

/**
 * Fetch product list
 * Supports search, category, featured
 */
export async function fetchProducts({
  search = "",
  category = "",
  featured = false,
} = {}) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (category) params.append("category", category);
  if (featured) params.append("featured", "true");

  const query = params.toString();
  const url = `${API_BASE}/api/products/${query ? `?${query}` : ""}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }

  return res.json();
}

/**
 * Fetch single product by slug
 */
export async function fetchProduct(slug) {
  if (!slug) throw new Error("Slug is required");

  const url = `${API_BASE}/api/products/${slug}/`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch product (${res.status})`);
  }

  return res.json();
}


const CART_KEY = "reeky_lux_cart";

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:changed"));
}

export function addToCart(item) {
  const cart = getCart();
  const found = cart.find((x) => x.slug === item.slug);

  if (found) {
    found.qty = Number(found.qty || 1) + Number(item.qty || 1);
  } else {
    cart.push({
      slug: item.slug,
      name: item.name,
      price: Number(item.price || 0),
      qty: Number(item.qty || 1),
      image_url: item.image_url || "",
    });
  }

  setCart(cart);
  return cart;
}

export function updateQty(slug, qty) {
  const cart = getCart().map((i) =>
    i.slug === slug ? { ...i, qty: Math.max(1, Number(qty || 1)) } : i
  );
  setCart(cart);
  return cart;
}

export function removeFromCart(slug) {
  const cart = getCart().filter((i) => i.slug !== slug);
  setCart(cart);
  return cart;
}

export function clearCart() {
  setCart([]);
}


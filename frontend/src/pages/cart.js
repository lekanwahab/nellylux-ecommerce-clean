import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const CART_KEY = "NELLY_LUX_cart";

export default function Cart() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "₦";
  const waPhone = (process.env.NEXT_PUBLIC_WA_PHONE || "").replace(/\D/g, "");

  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    location: "",
    delivery: "Delivery",
    note: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  const saveCart = (nextItems) => {
    localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
    setItems(nextItems);
    window.dispatchEvent(new Event("cart:changed"));
  };

  const onUpdate = (slug, qty) => {
    const next = items.map((i) =>
      i.slug === slug ? { ...i, qty: Math.max(1, Number(qty || 1)) } : i
    );
    saveCart(next);
  };

  const onRemove = (slug) => {
    const next = items.filter((i) => i.slug !== slug);
    saveCart(next);
  };

  const onClear = () => saveCart([]);

  const total = useMemo(() => {
    return items.reduce(
      (sum, i) => sum + Number(i.price || 0) * Number(i.qty || 1),
      0
    );
  }, [items]);

  const onCheckout = () => {
    if (!waPhone) return alert("Set NEXT_PUBLIC_WA_PHONE in .env.local");
    if (items.length === 0) return alert("Your cart is empty.");

    const lines = [];
    lines.push("Nelly Lux Order");
    lines.push("----------------------------");
    lines.push(`Name: ${customer.name || "-"}`);
    lines.push(`Phone: ${customer.phone || "-"}`);
    lines.push(`Location: ${customer.location || "-"}`);
    lines.push(`Delivery: ${customer.delivery || "-"}`);
    if (customer.note) lines.push(`Note: ${customer.note}`);
    lines.push("");
    lines.push("Items:");

    items.forEach((i) => {
      const lineTotal = Number(i.price || 0) * Number(i.qty || 1);
      lines.push(`- ${i.name} x${i.qty} = ${currency}${lineTotal.toFixed(2)}`);
    });

    lines.push("");
    lines.push(`TOTAL: ${currency}${total.toFixed(2)}`);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${waPhone}?text=${text}`, "_blank");
  };

  return (
    <div className="watermarkBg">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <h1 style={{ marginTop: 6, marginBottom: 6 }}>Cart</h1>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/shop">
              <button className="btn btnGhost">Continue Shopping</button>
            </Link>
            <button className="btn btnGhost" onClick={onClear} disabled={items.length === 0}>
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid2" style={{ alignItems: "start" }}>
          {/* LEFT: ITEMS */}
          <div className="card" style={{ padding: 16 }}>
            {items.length === 0 && <div className="small">Your cart is empty.</div>}

            {items.map((i) => (
              <div
                key={i.slug}
                style={{ display: "flex", gap: 12, padding: "12px 0", alignItems: "center" }}
              >
                <div
                  style={{
                    width: 84,
                    height: 64,
                    borderRadius: 14,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.06)",
                    flex: "0 0 auto",
                  }}
                >
                  {i.image_url ? (
                    <img
                      src={i.image_url}
                      alt={i.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900 }}>{i.name}</div>
                  <div className="small">
                    {currency}
                    {Number(i.price || 0).toFixed(2)} each
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={i.qty}
                      onChange={(e) => onUpdate(i.slug, Number(e.target.value || 1))}
                      style={{ width: 110 }}
                    />
                    <button className="btn btnGhost" onClick={() => onRemove(i.slug)}>
                      Remove
                    </button>
                  </div>
                </div>

                <div style={{ fontWeight: 900 }}>
                  {currency}
                  {(Number(i.price || 0) * Number(i.qty || 1)).toFixed(2)}
                </div>
              </div>
            ))}

            <hr />

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              <div className="small">Total</div>
              <div style={{ fontWeight: 900, fontSize: 20 }}>
                {currency}
                {total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* RIGHT: CUSTOMER */}
          <div className="card" style={{ padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Customer Info</h2>

            <div style={{ display: "grid", gap: 10 }}>
              <input
                className="input"
                placeholder="Full name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />

              <input
                className="input"
                placeholder="Phone number"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />

              <input
                className="input"
                placeholder="City / State"
                value={customer.location}
                onChange={(e) => setCustomer({ ...customer, location: e.target.value })}
              />

              <select
                className="input"
                value={customer.delivery}
                onChange={(e) => setCustomer({ ...customer, delivery: e.target.value })}
              >
                <option>Delivery</option>
                <option>Pickup</option>
              </select>

              <textarea
                className="input"
                rows="4"
                placeholder="Optional note (color, lace type, preferred time...)"
                value={customer.note}
                onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
              />

              <button className="btn btnPrimary" onClick={onCheckout} disabled={items.length === 0}>
                Checkout on WhatsApp
              </button>

              <div className="small">
                Clicking checkout opens WhatsApp with your order details ready to send.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

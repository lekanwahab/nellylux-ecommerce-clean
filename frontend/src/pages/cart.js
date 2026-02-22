import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const CART_KEY = "reeky_lux_cart";

// Configure these in .env.local
const PAYPAL_LINK = process.env.NEXT_PUBLIC_PAYPAL_LINK || ""; // e.g. https://www.paypal.me/yourname
const CASHAPP_LINK = process.env.NEXT_PUBLIC_CASHAPP_LINK || ""; // e.g. https://cash.app/$yourcashtag
const ZELLE_INFO = process.env.NEXT_PUBLIC_ZELLE_INFO || ""; // e.g. zelle email/phone
const CARD_PROVIDER = process.env.NEXT_PUBLIC_CARD_PROVIDER || "Stripe"; // display only

export default function Cart() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";

  const [items, setItems] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    location: "",
    delivery: "Delivery",
    note: "",
  });

  const [payment, setPayment] = useState({
    method: "card", // card | paypal | cashapp | zelle
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

  const placeOrder = () => {
    if (items.length === 0) return alert("Your cart is empty.");

    // very simple validation like Amazon
    if (!customer.name || !customer.phone) {
      return alert("Please enter your name and phone number.");
    }

    if (payment.method === "card") {
      // Later we can integrate Stripe/Paystack. For now route to a placeholder page.
      window.location.href = "/pay/card";
      return;
    }

    if (payment.method === "paypal") {
      if (!PAYPAL_LINK) return alert("PayPal link is not set.");
      window.open(PAYPAL_LINK, "_blank");
      return;
    }

    if (payment.method === "cashapp") {
      if (!CASHAPP_LINK) return alert("Cash App link is not set.");
      window.open(CASHAPP_LINK, "_blank");
      return;
    }

    if (payment.method === "zelle") {
      if (!ZELLE_INFO) return alert("Zelle info is not set.");
      window.location.href = "/pay/zelle";
      return;
    }
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
          <h1 style={{ marginTop: 6, marginBottom: 6 }}>Checkout</h1>

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
          {/* LEFT: Cart items */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
              Review items
            </div>

            {items.length === 0 && <div className="small">Your cart is empty.</div>}

            {items.map((i) => (
              <div
                key={i.slug}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 0",
                  alignItems: "center",
                }}
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
              <div className="small">Order total</div>
              <div style={{ fontWeight: 900, fontSize: 20 }}>
                {currency}
                {total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* RIGHT: Shipping + Payment */}
          <div style={{ display: "grid", gap: 14 }}>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
                Shipping & Contact
              </div>

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
                  rows="3"
                  placeholder="Optional note (lace type, color, preferred time...)"
                  value={customer.note}
                  onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
                />
              </div>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
                Payment method
              </div>

              {/* Amazon style: selectable radio cards */}
              <div style={{ display: "grid", gap: 10 }}>
                <label className="payOption">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment.method === "card"}
                    onChange={() => setPayment({ method: "card" })}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900 }}>Debit / Credit Card</div>
                    <div className="small">Secure checkout via {CARD_PROVIDER} (recommended).</div>
                  </div>
                </label>

                <label className="payOption">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment.method === "paypal"}
                    onChange={() => setPayment({ method: "paypal" })}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900 }}>PayPal</div>
                    <div className="small">
                      {PAYPAL_LINK ? "Opens PayPal in a new tab." : "Set NEXT_PUBLIC_PAYPAL_LINK"}
                    </div>
                  </div>
                </label>

                <label className="payOption">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment.method === "cashapp"}
                    onChange={() => setPayment({ method: "cashapp" })}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900 }}>Cash App</div>
                    <div className="small">
                      {CASHAPP_LINK ? "Opens Cash App payment link." : "Set NEXT_PUBLIC_CASHAPP_LINK"}
                    </div>
                  </div>
                </label>

                <label className="payOption">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment.method === "zelle"}
                    onChange={() => setPayment({ method: "zelle" })}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900 }}>Zelle</div>
                    <div className="small">
                      {ZELLE_INFO ? `Send to: ${ZELLE_INFO}` : "Set NEXT_PUBLIC_ZELLE_INFO"}
                    </div>
                  </div>
                </label>
              </div>

              <button
                className="btn btnPrimary"
                onClick={placeOrder}
                disabled={items.length === 0}
                style={{ width: "100%", marginTop: 14 }}
              >
                Place your order
              </button>

              <div className="small" style={{ marginTop: 10 }}>
                By placing your order, you agree to Nelly Lux’s order terms.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


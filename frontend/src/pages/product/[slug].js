import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { fetchProduct } from "@/lib/api";
import { useToast } from "@/components/ToastProvider";


const CART_KEY = "reeky_lux_cart";

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";
  const { showToast } = useToast();

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    fetchProduct(slug)
      .then((data) => setP(data))
      .catch(() => setP(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const addToCart = () => { 
    if (!p) return;

    const existing = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    const found = existing.find((x) => x.slug === p.slug);

    if (found) {
      found.qty = Number(found.qty || 1) + Number(qty || 1);
    } else {
      existing.push({
        slug: p.slug,
        name: p.name,
        price: Number(p.price || 0),
        qty: Number(qty || 1),
        image_url: p.image_url || "",
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event("cart:changed"));
    router.push("/cart");
  };

  // ✅ REAL loading state
  if (loading) {
    return (
      <div className="watermarkBg">
        <div className="container">
          <div className="card">
            <div style={{ fontWeight: 900 }}>Loading product...</div>
            <div className="small" style={{ marginTop: 6 }}>
              Please wait.
            </div>
            <div style={{ marginTop: 12 }}>
              <Link href="/shop">
                <button className="btn btnGhost">Back to Shop</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Not found / fetch failed
  if (!p) {
    return (
      <div className="watermarkBg">
        <div className="container">
          <div className="card">
            <div style={{ fontWeight: 900 }}>Product not found</div>
            <div className="small" style={{ marginTop: 6 }}>
              This item may have been removed or the link is wrong.
            </div>
            <div style={{ marginTop: 12 }}>
              <Link href="/shop">
                <button className="btn btnPrimary">Back to Shop</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const price = Number(p.price || 0);
  const compare = Number(p.compare_at_price || 0);


  return (
    <div className="watermarkBg">
      <div className="container">
        <Link href="/shop">
          <button className="btn btnGhost" style={{ marginBottom: 14 }}>
            ← Back to Shop
          </button>
        </Link>

        <div className="grid grid2" style={{ alignItems: "start" }}>
          <div className="card" style={{ padding: 14 }}>
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.name}
                style={{ width: "100%", borderRadius: 18 }}
              />
            ) : (
              <div className="small">No image</div>
            )}
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="badge">{p.category || "Hair"}</div>

            <h1 style={{ marginTop: 10, marginBottom: 8 }}>{p.name}</h1>

            <div style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
              <div style={{ fontWeight: 900, fontSize: 26 }}>
                {currency}
                {price.toFixed(2)}
              </div>

              {compare > price && (
                <div className="small" style={{ textDecoration: "line-through" }}>
                  {currency}
                  {compare.toFixed(2)}
                </div>
              )}

              {p.in_stock === false && <div className="badge">Out of Stock</div>}
            </div>

            <div className="small" style={{ marginTop: 10 }}>
              {[p.texture, p.length && `${p.length} inches`, p.lace, p.color]
                .filter(Boolean)
                .join(" • ")}
            </div>

            {p.description ? (
              <p style={{ marginTop: 14 }}>{p.description}</p>
            ) : (
              <p className="small" style={{ marginTop: 14 }}>
                Premium quality hair — clean finish, natural look, easy to style.
              </p>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <input
                className="input"
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value || 1))}
                style={{ width: 110 }}
              />

              <button
	  className="btn btnPrimary"
	  onClick={addToCart}
	  disabled={p.in_stock === false}
	  style={{ opacity: p.in_stock === false ? 0.6 : 1 }}
	  > 

	  {p.in_stock === false ? "Out of Stock" : "Add to Cart"}
	  </button>



              <Link href="/cart">
                <button className="btn btnGhost">Go to Cart</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "NELLY LUXURY";


export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchProducts({ featured: true })
      .then((data) => setFeatured(data || []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div className="container">
      {/* COLORFUL HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
          padding: 34,
          border: "1px solid rgba(0,0,0,0.10)",
          boxShadow: "0 35px 90px rgba(0,0,0,0.10)",
          background:
            "linear-gradient(135deg, rgba(255,90,146,0.95) 0%, rgba(255,199,0,0.90) 35%, rgba(0,194,255,0.85) 70%, rgba(167,86,255,0.90) 100%)",
        }}
      >
        {/* glossy glow blobs */}
        <div
          style={{
            position: "absolute",
            inset: -120,
            background:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 85% 30%, rgba(255,255,255,0.25), transparent 45%), radial-gradient(circle at 50% 90%, rgba(255,255,255,0.20), transparent 50%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />
        {/* soft overlay for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.18))",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, color: "#111" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span className="badge" style={{ background: "rgba(255,255,255,0.70)" }}>
              Premium Wigs
            </span>
            <span className="badge" style={{ background: "rgba(255,255,255,0.70)" }}>
              Bundles
            </span>
            <span className="badge" style={{ background: "rgba(255,255,255,0.70)" }}>
              Frontal & Closure
            </span>
          </div>

          <h1 style={{ margin: "14px 0 10px", fontSize: 54, lineHeight: 1.02, color: "#0b0b10" }}>
            Nelly Lux
          </h1>

          <p style={{ margin: 0, maxWidth: 560, fontSize: 16, color: "rgba(0,0,0,0.85)" }}>
            Colorful. Bold. Luxury hair that makes you look expensive — instantly.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <Link href="/shop">
              <button className="btn btnPrimary" style={{ background: "#0b0b10" }}>
                Shop Now
              </button>
            </Link>

            <Link href="/cart">
              <button className="btn btnGhost" style={{ borderColor: "rgba(0,0,0,0.6)", color: "#0b0b10" }}>
                View Cart
              </button>
            </Link>
          </div>

          {/* colorful mini cards */}
          <div className="grid grid3" style={{ marginTop: 18 }}>
            <div
              className="card"
              style={{
                padding: 16,
                borderRadius: 20,
                background: "rgba(255,255,255,0.78)",
                border: "1px solid rgba(0,0,0,0.10)",
              }}
            >
              <div style={{ fontWeight: 900, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ff5a92" }} />
                WhatsApp Checkout
              </div>
              <div className="small" style={{ marginTop: 6, color: "rgba(0,0,0,0.75)" }}>
                Add to cart, checkout instantly.
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: 16,
                borderRadius: 20,
                background: "rgba(255,255,255,0.78)",
                border: "1px solid rgba(0,0,0,0.10)",
              }}
            >
              <div style={{ fontWeight: 900, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#00c2ff" }} />
                Premium Quality
              </div>
              <div className="small" style={{ marginTop: 6, color: "rgba(0,0,0,0.75)" }}>
                Soft feel, clean finish, luxury look.
              </div>
            </div>

            <div
              className="card"
              style={{
                padding: 16,
                borderRadius: 20,
                background: "rgba(255,255,255,0.78)",
                border: "1px solid rgba(0,0,0,0.10)",
              }}
            >
              <div style={{ fontWeight: 900, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#a756ff" }} />
                New Drops
              </div>
              <div className="small" style={{ marginTop: 6, color: "rgba(0,0,0,0.75)" }}>
                Fresh styles added regularly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section style={{ marginTop: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Featured Picks</h2>
            <div className="small" style={{ marginTop: 6 }}>
              Bright favorites customers love ✨
            </div>
          </div>

          <Link href="/shop">
            <button className="btn btnGhost">See All</button>
          </Link>
        </div>

        {featured.length === 0 ? (
          <div
            className="card"
            style={{
              marginTop: 12,
              background:
                "linear-gradient(135deg, rgba(255,90,146,0.10), rgba(0,194,255,0.10), rgba(167,86,255,0.10))",
            }}
          >
            <div style={{ fontWeight: 900 }}>New arrivals loading ✨</div>
            <div className="small" style={{ marginTop: 6 }}>
              Tap shop to see all available styles right now.
            </div>
            <div style={{ marginTop: 12 }}>
              <Link href="/shop">
                <button className="btn btnPrimary">Browse Shop</button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid3" style={{ marginTop: 12 }}>
            {featured.slice(0, 6).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


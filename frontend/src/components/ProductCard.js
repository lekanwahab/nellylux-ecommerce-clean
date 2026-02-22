import Link from "next/link";

export default function ProductCard({ p }) {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";
  const out = p.in_stock === false;

  return (
    <div
      className="card"
      style={{ padding: 14, overflow: "hidden", opacity: out ? 0.78 : 1 }}
    >
      <Link
        href={out ? "#" : `/product/${p.slug}`}
        onClick={(e) => {
          if (out) e.preventDefault();
        }}
        style={{ display: "block" }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: 14,
            overflow: "hidden",
            aspectRatio: "4/3",
            background: "rgba(255,255,255,0.06)",
          }}
        >
          {p.image_url ? (
            <img
              src={p.image_url}
              alt={p.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
              }}
              className="small"
            >
              No image
            </div>
          )}

          {out && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                background: "rgba(0,0,0,0.25)",
                backdropFilter: "blur(2px)",
                color: "#fff",
                fontWeight: 900,
                letterSpacing: 0.3,
              }}
            >
              OUT OF STOCK
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            justifyContent: "space-between",
            gap: 10,
            alignItems: "baseline",
          }}
        >
          <div style={{ fontWeight: 800 }}>{p.name}</div>
          <div style={{ fontWeight: 900 }}>
            {currency}
            {Number(p.price || 0).toFixed(2)}
          </div>
        </div>

        <div className="small" style={{ marginTop: 6 }}>
          {[p.texture, p.length, p.lace].filter(Boolean).join(" • ")}
        </div>

        {out && (
          <div className="badge" style={{ marginTop: 10 }}>
            Out of Stock
          </div>
        )}
      </Link>
    </div>
  );
}


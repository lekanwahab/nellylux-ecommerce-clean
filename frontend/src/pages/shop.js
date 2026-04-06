"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const load = async () => {
    try {
      const data = await fetchProducts({ search, category });

      // 🔥 FIX: handle different API shapes safely
      if (Array.isArray(data)) {
        setItems(data);
      } else if (data && Array.isArray(data.results)) {
        setItems(data.results);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(), 350);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <div className="watermarkBg">
      <div className="container">
        <div
          className="card"
          style={{
            padding: 18,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            className="input"
            placeholder="Search wigs, bundles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: "1 1 320px" }}
          />
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ flex: "0 0 220px" }}
          >
            <option value="">All Categories</option>
            <option value="wig">Wigs</option>
            <option value="bundle">Bundles</option>
            <option value="accessory">Accessories</option>
          </select>
        </div>

        <div className="grid grid3" style={{ marginTop: 14 }}>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((p) => <ProductCard key={p.id} p={p} />)
          ) : (
            <div className="small">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

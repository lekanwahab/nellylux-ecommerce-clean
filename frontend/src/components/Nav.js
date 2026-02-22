import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

export default function Nav() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(getCart().reduce((s, i) => s + i.qty, 0));
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("cart:changed", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("cart:changed", refresh);
    };
  }, []);

  const brand = process.env.NEXT_PUBLIC_BRAND || "NELLY LUXURY";

  return (
    <div className="nav">
      <div className="container" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:12}}>
        <Link href="/" style={{fontWeight:900, letterSpacing:0.3, fontSize:18}}>
          {brand}
        </Link>

        <div style={{display:"flex", alignItems:"center", gap:12, flexWrap:"wrap"}}>
          <Link href="/shop" className="badge">Shop</Link>
          <Link href="/about" className="badge">About</Link>
          <Link href="/contact" className="badge">Contact</Link>
          <Link href="/cart" className="badge">Cart • {count}</Link>
        </div>
      </div>
    </div>
  );
}


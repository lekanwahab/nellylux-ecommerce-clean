export default function About() {
  const brand = process.env.NEXT_PUBLIC_BRAND || "Nelly Lux";
  return (
    <div className="container">
      <div className="card" style={{ padding: 18 }}>
        <h1>About {brand}</h1>
        <p className="small">
          {brand} is built for women who want a natural, luxury look without stress.
          We focus on quality hair, clean packaging, and fast communication.
        </p>
      </div>
    </div>
  );
}


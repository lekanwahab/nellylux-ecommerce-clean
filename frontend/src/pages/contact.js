export default function Contact() {
  return (
    <div className="container">
      <div className="card" style={{ padding: 18 }}>
        <h1>Contact</h1>
        <p className="small">For orders and questions, send a message on WhatsApp.</p>
        <a className="btn btnPrimary" href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_PHONE}`} target="_blank" rel="noreferrer">
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}


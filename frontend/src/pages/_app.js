import "../styles/globals.css";
import Nav from "@/components/Nav";
import { ToastProvider } from "@/components/ToastProvider";

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <>
        <Nav />
        <Component {...pageProps} />

        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_PHONE}`}
          target="_blank"
          rel="noreferrer"
          style={{
            position: "fixed",
            right: 18,
            bottom: 18,
            padding: "12px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.16)",
            backdropFilter: "blur(10px)",
            fontWeight: 800,
            zIndex: 9999,
          }}
        >
          WhatsApp
        </a>
      </>
    </ToastProvider>
  );
}


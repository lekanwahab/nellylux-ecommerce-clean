import { createContext, useContext, useEffect, useRef, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const showToast = (message, type = "success", ms = 2400) => {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setToasts((t) => [...t, { id, message, type }]);

    const timer = setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
      timers.current.delete(id);
    }, ms);

    timers.current.set(id, timer);
  };

  const dismiss = (id) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  useEffect(() => {
    return () => {
      for (const t of timers.current.values()) clearTimeout(t);
      timers.current.clear();
    };
  }, []);

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}

      <div className="toastWrap" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <button
            key={t.id}
            className={`toast ${t.type}`}
            onClick={() => dismiss(t.id)}
            title="Dismiss"
          >
            <span className="toastDot" />
            <span style={{ flex: 1 }}>{t.message}</span>
            <span style={{ opacity: 0.7, fontWeight: 900 }}>×</span>
          </button>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}


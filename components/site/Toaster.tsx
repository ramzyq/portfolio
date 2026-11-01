"use client";

import { useEffect, useState } from "react";
import { TOAST_EVENT, type ToastDetail } from "@/lib/toast";

type Item = ToastDetail & { id: number };

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let seq = 0;
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      const id = ++seq;
      setItems((prev) => [...prev.slice(-2), { ...detail, id }]);
      window.setTimeout(
        () => setItems((prev) => prev.filter((item) => item.id !== id)),
        detail.tone === "flag" ? 5200 : 4200
      );
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div className="toaster" role="status" aria-live="polite" data-testid="toaster">
      {items.map((item) => (
        <div key={item.id} className="toast" data-tone={item.tone ?? "info"}>
          <span className="toast__icon" aria-hidden="true">
            {item.tone === "flag" ? "⚑" : item.tone === "error" ? "!" : ">"}
          </span>
          <div>
            <p className="toast__title">{item.title}</p>
            {item.body ? <p className="toast__body">{item.body}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

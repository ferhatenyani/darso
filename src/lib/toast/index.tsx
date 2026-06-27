"use client";

import * as React from "react";

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

type ToastVariant = "default" | "success" | "danger" | "warning";

type ToastInput = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastItem = ToastInput & { id: string };

type ToastContextValue = {
  show: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastHost({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = React.useCallback((toast: ToastInput) => {
    const id = `toast-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [...prev, { id, ...toast }]);
    return id;
  }, []);

  const value = React.useMemo<ToastContextValue>(() => ({ show, dismiss }), [show, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      <ToastProvider duration={5000} swipeDirection="right">
        {children}
        {items.map((item) => (
          <Toast
            key={item.id}
            variant={item.variant ?? "default"}
            duration={item.durationMs}
            onOpenChange={(open) => {
              if (!open) dismiss(item.id);
            }}
          >
            <div className="flex-1 space-y-1 pe-6">
              {item.title ? <ToastTitle>{item.title}</ToastTitle> : null}
              {item.description ? <ToastDescription>{item.description}</ToastDescription> : null}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastHost> (mounted in the locale root layout).");
  }
  return ctx;
}

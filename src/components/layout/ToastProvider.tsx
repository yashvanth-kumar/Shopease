"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 2800,
        style: {
          background: "#22252b",
          color: "#fff",
          fontSize: "14px",
          borderRadius: "10px",
          padding: "10px 16px",
        },
        success: { iconTheme: { primary: "#2e8f6d", secondary: "#fff" } },
        error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
      }}
    />
  );
}

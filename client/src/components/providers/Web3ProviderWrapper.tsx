"use client";

import { ReactNode, useEffect } from "react";
import Web3Provider from "./web3";

interface Web3ProviderWrapperProps {
  children: ReactNode;
}

export default function Web3ProviderWrapper({ children }: Web3ProviderWrapperProps) {
  useEffect(() => {
    // Handle unhandled promise rejections from external scripts (browser extensions, etc.)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Suppress errors from external scripts (browser extensions, checkout popups, etc.)
      if (
        event.reason?.message?.includes("checkout popup") ||
        event.reason?.message?.includes("No checkout popup config") ||
        event.reason?.stack?.includes("core.js")
      ) {
        event.preventDefault();
        // Silently ignore these external script errors
        return;
      }
      // Let other errors through
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return <Web3Provider>{children}</Web3Provider>;
}

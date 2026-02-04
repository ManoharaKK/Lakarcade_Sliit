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
      const error = event.reason;
      const errorMessage = error?.message || error?.toString() || String(error || "");
      const errorStack = error?.stack || "";
      
      // Normalize the error message for comparison
      const normalizedMessage = errorMessage.toLowerCase();
      
      // Suppress errors from external scripts (browser extensions, checkout popups, etc.)
      if (
        normalizedMessage.includes("checkout popup") ||
        normalizedMessage.includes("no checkout popup config") ||
        normalizedMessage.includes("checkout popup config") ||
        errorStack.includes("core.js") ||
        (normalizedMessage.includes("checkout") && normalizedMessage.includes("config")) ||
        (normalizedMessage.includes("checkout") && normalizedMessage.includes("popup"))
      ) {
        event.preventDefault();
        // Silently ignore these external script errors
        return;
      }
      // Let other errors through
    };

    // Also handle regular errors from external scripts
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || "";
      const errorSource = event.filename || "";
      
      if (
        errorMessage.includes("checkout popup") ||
        errorMessage.includes("No checkout popup config") ||
        errorMessage.includes("checkout popup config") ||
        errorSource.includes("core.js")
      ) {
        event.preventDefault();
        return false; // Suppress the error
      }
      return true; // Let other errors through
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return <Web3Provider>{children}</Web3Provider>;
}

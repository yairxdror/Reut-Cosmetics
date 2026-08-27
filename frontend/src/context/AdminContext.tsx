"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { isAdminLoggedIn, ADMIN_AUTH_EVENT } from "@/lib/adminAuth";

interface AdminContextValue {
  isAdmin: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    function checkAdmin() {
      const loggedIn = isAdminLoggedIn();
      setIsAdmin(loggedIn);
      // Edit mode only ever makes sense while logged in — losing admin
      // status (logout here, or in another tab) must never leave a stale
      // edit-mode UI active for what is now a plain visitor.
      if (!loggedIn) setIsEditMode(false);
    }
    checkAdmin();
    window.addEventListener(ADMIN_AUTH_EVENT, checkAdmin);
    window.addEventListener("storage", checkAdmin);
    return () => {
      window.removeEventListener(ADMIN_AUTH_EVENT, checkAdmin);
      window.removeEventListener("storage", checkAdmin);
    };
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  return <AdminContext.Provider value={{ isAdmin, isEditMode, toggleEditMode }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}

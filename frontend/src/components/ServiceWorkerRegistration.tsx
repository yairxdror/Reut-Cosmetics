"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Registering in dev would fight the Docker/webpack hot-reload setup —
    // a stale cached bundle is the last thing that workflow needs. Only the
    // real production build (GitHub Pages, or a future real server) gets one.
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const hadController = !!navigator.serviceWorker.controller;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

    navigator.serviceWorker
      .register(`${basePath}/sw.js`)
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            // Only reload for a genuine update (there was already a page
            // controlled by an older worker) — not on the very first
            // install, where there's nothing new to show yet.
            if (installing.state === "activated" && hadController) {
              window.location.reload();
            }
          });
        });
      })
      .catch(() => {
        // The site works fully without it — a failed registration is not
        // worth surfacing to the user.
      });
  }, []);

  return null;
}

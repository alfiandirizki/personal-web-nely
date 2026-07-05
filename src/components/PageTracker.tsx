"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PageTracker() {
  useEffect(() => {
    const supabase = createClient();
    supabase.from("page_views").insert({
      path: window.location.pathname,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent,
    });
  }, []);

  return null;
}

"use client";
import { useEffect, useState } from "react";

/** Returns the id of the section currently crossing the middle of the viewport. */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const updateActiveSection = () => {
      const marker = window.innerHeight * 0.45;
      const visible = ids
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)
        .filter((element) => element.getBoundingClientRect().top <= marker)
        .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top);

      if (visible[0]) {
        setActive(visible[0].id);
      } else {
        setActive(ids[0]);
      }
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [ids]);
  return active;
}

"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Slowly cycles through a few phrases. Static when the visitor prefers reduced motion. */
export function RotatingPhrase({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || phrases.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % phrases.length), 3200);
    return () => clearInterval(timer);
  }, [reduced, phrases.length]);

  return (
    <span key={index} className="phrase-in inline-block font-serif italic text-forest" aria-live="off">
      {phrases[index]}
    </span>
  );
}

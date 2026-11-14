"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Star } from "./Star";
import { cn } from "@/lib/utils";

/**
 * Scrapbook-style portrait: an arch-shaped cutout with a bold offset outline,
 * stars that drift toward the pointer (and spin when tapped), a handwritten note
 * that cycles through facts, and a little moon hiding a surprise.
 *
 * `depth` controls how far each star drifts. Position values are % of the container.
 */
const stars = [
  { top: "2%", left: "-4%", size: 44, color: "text-forest", rot: -12, depth: 14 },
  { top: "14%", left: "88%", size: 34, color: "text-rose", rot: 18, depth: -10 },
  { top: "46%", left: "-9%", size: 30, color: "text-moss", rot: 8, depth: 8 },
  { top: "62%", left: "92%", size: 48, color: "text-sage", rot: -20, depth: -16 },
  { top: "90%", left: "6%", size: 26, color: "text-rose", rot: 24, depth: 10 },
  { top: "-6%", left: "56%", size: 24, color: "text-moss", rot: -6, depth: -8 },
];

export function PortraitComposition() {
  const { portrait, curiosityNotes, easterEgg } = siteConfig;
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [noteIndex, setNoteIndex] = useState(0);
  const [spun, setSpun] = useState<number[]>([]);
  const [eggOpen, setEggOpen] = useState(false);

  // Pointer position (-1..1) is stored in CSS variables, so React doesn't re-render on every move.
  function onPointerMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== "mouse" || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    wrapRef.current.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    wrapRef.current.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  }
  function onPointerLeave() {
    wrapRef.current?.style.setProperty("--px", "0");
    wrapRef.current?.style.setProperty("--py", "0");
  }
  const toggleSpin = (i: number) =>
    setSpun((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  return (
    <div
      ref={wrapRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto w-full max-w-sm px-4 pb-10 pt-4 sm:max-w-md"
      style={{ "--px": 0, "--py": 0 } as React.CSSProperties}
    >
      {/* Cutout outline, slightly off-register like a hand-cut sticker */}
      <div aria-hidden="true" className="absolute inset-x-1 bottom-10 top-6 rotate-2 rounded-t-[50%] rounded-b-xl bg-moss" />
      <div
        aria-hidden="true"
        className="absolute inset-x-3 bottom-10 top-5 -rotate-1 rounded-t-[50%] rounded-b-xl border-4 border-forest"
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[50%] rounded-b-lg border-4 border-cream bg-sage shadow-[6px_8px_0_0_rgb(52_74_59/0.25)]">
        <Image
          src={portrait.src}
          alt={portrait.alt}
          fill
          priority
          sizes="(min-width: 640px) 28rem, 90vw"
          className="-translate-x-1 object-cover"
        />
      </div>

      {/* Stars: tap or click one to spin it */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => toggleSpin(i)}
            className={cn("absolute grid place-items-center p-0 transition-transform duration-500 ease-out", s.color)}
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              transform: `translate(calc(var(--px) * ${s.depth}px), calc(var(--py) * ${s.depth}px)) rotate(${s.rot + (spun.includes(i) ? 144 : 0)}deg)`,
            }}
          >
            <Star className="size-full" />
          </button>
        ))}
      </div>

      {/* Handwritten note: click for the next one */}
      <div className="absolute -left-1 bottom-0 z-10 w-[62%] -rotate-3 sm:-left-6">
        <span aria-hidden="true" className="tape absolute -top-3 left-1/2 block h-5 w-16 -translate-x-1/2 rotate-2" />
        <button
          type="button"
          onClick={() => setNoteIndex((i) => (i + 1) % curiosityNotes.length)}
          aria-label="Show another note about me"
          className="block w-full bg-cream px-4 pb-3 pt-4 text-left font-serif text-[0.95rem] italic leading-snug text-forest shadow-md transition-transform hover:rotate-1"
        >
          <span aria-live="polite">{curiosityNotes[noteIndex]}</span>
          <span className="mt-1 block text-xs not-italic text-moss">tap for another ↻</span>
        </button>
      </div>

      {/* Easter egg: the little moon */}
      <div className="absolute right-0 top-0 z-10">
        <button
          type="button"
          onClick={() => setEggOpen((v) => !v)}
          aria-expanded={eggOpen}
          aria-controls="moon-message"
          aria-label="A small moon. Click to see what it says"
          className="grid size-11 place-items-center rounded-full bg-midnight text-sage shadow-md transition-transform hover:rotate-12"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="currentColor">
            <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" />
          </svg>
        </button>
        {eggOpen && (
          <div
            id="moon-message"
            role="status"
            className="absolute right-0 top-12 w-60 rounded-md bg-midnight p-4 text-sage shadow-lg"
          >
            <p className="mb-2 font-serif text-base italic text-cream">{easterEgg.title}</p>
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{easterEgg.lines.join("\n")}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

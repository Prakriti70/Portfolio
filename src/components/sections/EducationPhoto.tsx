"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Expand, X } from "lucide-react";

export function EducationPhoto({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger photo: ${alt}`}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-md border border-moss/40 bg-sage text-left"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 640px) 36vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-forest/75 px-3 py-2 text-sm font-medium text-cream opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand aria-hidden="true" className="size-4" />
          Click to enlarge
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        aria-label={alt}
        className="m-auto max-h-[94dvh] w-[min(96vw,72rem)] overflow-hidden rounded-xl border-0 bg-cream p-3 text-ink shadow-2xl sm:p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="font-serif text-lg italic text-forest">{alt}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close enlarged photo"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-forest text-cream"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="relative h-[min(78dvh,52rem)] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="96vw"
            className="object-contain"
          />
        </div>
      </dialog>
    </>
  );
}

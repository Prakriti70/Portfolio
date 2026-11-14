/** The playful "Currently exploring…" label. Text comes from the site config. */
export function StatusChip({ text }: { text: string }) {
  return (
    <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-moss/60 bg-cream px-4 py-2 text-sm text-forest">
      <span aria-hidden="true" className="pulse-dot size-2.5 shrink-0 rounded-full bg-rose" />
      <span>
        Currently exploring: <strong className="font-semibold">{text}</strong>
      </span>
    </p>
  );
}

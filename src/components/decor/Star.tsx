/** A single five-pointed star. Colour comes from `currentColor`. */
export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} fill="currentColor">
      <path d="M32 4l7.4 17.6 19 1.5-14.5 12.4 4.5 18.5L32 44.2 15.6 54l4.5-18.5L5.6 23.1l19-1.5z" />
    </svg>
  );
}

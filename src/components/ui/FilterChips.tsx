import { cn } from "@/lib/utils";

interface Props<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

/** A row of toggle buttons used to filter projects and artwork. */
export function FilterChips<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option)}
            className={cn(
              "min-h-11 rounded-full border-2 px-4 text-sm font-medium transition-colors",
              selected
                ? "border-forest bg-forest text-cream"
                : "border-moss/60 bg-cream/60 text-forest hover:border-forest",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

import { cn } from "@/lib/utils";

interface Props {
  href: string;
  children: React.ReactNode;
  variant: "forest" | "sage";
  external?: boolean;
}

/** Two equal-weight call-to-action styles, so the technical and artistic paths feel balanced. */
export function LinkButton({ href, children, variant, external }: Props) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-forest px-6 text-base font-semibold transition-transform hover:-translate-y-0.5",
        variant === "forest" ? "bg-forest text-cream" : "bg-sage text-ink",
      )}
    >
      {children}
    </a>
  );
}

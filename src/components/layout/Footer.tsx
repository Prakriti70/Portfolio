import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-moss/40 bg-forest text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif italic">{siteConfig.footerLine}</p>
        <p>© {new Date().getFullYear()} {siteConfig.name}</p>
      </div>
    </footer>
  );
}

import { siteConfig } from "@/config/site";
import { isSafeHref } from "@/lib/utils";
import { ContactForm } from "@/components/contact/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ContactSection() {
  const links = [
    ...(siteConfig.email ? [{ label: "Email", href: `mailto:${siteConfig.email}`, text: siteConfig.email }] : []),
    ...siteConfig.socials.filter((s) => s.href && isSafeHref(s.href)).map((s) => ({ label: s.label, href: s.href, text: s.href.replace(/^https?:\/\/(www\.)?/, "") })),
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-moss/30 bg-cream/70">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
        <div>
          <SectionHeading id="contact-title" title="Let's talk" aside={siteConfig.contactClosing} />
          <ul className="flex flex-wrap items-center gap-3">
            {links.map((l) => (
              <li key={l.label} className={l.label === "Email" ? "basis-full" : undefined}>
                {l.label === "Email" ? (
                  <>
                    <span className="font-serif italic text-forest/80">{l.label}: </span>
                    <a href={l.href} className="inline-flex min-h-11 items-center break-all font-medium text-forest underline decoration-rose decoration-2 underline-offset-4">
                      {l.text}
                    </a>
                  </>
                ) : (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${l.label} profile`}
                    title={l.label}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-moss/40 text-forest transition-colors hover:bg-sage/40"
                  >
                    {l.label === "GitHub" ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
                        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.33-1.77-1.33-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.13 3.17.77.84 1.23 1.9 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
                      </svg>
                    ) : null}
                    {l.label === "LinkedIn" ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
                        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
                      </svg>
                    ) : null}
                    {l.label === "Instagram" ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
                      </svg>
                    ) : null}
                    {!["GitHub", "LinkedIn", "Instagram"].includes(l.label) ? (
                      <span aria-hidden="true" className="text-xs font-semibold">{l.label}</span>
                    ) : null}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

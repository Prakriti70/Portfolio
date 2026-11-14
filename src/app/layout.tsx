import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/dm-sans/wght.css";
import "./globals.css";
import { siteConfig } from "@/config/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.siteTitle,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.siteTitle,
    description: siteConfig.description,
    type: "website",
    siteName: siteConfig.name,
  },
  twitter: { card: "summary", title: siteConfig.siteTitle, description: siteConfig.description },
};

export const viewport: Viewport = { themeColor: "#F2EBDD", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

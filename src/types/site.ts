/** Shape of everything personal that lives in src/config/site.ts */
export interface SocialLink {
  label: string;
  /** Full URL. Leave empty to hide the link. */
  href: string;
}

export interface SiteConfig {
  name: string;
  /** Short monogram shown in the navbar, e.g. "YN" */
  monogram: string;
  siteTitle: string;
  description: string;
  tagline: string;
  intro: string;
  /** Phrases that rotate slowly in the hero. */
  rotatingPhrases: string[];
  /** Playful "Currently exploring…" indicator. */
  currentlyExploring: string;
  portrait: { src: string; alt: string };
  about: {
    heading: string;
    paragraphs: string[];
    facts: { label: string; value: string }[];
  };
  /** Click the handwritten note to cycle through these. */
  curiosityNotes: string[];
  /** Revealed when the little moon in the hero is clicked. */
  easterEgg: { title: string; lines: string[] };
  email: string;
  socials: SocialLink[];
  contactClosing: string;
  footerLine: string;
}

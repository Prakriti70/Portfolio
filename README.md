# My Portfolio

*A little bit of logic, a little bit of art, and a lot of curiosity.*

A single-page portfolio built with **Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase**. The left half of the hero is graph paper (engineering), the right half is watercolour (art), and the two get equal space in the rest of the site.

Without any setup the site runs with clearly-labelled sample content. Add Supabase and you get a private admin area for uploading, editing, reordering and deleting artwork.

## Quick start

Requires **Node.js 20.9+** (22 recommended).

```bash
unzip my-portfolio.zip
cd my-portfolio
npm install
cp .env.example .env.local     # optional at first, see "Configuration"
npm run dev                    # http://localhost:3000
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Unit tests (Vitest) |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run check` | Lint + typecheck + tests + build in one go |

## Where everything lives

```
src/
├── app/                 layout, page, /admin, /api/contact, globals.css (palette + textures)
├── components/
│   ├── layout/          Navbar, Footer
│   ├── sections/        Hero, AboutSection, ProjectSection, ArtSection, CurrentlyCurious, ContactSection
│   ├── projects/        ProjectCard
│   ├── artwork/         ArtGallery (masonry + filters), ArtworkCard, ArtworkLightbox
│   ├── contact/         ContactForm
│   ├── decor/           PortraitComposition (stars, note, moon), RotatingPhrase, StatusChip, Star
│   ├── admin/           AdminDashboard, LoginForm, UploadForm, ArtworkEditor, ArtworkFields
│   └── ui/              SectionHeading, FilterChips, LinkButton
├── config/site.ts       ✏️ ALL personal details
├── config/nav.ts        navigation entries
├── data/projects.ts     ✏️ your projects
├── data/curiosity.ts    ✏️ "Currently curious about"
├── data/sampleArtwork.ts  placeholder art shown until you upload real work
├── lib/                 supabase/ (client, reads, admin writes), validation/ (zod), image/ (resize), artwork.ts, utils.ts
├── hooks/               useActiveSection, useReducedMotion
└── types/               site, project, artwork
supabase/migrations/     database schema + security policies
tests/                   Vitest unit tests
```

**How data flows:** the page (a server component) reads artwork from Supabase with the public anon key and hands it to `ArtGallery`, which only displays it. The admin area runs in your browser with *your* login; the database decides whether each write is allowed. The page re-fetches at most once a minute, so a new upload appears within ~60 seconds.

## Editing your content

### Personal information
Open **`src/config/site.ts`**. Everything marked `[PLACEHOLDER]` is a stand-in: name, monogram, intro, about text and facts, the rotating phrases, the "Currently exploring" chip, the handwritten notes, the moon's secret message, email and social links (leave a link's `href` as `""` to hide it).

### Portrait
1. Put your photo in `public/images/`, e.g. `public/images/me.jpg` (portrait orientation, roughly 4:5, under ~500 KB works well).
2. In `src/config/site.ts` set `portrait: { src: "/images/me.jpg", alt: "…describe the photo…" }`.

### Projects
Edit **`src/data/projects.ts`**. Copy an entry, change the fields, and put the thumbnail in `public/images/projects/`. The `inspiration` field is the "Why I made this" text. `repoUrl` and `demoUrl` are optional: **leave them out until the link is real**, and they're hidden. Delete the `isSample: true` line on real projects so the "Sample project" badge disappears. Filter chips appear automatically from the `category` values.

### "Currently curious about"
Edit **`src/data/curiosity.ts`**.

### Colours and fonts
The palette is defined once at the top of `src/app/globals.css` under `@theme`.

## Art Journal: adding paintings

1. Go to **`/admin`** (e.g. `http://localhost:3000/admin`) and sign in.
2. Under *Add something new*: choose an image, fill in title, category, optional medium/date, a description in your voice, and an optional "idea behind it".
3. Press **Upload**. The image is resized in your browser (full copy ≤ 2000px, grid thumbnail ≤ 800px), uploaded with a progress bar, and the entry is saved.
4. For poems or short writing choose the **Writing** category: a text box appears and the image becomes optional.
5. Below the form you can **reorder** (up/down), **edit** and **delete** entries. New uploads go to the top.

No code changes are ever needed to add art. Until you upload your first piece the gallery shows labelled sample images.

## Supabase setup (needed for the admin area)

Full steps are in [`supabase/README.md`](supabase/README.md). In short:

1. Create a project at supabase.com.
2. Run `supabase/migrations/0001_art_journal.sql` in the SQL Editor (creates the `artworks` and `admins` tables, the public `artwork` storage bucket, and all row-level-security / storage policies).
3. Authentication → Users → *Add user* (your email + password, auto-confirm). Turn off public sign-ups.
4. Make yourself admin: `insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';`
5. Put the Project URL and anon key in `.env.local`, then restart `npm run dev`.

**Security model:** the browser only ever has the *anon* key. Anyone can read artwork; only users listed in `admins` can insert/update/delete rows or write to the bucket (enforced by Postgres policies, not by the UI). The bucket also enforces 5 MB and JPEG/PNG/WebP limits server-side. The service-role key is never used.

## Contact form

The form posts to `/api/contact`, which validates on the server (zod), rejects honeypot/too-fast submissions, rate-limits per IP (5/hour, in-memory) and sends mail through [Resend](https://resend.com).
Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` in `.env.local`. **Without them the form does not pretend to send**: it tells the visitor and offers a `mailto:` link instead.

## Environment variables

| Variable | Required? | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | For admin + live gallery | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For admin + live gallery | Public anon key (safe in browser because of RLS) |
| `RESEND_API_KEY` | For contact form | Resend API key (server only) |
| `CONTACT_TO_EMAIL` | For contact form | Your inbox |
| `CONTACT_FROM_EMAIL` | For contact form | Verified sender (`onboarding@resend.dev` for testing) |
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Used for social-sharing metadata |

## Deploying (Vercel)

1. Push the project to GitHub (`.env.local` is git-ignored).
2. Import the repo at vercel.com → framework is detected automatically.
3. Add the environment variables above under Settings → Environment Variables, then deploy.
4. Set `NEXT_PUBLIC_SITE_URL` to your final URL. Any Node host that runs `npm run build && npm start` also works.

## Accessibility & motion

Skip link, visible focus rings, labelled forms with `aria-describedby` errors, native `<dialog>` lightbox (focus trap, Esc, focus restore, arrow keys), 44px+ touch targets, `aria-pressed` filters. Every animation is disabled under `prefers-reduced-motion`. Nothing important is hover-only (stars spin on tap, the "why I made this" panel is a button, the note and moon are buttons).

## Testing checklist

**Automated:** `npm run check`.

**Manual, public site** (test at ~360px, ~768px, ~1280px and ≥1920px wide):
- [ ] No horizontal scrolling; hero stacks cleanly on phones
- [ ] Nav: links jump to sections, squiggle follows scroll, mobile menu opens/closes (button, link tap, Esc)
- [ ] Both hero buttons work and look equally weighted
- [ ] Handwritten note cycles; moon opens/closes; stars spin on tap; rotating phrase changes (and stops with reduced motion on)
- [ ] Project "Why I made this" toggles; filter chips work; no dead links
- [ ] Art filters, empty-state message (pick a category with no work), lightbox opens, ←/→/Esc/X/backdrop work, focus returns to the card
- [ ] Contact: validation messages, fallback message when no email service, success when configured

**Manual, admin (needs Supabase):**
- [ ] Wrong password shows an error; a signed-in non-admin sees "not an admin"
- [ ] Upload image → progress bar → entry appears in the list → appears on the public site within a minute
- [ ] Upload a GIF / >20 MB file → rejected with a clear message
- [ ] Edit, reorder, delete (image files are removed too); logged-out requests to the API are refused

## Notes on design choices
- **Two typefaces only:** Fraunces (headings, handwritten-style notes) and DM Sans (everything else), self-hosted through `@fontsource-variable`, so there are no calls to Google at runtime.
- **Plain `<img>` in the gallery** (with width/height to prevent layout shift and lazy loading) because uploads are already resized in the browser; local images use `next/image`.
- **No middleware:** admin protection is enforced by the database policies, so it can't be bypassed by skipping a page check.
- **Gallery order uses CSS columns**, so items flow down each column rather than across rows: the usual Pinterest behaviour.

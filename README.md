# My Portfolio

*A little bit of logic, a little bit of art, and a lot of curiosity.*

A single-page portfolio built with **Next.js 16 · TypeScript · Tailwind CSS 4 · Supabase**. The hero brings together two sides: graph paper representing engineering and watercolour representing art. Both themes carry equal weight throughout the rest of the site.

The project runs with clearly labelled sample content even without external configuration.

## Quick Start

Requires **Node.js 20.9+** (22 recommended).

```bash
unzip my-portfolio.zip
cd my-portfolio
npm install
cp .env.example .env.local
npm run dev
```

The development server starts at `http://localhost:3000`.

Other available commands:

| Command             | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `npm run lint`      | Runs ESLint                                                  |
| `npm run typecheck` | Runs TypeScript type checking without emitting files         |
| `npm test`          | Runs unit tests with Vitest                                  |
| `npm run build`     | Creates the production build                                 |
| `npm start`         | Serves the production build                                  |
| `npm run check`     | Runs linting, type checking, tests, and the production build |

## Project Structure

```text
src/
├── app/                   layout, page, /admin, /api/contact, globals.css
├── components/
│   ├── layout/            Navbar, Footer
│   ├── sections/          Hero, AboutSection, ProjectSection,
│   │                      ArtSection, CurrentlyCurious, ContactSection
│   ├── projects/          ProjectCard
│   ├── artwork/           ArtGallery, ArtworkCard, ArtworkLightbox
│   ├── contact/           ContactForm
│   ├── decor/             PortraitComposition, RotatingPhrase,
│   │                      StatusChip, Star
│   ├── admin/             AdminDashboard, LoginForm, UploadForm,
│   │                      ArtworkEditor, ArtworkFields
│   └── ui/                SectionHeading, FilterChips, LinkButton
├── config/
│   ├── site.ts            Personal details and site configuration
│   └── nav.ts             Navigation entries
├── data/
│   ├── projects.ts        Project data
│   ├── curiosity.ts       Currently curious about
│   └── sampleArtwork.ts   Placeholder artwork
├── lib/                   Supabase, validation, image processing,
│                          artwork utilities
├── hooks/                 useActiveSection, useReducedMotion
└── types/                 site, project, artwork
supabase/
└── migrations/            Database schema and security policies
tests/                     Vitest unit tests
```

### Data Flow

The main page is a server component that retrieves artwork from Supabase using the public anon key and passes it to `ArtGallery` for display.

The admin area runs in the browser using an authenticated user session. Database and storage policies determine whether a write operation is permitted.

The public page re-fetches artwork at most once per minute, so newly uploaded work can appear within approximately 60 seconds.

## Content Management

### Personal Information

Personal details and site-specific content are stored in `src/config/site.ts`.

This includes the name, monogram, introduction, about text, facts, rotating phrases, currently exploring chip, handwritten notes, moon's secret message, email address, and social links.

Placeholder values are marked with `[PLACEHOLDER]`. Social links can be hidden by leaving their `href` as an empty string.

### Portrait

The portrait image is stored in `public/images/`.

For example:

```text
public/images/me.jpg
```

A portrait-oriented image with an approximately 4:5 aspect ratio and a file size under 500 KB is recommended.

The portrait configuration is defined in `src/config/site.ts`:

```ts
portrait: {
  src: "/images/me.jpg",
  alt: "Description of the portrait"
}
```

### Projects

Project entries are stored in `src/data/projects.ts`.

Each project can include a thumbnail stored in `public/images/projects/`.

The `inspiration` field contains the "Why I made this" description.

`repoUrl` and `demoUrl` are optional and are displayed only when valid links are provided.

Projects marked with `isSample: true` display a "Sample project" badge. Removing this property from actual projects removes the badge.

Filter chips are generated automatically from the `category` values.

### Currently Curious About

The content displayed in the "Currently curious about" section is stored in `src/data/curiosity.ts`.

### Colours and Fonts

The site's colour palette is defined in `src/app/globals.css` under `@theme`.

## Art Journal

The Art Journal provides an admin interface for managing paintings, illustrations, and written work.

It is accessible at `/admin` and requires an authorised account.

### Adding Artwork

1. Sign in to the admin dashboard.
2. Under *Add something new*, select an image and provide a title, category, optional medium and date, description, and optional "idea behind it".
3. Press **Upload**. Images are resized in the browser before upload:
   - Full-size image: maximum 2000px
   - Grid thumbnail: maximum 800px
4. A progress bar displays the upload status.
5. For poems or short writing, select the **Writing** category. A text box appears and an image becomes optional.

Existing entries can be reordered, edited, or deleted from the admin dashboard. New uploads appear at the top of the gallery.

The gallery displays labelled sample images until actual artwork is uploaded.

## Supabase Setup

Supabase powers the live artwork gallery and admin functionality.

Detailed setup instructions are available in [`supabase/README.md`](supabase/README.md).

### Initial Setup

1. Create a project at [Supabase](https://supabase.com).
2. Run `supabase/migrations/0001_art_journal.sql` in the SQL Editor. This creates the `artworks` and `admins` tables, the public `artwork` storage bucket, and the required row-level security and storage policies.
3. Under **Authentication → Users → Add user**, create an account for the portfolio owner using an email and password. Enable auto-confirmation and keep public sign-ups disabled.
4. Assign admin privileges by adding the account to the `admins` table:

```sql
insert into public.admins (user_id)
select id
from auth.users
where email = 'admin@example.com';
```

5. Add the Supabase project URL and anon key to `.env.local`.
6. Restart the development server.

### Single-Admin Access Model

The portfolio has a single administrator: its owner.

- Public registration is disabled.
- Admin privileges are assigned manually through the `admins` table.
- Only the authorised owner account can access the admin functionality.
- Visitors can browse the artwork gallery without logging in.
- Visitors cannot upload, edit, reorder, or delete artwork.

### Security Model

The browser only has access to the **anon key**.

Public users can read artwork, while authenticated users listed in the `admins` table can insert, update, or delete artwork and write to the storage bucket.

These permissions are enforced through PostgreSQL Row Level Security (RLS) and Supabase storage policies rather than relying on UI-level restrictions.

The storage bucket also enforces a 5 MB file-size limit and JPEG, PNG, and WebP format restrictions.

The Supabase service-role key is never exposed to the browser or used by the application.

## Contact Form

The contact form submits to `/api/contact`.

The server validates submissions using Zod, rejects honeypot and suspiciously fast submissions, applies an in-memory rate limit of 5 requests per hour per IP, and sends emails through [Resend](https://resend.com).

The following environment variables are required for email delivery:

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=
```

Without these variables, the form displays a fallback message and provides a `mailto:` link instead of indicating that a message was successfully sent.

## Environment Variables

| Variable                        | Required For           | Purpose                           |
| ------------------------------- | ---------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Admin and live gallery | Supabase project URL              |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Admin and live gallery | Public anon key, protected by RLS |
| `RESEND_API_KEY`                | Contact form           | Resend API key (server only)      |
| `CONTACT_TO_EMAIL`              | Contact form           | Inbox that receives messages      |
| `CONTACT_FROM_EMAIL`            | Contact form           | Verified sender address           |
| `NEXT_PUBLIC_SITE_URL`          | Recommended            | Used for social-sharing metadata  |

## Accessibility and Motion

The site incorporates several accessibility considerations:

- Skip navigation link
- Visible focus indicators
- Labelled forms with `aria-describedby` error messages
- Native `<dialog>` lightbox with focus trapping, Escape handling, focus restoration, and arrow-key navigation
- Touch targets of at least 44px
- `aria-pressed` filter controls
- Support for `prefers-reduced-motion`

Animations are disabled when reduced motion is requested.

Important interactions are not hover-dependent. Stars respond to taps, the "Why I made this" panel is a button, and the handwritten note and moon are interactive buttons.

## Testing

### Automated Tests

Run the complete test suite and production checks using:

```bash
npm run check
```

### Manual Testing — Public Site

The interface is tested across approximately 360px, 768px, 1280px, and 1920px+ screen widths.

- [ ] No horizontal scrolling; hero stacks correctly on mobile
- [ ] Navigation links jump to the correct sections
- [ ] Scroll indicator follows the active section
- [ ] Mobile menu opens and closes through button, link tap, and Escape
- [ ] Both hero buttons work and have equal visual weight
- [ ] Handwritten note cycles correctly
- [ ] Moon opens and closes
- [ ] Stars respond to taps
- [ ] Rotating phrase changes and respects reduced motion
- [ ] Project "Why I made this" panel toggles
- [ ] Project filters work
- [ ] No dead links
- [ ] Art filters work
- [ ] Empty-state message appears for categories without artwork
- [ ] Lightbox opens and closes correctly
- [ ] Lightbox arrow keys, Escape, X, and backdrop controls work
- [ ] Focus returns to the artwork card after closing the lightbox
- [ ] Contact form validation works
- [ ] Fallback message appears when email service is not configured
- [ ] Successful submission works when email service is configured

### Manual Testing — Admin

Requires a configured Supabase project.

- [ ] Incorrect password displays an error
- [ ] Signed-in non-admin users receive an access-denied message
- [ ] Image upload displays a progress bar and creates an entry
- [ ] Uploaded artwork appears on the public site within approximately one minute
- [ ] GIF and files larger than 20 MB are rejected with a clear message
- [ ] Artwork can be edited, reordered, and deleted
- [ ] Associated image files are removed when artwork is deleted
- [ ] Logged-out requests to protected API routes are refused

## Design Decisions

- **Two typefaces:** Fraunces is used for headings and handwritten-style notes, while DM Sans is used throughout the rest of the interface. Both are self-hosted through `@fontsource-variable`, avoiding runtime requests to Google Fonts.
- **Gallery images:** Plain `<img>` elements are used for gallery images with explicit width and height to prevent layout shifts and lazy loading. Uploaded images are already resized in the browser, while local images use `next/image`.
- **No middleware:** Admin permissions are enforced through database policies rather than relying solely on page-level protection.
- **CSS-column gallery:** The gallery uses CSS columns so artwork flows vertically within each column, creating a Pinterest-style masonry layout.

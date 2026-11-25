# My Portfolio

*A little bit of logic, a little bit of art, and a lot of curiosity.*

A personal portfolio built with **Next.js, TypeScript, Tailwind CSS, and Supabase**.

The site brings together my work in computer engineering, programming, and art in a single-page portfolio.

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Supabase
- Vitest
- Resend

## Features

- Personal introduction and about section
- Project showcase with GitHub and demo links
- Art Journal with painting and writing categories
- Artwork filtering and lightbox
- Contact form
- Responsive design
- Reduced-motion support
- Admin dashboard for managing artwork

## Projects

### Heliotropic Sunflower
A C++ OpenGL project that simulates the movement and lighting of a sunflower throughout the day.

### ForestGuard AI
A wildlife monitoring project built during the eSewa x WWF Hackathon, using AI to help detect wildlife and identify potential threats.

### Pulchowk Smart Campus Navigation System
A Python-based campus navigation system using graph algorithms including BFS, DFS, and Dijkstra's algorithm.

## Art Journal

The Art Journal is a collection of my paintings and other creative work.

Artwork can be added and managed through the admin dashboard. Local artwork is also included in the project, so the gallery can work without Supabase being configured.

## Contact

The portfolio includes a contact form powered by **Resend**.

## Getting Started

Requires **Node.js 20.9+**.

```bash
npm install
npm run dev
```

The development server will start at:

```text
http://localhost:3000
```

## Other Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
npm run check
```

## Environment Variables

Create a `.env.local` file for the services that need configuration.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=

NEXT_PUBLIC_SITE_URL=
```

The portfolio can still display the local artwork without Supabase configuration.

## Project Structure

```text
src/
├── app/
├── components/
├── config/
├── data/
├── hooks/
├── lib/
└── types/

public/
├── images/
└── ...

supabase/
└── migrations/

tests/
```

## About

This portfolio is a work in progress and will change as I learn, build, paint, and experiment with new ideas.
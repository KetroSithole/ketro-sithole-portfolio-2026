# ketro-sithole-portfolio

An interactive portfolio for **Ketro Sithole, Senior Data Engineer** in Cape Town, South Africa. It covers four years of data platforms, pipelines and analytics work across banking (FNB, Nedbank, SBV), retail (Superbalist, Takealot), academia and a UK BPO.

The site is built with **Angular 19**: standalone components, signals and OnPush change detection. It has no UI libraries and no backend, and the first load is about 77 kB gzipped.

---

## Quick start

**Requirements:** Node.js 20 LTS or newer ([download](https://nodejs.org)).

```bash
npm install        # install dependencies (first time only)
npm start          # dev server with live reload → http://localhost:4200
npm run build      # production build → dist/ketro-sithole-portfolio/browser
```

| Script | What it does |
| --- | --- |
| `npm start` | Runs `ng serve --open` with hot reload and opens the browser |
| `npm run build` | Builds an optimised, hashed production bundle |
| `npm run watch` | Rebuilds the dev bundle whenever a file changes |

---

## Editing content

All text on the site comes from **one file**: [`src/app/data/profileData.ts`](src/app/data/profileData.ts). The only exceptions are the marquee words, the skills orbit and the hero code card, which are listed below.

| Export | Controls |
| --- | --- |
| `PROFILE` | Name, title, rotating hero roles, location, email, social links, bio and stats |
| `EXPERIENCE` | The timeline: period, role, company, summary, highlights and tech tags |
| `CASE_STUDIES` | Work tiles and their case-study panels (challenge, approach, outcome, stack, tile colour and size) |
| `SKILLS` | Toolkit tabs and skill chips |
| `ACHIEVEMENTS` | Award cards, front and back |
| `EDUCATION` | Degrees and certifications |

> Tags are matched across sections by name. The "where I've used it" panel finds a skill in the experience and case-study tags when the names are spelled the same. Case, spaces and punctuation don't matter.

The decorative word lists live in:

- `ROW_A` / `ROW_B` in [`marqueeComponent.ts`](src/app/components/sections/marqueeComponent.ts)
- `ORBITS` in [`skillsComponent.ts`](src/app/components/sections/skillsComponent.ts)
- `CODE` (the hero code card) in [`heroComponent.ts`](src/app/components/sections/heroComponent.ts)

**Before publishing:** replace the placeholder GitHub, LinkedIn and YouTube URLs in `PROFILE.links`.

---

## Features

### Interactions

- **Hero:** a canvas background of connected particles. They move away from the cursor, and clicking empty space sends a shockwave through them.
- **Name and roles:** the name drops in letter by letter, and a line types out a rotating list of roles.
- **Marquee:** speeds up when you scroll, changes direction when you scroll up and slows down on hover. Each tech word opens that skill in the Toolkit.
- **About:** stat cards count up when they come into view, and clicking one replays the count with a ripple.
- **Experience:** a timeline whose line glows in as you scroll. Each role expands on click, and its tech tags link to the Toolkit.
- **Work:** a grid of case-study tiles that tilt in 3D. Clicking a tile opens a slide-in case study with ←/→ navigation and Esc to close.
- **Toolkit:** orbiting skills plus tabbed chips. Selecting a skill shows the jobs and case studies where it was used, and the centre button picks a random one.
- **Awards:** cards flip in 3D to show the story behind each award.
- **Contact:** a button that copies your email, magnetic buttons and a live Cape Town clock.

### Navigation and polish

- **Command palette:** press `Ctrl/⌘ + K` to search sections, switch theme, copy your email or open your links. It works fully from the keyboard.
- **Theme:** light and dark modes. The choice is remembered, and the default follows the visitor's system setting.
- **Cursor:** a custom cursor that grows over links and buttons and shows labels like "open" or "flip".
- **Layout:** a loading screen, scroll progress bar, background glows, film grain and a navigation bar that hides as you scroll down.
- **Mobile:** a full-screen menu that opens with a circular reveal.
- **Easter egg:** `↑ ↑ ↓ ↓ ← → ← → B A`

### Accessibility and performance

- **Reduced motion:** honours `prefers-reduced-motion`, which turns off the canvas loop, marquee, reveals and count-ups.
- **Keyboard and screen readers:** visible focus outlines, ARIA roles on dialogs, tabs and the command palette, and keyboard support for every interaction.
- **Performance:** animation loops run outside Angular's change detection, and the canvas stops drawing when it's off-screen.
- **Touch devices:** the custom cursor and tilt effects switch off on touch screens.

---

## Project structure

```text
ketro-sithole-portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── index.html                      # <head>, fonts, meta tags
│   ├── main.ts                         # bootstraps AppComponent
│   ├── styles.css                      # design tokens, themes, global utilities
│   └── app/
│       ├── appComponent.ts             # root: preloader, scroll bar, ambient layers, easter egg
│       ├── core/
│       │   └── uiService.ts            # shared signals: theme, palette, toast, selected skill
│       ├── data/
│       │   └── profileData.ts          # ★ all site content lives here
│       ├── directives/
│       │   ├── countUpDirective.ts     # [countTo]  animated number counter
│       │   ├── magneticDirective.ts    # [magnetic] cursor-attracted elements
│       │   ├── revealDirective.ts      # [reveal]   fade/blur-in on scroll
│       │   └── tiltDirective.ts        # [tilt]     3D pointer tilt + glare
│       └── components/
│           ├── layout/
│           │   ├── commandPaletteComponent.ts
│           │   ├── cursorComponent.ts
│           │   └── navComponent.ts
│           └── sections/               # page sections, top to bottom
│               ├── heroComponent.ts
│               ├── marqueeComponent.ts
│               ├── aboutComponent.ts
│               ├── experienceComponent.ts
│               ├── workComponent.ts
│               ├── skillsComponent.ts
│               ├── achievementsComponent.ts
│               └── contactComponent.ts
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

### Conventions

- **File names:** camelCase, named after the class inside (`heroComponent.ts` → `HeroComponent`).
- **Components:** single-file, with the template and styles inline, standalone and `OnPush`.
- **State:** Angular signals only, shared through `UiService`, with no RxJS stores.
- **Styling:** colours, fonts and easing are CSS custom properties defined in `styles.css`. A component's styles only use those tokens, so themes switch automatically.

---

## Theming

All colours are defined in [`src/styles.css`](src/styles.css):

```css
:root                     { --accent: #7c5cff; --accent-2: #00e0c6; --accent-3: #ff4d8d; ... }  /* dark */
:root[data-theme='light'] { --accent: #5b3df5; --accent-2: #00a892; --accent-3: #e8336f; ... }  /* light */
```

Change `--accent`, `--accent-2` and `--accent-3` to restyle the whole site, including the gradients, glows, particle colour and cursor.

---

## Deployment

`npm run build` writes a static site to `dist/ketro-sithole-portfolio/browser/`, which you can host on any static host:

| Host | Setup |
| --- | --- |
| **Netlify / Vercel** | Build command `npm run build`, publish directory `dist/ketro-sithole-portfolio/browser` |
| **GitHub Pages** | `npx ng build --base-href /ketro-sithole-portfolio/`, then publish the `browser` folder |
| **Firebase / Azure Static Web Apps** | Point the app location at `dist/ketro-sithole-portfolio/browser` |

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Angular 19.2: standalone components, signals, new control flow (`@if` / `@for`) |
| Build | `@angular/build` (esbuild + Vite dev server) |
| Language | TypeScript 5.7, strict mode with strict templates |
| Styling | Plain CSS with custom properties, `color-mix()`, container-free responsive grid |
| Graphics | Canvas 2D (hero), CSS 3D transforms (tilt, flip, orbit) |
| Fonts | Syne (display), Space Grotesk (body), JetBrains Mono (code), via Google Fonts |

---

## Contact

**Ketro Sithole**, Senior Data Engineer, Cape Town
✉ [Sithole.tk@tuks.co.za](mailto:Sithole.tk@tuks.co.za)

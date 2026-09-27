# Girling Jones: homepage redesign (private prospect demo)

A one-page rebuild of [girlingjones.com](https://girlingjones.com/). It uses Girling Jones's own logo, brand film, photography and copy, and restages them on the layout and motion of the reference site [jdavisgc.com](https://jdavisgc.com/). **Scope: homepage only.** Every other link opens the real page on girlingjones.com.

Stack: Next.js 16 (App Router, TypeScript), GSAP + ScrollTrigger + CustomEase, and Lenis. No UI kit, no CSS framework and no other animation library. Plain CSS lives in `app/globals.css` and `styles/*.css`.

```bash
npm install
npm run dev        # http://127.0.0.1:3024
npm run build      # static export of the single route
npm run typecheck
npm run scrape     # refresh content/home.json from the live site
npm run media      # re-download photography and re-encode the hero film (needs ffmpeg)
npm run logo       # re-split the live Logo.svg into lib/logo.ts + public/brand/*.svg
```

## Routes

| Route | What |
|---|---|
| `/` | The homepage. Statically generated. |
| `/icon.svg` | Favicon: the white "gj" monogram on an ink tile. |

`next build` generates 4 static pages; the route table lists `/`, `/_not-found` and `/icon.svg`. There are no archive or detail pages, because the brief was "just Homepage, no other page".

## Recon (Phase 1)

**Sitemaps** (`sitemap_index.xml`, Yoast):

| Type | Count | Used here |
|---|---|---|
| Pages | 18 | Linked out (nav, footer, sector links) |
| Posts (GJ News, 2015–2019) | 115 | Not on the live homepage, so not used |
| Jobs (`wpbb_job`) | 60 | All 60 scraped. The newest 6 are shown and the count is live |
| Job categories / types | 4 / 2 | Shown on each job card |

**Access:** the site returns `403` to non-browser user agents, so every script sends a desktop Chrome UA. The WP REST API does not expose jobs. Instead `/job-search/?job-length=200` returns all 60 in one page, each with `JobPosting` JSON-LD (the date comes from there).

**Brand:**
- **Logo:** vector `wp-content/uploads/2021/11/Logo.svg`, 16 paths: the "gj" monogram, 12 wordmark letters, 2 hairlines and the tagline. The monogram is a single merged outline, so the g and j cannot be separated.
- **Favicon:** `gj_fav.png`. It is rebuilt here as SVG from the monogram.
- **Brand film:** `2026/01/Girling-Jones_exeter.mp4` (19s, 1920×1080, 50 MB). It shows a drive up to the Exeter office and Simon on a red telephone.
- **Second film:** `GJ_no_idiots.mp4`, a lime end card that reads "No egos, no idiots." It is used as copy (the marquee), not as video.

**Fonts:** `futura-pt` / `futura-pt-bold` from Adobe Fonts (Typekit). That licence cannot be self-hosted, so **Jost** (OFL) stands in. Jost is the closest open geometric match: single-storey a, round o, pointed caps. It is self-hosted as a variable font from `@fontsource-variable/jost`.

**Structure:**
- **Header:** Home · Jobs · Tools · About Us · Contact Us, plus a hamburger popup containing a job search, the 2 newest jobs, the links and contact details.
- **Footer:** Browse / Cool stuff / Legal columns.
- **Socials:** LinkedIn, X, Facebook.
- **Contact:** 01392 493 347, info@girlingjones.com, Exeter.

## Decisions (brief brackets left open)

| Bracket | Decision |
|---|---|
| [PALETTE] | **Ink `#221f20`** (live footer and text), **Lime `#98d639`** (live accent: the hero flip text, the green words in headings, the film end card), **Paper `#f9f8f4`** (live CV and testimonial ground), **White**. No other hue anywhere. Tints are ink or white at lower alpha. The logo's own letters are `#80ba27`; they are drawn in the palette lime so only one green exists. |
| Look / motion reference | Only one reference was given (jdavisgc.com), so it decides both. |
| Copied interaction | Not named. jdavisgc.com's **`.the-button` pill** was chosen, plus its **`.red-swipe`** highlight (see below). |
| UI/body [x], display [y] | Both Jost (the Futura PT stand-in). Display role = Jost 700 in capitals, as the live site sets futura-pt-bold. |
| [ONCE?] | The preloader plays on every homepage visit. |
| Photography | Every still and the film are shown in **monochrome**. Otherwise the film's red telephone and the blue Plymouth sea would add hues. |
| Live CV form | Gravity Forms with a file upload and reCAPTCHA can't post from a demo. The "Submit your CV" button opens the live registration form instead of imitating a dead form. |
| "Make Contact" | The live button has `href=""`. Here it links to the live contact page. |
| CV template | The live link points at a staging host. The same file on the live uploads path is used instead (verified 200). |
| Header CTA | "Submit your CV" (anchor to `#cv`), in the reference's "Build with Us" slot. |

## Page structure

The section order follows the live homepage, restaged on the jdavisgc.com rhythm:

| # | Section | Live content | Reference pattern |
|---|---|---|---|
| 1 | Hero | Brand film, "Recruitment for [5 rotating sectors]", "BEST TO WORK WITH", job search (submits to live `/job-search/`) | Full-height dark hero, left-aligned 96px+ headline, pill CTA |
| 2 | Who are we? | Closing line as heading, intro, 3 markets, "Make Contact" | "Who we are": eyebrow, swiped phrase, copy + photo |
| 3 | Marquee | "No egos · No idiots · Best to work with" (film end card + strapline) | "Innovation · Safety · Ethics": 120px pale type, 35s loop |
| 4 | Sectors | "Want a job in construction? You've hit the spot." + 3 sectors → live sector pages | "Our sectors": 48px outline pills with arrows, photo pills |
| 5 | Latest jobs | "60 Jobs Found", heading, body, "View All jobs" + 6 newest jobs → live job pages | "Featured Projects": sticky stacked articles, top rule, tag, arrow ring |
| 6 | Tools | "Cool stuff": Salary Intelligence, Worth The Drive?, PAYE Calculator | Services: accordion + picture |
| 7 | Reviews | "Don't take our word for it?", 19 Google reviews, 5/5 | Sticky 100vh stage with a circle that grows on scroll |
| 8 | CV | "Submit your CV", "Need More Help?", Contact us, Download template | — (live section, restyled) |
| 9 | CTA | "Why not give us a tinkle?", "Contact us for a no-obligation chat." | "Ready to break ground?": 814px photo band |

## Content counts (scraped vs source)

| Item | Scraped | Source | Note |
|---|---|---|---|
| Jobs | 60 | 60 (`job-sitemap.xml`, "60 Jobs Found") | Newest 6 shown on the page. All 60 are in `content/home.json` |
| Google reviews | 19 | 21 slides | The live slider repeats Tim Dix and Andrew Murphy at the end. Duplicates are dropped |
| Sectors | 3 | 3 | |
| Rotating hero sectors | 5 | 5 | From the live `data-items` |
| Tools | 3 | 3 | Screenshots are already ink and green, so they stay in colour |

`content/home.json` is written by `scripts/scrape.mjs`. Components read it only through `lib/content.ts`, and site structure lives in `lib/site.ts`.

## Systems

### Preloader (`components/Preloader.tsx`)
The company signs its name using the logo's own vector paths (`lib/logo.ts`). The "gj" monogram is one merged outline, so it cannot be built from tiles. Instead **its outline is drawn as a lime stroke (`stroke-dashoffset`) and then flooded white**, like a signature being inked. The build then runs:

1. The 12 wordmark letters rise one after another.
2. The two hairlines draw outwards from the descenders.
3. The tagline clip-wipes open.

All of this runs on **one GSAP timeline**:

| Stage | Time | What happens |
|---|---|---|
| Build | 0.10–0.95s | Stroke draw, fill, letters, rules, tagline |
| Hold | to 1.20s | |
| Exit | 1.20–1.75s | The lock-up travels and shrinks into the header logo while the ink ground fades onto the film |

- **Handover:** at 1.35s, `is-loading` is removed from `<html>`, `data-intro="done"` is set and `intro:done` is dispatched. The hero entrance starts on that event (headline lines rise out of masks, film settles from 1.08 scale, search and header fade in).
- **Colour:** the loader ground is ink, which is the hero's opening scene (the film sits under an ink shade), so there is no jump.
- **Scroll lock:** Lenis is stopped until handover.
- **No flash:** `app/layout.tsx` sets `js is-loading is-landing` in the head before first paint, so neither the page nor the hero can show early.
- **Safety nets:**
  - A 2.3s JS failsafe.
  - A 4s CSS failsafe that releases the loader, hero and header logo even if JS never runs.
  - Hidden under `<noscript>`.
  - Skipped instantly with reduced motion.
  - `aria-hidden`.
  - Everything is cleaned up in the effect.
- **Measured** (production build, headless Chrome 1440×900): first paint 108ms (ink ground), `intro:done` at 1.49s after navigation, fully handed over by ~1.9s, and `lenis-stopped` held until `intro:done`.

### Smooth scroll (`components/motion.tsx`, `lib/scroll.ts`)
Lenis runs site-wide on the GSAP ticker (`lagSmoothing(0)`) and feeds `ScrollTrigger.update`. jdavisgc.com scrolls natively, so there is no value to copy. A lerp of `0.1` stays close to native with a light glide. In-page anchors (`#who`, `#cv`, `#top`) go through `lenis.scrollTo`. The menu and preloader stop Lenis.

### Reveal moves (`components/motion.tsx`)
One fixed set, played once, on one ease-out curve, shortened to 75% inside `[data-late]` sections (reviews, CV, CTA, footer):

| Move | Applies to | Motion | Duration |
|---|---|---|---|
| `label` | Eyebrows, buttons, count pill | 12px rise + fade | 0.45s |
| `heading` | Every section heading | Whole phrase fades and rises **40px** (jdavisgc `.fade-in-up`: `translateY(40px)`, ease-out) | 0.8s |
| `text` | Paragraphs | Each word slides up out of its own mask | 0.7s, ≤12ms stagger |
| `card` | Market rows, sector pills and notes, accordion rows, footer columns | Batched 24px rise + fade, 80ms stagger | 0.65s |
| `image` | Photographs, tools frame | Clip opens from the bottom edge. `[data-parallax]` adds ±5% drift | 1.1s |
| `swipe` | `[data-swipe]` phrases | Lime block grows behind the phrase 0.35s after it enters | 0.5s |

There are no per-letter effects outside the preloader and hero. The hero's rotating sector (live `flip-text-anim`) rolls vertically every 2.8s.

### Header
The header has no bar or box. `motion.tsx` sets `html[data-header]` from whichever `[data-tone="dark"]` section sits under the top 36px, and the logo monogram, tagline and links flip between white and ink. It hides on scroll down and returns on scroll up or when it receives focus.

### Menu
A full-screen overlay rebuilt from the live popup: site links, a job search, the 2 newest jobs, contact details and socials.
- **In:** an ink curtain drops from the top edge (`clip-path`), then items rise with a stagger.
- **Out:** the same timeline reversed at 1.4×.
- **Accessibility:** focus trap, Esc closes, focus returns to the trigger, `inert` while closed.

### Copied interaction: jdavisgc.com `.the-button` → `components/ui.tsx` `<Pill>`

Measured from the live element (computed styles and the stylesheet rule `.the-button:hover svg { transform: translate(5px) }`):

| Property | jdavisgc.com | Here |
|---|---|---|
| Structure | `<a>` › `<span>` label + 15×15 arrow `<svg>` at 12px | Same (same arrow path) |
| Box | `px-8 py-4`, 64px tall, `rounded-full`, 1px border | Same (`.pill`) |
| Type | 20px/30px, weight 500, tracking −0.03em | Same |
| Colour swap | `transition … 0.3s cubic-bezier(.4,0,.2,1)`, white/red → red/white | `--hover-duration: .3s`, `--ease-hover`. Tones re-mapped to the palette (lime→ink, white→lime, ink→lime, line→ink) |
| Arrow | `transition-transform duration-500 ease-in-out`, hover `translate(5px)` | `--arrow-duration: .5s`, `translate(5px)` |

The same interaction is used at display size on the sector pills, and on arrow rings, "Read more" and socials.

A second measured piece, **`.red-swipe` → `<Swipe>`**:
- `::before`, `top: 6%`, `left: -2px`, `height: 104%`, width `0 → calc(100% + 4px)`.
- `transition: width .5s cubic-bezier(.16,.01,.77,1)` (`--ease-swipe`).
- The block is lime and the text over it is ink (10:1).

### Easing tokens

| Token | Value | Source |
|---|---|---|
| `--ease` / GSAP `gj` | `cubic-bezier(.22,.61,.36,1)` | jdavisgc `.fade-in-up` ease-out, with a softer tail for longer GSAP moves |
| `--ease-swipe` | `cubic-bezier(.16,.01,.77,1)` | jdavisgc `.red-swipe::before` |
| `--ease-hover` | `cubic-bezier(.4,0,.2,1)` | jdavisgc `.the-button` (Tailwind `transition`) |

### Hero film
- **Muted and looping,** with a Pause/Play control.
- **Pauses off screen** (IntersectionObserver) and stays paused if the visitor paused it.
- **Poster fallback:** a local poster frame (`hero-poster.jpg`, preloaded).
- **Size:** `hero-1280.mp4` (3.5 MB) serves ≤1100px and `hero-1920.mp4` (7.3 MB) serves larger screens. Both are CRF 28, with the audio stripped from the 50 MB original.
- **Reduced motion:** the film is paused on its first frame.

### Accessibility
- **Page structure:** skip link, a single `h1`, labelled sections, `aria-live` on the review quote, real `<button>`s for the menu, film, reviews and accordion (`aria-expanded`, `inert` panels).
- **Contrast:** checked on every ground:
  - Ink on white or paper: 16:1.
  - Muted ink: 5.9:1.
  - White on the ink-shaded film: ≥7:1.
  - Lime is only used as a fill behind ink text, or as text on ink (9.6:1).
- **Reduced motion:** no Lenis, no preloader, no reveals, film paused, marquee stopped, swipes pre-drawn.
- **No-JS:** every element renders in place (initial hidden states require `html.js`).

## Private-demo settings
- `robots: noindex, nofollow, nocache` on the route (`app/layout.tsx`). No sitemap and no robots route.
- PostHog EU snippet (`lib/posthog.ts`):
  - The key can be overridden by `NEXT_PUBLIC_POSTHOG_KEY`.
  - Pageview, pageleave, autocapture and session recording are on, and surveys are off.
  - `site` and UTM parameters are registered.
  - `scroll_depth` fires once each at 25/50/75/100%.
  - There is no visible tracking UI.

## Where the images came from
All images come from girlingjones.com and are fetched by `scripts/media.sh`:

| File | Source |
|---|---|
| `hero-*.mp4`, `hero-poster.jpg` | `2026/01/Girling-Jones_exeter.mp4` (re-encoded) |
| `office.jpg` (5.2s), `tinkle.jpg` (12.4s) | Stills taken from the same film |
| `join-our-team.jpg` | `2024/09/join-our-team-image.jpg` |
| `plymouth.jpg` | `2023/07/Plymouth.jpg` |
| `tool-*.jpg` | `2026/06/SS.png`, `WTD.png`, `PC.png` (the "Cool stuff" page) |
| `public/brand/*.svg`, `lib/logo.ts` | `2021/11/Logo.svg` (split by `scripts/logo.mjs`) |
| Social icons | Simple Icons paths (`lib/brand-icons.ts`) |

## Verification (2026-09-28)
- **Build:** `npm run typecheck` and `npm run build` pass, and Next reports 4 static pages generated (route table: `/`, `/_not-found`, `/icon.svg`).
- **Layout:** checked in headless Chrome at 375×812, 768×1024 and 1440×900. No horizontal scroll (`scrollWidth === clientWidth`), no console errors and no failed images. (PostHog's `/flags` request is blocked in headless mode.)
- **Keyboard only:**
  - Tab order runs skip link → logo → nav → CTA → menu.
  - The menu opens on Enter and focus stays inside across 16 Tabs.
  - Esc closes it and returns focus to the trigger.
  - Review arrows and accordion work.
- **Links:** every girlingjones.com and coolstuff link returns 200. Facebook answers 400 to scripted requests only.

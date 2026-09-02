# IRWR Commercial Site — Full Spec (Design + 3D)

## Context

IRWR (International Registry of World Records) is a sub-registry of GBR (Global
Best Records, UAE). This spec covers a static, multi-page marketing/registry
site built on the approved visual language in `irwr_design7.html` (navy/gold,
Oswald + Inter, marquee tickers, reveal/ripple/cursor-glow interactions).

GBR's own site (globalbestrecords.org) was reviewed as a **structural**
reference only — no text is copied. Findings that shape this spec:
- The 10 category slugs in the brief (sport, economy, culture, education,
  transport, cooking, architecture, military, human body, extreme) match GBR's
  site exactly — reused as IRWR's own categories.
- GBR's submit flow is conceptually: application → evidence → expert review →
  certification. IRWR mirrors this logic with its own wording.
- GBR's site has no populated record data, no ID scheme, no holder-profile
  pattern, and no stated verification methodology — IRWR designs all of that
  itself rather than borrowing it.
- GBR does not describe a GBR→IRWR parent/child relationship on its own site;
  that hierarchy is IRWR's own framing (per the brief) and appears only on
  IRWR's About page.

## Architecture

**Static HTML, generated from partials by a small local build script.** No
framework, no bundler, no server required — output is plain `.html` files
deployable anywhere or opened directly. Three.js is the one exception to
"no dependency," loaded via CDN `<script>` tag (r128) like a normal library
include — no npm, no bundler step for it.

```
/IRWR
  build.js                 # ~40-line Node script, no deps: stitches partials into pages
  /src
    /partials/              header.html, footer.html, marquee.html, ruler.html
    /pages/                 home.html, records.html, holders.html, countries.html,
                             categories.html, search.html, verify.html, archive.html,
                             about.html, admin.html   — body content, {{PARTIAL_NAME}} tags
  /css
    tokens.css               design vars (colors, fonts) lifted from design7
    base.css                 reset, typography, layout primitives, shared components
                              (buttons, cards, marquee, ruler, reveal, header/footer)
    pages.css                page-specific rules (filters, pagination, forms, etc.)
  /js
    main.js                  shared behaviors: scroll-progress, cursor-glow, ripple,
                              reveal-on-scroll, marquee population, mobile nav toggle,
                              header solid-on-scroll, animated counters, 3D-tilt on cards
    data.js                  single source of truth: ~35 record objects (below)
    records.js, holders.js,  page-specific logic (filtering, search, pagination,
    countries.js, search.js, verify lookup) — one small file per page that needs it
    verify.js, archive.js
    bg3d.js                  shared floating 3D background (all pages)
    hero3d.js                 3D hero scene (home page)
    globe3d.js                3D globe (countries page)
    categoryIcons3d.js        3D icons per category tile (categories page)
  *.html                    generated output (build.js writes these to repo root)
```

`node build.js` regenerates all root `*.html` from `/src`. Editing shared
chrome (nav links, footer) means editing one partial, not 10 files.

## Data model

One array in `js/data.js`, ~35 objects:

```js
{
  id: "IRWR-00417",        // IRWR-##### format
  title: "Longest continuous calligraphy scroll",
  category: "culture",      // one of the 10 category slugs
  holderName: "L. Al Farsi",
  country: "United Arab Emirates",
  countryCode: "UAE",       // for grouping/badges
  date: "2026-03-14",
  status: "verified",       // verified | pending
  description: "412.6 metres, hand-inked over eleven days...",
  photoSeed: "irwr7-calligraphy"   // picsum.photos seed, matches design7 pattern
}
```

Every listing/filter/search page (Records, Holders, Countries, Categories,
Search, Verify, Archive, Home's featured strip) reads this one array
client-side. Holders are derived by grouping records on `holderName`;
countries are derived by grouping on `country`. No backend, no duplication.

Distribution: ~35 records spread across the 10 categories (3–4 each), roughly
12–15 distinct countries, mostly `verified` with a handful `pending` (mirrors
design7's "Coming soon" tag) to give status filtering something to show.

## Pages

All pages share header, footer, marquee ticker, ruler divider, scroll-progress
bar, cursor-glow, reveal-on-scroll, and the shared floating 3D background
(`bg3d.js`) — per the brief's "in every corner" requirement. Below is what's
unique per page.

1. **Home** — design7 as-is, ported into partials. Stat numbers (1,284+ / 61
   / 34) animate via count-up when scrolled into view. Hero section uses
   `hero3d.js` — abstract 3D scene (particles / geometric shapes), NOT a
   medallion.
2. **World Records** (`records.html`) — grid of record cards with category
   filter chips (client-side, animated re-flow on filter change). Cards use
   3D-tilt on hover.
3. **Record Holders** (`holders.html`) — profile cards (photo, name, country,
   category, IRWR ID); hover reveals their record's headline stat; 3D-tilt
   on hover.
4. **Countries** (`countries.html`) — list of countries with record counts;
   count bars animate their width in on scroll. Includes a 3D globe
   (`globe3d.js`) with markers per country; hover/click on a marker
   highlights the matching country in the list.
5. **Categories** (`categories.html`) — 10 tiles (one per category), each
   with a small 3D icon (`categoryIcons3d.js`, one primitive shape per
   category) that rotates on hover, plus photo parallax/zoom; links into
   Records filtered by that category.
6. **Search** (`search.html`) — single input, live client-side filter across
   name/country/category/ID, instant result list, no page reload.
7. **Verify Record** (`verify.html`) — IRWR ID input → looks up `data.js` →
   renders a certificate-style result card (found, with all fields) or a
   clear "not found" state.
8. **Archive** (`archive.html`) — full record list, real pagination (10 per
   page) combined with category + country dropdown filters.
9. **About IRWR** (`about.html`) — mission copy (IRWR's own wording, not
   GBR's) plus an animated scroll-reveal chain diagram: GBR → IRWR → RECORD →
   IRWR ID → VERIFICATION. Includes an outbound link/card to
   globalbestrecords.org.
10. **GBR Admin** (`admin.html`) — static login form stub (email, password,
    "Sign in" button), no real auth, labeled as internal-use-only.

GBR is also linked from the main footer/nav across every page (per brief step
2), not just the About page.

## Interactivity per page (brief step 3 requirement)

Already covered above per-page (filter chips, hover-reveal cards, animated
count bars, parallax tiles, live search, certificate lookup, pagination +
combined filters, animated chain diagram, 3D globe, 3D category icons).
Shared across all pages: ripple on gold/line buttons, reveal-on-scroll for
every section, cursor-glow, hover underline/lift + 3D-tilt on cards and
links, mobile nav becomes a slide-in/hamburger menu under 900px (matching
design7's existing `@media (max-width:900px)` breakpoint, extended with an
actual toggle instead of just hiding nav), floating 3D background objects.

## 3D layer — implementation notes

**Tech:** Three.js (r128, CDN `<script>` include, no bundler).

**General rules:**
- One reusable canvas/renderer per page where possible — avoid stacking
  multiple WebGL contexts.
- 3D elements are `position: fixed`/`absolute`, `pointer-events: none`
  except interactive zones (cards, globe).
- Lazy init after `DOMContentLoaded`; graceful fallback (static
  gradient) if WebGL is unavailable.
- Colors pulled from `tokens.css` (navy/gold) — no off-palette hues.
- On mobile (≤414px), simplify or disable `bg3d.js` and `hero3d.js` if FPS
  suffers; keep card tilt and category icons since they're cheap.

**Components:**

1. **`bg3d.js` — sitewide floating background.** 3–5 low-poly wireframe
   objects (rings/crystals), parallax on scroll (Y-offset + slow rotate).
   Included via partial on every page. Keep extra-light on list-heavy pages
   (Records/Archive).
2. **`hero3d.js` — home hero.** Abstract scene: particle field or a small
   group of geometric shapes (TorusKnot/Icosahedron), slow auto-rotation +
   mouse-parallax. Explicitly NOT a medallion (rejected direction).
3. **Card 3D-tilt.** Not Three.js — CSS `perspective` +
   `transform: rotateX/rotateY` driven by cursor position, delegated hover
   listener added in `main.js`. Applied to cards on Records, Holders,
   Categories.
4. **`globe3d.js` — countries page.** Three.js sphere with point markers per
   country (grouped from `data.js`). Slow auto-rotation, drag to rotate
   manually, hover/click marker highlights matching country in the adjacent
   list.
5. **`categoryIcons3d.js` — category tiles.** 10 simple 3D primitives (one
   per category, e.g. sphere for sport, cube for architecture). Rendered via
   **one shared `WebGLRenderer` with per-tile `Scene`/`Camera` pairs**, each
   drawn into its tile's canvas via `renderer.setScissor`/`setViewport` per
   frame — not 10 separate WebGL contexts, per the general rule above. Each
   icon rotates on hover.

**Build order:** `bg3d.js` → `hero3d.js` → CSS tilt (in `main.js`) →
`categoryIcons3d.js` → `globe3d.js` (most complex, last).

## Verification plan (brief step 5)

After all pages are built:
- Manual check at 1920px, 1440px, 414px, 375px per page (11 pages × 4
  widths) — screenshots via browser tooling where feasible, visual read of
  CSS otherwise.
- Confirm marquee/ruler tickers don't overflow or break layout on mobile.
- Confirm nav collapses to a working mobile menu (open/close, links
  navigate, closes on link click).
- Click-through every internal link (nav, footer, card CTAs, category tiles)
  to confirm no dead `#` links remain outside of intentionally-stubbed ones
  (e.g. admin login submit).
- FPS check on all 3D components, especially list-heavy pages
  (Records/Archive) and the globe.
- Confirm mobile fallback/simplification behavior for `bg3d.js` and
  `hero3d.js` on 414px/375px.
- Report: what was checked, what was fixed, any known remaining gaps.

## Explicit non-goals (scope guard)

- No real backend, auth, database, or form submission — Verify/Search/Admin
  are all client-side against the static `data.js` dataset.
- No i18n — English only (per earlier decision); the EN label in the header
  stays decorative.
- No image assets to source/optimize — picsum.photos placeholders throughout,
  matching design7's existing pattern.
- No CMS/templating framework beyond the one local `build.js` partial-stitcher.
- No medallion 3D hero — rejected direction, replaced with abstract
  particles/geometry per above.

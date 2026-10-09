# UI QA Report

## Scope

Implemented the requested navbar, footer, chapter-number, sticky-anchor, responsive menu, and in-page editor-toolbar refinements while reusing the existing palette, typography, and shared elevation tokens.

## What changed

- Desktop navbar now keeps the required order: **HOME, JOURNEY, CHAPTERS, CASE STUDIES, GLOSSARY, ABOUT | PROJECT PROMPT, search, audio, BEGIN JOURNEY**.
- Desktop navigation remains active at **1024px**; below 1024px it collapses into a full-screen sheet with large tap targets.
- `Chapters` uses CSS `text-transform: uppercase`; all primary nav items share the same UI font, size range, weight, and tracking.
- Active nav items use a Lantern Gold underline. The Chapters chevron rotates when the menu opens.
- Chapters dropdown is an elevated glass panel with themed colour dots and keyboard support for Arrow Up/Down and Escape. Mobile chapters use a native accordion.
- Header surface uses the established glass treatment with a gradient border highlight and E3/E4-style elevation.
- Added global scroll padding and ID scroll margins so sticky navigation does not obscure anchored content.
- Footer is a deep teal gradient with gold glow, raised glass cards on a 12-column grid, responsive to one column on mobile.
- Footer/source-work text is ivory or high-contrast mist on deep teal; links use gold on interaction. The automated contrast checks pass at 4.5:1 or higher.
- Editor toolbar keeps its existing behavior, uses the shared glass/elevation treatment, remains compact on mobile, and reserves bottom space on every route.
- Replaced source formatting expressions that could render `010`/`011`; rendered chapter labels now use `10`/`11`.

## Empty sparkle pill inspection

The sparkle pill in the footer is **not an empty input or button**. It is a non-interactive quote element containing the existing source text `"Stepping into a memory you have never lived"`, and that text already renders correctly. It was retained as a quote pill and restyled for the dark footer surface; no copy was invented.

## Verification

- `npm run build` — passed.
- `npm run lint` — passed.
- Source grep for padded chapter formatting expressions — no matches.
- Playwright self-test — passed at:
  - 360×740, 390×844, 430×932, 768×1024
  - 1024×768, 1280×720, 1366×768, 1440×900, 1536×864, 1920×1080
- Playwright assertions covered:
  - no desktop navbar item overlap;
  - uppercase nav labels and ABOUT/PROJECT PROMPT divider gap;
  - mobile sheet visibility and tap target size;
  - footer contrast ≥ 4.5:1;
  - in-page anchor clearance below sticky navbar;
  - footer last-row clearance above the fixed editor toolbar.
- Screenshots and machine-readable results are in `qa/nav-footer/`.

## Content issues for the owner

None identified. No user-visible copy was changed except the owner-approved chapter-number normalization from `010`/`011` to `10`/`11`.


## Chapter template and routing update

- Consolidated all chapter hero variants into one responsive hero: ghost chapter number, chapter pill/meta, reading-mode toggle, balanced serif title, quote/summary, and the scenic illustration in a masked right column.
- Removed the pale/missing-illustration failure mode by keeping `ChapterArrivalScene` in the shared hero layout; desktop uses a 55/45 grid and mobile promotes the scene above the title as a rounded E3 card.
- Curriculum progress and breadcrumbs are now entry-aware: `from=chapters` (Chapters menu or chapter-to-chapter controls) shows them and persists that state for refresh; `from=journey` and Journey panel entry hide them. Unknown/default entry is hidden.
- Added a 360ms route fade/slide transition and fixed 2D Lite Journey station clicks to open the existing chapter panel directly instead of entering an unresolvable 3D navigation state.
- Kept chapter copy unchanged; the hero-text check compares extracted hero text against the corresponding baseline after the approved `010`/`011` normalization.

## Chapter verification

- `npm run build` — passed.
- `npm run lint` — passed.
- `qa/chapter-hero/run.mjs` — passed with `qa/chapter-hero/results.json`.
- Entry flows passed: Chapters menu → Chapter 8 shows progress and survives refresh; Journey 2D Lite → Chapter 8 hides progress; Journey-origin canonical route hides progress and survives refresh.
- Geometry checks passed for all chapter routes at 360×740, 390×844, 430×932, 768×1024, 1024×768, 1280×720, 1366×768, 1440×900, 1536×864, and 1920×1080: title and illustration do not intersect, ghost number remains within the hero and the hero does not clip overflow.
- Screenshots are in `qa/chapter-hero/`.


## Navbar typography follow-up

The Chapters trigger was inheriting the browser button font shorthand, which overrode the shared nav size, weight, tracking, and line-height. The trigger now explicitly uses the same Inter typography tokens as HOME, JOURNEY, CASE STUDIES, GLOSSARY, and ABOUT, including the compact 1024px rule. Computed-style checks match at 1024px, 1280px, and 1440px; navbar overlap checks pass at 1024px, 1280px, 1366px, 1440px, and 1920px.

# The River of Insights — Repository and Baseline Audit

**Scope:** inspection and baseline artifacts only. No application source, UI, or educational content was edited.
**Baseline date:** 2026-10-10 (Asia/Bangkok).
**Git starting point:** branch `main`, clean worktree before this task. The latest starting commit was `e83cd5d docs: add AGENTS.md project rules`; the previous 30-commit history and earlier Home, Journey, and performance work were reviewed and preserved.

## 1. Project map

| Area | Implementation / source of truth |
|---|---|
| Runtime / entry | Vite + React 19 + TypeScript; `index.html` → `src/main.tsx` → `src/App.tsx` and `src/index.css`. Tailwind 4 is provided by `@tailwindcss/vite` and CSS `@theme`; there is no active `tailwind.config.*`. |
| Route dispatch | `src/App.tsx` has a small pathname router and link interception. Routes captured: `/`, `/journey`, five `/journey/<chapter-slug>` reader routes, five standalone chapter routes, `/case-studies`, `/glossary`, `/about`, `/admin`, `/dev/blocks`, and the not-found route (18 total including the five Journey deep links and not-found). |
| Shared shell | `src/App.tsx` mounts `Navbar` except on Journey, `Footer` except on Journey, and the lazy-loaded `AdminEditor` globally. |
| Home / Hero | `src/pages/HomePage.tsx`; section sequence is Hero, site explanation/questions, Five Lands/chapters, case-study story, takeaway, Team, then the shared Footer. The five Home scenes are described in that page; section scrolling/keyboard navigation is also there. |
| Navbar / Footer | `src/components/common/Navbar.tsx`, `src/components/common/Footer.tsx`. |
| Journey page / controls | `src/pages/JourneyPage.tsx`; route state, active/current chapter, navigation actions, wheel/keyboard handlers, waypoint rail and fixed HUD/control overlays. `src/components/journey/MiniMap.tsx` provides the map. |
| Chapter destinations / IDs | `src/data/chapterRegistry.ts` is the canonical five-stop navigation registry (`chapter-7`…`chapter-11`, targetU, slug, region). `src/data/chaptersData.ts` supplies chapter objects and is the source used by chapter rendering. The registry repeats some chapter metadata (title/slug/number), but not the lesson body. |
| Standalone chapter pages | `src/pages/ChapterPage.tsx`; `src/components/blocks/BlockRenderer.tsx` and `src/components/storytelling/ChapterSignatureVisuals.tsx` render the chapter hero, signature visuals and existing content blocks. `src/components/common/ChapterProgressIndicator.tsx` is the curriculum stepper. |
| Journey chapter reading | `src/components/journey/ChapterPanel.tsx` renders the selected canonical chapter as an overlay; its content is taken from the same chapter data, not a second lesson-content source. |
| Other content | `src/data/caseStudiesData.ts`, `src/data/glossaryData.ts`, `src/data/journeyCopy.ts`, `src/data/teamData.ts`. |
| People section | `src/components/common/TeamSection.tsx`, rendered at the end of `HomePage` before the shared Footer. `teamData.ts` is its data source; seven slots are stable-ID keyed. User edits/images are persisted in browser localStorage, not a server CMS. |
| In-page editing | `src/components/cms/AdminEditor.tsx`, globally injected by `App.tsx`; its floating toolbar is fixed to the viewport. The separate `/admin` page is `src/pages/AdminPage.tsx`. |
| 3D scene | `src/components/scene/RiverCanvas.tsx` owns the renderer, generated river/world, textures, lighting/shadows, visibility pause and frame loop. Supporting files: `RiverWorld.ts`, `BoatNavigationSystem.ts`, `CinematicCameraSystem.ts`, `CollisionSystem.ts`, `EnvironmentDetailSystem.ts`, `WakeTrailSystem.ts`, `RealisticAssetManager.ts`, `RiverAudio.ts`; `LiteJourney.tsx` is the 2D fallback. `ChapterSignatureVisuals.tsx` contains the chapter arrival/signature scenery. Most scene textures and geometry are generated in code; there is no separate public model/image asset library in the inspected project. |
| Theme / styles | Active global style entry is `src/index.css`, imported by `src/main.tsx`; it contains the Tailwind `@theme`, CSS variables, and most global/page-specific rules. Editorial block styling is `src/components/blocks/editorial.css`. Tracked root-level `index.css` and `editorial.css` are not imported by the app entry; they are legacy/parallel style files and should not be mistaken for active styles. |
| Fonts | `index.html` preconnects, preloads and loads Google Fonts Cormorant Garamond and Inter (`display=swap`). Active `src/index.css` maps sans to Inter and serif to Cormorant with system fallbacks, but `.font-mono` declares a real monospace stack. Inline table style in `EditorialBlocks.tsx` explicitly uses Inter. No local font files or Tailwind config were found. |
| Responsive / build | Responsive rules are split between Tailwind utility classes and `src/index.css` media queries. `vite.config.ts` sets `/final-data-web/` as the build base and `/` in dev; `.github/workflows/deploy.yml` builds/deploys `dist`. |

### Font-family inventory

Families/stacks present in tracked CSS, Tailwind theme/classes and inline style:

- Intended face: `Inter`; fallback faces `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `Arial`, `sans-serif`.
- Intended face: `Cormorant Garamond`; fallback faces `Georgia`, `Times New Roman`, `serif`.
- **Third face in active `src/index.css`:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `Liberation Mono`, `Courier New`, `monospace`, used by `.font-mono` controls/HUD and data labels. This violates the project’s two-family typography rule (R3); the similarly named class in the unused root `index.css` maps to Inter, so active vs. legacy CSS differs.
- The generated Tailwind `font-mono` utility is used in JSX; CSS fallback names above are fallbacks, not separately loaded web fonts. No other intentional remote font family was found.

## 2. Canonical educational content and navigation

- Chapters 7–11 titles, kicker/tagline/summary and the lesson blocks (paragraphs, case studies, figures, frameworks, comparisons, reflections and conclusions) live in `src/data/chaptersData.ts`. Chapter 7–11 standalone routes and Journey reader share this data through their page/rendering components. No second lesson-body source was identified.
- Navigation IDs and river destinations live in `src/data/chapterRegistry.ts`; the data maps `chapter-7` through `chapter-11` to the five canonical slugs and targetU values. `src/pages/JourneyPage.tsx` uses `navigateToChapter`, current chapter refs, arrival synchronization and the shared registry. `src/components/scene/BoatNavigationSystem.ts` advances the boat toward targetU; `RiverCanvas.tsx` updates the scene/camera and reports runtime state. Avoid casual edits to this navigation/physics path.
- `ChapterPanel.tsx` is intentionally a fixed, independently scrollable reader. This matters for screenshot capture and for future overlay/scroll fixes.

## 3. Visual and interaction findings

### Strengths to preserve

- The product already has a recognizable river/landscape palette, distinctive serif chapter titles, a branded floating header, chapter-specific illustration accents, and a coherent content/3D relationship.
- Chapter pages use a dedicated heading/visual system and varied block renderers rather than only a repeated card grid. The Journey retains a centered elevated boat view, canonical chapter destinations, visibility-aware render pause, and a 2D fallback.
- Home has a clear narrative sequence and an explicit team section at the final Home position. Preserve these structures and the 3D architecture during later visual work.

### Known issues: reproduction and root-cause status

Line references below are to the current `main` source inspected for this audit.

| Issue | Status | Finding / likely root cause |
|---|---|---|
| Navbar ABOUT collides with PROJECT PROMPT; Chapters casing differs; fixed header masks section headings | **PARTIAL** | The `Chapters` case mismatch is reproduced: the nav wrapper is uppercase, but its button has no explicit text transform (`Navbar.tsx:82,104–120`). The fixed shell (`Navbar.tsx:63`) can overlay Home section anchors, which use `scrollIntoView` (`HomePage.tsx:105–112`) without a Home-level scroll offset; heading masking is a structural risk to confirm at the Team anchor. The ABOUT/Project Prompt collision was **not reproduced** in the sampled captures: at ≤1199px the nav is deliberately hidden (`src/index.css:1439–1440`), and at 1280px the prompt collapses to an icon (`src/index.css:1355–1358`) with a visible gap from ABOUT. Do not change nav spacing until a colliding viewport/state is demonstrated. |
| Chapter hero: Competing on Analytics title/illustration overlap, ghost numeral clipping, or pale empty rectangle | **TODO (not reproduced)** | The current 1280×720 and 1366×768 standalone Chapter 8 captures show the illustration present and the ghost “08” in bounds; the title and graphic do not visibly collide in those captured states. The component is `.chapter-heading`, `.chapter-number-watermark`, `.chapter-visual` in `src/index.css:461–568`, rendered by `ChapterPage.tsx` and `ChapterSignatureVisuals.tsx`. No pale empty rectangle reproduced. Record as unconfirmed/possibly state-dependent rather than a verified defect; inspect other widths and any delayed asset/animation state before changing it. |
| Footer Source Work heading contrast; toolbar covers footer content | **DONE (reproduced)** | `Footer.tsx:58–61` gives the `h4` `text-[#85590A]`; the later dark gradient override is `.site-footer` in `src/index.css:1917–1948`, and it only resets `h3`, links, paragraphs and spans—not `h4`. That leaves the brown heading on dark teal at low contrast. `AdminEditor.tsx:161` fixes the editor pill at `bottom-6 z-50` globally, while `App.tsx:147–153` adds it without reserving bottom space; it visibly sits over page/footer content and clips on narrow screens. |
| Journey up/down arrows; left rail label truncation; dark scene; crowded HUD on small screens | **PARTIAL** | Arrow controls call `sailPrevStop`/`sailNextStop` (`JourneyPage.tsx:214–228,739–754`), which only navigate when `currentChapterIdRef.current` is populated; with no current chapter, the callbacks return without action. On a selected stop they are previous/next destination controls, not free vertical scrolling. At 768px the Journey capture visibly truncates the rotated “Peach Village” MiniMap label (`src/components/journey/MiniMap.tsx:18–23`, rail styling `src/index.css:848–857`); at 360px the top HUD is cramped and the reader prompt/scene are dark. Independently fixed Journey controls compete for small viewport space (`JourneyPage.tsx:593–718,739–754`). |
| Flat/repetitive cards; fonts inconsistent; laptop layout sparse/small | **PARTIAL** | The third active monospace stack is confirmed (`src/index.css:122–124`). Card depth is mixed rather than uniformly flat: chapter and Home blocks include borders/shadows, but repeated card-like block patterns remain. Full-page 1280–1440 chapter captures show long vertical pacing and unused whitespace around some centered content, so tune against specific pages rather than globally enlarging everything. Relevant presentation code is `BlockRenderer.tsx`, `EditorialBlocks.tsx`, `src/components/blocks/editorial.css`, and chapter/Home layout rules in `src/index.css`. |

## 4. Additional baseline checks

- **Routes / browser console:** all 18 captured routes rendered content in the headless Edge run; the 180 route/viewport records report no console errors, no visible `<img>` missing `alt`, and no document-level horizontal overflow. See `qa/baseline/route-viewport-results.json`. CSS globally sets `overflow-x: hidden`, so `horizontalOverflow=false` cannot rule out visually clipped descendants; the Home 360px image shows clipping despite that result.
- **Runtime warnings:** browser capture recorded zero `console.error` entries, but the Vite/Three.js server log did emit warnings: `THREE.WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead` at `src/components/scene/RiverCanvas.tsx:299`, plus generated WebGL shader precision warnings that may be associated with the water `ShaderMaterial` at `RiverCanvas.tsx:364`. They did not prevent route rendering; consider a version-compatible shadow setting and profile the water shader during the scene task.
- **Content reference:** `qa/baseline/text/<route>.json` records route, title, complete `document.body.innerText`, and visible section text at 1366×768. It is a comparison baseline, not a new content source. Five Journey-reader screenshots were expanded for their nested scrolling panel; those screenshots are full content height while retaining the filename’s viewport width/height.
- **Layout shift:** no layout-shift performance observer/CLS measurement was instrumented in this baseline; mark it **unmeasured**, not a pass.
- **Three.js lifecycle risk:** `RiverCanvas.tsx:1561–1588` stops/cancels its one RAF loop, disconnects the visibility observer, removes listed listeners, and disposes renderer/environment resources. Cleanup does not traverse the full scene to dispose every mesh geometry/material/texture; generated scene resources may remain retained across repeated mount/unmount cycles. This is a **potential** lifecycle/memory risk, not a measured leak. Profile repeated Journey mount/unmount before altering it.
- **Accessibility:** visible `<img>` scan returned zero missing `alt` in captured routes. Automated contrast audit was not run; the Source Work `h4` is an identified contrast failure. Existing CSS `overflow-x:hidden` can mask clipped layouts from a document-width-only check.
- **GitHub Pages base path:** build base is `/final-data-web/` (`vite.config.ts:10`) and route links are normalized in `App.tsx`; no `404.html` fallback was found. Vite’s local history fallback does not prove GitHub Pages direct refresh behavior. Direct refresh of client-only paths under the repository base is therefore a **likely deployment risk**, pending a deployed-route check or a Pages-compatible fallback.
- **Production build/preview:** `npm run lint` passes. `npm run build` passes after allowing the native Tailwind/Windows build dependency to run outside the sandbox. `dist/index.html` references `/final-data-web/assets/...`; Vite preview returned 200 for `/final-data-web/`, `/final-data-web/journey/` and `/final-data-web/competing-on-analytics/`. This verifies the local built preview only, not GitHub Pages refresh behavior. Build emits a Vite warning that `__dirname` in `vite.config.ts:14` is unsupported by its native config loader.
- **Assets / image persistence:** most 3D visuals are procedural; team portraits use `<img>`/file data from the Team editor and localStorage persistence (`TeamSection.tsx`). No shared remote asset manager or uploaded-image backend was identified.
- **Spacing / legibility:** screenshots confirm the floating editor can cover visible controls/content; Home is visually clipped at 360px; Journey HUD is crowded on narrow widths; Chapter 8 did **not** reproduce the reported hero collision/clipped number at 1280/1366. Do not treat all previously reported issues as confirmed until state-specific repro is captured.

## 5. Baseline artifacts

- `qa/baseline/<route>-<WxH>.png`: **180** captures (18 routes × all 10 R6 viewport sizes: 360×740, 390×844, 430×932, 768×1024, 1024×768, 1280×720, 1366×768, 1440×900, 1536×864, 1920×1080). Main document routes are full-page captures. The five Journey-reader routes use stitched viewport captures of the actual nested scroll panel, retaining the visible sticky reader header only once.
- `qa/baseline/text/<route>.json`: **18** text references, with complete body `innerText` and per-section `innerText` at 1366×768.
- `qa/baseline/route-viewport-results.json`: title, text length, visible section count, document height, overflow/alt scan and console-error summary for each route/viewport.
- Capture method: Edge headless Chromium via Chrome DevTools Protocol (Playwright was not installed in this checkout). This is the requested Playwright-equivalent browser capture; viewport dimensions match R6.
- Artifact footprint at audit time: approximately 286 MB for 180 PNGs and 19 JSON files. PNGs are committed as directly usable baseline images; no Git LFS configuration was found.

## 6. Work-status ledger for this and later task groups

Use these statuses to scope future implementation. Do only the **PARTIAL** and **TODO** work; do not redo items marked DONE.

| Work item | Status | Current evidence / remaining scope |
|---|---|---|
| Starting Git state/history review | DONE | Clean before audit; previous 30 commits reviewed, no existing work reverted. |
| Route/component/data/theme/3D architecture map | DONE | Mapped above. |
| Font inventory and non-approved font flag | DONE | Inventory complete; active monospace third family recorded for later typography task. |
| R6 screenshot matrix | DONE | 180 PNGs in `qa/baseline/`; 130 document full-page captures and 50 stitched full-reader captures, with viewport dimensions following R6. |
| Per-route visible text reference | DONE | 18 JSONs in `qa/baseline/text/`. |
| Browser console-error and visible image-alt smoke audit | DONE | No browser console errors or visible missing-alt images; separate dev-server Three.js warnings are logged above. |
| Foundation / shared visual tokens | PARTIAL | Theme and many reusable styles exist; audit found active/legacy CSS divergence and third font family; future work should extend current active tokens only. |
| Navbar / Footer | PARTIAL | Existing branded components are present; nav spacing/case/anchor offset and Source Work contrast/editor overlap need work. |
| Chapter hero | PARTIAL | Shared hero and chapter visuals exist; reported Chapter 8 collision is not reproduced at baseline widths; investigate only unresolved states/widths. |
| 3D scenes | PARTIAL | Complete RiverCanvas/world systems and 2D fallback exist; sampled scene is dark, and scene-resource disposal requires measurement. Preserve navigation, camera and physics. |
| Cards / backgrounds | PARTIAL | Editorial block and chapter-specific visual systems exist; some repetitive surfaces/flatness remain. Improve only weak blocks. |
| Journey controls | PARTIAL | Destination rail/HUD and arrows exist; no-selected-stop arrow no-op is confirmed; narrow HUD and label clipping need targeted work. |
| Responsive layout | PARTIAL | Responsive rules exist; 360px Home clipping, crowded Journey controls and sparse laptop compositions remain. |
| Chapter hero collision/empty illustration issue | TODO | Not observed at 1280×720 or 1366×768; wait for reproducible affected state before editing. |
| CLS / layout-shift measurement | TODO | Not measured in this baseline. |
| GitHub Pages deep-link refresh verification | TODO | `/final-data-web/` base configured; deployed direct-refresh behavior not verified and no `404.html` fallback exists. |

## 7. Recommended implementation order

1. Verify deployed GitHub Pages deep-link refresh and reproduce the navbar/header, footer/editor overlap, mobile clipping, and Journey arrow states against these baseline artifacts.
2. Fix shared shell/responsive containment (header nav fit/case and scroll offsets; toolbar safe area; footer heading contrast) without touching chapter copy.
3. Resolve Journey controls and small-screen HUD/rail layout while preserving `chapterRegistry`, targetU, boat physics, collision, camera and arrival state.
4. Remove the active third font-family and consolidate only the active typography/token source; do not refactor unused CSS unless the task explicitly calls for it.
5. Tune chapter hero and content block surfaces against the captured screenshots; first reproduce the reported Chapter 8 collision/pale rectangle since it did not occur in this baseline.
6. Profile Three.js resource retention, CLS and FPS before any scene/performance changes; change only measured bottlenecks.

## 8. Change boundary

Only `AUDIT.md` and the requested `qa/baseline/` artifacts are created by this task. No application source, UI behavior, or educational content has been changed.

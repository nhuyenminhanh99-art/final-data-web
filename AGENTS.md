# PROJECT RULES

## R1. ZERO CONTENT CHANGES (highest priority)
This is a visual and UX upgrade only. Never edit, rewrite, add, delete, translate, shorten or reorder any user-visible text: headings, paragraphs, quotes, labels, button text, captions, chapter names, numbers, data. Do not invent placeholder copy. There are exactly TWO owner-approved exceptions: (a) Chapter numbers displayed as "010" or "011" (curriculum stepper, footer chapter list, chapter pills, journey rail, anywhere else) must display as "10" and "11", matching the two-digit style of 07, 08, 09; fix it at the source data or in the formatting function, whichever causes it. (b) The empty pill with a sparkle icon in the footer must be fixed as described in the footer task. For ANY other apparent content problem (typos, odd wording), DO NOT fix it; list it in REPORT.md under "Content issues for the owner".
Only allowed text-related change: letter case through CSS text-transform (for example the nav item "Chapters" must render as "CHAPTERS" like its siblings, done with CSS, not by editing the string).

## R2. Brand system (extend, never replace)
First read the existing tokens in the CSS/Tailwind theme and reuse them. The established palette is: Obsidian #0C0C0B, River Green #142F2D, Lantern Gold #C8A66A, Warm Ivory #E8E4DA, Faded Peach #D99A9A, plus the existing teal / sea-green / sky-mist tints used in the chapter pages. You may add tints, shades and gradient stops derived from these hues. Do not introduce unrelated hues.
Mood: luminous spring morning on a river, cinematic, poetic, premium, easy to understand and apply. Bright and fresh for reading pages; deep teal-to-obsidian only for dramatic sections, never flat black.

## R3. Typography (maximum 2 font families)
- Display / headings / quotes: Cormorant Garamond.
- UI / body / labels / buttons / HUD: Inter (use tabular-nums for numbers, letter-spacing for small uppercase labels).
- No monospace family, no third font. Replace any other font with one of the two. Self-host or preload the fonts with font-display: swap.
- Use a fluid type scale with clamp() defined once as CSS variables (display, h1, h2, h3, body, small, label). Body text min 16px on mobile, line-height 1.6-1.75, contrast ratio at least 4.5:1 (WCAG AA).

## R4. Depth system (everything must feel 3D, nothing flat)
Define ONE shared elevation system as CSS variables/utilities and use it everywhere: layered soft shadows (ambient + key + contact), 1px inner highlight on the top edge, subtle gradient surface, optional glass (backdrop-filter) on dark sections, hover lift (translateY + larger shadow, 180-260ms ease-out), pressed state (translateY(1px), reduced shadow). Optional gentle pointer-tilt (max 6deg, perspective 900px) on large cards, disabled on touch devices and when prefers-reduced-motion is set.

## R5. Component consistency
All buttons, chips, cards, inputs, nav items and toggles must come from shared primitives (variants: primary, secondary, ghost, icon; sizes: sm, md, lg). Same radius scale, same elevation levels, same focus ring (2px Lantern Gold + offset), same hover/active/disabled/focus-visible states. No one-off styles.

## R6. Responsive rules
Mobile-first, but laptops must NEVER fall back to the mobile layout. Breakpoints: mobile < 768px, tablet 768-1023px, desktop >= 1024px. Many laptops have Windows scaling 125-150%, so real CSS viewports are 1280x720, 1366x768, 1440x900, 1536x864: the desktop layout must look intentional and full at all of these. Use min-h-[100svh]/dvh instead of vh, container queries or clamp() for fluid sizing, safe-area insets on phones, tap targets >= 44px.
Test matrix: 360x740, 390x844, 430x932, 768x1024, 1024x768, 1280x720, 1366x768, 1440x900, 1536x864, 1920x1080.

## R7. Performance and smoothness
Target 60fps. Animate only transform and opacity. Use will-change sparingly. Respect prefers-reduced-motion. three.js: cap devicePixelRatio (desktop 2, mobile 1.5), dispose geometries/materials/textures on unmount, pause rendering when the tab is hidden or the canvas is off-screen, lazy-load the 3D scene, keep the existing "2D Lite" mode as a working fallback. Lazy-load below-the-fold images and heavy sections.

## R8. The in-page editor toolbar (Preview / Settings / Save / Publish / Project files)
Keep it and its behaviour. But it must never cover content: reserve bottom padding equal to its height on every page, make it compact on mobile (icon-only or collapsible), and give it the same primitives and elevation as the rest of the UI.

## R9. Workflow
Small, focused commits. Before finishing any task run: npm run build, npm run lint (if present), and a Playwright (or equivalent headless-browser) check at the R6 viewports, saving screenshots to /qa/<task-name>/. Fix any problem you find before reporting. End each task with a short summary: files changed, what was tested, what remains. Never leave the build broken.

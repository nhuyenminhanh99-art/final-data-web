import { chromium } from 'playwright';
import fs from 'node:fs';

const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const out = `${process.cwd()}/qa/chapter-hero`;
fs.mkdirSync(out, { recursive: true });
const viewports = [
  [360, 740], [390, 844], [430, 932], [768, 1024],
  [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1536, 864], [1920, 1080],
];
const chapters = [
  { slug: 'analytics-leadership', baseline: 'analytics-leadership.json' },
  { slug: 'competing-on-analytics', baseline: 'competing-on-analytics.json' },
  { slug: 'analytics-leaders-playbook', baseline: 'analytics-leaders-playbook.json' },
  { slug: 'making-it-happen', baseline: 'making-it-happen.json' },
  { slug: 'common-pitfalls', baseline: 'common-pitfalls.json' },
];
const results = [];
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const normalize = (text) => text.replaceAll('010', '10').replaceAll('011', '11').replace(/\s+/g, ' ').trim();
const assert = (condition, message) => { if (!condition) throw new Error(message); };

// Flow 1: Navbar Chapters menu -> Chapter 8 shows progress; refresh preserves it.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.locator('.river-chapters-trigger').hover();
  await page.locator('.river-chapters-dropdown').waitFor();
  await page.getByRole('menuitem', { name: /Competing on Analytics/ }).click();
  await page.locator('.chapter-heading').waitFor();
  assert(new URL(page.url()).searchParams.get('from') === 'chapters', 'Chapters menu did not preserve from=chapters');
  assert(await page.locator('.chapter-progress-shell').count() === 1, 'Stepper not visible after Chapters-menu entry');
  await page.reload({ waitUntil: 'networkidle' });
  assert(await page.locator('.chapter-progress-shell').count() === 1, 'Stepper not preserved after Chapters-menu refresh');
  results.push({ flow: 'chapters-menu-to-chapter-8', progress: 'visible', refresh: 'visible' });
  await page.close();
}

// Flow 2: Journey 2D Lite -> Chapter 8 panel has no curriculum stepper.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`${base}/journey`, { waitUntil: 'networkidle' });
  const liteToggle = page.getByRole('button', { name: '2D Lite' });
  await liteToggle.click();
  await page.getByRole('button', { name: 'Open Chapter Details' }).nth(1).waitFor();
  await page.getByRole('button', { name: 'Open Chapter Details' }).nth(1).click();
  await page.locator('.chapter-reading-panel').waitFor();
  assert(await page.locator('.chapter-reading-panel .chapter-progress-shell').count() === 0, 'Journey chapter panel unexpectedly shows curriculum stepper');
  results.push({ flow: 'journey-2d-lite-to-chapter-8', progress: 'hidden' });
  await page.close();
}

// Flow 3: Journey-origin canonical chapter route and refresh remain hidden.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(`${base}/competing-on-analytics/?from=journey`, { waitUntil: 'networkidle' });
  assert(await page.locator('.chapter-progress-shell').count() === 0, 'Journey-origin canonical route shows stepper');
  await page.reload({ waitUntil: 'networkidle' });
  assert(await page.locator('.chapter-progress-shell').count() === 0, 'Journey-origin refresh shows stepper');
  results.push({ flow: 'journey-origin-canonical-route', progress: 'hidden', refresh: 'hidden' });
  await page.close();
}

// Full R6 hero geometry and extracted-text checks for all chapter routes.
for (const chapter of chapters) {
  const baseline = JSON.parse(fs.readFileSync(`${process.cwd()}/qa/baseline/text/${chapter.baseline}`, 'utf8'));
  for (const [width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${base}/${chapter.slug}/?from=journey`, { waitUntil: 'networkidle' });
    await page.locator('.chapter-heading').waitFor();
    await page.waitForTimeout(120);
    const geometry = await page.evaluate(() => {
      const heading = document.querySelector('.chapter-heading').getBoundingClientRect();
      const title = document.querySelector('.chapter-title').getBoundingClientRect();
      const scene = document.querySelector('.chapter-arrival-scene').getBoundingClientRect();
      const ghost = document.querySelector('.chapter-number-watermark').getBoundingClientRect();
      const overflow = getComputedStyle(document.querySelector('.chapter-heading')).overflow;
      return {
        title: { left: title.left, right: title.right, top: title.top, bottom: title.bottom },
        scene: { left: scene.left, right: scene.right, top: scene.top, bottom: scene.bottom },
        ghost: { left: ghost.left, right: ghost.right, top: ghost.top, bottom: ghost.bottom },
        heading: { left: heading.left, right: heading.right, top: heading.top, bottom: heading.bottom },
        overflow,
      };
    });
    const intersects = geometry.title.left < geometry.scene.right && geometry.title.right > geometry.scene.left && geometry.title.top < geometry.scene.bottom && geometry.title.bottom > geometry.scene.top;
    assert(!intersects, `${chapter.slug} title/illustration intersect at ${width}x${height}`);
    assert(geometry.ghost.left >= geometry.heading.left - 2 && geometry.ghost.right <= geometry.heading.right + 2 && geometry.ghost.top >= geometry.heading.top - 2 && geometry.ghost.bottom <= geometry.heading.bottom + 2, `${chapter.slug} ghost number clipped at ${width}x${height}: ${JSON.stringify(geometry)}`);
    assert(geometry.overflow !== 'hidden', `${chapter.slug} hero clips ghost number at ${width}x${height}`);
    const heroText = normalize(await page.locator('.chapter-heading').innerText());
    const baselineText = normalize(baseline.bodyInnerText);
    for (const line of normalize(heroText).split(' · ').flatMap((part) => part.split(/\n/)).map((line) => line.trim()).filter((line) => line.length > 3)) {
      assert(baselineText.includes(line), `${chapter.slug} hero text changed: ${line}`);
    }
    await page.screenshot({ path: `${out}/${chapter.slug}-${width}x${height}.png`, fullPage: false });
    results.push({ chapter: chapter.slug, width, height, geometry, checks: ['title/illustration non-intersection', 'ghost visible', 'hero text matches baseline'] });
    await page.close();
  }
}

fs.writeFileSync(`${out}/results.json`, JSON.stringify({ passed: true, results }, null, 2));
console.log(JSON.stringify({ passed: true, results }, null, 2));
await browser.close();

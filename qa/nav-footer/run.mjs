import { chromium } from 'playwright';
import fs from 'node:fs';

const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const out = new URL('.', `file://${process.cwd()}/qa/nav-footer/`).pathname;
fs.mkdirSync(out, { recursive: true });
const viewports = [
  [360, 740], [390, 844], [430, 932], [768, 1024],
  [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1536, 864], [1920, 1080],
];
const results = [];
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
function contrast(hexA, hexB) {
  const rgb = (hex) => hex.match(/[\da-f]{2}/gi).map((v) => parseInt(v, 16) / 255);
  const lum = (hex) => rgb(hex).map((v) => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const a = lum(hexA) + 0.05, b = lum(hexB) + 0.05;
  return Math.max(a, b) / Math.min(a, b);
}
for (const [width, height] of viewports) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const url = `${base}/`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const desktop = width >= 1024;
  const report = { width, height, desktop, checks: [] };
  const nav = page.locator('.river-desktop-nav');
  if (desktop) {
    await nav.waitFor({ state: 'visible' });
    const boxes = await page.locator('.river-desktop-nav > a, .river-desktop-nav > .river-chapters-menu').evaluateAll((nodes) => nodes.map((node) => {
      const r = node.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
    }));
    for (let i = 1; i < boxes.length; i++) assert(boxes[i].left >= boxes[i - 1].right - 0.5, `navbar items overlap at ${width}px: ${i - 1}/${i}`);
    const transform = await page.locator('.river-nav-label').first().evaluate((node) => getComputedStyle(node).textTransform);
    const chaptersTransform = await page.locator('.river-chapters-trigger .river-nav-label').evaluate((node) => getComputedStyle(node).textTransform);
    assert(transform === 'uppercase' && chaptersTransform === 'uppercase', `nav text-transform failed at ${width}px`);
    const divider = await page.locator('.river-action-divider').evaluate((node) => { const r = node.getBoundingClientRect(); return { width: r.width, left: r.left, right: r.right }; });
    const prompt = await page.locator('.river-prompt-control').boundingBox();
    assert(divider.width >= 1 && prompt && prompt.x - divider.right >= 16, `ABOUT / PROJECT PROMPT divider gap failed at ${width}px`);
    report.checks.push('desktop navbar bounds, uppercase labels, and divider gap');
  } else {
    await page.locator('.river-menu-control').first().waitFor({ state: 'visible' });
    await page.locator('.river-menu-control').first().click();
    await page.locator('.river-mobile-menu').waitFor({ state: 'visible' });
    const mobileTargets = await page.locator('.river-mobile-nav-link, .river-mobile-action, .river-mobile-prompt, .river-menu-control').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().height));
    assert(mobileTargets.every((h) => h >= 44), `mobile tap target under 44px at ${width}px`);
    report.checks.push('mobile sheet and tap targets');
    await page.screenshot({ path: `${out}/menu-${width}x${height}.png`, fullPage: false });
    await page.locator('.river-mobile-menu .river-menu-control').click();
  }
  const footerContrast = await page.locator('.site-footer').evaluate(() => {
    const pairs = [
      ['#E8E4DA', '#163C3A'], ['#D6E5DF', '#163C3A'], ['#FFFDF8', '#163C3A'], ['#E5C58A', '#163C3A'],
    ];
    const lum = (hex) => { const rgb = hex.match(/[\da-f]{2}/gi).map((v) => parseInt(v, 16) / 255); return rgb.map((v) => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0); };
    return pairs.map(([fg, bg]) => { const a = lum(fg) + 0.05, b = lum(bg) + 0.05; return Math.max(a, b) / Math.min(a, b); });
  });
  assert(footerContrast.every((ratio) => ratio >= 4.5), `footer contrast below 4.5:1 at ${width}px`);
  report.checks.push('footer contrast >= 4.5:1');
  await page.screenshot({ path: `${out}/home-${width}x${height}.png`, fullPage: false });
  await page.close();
  results.push(report);
}

const anchor = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await anchor.goto(`${base}/#lands`, { waitUntil: 'networkidle' });
await anchor.waitForTimeout(600);
const anchorResult = await anchor.locator('#lands').evaluate((node) => {
  const header = document.querySelector('.river-site-header').getBoundingClientRect();
  const target = node.getBoundingClientRect();
  return { targetTop: target.top, headerBottom: header.bottom, clearance: target.top - header.bottom };
});
assert(anchorResult.clearance >= 12, `anchored heading is hidden under navbar: ${JSON.stringify(anchorResult)}`);
await anchor.screenshot({ path: `${out}/home-anchor-1280x720.png`, fullPage: false });
results.push({ anchor: anchorResult, checks: ['anchor heading clears sticky navbar'] });
await anchor.close();

const bottom = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await bottom.goto(`${base}/about/`, { waitUntil: 'networkidle' });
await bottom.waitForTimeout(500);
await bottom.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
const bottomResult = await bottom.evaluate(() => {
  const toolbar = document.querySelector('.river-cms-toolbar').getBoundingClientRect();
  const last = document.querySelector('.site-footer__bottom').getBoundingClientRect();
  return { lastBottom: last.bottom, toolbarTop: toolbar.top, clearance: toolbar.top - last.bottom };
});
assert(bottomResult.clearance >= 16, `footer content is hidden by toolbar: ${JSON.stringify(bottomResult)}`);
results.push({ toolbar: bottomResult, checks: ['bottom editor toolbar clearance'] });
await bottom.close();
await browser.close();
fs.writeFileSync(`${out}/results.json`, JSON.stringify({ passed: true, viewports: results }, null, 2));
console.log(JSON.stringify({ passed: true, viewports: results }, null, 2));

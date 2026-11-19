import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outDir = resolve('previews')
mkdirSync(outDir, { recursive: true })
const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)
const height = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < height; y += 650) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
  await page.waitForTimeout(90)
}
await page.waitForTimeout(600)

for (const [name, selector] of [
  ['shop', '#shop'],
  ['ritual', '#ritual'],
  ['studio', '#studio'],
  ['campaign', '.campaign'],
  ['testimonials', '.testimonials'],
  ['glow', '#glow-club'],
  ['journal', '#journal'],
  ['gallery', '.gallery'],
  ['newsletter', '#newsletter'],
  ['footer', '#footer'],
]) {
  const element = page.locator(selector)
  await element.scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)
  await element.screenshot({ path: resolve(outDir, `section-${name}.png`) })
  const box = await element.boundingBox()
  console.log(name, box)
}

const journalImages = await page.locator('#journal img').evaluateAll((els) =>
  els.map((el) => ({ src: el.getAttribute('src'), complete: el.complete, naturalWidth: el.naturalWidth, rect: el.getBoundingClientRect().toJSON() })),
)
console.log(JSON.stringify(journalImages, null, 2))

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
await mobile.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await mobile.evaluate(() => document.fonts.ready)
await mobile.waitForTimeout(500)
await mobile.screenshot({ path: resolve(outDir, 'mobile-hero-full.png'), fullPage: true, clip: { x: 0, y: 0, width: 390, height: 1500 } })
await browser.close()

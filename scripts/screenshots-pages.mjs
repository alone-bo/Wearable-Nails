import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = 'http://127.0.0.1:5173'
const outDir = resolve('previews', 'pages')
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ executablePath, headless: true })
const errors = []

const pages = [
  ['home', '/'],
  ['shop', '/shop'],
  ['product', '/product/olive-hour'],
  ['about', '/about'],
  ['faq', '/faq'],
  ['contact', '/contact'],
  ['journal', '/journal'],
  ['article', '/journal/make-press-ons-last'],
  ['privacy', '/privacy'],
  ['terms', '/terms'],
  ['shipping-returns', '/shipping-returns'],
  ['404', '/this-page-does-not-exist'],
]

for (const [name, path] of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (error) => errors.push(`${name} pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${name} console: ${message.text()}`)
  })
  const response = await page.goto(baseUrl + path, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(700)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await page.waitForTimeout(60)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(350)
  await page.screenshot({ path: resolve(outDir, `${name}-top.png`) })
  await page.screenshot({ path: resolve(outDir, `${name}-full.png`), fullPage: true })
  console.log(name, response?.status(), height, await page.title())
  await page.close()
}

// Mobile top views
for (const [name, path] of pages.slice(0, 9)) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  await page.goto(baseUrl + path, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(550)
  await page.screenshot({ path: resolve(outDir, `${name}-mobile.png`) })
  console.log('mobile', name)
  await page.close()
}

console.log(errors.length ? errors.join('\n') : 'No console errors')
await browser.close()

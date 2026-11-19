import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = 'http://127.0.0.1:5173/'
const outDir = resolve('previews')
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ executablePath, headless: true })

const errors = []

async function prepare(page) {
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(700)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await page.waitForTimeout(110)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
}

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
await prepare(desktop)
await desktop.screenshot({ path: resolve(outDir, 'desktop-top.png') })
await desktop.screenshot({ path: resolve(outDir, 'desktop-full.png'), fullPage: true })
console.log('desktop height', await desktop.evaluate(() => document.documentElement.scrollHeight))

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
})
await prepare(mobile)
await mobile.screenshot({ path: resolve(outDir, 'mobile-top.png') })
await mobile.screenshot({ path: resolve(outDir, 'mobile-full.png'), fullPage: true })
console.log('mobile height', await mobile.evaluate(() => document.documentElement.scrollHeight))

// Dialog states at desktop
await desktop.getByRole('button', { name: 'Open shopping bag' }).click()
await desktop.waitForTimeout(650)
await desktop.screenshot({ path: resolve(outDir, 'cart.png') })
await desktop.getByRole('button', { name: 'Close dialog' }).click()
await desktop.waitForTimeout(450)

await desktop.getByRole('button', { name: 'Quick add The Olive Hour to bag' }).first().click()
await desktop.waitForTimeout(500)
await desktop.screenshot({ path: resolve(outDir, 'toast.png') })

await desktop.getByRole('button', { name: 'View The Olive Hour' }).first().click()
await desktop.waitForTimeout(600)
await desktop.screenshot({ path: resolve(outDir, 'quickview.png') })

console.log(errors.length ? errors.join('\n') : 'No console errors')
await browser.close()

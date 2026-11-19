import { chromium } from 'playwright-core'
import { resolve } from 'node:path'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = 'http://127.0.0.1:5173/'
const outDir = resolve('previews')
let checks = 0

function assert(condition, message) {
  checks += 1
  if (!condition) throw new Error(`FAIL: ${message}`)
  console.log(`ok ${checks} - ${message}`)
}

const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(500)

await page.getByRole('button', { name: 'Open site menu' }).click()
await page.waitForTimeout(400)
await page.getByRole('dialog', { name: 'Site menu' }).getByRole('button', { name: 'Book a visit' }).click()
await page.waitForTimeout(800)
assert(!(await page.getByRole('dialog', { name: 'Site menu' }).isVisible()), 'menu closes before booking opens')
assert(await page.getByRole('dialog', { name: 'Book a studio visit' }).isVisible(), 'mobile menu booking opens booking dialog')
assert((await page.evaluate(() => document.body.classList.contains('modal-open'))), 'body remains locked while booking is open')
await page.screenshot({ path: resolve(outDir, 'mobile-booking.png') })
await page.locator('.dialog--modal[open] .dialog__close').click()
await page.waitForTimeout(400)
assert(!(await page.evaluate(() => document.body.classList.contains('modal-open'))), 'body unlock after booking close')

await page.getByRole('button', { name: 'Open site menu' }).click()
await page.waitForTimeout(350)
await page.getByRole('button', { name: 'Search the collection' }).click()
await page.waitForTimeout(800)
assert(await page.getByRole('dialog', { name: 'Search the YOUGLOW collection' }).isVisible(), 'menu search opens search dialog')
await page.screenshot({ path: resolve(outDir, 'mobile-search.png') })
await page.keyboard.press('Escape')
await page.waitForTimeout(400)

await page.getByRole('button', { name: 'Open shopping bag' }).click()
await page.waitForTimeout(550)
assert(await page.getByRole('dialog', { name: 'Shopping bag' }).isVisible(), 'mobile cart opens')
const cartWidth = await page.locator('.dialog--drawer[open] .dialog__panel').evaluate((el) => el.getBoundingClientRect().width)
assert(cartWidth <= 390, 'mobile cart fits viewport')
await page.screenshot({ path: resolve(outDir, 'mobile-cart.png') })
await page.locator('.dialog--drawer[open] .dialog__close').click()
await page.waitForTimeout(450)

await page.locator('#shop').scrollIntoViewIfNeeded()
await page.waitForTimeout(300)
await page.getByRole('button', { name: 'View The Olive Hour' }).first().click()
await page.waitForTimeout(600)
assert(await page.getByRole('dialog', { name: 'The Olive Hour' }).isVisible(), 'mobile quick view opens')
const modalBox = await page.locator('.dialog--modal[open] .dialog__panel').boundingBox()
assert(modalBox.height <= 844, 'mobile quick view fits viewport height')
await page.screenshot({ path: resolve(outDir, 'mobile-quickview.png') })

// Desktop search dialog visual
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await desktop.goto(baseUrl, { waitUntil: 'networkidle' })
await desktop.evaluate(() => document.fonts.ready)
await desktop.waitForTimeout(500)
await desktop.getByRole('button', { name: 'Search the shop' }).click()
await desktop.waitForTimeout(500)
await desktop.getByRole('searchbox', { name: 'Search products' }).fill('olive')
await desktop.waitForTimeout(300)
await desktop.screenshot({ path: resolve(outDir, 'search.png') })

// Tablet capture
const tablet = await browser.newPage({ viewport: { width: 768, height: 900 } })
await tablet.goto(baseUrl, { waitUntil: 'networkidle' })
await tablet.evaluate(() => document.fonts.ready)
await tablet.waitForTimeout(600)
await tablet.screenshot({ path: resolve(outDir, 'tablet-top.png') })

await browser.close()
console.log(`\nAll ${checks} mobile checks passed.`)

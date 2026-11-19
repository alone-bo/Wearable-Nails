import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = 'http://127.0.0.1:5173/'
const outDir = resolve('previews')
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch({ executablePath, headless: true })
const errors = []
let checks = 0

function assert(condition, message) {
  checks += 1
  if (!condition) throw new Error(`FAIL: ${message}`)
  console.log(`ok ${checks} - ${message}`)
}

async function makePage(viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)
  return page
}

const desktop = await makePage({ width: 1440, height: 900 })
assert((await desktop.locator('h1').innerText()).includes('Quietly'), 'hero heading renders')
assert((await desktop.locator('.product-card').count()) === 8, 'eight products render')

// Force lazy-loaded assets and scroll reveals to settle.
const pageHeight = await desktop.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < pageHeight; y += 650) {
  await desktop.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
  await desktop.waitForTimeout(80)
}
await desktop.waitForTimeout(500)
await desktop.evaluate(() => window.scrollTo(0, 0))
await desktop.waitForTimeout(300)

const images = await desktop.evaluate(() =>
  Array.from(document.images).map((img) => ({ src: img.getAttribute('src'), ok: img.complete && img.naturalWidth > 0 })),
)
assert(images.every((image) => image.ok), 'all images load')
console.log('images', images.length)

// Filters
await desktop.getByRole('button', { name: /Nail care/ }).click()
await desktop.waitForTimeout(250)
assert((await desktop.locator('.product-card').count()) === 2, 'nail care filter shows two products')
await desktop.getByRole('button', { name: /All pieces/ }).click()
await desktop.waitForTimeout(250)

// Primary navigation filters the collection.
await desktop.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Nail care' }).click()
await desktop.waitForTimeout(650)
assert((await desktop.locator('.product-card').count()) === 2, 'header nav filters the collection')
await desktop.getByRole('button', { name: /All pieces/ }).click()
await desktop.waitForTimeout(250)

// Add and adjust cart
await desktop.getByRole('button', { name: 'Quick add The Olive Hour to bag' }).click()
await desktop.waitForTimeout(350)
assert((await desktop.locator('.bag-count').innerText()) === '2', 'quick add increments bag count')
await desktop.getByRole('button', { name: 'Open shopping bag' }).click()
await desktop.waitForTimeout(550)
assert(await desktop.getByRole('dialog', { name: 'Shopping bag' }).isVisible(), 'cart drawer opens')
await desktop.getByRole('button', { name: 'Increase quantity of The Olive Hour' }).click()
await desktop.waitForTimeout(250)
assert((await desktop.locator('.cart__subtotal strong').innerText()).includes('567'), 'cart subtotal updates')
assert(await desktop.locator('.cart__shipping-done').isVisible(), 'free delivery state updates')
await desktop.screenshot({ path: resolve(outDir, 'cart-updated.png') })
await desktop.getByRole('button', { name: 'Remove The Olive Hour from bag' }).click()
await desktop.waitForTimeout(300)
assert(await desktop.getByRole('heading', { name: 'Your bag is waiting.' }).isVisible(), 'empty cart state renders')
await desktop.locator('.dialog--drawer[open] .dialog__close').click()
await desktop.waitForTimeout(400)

// Search and quick view
await desktop.getByRole('button', { name: 'Search the shop' }).click()
await desktop.waitForTimeout(450)
await desktop.getByRole('searchbox', { name: 'Search products' }).fill('serum')
await desktop.waitForTimeout(250)
assert((await desktop.locator('.search-result').count()) >= 1, 'search returns matching products')
assert((await desktop.locator('.search-result').first().innerText()).includes('Nail Care Serum'), 'search result is relevant')
await desktop.locator('.search-result').first().click()
await desktop.waitForTimeout(600)
assert(await desktop.getByRole('dialog', { name: 'Nail Care Serum' }).isVisible(), 'quick view opens from search')
await desktop.screenshot({ path: resolve(outDir, 'quickview-serum.png') })
await desktop.getByRole('button', { name: /Add to bag/ }).click()
await desktop.waitForTimeout(700)
assert(await desktop.getByRole('dialog', { name: 'Shopping bag' }).isVisible(), 'cart opens after quick view add')
await desktop.locator('.dialog--drawer[open] .dialog__close').click()
await desktop.waitForTimeout(500)

// Booking flow
await desktop.locator('.site-header__book').click()
await desktop.waitForTimeout(500)
assert(await desktop.getByRole('dialog', { name: 'Book a studio visit' }).isVisible(), 'booking dialog opens')
await desktop.locator('#booking-name').fill('Amira Test')
await desktop.locator('#booking-email').fill('amira@example.com')
const tomorrow = await desktop.evaluate(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
await desktop.locator('#booking-date').fill(tomorrow)
await desktop.locator('#booking-time').selectOption('14:30')
await desktop.getByRole('button', { name: 'Request appointment' }).click()
await desktop.waitForTimeout(500)
assert(await desktop.getByRole('heading', { name: /pencilled in/ }).isVisible(), 'booking confirmation renders')
await desktop.screenshot({ path: resolve(outDir, 'booking-success.png') })
await desktop.getByRole('button', { name: 'Back to YOUGLOW' }).click()
await desktop.waitForTimeout(400)

// Newsletter
await desktop.locator('#newsletter-email').fill('bad-email')
await desktop.getByRole('button', { name: /Subscribe/ }).click()
await desktop.waitForTimeout(200)
assert(await desktop.getByRole('alert').filter({ hasText: 'valid email' }).isVisible(), 'newsletter validation shows')
await desktop.locator('#newsletter-email').fill('hello@youglow.ma')
await desktop.getByRole('button', { name: /Subscribe/ }).click()
await desktop.waitForTimeout(250)
assert(await desktop.getByRole('status').filter({ hasText: 'You are on the list' }).isVisible(), 'newsletter success shows')

// Overflow at breakpoints
for (const width of [1440, 1024, 768, 390, 360]) {
  const page = await makePage({ width, height: 900 })
  const sizes = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  assert(sizes.scrollWidth <= sizes.clientWidth + 1, `no horizontal overflow at ${width}px`)
  await page.close()
}

// Mobile menu
const mobile = await makePage({ width: 390, height: 844 })
await mobile.getByRole('button', { name: 'Open site menu' }).click()
await mobile.waitForTimeout(450)
assert(await mobile.getByRole('dialog', { name: 'Site menu' }).isVisible(), 'mobile navigation opens')
await mobile.screenshot({ path: resolve(outDir, 'mobile-menu.png') })
await mobile.keyboard.press('Escape')
await mobile.waitForTimeout(350)
assert(!(await mobile.getByRole('dialog', { name: 'Site menu' }).isVisible()), 'mobile navigation closes with Escape')
await mobile.close()

console.log(errors.length ? `Console errors:\n${errors.join('\n')}` : 'No console errors')
assert(errors.length === 0, 'no browser console errors')
await browser.close()
console.log(`\nAll ${checks} checks passed.`)

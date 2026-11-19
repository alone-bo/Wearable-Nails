import { chromium } from 'playwright-core'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = 'http://127.0.0.1:5173'
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
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`http ${response.status()}: ${response.url()}`)
  })
  return page
}

async function settleImages(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await page.waitForTimeout(35)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(200)
  return page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.getAttribute('src')),
  )
}

const page = await makePage({ width: 1440, height: 900 })

// Home → shop
await page.goto(baseUrl + '/', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
assert((await page.locator('h1').innerText()).includes('Quietly'), 'homepage hero renders')
assert((await page.locator('.product-card').count()) === 8, 'homepage shows eight products')

await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Shop all' }).click()
await page.waitForURL('**/shop')
await page.waitForTimeout(350)
assert((await page.locator('h1').innerText()).includes('Everyday pieces'), 'shop page renders')
assert((await page.locator('.product-card').count()) === 8, 'shop shows full collection')
assert((await page.locator('.primary-nav a.is-current').count()) === 1, 'only one primary nav item is active on shop')
assert((await page.locator('.primary-nav a.is-current').innerText()).toLowerCase().includes('shop all'), 'shop-all nav is active on the unfiltered shop')
assert((await page.locator('.page-hero__image').count()) === 1, 'shop banner renders a full-bleed nail image')

await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Press-ons' }).click()
await page.waitForURL('**/shop?category=press-on')
await page.waitForTimeout(350)
assert((await page.locator('.product-card').count()) === 4, 'press-on navigation filters products')
assert((await page.locator('.primary-nav a.is-current').count()) === 1, 'only one nav item is active after press-on filter')
assert((await page.locator('.primary-nav a.is-current').innerText()).toLowerCase().includes('press-ons'), 'press-on nav is active')

await page.evaluate(() => window.scrollTo(0, 500))
const scrollBeforeFilter = await page.evaluate(() => window.scrollY)
await page.getByRole('button', { name: /Nail care/ }).click()
await page.waitForTimeout(300)
const scrollAfterFilter = await page.evaluate(() => window.scrollY)
assert(Math.abs(scrollAfterFilter - scrollBeforeFilter) < 10, 'filtering the edit keeps the current scroll position')
assert((await page.locator('.product-card').count()) === 2, 'category filter updates shop grid')
assert(page.url().includes('category=care'), 'category filter syncs to URL')
assert((await page.locator('.primary-nav a.is-current').count()) === 1, 'only one nav item remains active after in-page filter')
assert((await page.locator('.primary-nav a.is-current').innerText()).toLowerCase().includes('nail care'), 'in-page filter updates the active nav item')

await page.getByRole('button', { name: /All pieces/ }).click()
await page.waitForTimeout(300)
await page.locator('.catalog__sort select').selectOption('price-asc')
await page.waitForTimeout(250)
assert((await page.locator('.product-card__name').first().innerText()).includes('Soft Buff Duo'), 'price sorting works')

// Quick view → full product page
await page.getByRole('button', { name: 'View Soft Buff Duo' }).click()
await page.waitForTimeout(500)
assert(await page.getByRole('dialog', { name: 'Soft Buff Duo' }).isVisible(), 'quick view opens from shop')
await page.getByRole('button', { name: 'View full product details' }).click()
await page.waitForURL('**/product/soft-buff')
await page.waitForTimeout(450)
assert((await page.locator('h1').innerText()).includes('Soft Buff Duo'), 'product page opens from quick view')

await page.getByRole('button', { name: /Add to bag/ }).click()
await page.waitForTimeout(550)
assert(await page.getByRole('dialog', { name: 'Shopping bag' }).isVisible(), 'product page adds to bag and opens drawer')
await page.locator('.dialog--drawer[open] .dialog__close').click()
await page.waitForTimeout(400)

// Search → quick view
await page.getByRole('button', { name: 'Search the shop' }).click()
await page.waitForTimeout(400)
await page.getByRole('searchbox', { name: 'Search products' }).fill('cuticle')
await page.waitForTimeout(250)
assert((await page.locator('.search-result').count()) >= 1, 'search returns results')
await page.locator('.search-result').first().click()
await page.waitForTimeout(600)
assert(await page.getByRole('dialog', { name: 'Cuticle Oil' }).isVisible(), 'search result opens quick view')
await page.keyboard.press('Escape')
await page.waitForTimeout(350)

// About page
await page.goto(baseUrl + '/about', { waitUntil: 'networkidle' })
await page.waitForTimeout(350)
assert((await page.locator('h1').innerText()).includes('Made slowly'), 'about page renders')
assert((await page.locator('.about-values__grid article').count()) === 3, 'about page shows three values')

// FAQ search and category filter
await page.goto(baseUrl + '/faq', { waitUntil: 'networkidle' })
await page.waitForTimeout(350)
assert((await page.locator('.faq-item').count()) === 19, 'FAQ shows all nineteen questions')
assert((await page.locator('.faq-item[open]').count()) >= 1, 'first FAQ answer is open by default')
await page.locator('#faq-search').fill('refund')
await page.waitForTimeout(250)
assert((await page.locator('.faq-item').count()) > 0, 'FAQ search returns matching questions')
await page.locator('#faq-search').fill('')
await page.getByRole('button', { name: /Returns & care/ }).click()
await page.waitForTimeout(200)
assert((await page.locator('.faq-group').count()) === 1, 'FAQ category filter works')

// Contact form
await page.goto(baseUrl + '/contact', { waitUntil: 'networkidle' })
await page.waitForTimeout(350)
await page.getByRole('button', { name: 'Send message' }).click()
await page.waitForTimeout(200)
assert((await page.locator('.field__error').count()) === 3, 'contact form validates required fields')
await page.locator('#contact-name').fill('Amira Test')
await page.locator('#contact-email').fill('amira@example.com')
await page.locator('#contact-message').fill('I would love help choosing a set for a wedding.')
await page.getByRole('button', { name: 'Send message' }).click()
await page.waitForTimeout(250)
assert((await page.locator('.contact-success').innerText()).includes('Your note is on its way'), 'contact form success state renders')

// Journal → article
await page.goto(baseUrl + '/journal', { waitUntil: 'networkidle' })
await page.waitForTimeout(350)
assert((await page.locator('.feature').count()) === 1, 'journal page shows cover story')
await page.locator('.feature').click()
await page.waitForURL('**/journal/make-press-ons-last')
await page.waitForTimeout(350)
assert((await page.locator('h1').innerText()).includes('press-on set last three weeks'), 'journal article opens')
assert((await page.locator('.article-section').count()) === 3, 'journal article shows all sections')
await page.locator('.article-next__link').click()
await page.waitForTimeout(500)
assert(page.url().includes('/journal/slower-kind-of-beauty'), 'read next navigates to another article')

// Legal pages
for (const [path, heading] of [
  ['/privacy', 'Your privacy'],
  ['/terms', 'The fine print'],
  ['/shipping-returns', 'Shipping & returns'],
]) {
  await page.goto(baseUrl + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(250)
  assert((await page.locator('h1').innerText()).includes(heading), `${path} renders`)
  assert((await page.locator('.legal-section').count()) >= 8, `${path} includes policy sections`)
}

// Header booking flow
await page.goto(baseUrl + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(250)
await page.locator('.site-header__book').click()
await page.waitForTimeout(500)
assert(await page.getByRole('dialog', { name: 'Book a studio visit' }).isVisible(), 'booking opens from global header')
await page.locator('#booking-name').fill('Amira Test')
await page.locator('#booking-email').fill('amira@example.com')
const tomorrow = await page.evaluate(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
await page.locator('#booking-date').fill(tomorrow)
await page.getByRole('button', { name: 'Request appointment' }).click()
await page.waitForTimeout(400)
assert(await page.getByRole('heading', { name: /pencilled in/ }).isVisible(), 'booking confirmation renders')
await page.getByRole('button', { name: 'Back to YOUGLOW' }).click()
await page.waitForTimeout(300)

// 404
await page.goto(baseUrl + '/a-page-that-does-not-exist', { waitUntil: 'networkidle' })
await page.waitForTimeout(250)
assert((await page.locator('h1').innerText()).includes('wandered off'), '404 page renders for unknown route')

// Assets and overflow
const keyPages = ['/', '/shop', '/product/olive-hour', '/about', '/faq', '/contact', '/journal', '/journal/make-press-ons-last', '/privacy', '/terms', '/shipping-returns', '/404']
const breakpoints = [1440, 1024, 768, 390, 360]
for (const width of breakpoints) {
  const p = await makePage({ width, height: 900 })
  for (const path of keyPages) {
    await p.goto(baseUrl + path, { waitUntil: 'networkidle' })
    const sizes = await p.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    if (sizes.scrollWidth > sizes.clientWidth + 1) {
      throw new Error(`horizontal overflow at ${width}px on ${path}`)
    }
  }
  checks += 1
  console.log(`ok ${checks} - no horizontal overflow across pages at ${width}px`)
  await p.close()
}

const imageFailures = await settleImages(page)
assert(imageFailures.length === 0, 'all lazy images load on the last visited page')

assert(errors.length === 0, 'no console or network errors')
console.log(errors.length ? errors.join('\n') : 'No browser console errors')
await browser.close()
console.log(`\nAll ${checks} checks passed.`)

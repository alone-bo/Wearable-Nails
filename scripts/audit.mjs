import { chromium } from 'playwright-core'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = 'http://127.0.0.1:5173/'
const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const failed = []
page.on('response', (response) => {
  if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`)
})
await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
const auditHeight = await page.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < auditHeight; y += 700) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
  await page.waitForTimeout(70)
}
await page.waitForTimeout(400)
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(250)

const report = await page.evaluate(() => {
  const visible = (el) => {
    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
  }
  const nameOf = (el) =>
    (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || '').trim()
  const buttons = Array.from(document.querySelectorAll('button')).filter(visible)
  const links = Array.from(document.querySelectorAll('a')).filter(visible)
  const images = Array.from(document.images)
  return {
    title: document.title,
    fonts: {
      cormorant: document.fonts.check('16px "Cormorant Garamond"'),
      montserrat: document.fonts.check('16px Montserrat'),
    },
    unnamedButtons: buttons.filter((button) => !nameOf(button)).map((button) => button.outerHTML.slice(0, 120)),
    unnamedLinks: links.filter((link) => !nameOf(link)).map((link) => link.outerHTML.slice(0, 120)),
    imagesWithoutAlt: images.filter((image) => !image.hasAttribute('alt')).map((image) => image.src),
    imagesBroken: images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
    heroImagePriority: document.querySelector('.hero__figure img')?.getAttribute('fetchpriority'),
    dialogs: document.querySelectorAll('dialog').length,
    headings: Array.from(document.querySelectorAll('h1,h2,h3')).slice(0, 30).map((h) => `${h.tagName}:${h.innerText.trim().slice(0, 48)}`),
  }
})
console.log(JSON.stringify({ ...report, failed }, null, 2))

const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
await reduced.goto(baseUrl, { waitUntil: 'networkidle' })
await reduced.waitForTimeout(400)
const reducedState = await reduced.evaluate(() => {
  const reveal = document.querySelector('.reveal')
  return {
    revealClasses: reveal ? reveal.className : null,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }
})
console.log('reduced motion', reducedState)

await browser.close()

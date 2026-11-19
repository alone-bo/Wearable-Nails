import { chromium } from 'playwright-core'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = 'http://127.0.0.1:5173'
const browser = await chromium.launch({ executablePath, headless: true })
const errors = []
let checked = 0

const routes = [
  '/',
  '/shop',
  '/product/olive-hour',
  '/about',
  '/faq',
  '/contact',
  '/journal',
  '/journal/make-press-ons-last',
  '/privacy',
  '/terms',
  '/shipping-returns',
  '/404',
]

for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (error) => errors.push(`${route} pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${route} console: ${message.text()}`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${route} http ${response.status()}: ${response.url()}`)
  })

  await page.goto(baseUrl + route, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await page.waitForTimeout(25)
  }
  await page.waitForTimeout(250)

  const report = await page.evaluate(() => {
    const visible = (el) => {
      const style = getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0
    }
    const nameOf = (el) =>
      (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || '').trim()
    const h1s = Array.from(document.querySelectorAll('h1'))
    const buttons = Array.from(document.querySelectorAll('button')).filter(visible)
    const links = Array.from(document.querySelectorAll('a')).filter(visible)
    const images = Array.from(document.images)
    const ids = Array.from(document.querySelectorAll('[id]')).map((el) => el.id)
    return {
      title: document.title,
      h1Count: h1s.length,
      h1: h1s[0]?.innerText.trim() || '',
      unnamedButtons: buttons.filter((button) => !nameOf(button)).map((button) => button.outerHTML.slice(0, 100)),
      unnamedLinks: links.filter((link) => !nameOf(link)).map((link) => link.outerHTML.slice(0, 100)),
      noAlt: images.filter((img) => !img.hasAttribute('alt')).map((img) => img.src),
      broken: images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
      duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
      language: document.documentElement.lang,
    }
  })

  if (report.h1Count !== 1) errors.push(`${route} has ${report.h1Count} h1 elements`)
  if (!report.title) errors.push(`${route} has no title`)
  if (report.unnamedButtons.length) errors.push(`${route} unnamed buttons: ${report.unnamedButtons.join(' | ')}`)
  if (report.unnamedLinks.length) errors.push(`${route} unnamed links: ${report.unnamedLinks.join(' | ')}`)
  if (report.noAlt.length) errors.push(`${route} images without alt: ${report.noAlt.join(', ')}`)
  if (report.broken.length) errors.push(`${route} broken images: ${report.broken.join(', ')}`)
  if (report.duplicateIds.length) errors.push(`${route} duplicate ids: ${report.duplicateIds.join(', ')}`)
  if (report.language !== 'en') errors.push(`${route} lang is ${report.language}`)
  checked += 1
  console.log(`ok ${route} · ${report.h1}`)
  await page.close()
}

console.log(errors.length ? `\nProblems:\n${errors.join('\n')}` : '\nNo accessibility or asset problems found.')
await browser.close()
if (errors.length) process.exitCode = 1

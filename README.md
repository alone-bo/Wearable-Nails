# YOUGLOW — Nail Atelier & Storefront Demo

A complete, responsive homepage demo for **YOUGLOW**, a Casablanca nail atelier and press-on nail shop. Built with **Vue 3 + Vite**, with a quiet-luxury visual language based on the supplied references: sage green, warm cream, rose gold, editorial serif type and a sun motif.

![YOUGLOW desktop preview](previews/desktop-top.png)

## Run it

```bash
pnpm install
pnpm dev
```

Local preview: <http://127.0.0.1:5173/>

```bash
pnpm build     # production build in dist/
pnpm preview   # preview the production build
node scripts/test-ui.mjs       # desktop + responsive interaction checks
node scripts/test-mobile.mjs   # mobile dialog and menu checks
```

## What is included

- Editorial hero with loyalty card, signature product card and social proof
- Shop collection with category filtering and eight hand-built product visuals
- Product quick view with quantity, wishlist and add-to-bag
- Working shopping bag: quantity updates, remove, free-delivery progress, subtotal
- Search dialog with instant results
- Studio services with a fully validated appointment request flow
- Limited-edition “Olive Hour” campaign
- Client testimonials, Glow Club loyalty section, journal cards and Instagram gallery
- Newsletter validation and success state
- Mobile navigation, sticky header and responsive layouts at 360/390/768/1024/1440 px
- Local fonts and images — no external CDN assets at runtime

## Demo boundaries

This is a **front-end homepage demo**, not a production commerce integration:

- Checkout is not connected to a payment provider. The button deliberately shows a demo message.
- Appointment requests are validated in the browser and show a demo confirmation; nothing is sent to a server.
- Newsletter subscription is a local success state; no email is sent.
- Journal and social links point to placeholder/external destinations.

The booking confirmation itself states that no real appointment has been reserved, so the demo never implies a completed transaction.

## Project structure

```text
src/
  App.vue                    homepage composition and section styles
  styles.css                 global tokens, reset, typography, utilities
  fonts.css                  local font-face declarations
  data/products.js           products, services, testimonials, journal data
  components/
    BaseDialog.vue           accessible native <dialog> wrapper
    BookingDialog.vue        validated booking request flow
    BrandLogo.vue            serif wordmark + sun “O”
    CartDrawer.vue           cart drawer and empty state
    Icon.vue                 inline SVG icon set
    ProductCard.vue          product card and wishlist/quick-add controls
    ProductVisual.vue        CSS packaging illustrations for the collection
    QuickViewDialog.vue      product detail modal
    SearchDialog.vue         collection search
    SiteFooter.vue
    SiteHeader.vue
    SunMark.vue              reusable sun motif
public/
  fonts/                     self-hosted Cormorant Garamond + Montserrat
  images/                    optimized WebP editorial images
scripts/
  prepare_assets.py          image/font processing
  screenshot.mjs             screenshot capture
  test-ui.mjs                interaction and responsive checks
  test-mobile.mjs            mobile dialog checks
design-system/youglow/MASTER.md
```

## Design tokens

| Token | Value | Use |
| --- | --- | --- |
| `--cream` | `#F7F2E9` | Primary page background |
| `--cream-soft` | `#FBF7F0` | Cards and raised surfaces |
| `--sand` | `#EBDFCD` | Campaign and newsletter bands |
| `--sage` | `#7D8E6E` | Botanical accent |
| `--sage-deep` | `#536148` | Primary CTA and display accents |
| `--sage-dark` | `#394733` | Studio and footer grounds |
| `--rose` | `#BF8D76` | Rose-gold decorative accent |
| `--rose-deep` | `#925E4A` | Accessible rose text accent |
| `--ink` | `#2F372C` | Primary text |
| `--ink-soft` | `#5F6858` | Supporting text |
| `--ink-faint` | `#68705E` | Small labels (4.5:1+ on cream) |

Typography: **Cormorant Garamond** for display, **Montserrat** for UI. Arabic uses a system Arabic stack.

## Asset notes

Photography is sourced from Unsplash and Pexels for this design demo and optimized to local WebP files. See [CREDITS.md](CREDITS.md) for sources. Replace with commissioned YOUGLOW photography before production. Fonts are self-hosted from Google Fonts (SIL Open Font License).

Tested in Chromium with Playwright. The page has no browser console errors and no horizontal overflow at 360, 390, 768, 1024 and 1440 px.

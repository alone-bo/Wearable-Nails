# YOUGLOW — Design System Master

**Brand:** YOUGLOW Nail & Beauty Studio  
**Product:** Quiet-luxury press-on nail shop + Casablanca atelier booking  
**Market:** Morocco / bilingual French–Arabic–English context  
**Experience:** Editorial, warm, slow beauty, small-batch, quietly confident

This file is the source of truth for all future YOUGLOW pages. Page-level overrides live in `pages/`.

---

## 1. Creative direction

A sunlit atelier on the Casablanca Corniche: warm stone, olive branches, polished nails, rose-gold light. The interface should feel **curated rather than decorative** and **expensive without being cold**.

**Do**

- Generous white space, asymmetric editorial layouts, oversized Cormorant display type.
- Sage and cream as the dominant ground; rose gold used sparingly as a line, seal, or accent.
- Real hands, natural light, tactile cream textiles, botanical shadows.
- Hairline borders, soft paper-like surfaces, restrained shadows.
- Artisanal details: hand-numbered sections, seals, small-batch language.

**Avoid**

- Bright saturated pinks or generic “beauty salon” purple.
- Glossy gradients, heavy drop shadows, neon CTAs, cartoon icons.
- Dense e-commerce chrome, countdown timers, aggressive discounts.
- Mixing more than one decorative motif; the sun is the signature.

---

## 2. Color tokens

| Token | Hex | Role |
| --- | --- | --- |
| `--cream` | `#F7F2E9` | Page base |
| `--cream-soft` | `#FBF7F0` | Cards, modal surfaces |
| `--cream-deep` | `#EFE7DA` | Quiet section grounds |
| `--sand` | `#EBDFCD` | Campaign/newsletter |
| `--sand-deep` | `#DDCBB4` | Borders, decorative rules |
| `--sage` | `#7C8E67` | Light brand green — large display accents, botanical surfaces |
| `--sage-soft` | `#A8B398` | Soft botanical tint |
| `--sage-wash` | `#E9EBE0` | Loyalty / benefit bands |
| `--sage-deep` | `#616E54` | Dark brand green — primary actions, dark section grounds |
| `--sage-dark` | `#616E54` | Alias of the dark brand green |
| `--sage-press` | `#4F5A44` | Hover/pressed interaction shade |
| `--rose` | `#BF8D76` | Rose-gold rules, seals, stars |
| `--rose-light` | `#E5C8B8` | Rose accents on dark grounds |
| `--rose-deep` | `#925E4A` | Accessible rose text accent |
| `--ink` | `#2F372C` | Primary copy |
| `--ink-soft` | `#5F6858` | Body secondary |
| `--ink-faint` | `#68705E` | Labels / metadata (4.5:1 on cream) |
| `--white` | `#FFFDF8` | Warm white |

Rules:

- The brand is built on two greens: light `#7C8E67` and dark `#616E54`. Use the light green for large italic display accents and botanical surfaces, and the dark green for primary actions and dark grounds.
- Primary CTA background is `--sage-deep`, never `--sage` (contrast).
- Light green is a display/accent color, not body copy: it sits around 3.2:1 against cream, so use it only for large display text or decorative surfaces; small text must use a darker token.
- Rose gold is decorative. For rose text on cream use `--rose-deep` at 12px+.
- On `#616E54`, keep secondary cream text at `rgba(247,242,233,.94)` or higher so small copy stays above 4.5:1. Build hierarchy with size and weight rather than opacity.
- Do not place body copy directly on `--sage`; use cream cards or switch the ground to `--sage-deep`.

---

## 3. Typography

- Display: **Cormorant Garamond** 300/400/500, italic for emotional phrases.
- UI/body: **Montserrat** 300/400/500/600.
- Arabic: system Arabic stack (`Segoe UI`, `Tahoma`), never italic.

Scale:

| Role | Desktop | Mobile |
| --- | --- | --- |
| Hero H1 | 5.4–9.6rem, 0.78 line-height | 4–6rem |
| Section H2 | 2.9–5.25rem | 2.4–3.6rem |
| Card title | 1.35–1.85rem | 1.2–1.45rem |
| Body | 12–14px, 1.8–1.9 | 12–13px |
| Eyebrow | 10.5px, .24em tracking | 9–10px |
| Micro label | 7–9px, .1–.16em | 6.5–8px |

Use sentence case for editorial headings. Use uppercase only for eyebrows, buttons, labels and price metadata. Never letterspace long body copy.

---

## 4. Layout

- Max content width: `1360px`; gutter `clamp(20px, 4.2vw, 64px)`.
- Section rhythm: `clamp(76px, 9vw, 136px)` block padding.
- Desktop grids: 12-column mental model, 2–4 practical columns.
- Hero: 0.94fr copy / 1.06fr visual, asymmetric arch image and floating cards.
- Shop: 4 columns >1180px, 3 columns >760px, 2 columns mobile.
- Breakpoints: 1180, 980, 760, 480, 360.
- Cards: 1px hairline border, 7–12px radius, no heavy shadow at rest.
- Buttons: 6px radius, min height 48–49px; small header CTA 42px.

---

## 5. Components

### Brand logo
Cormorant wordmark split as `YOUGL` + sun + `W`. Sun is rose gold. Arabic “يوغلو” sits beside it. The logo is decorative inside a labelled link.

### Sun motif
24-ray radial line sun with a warm ivory core. Use as:
- Logo “O”
- Section seals and loyalty marks
- Low-opacity background halo
- Small trust/benefit icon at 13–30px

Do not turn the sun into a generic emoji or a filled yellow graphic.

### Buttons
- Primary: deep sage fill, warm white caps label, arrow at right.
- Outline: 1px hairline, ink label, fills ink on hover.
- Cream: for dark sections.
- Ghost light: cream outline for dark grounds.
- Always visible focus ring via `:focus-visible`.

### Product cards
- Soft cream card, packaging illustration, badge top-left, heart top-right.
- Category + rating micro-row, serif name, shade, swatches, price and Add.
- Hover: 5px lift, shadow, image scale 1.025, quick-add plus appears.
- Mobile: 2 columns, quick-add remains visible.

### Product visuals
Packaging illustrations are generated in CSS to keep a consistent art direction:
- Press-on carton with window, nail fan and “HAND FINISHED” seal.
- Amber serum dropper, cream cuticle-oil tube, atelier gift box.
- Product colorways come from `products.js`; keep packaging typography small and quiet.

### Dialog system
Native `<dialog>` for all overlays, with backdrop blur, Escape close and focus restoration. Drawers: cart, mobile menu. Search: top-centered panel. Product/booking: centered modal; mobile bottom sheet at 94dvh.

---

## 6. Motion

- 220–420ms ease-out for UI transitions.
- 700–1400ms for image scale on hover.
- Scroll reveals: 28px rise + fade, 80ms stagger, IntersectionObserver.
- Respect `prefers-reduced-motion`; never animate width/height for layout.
- No auto-rotating carousels. Motion supports orientation, not spectacle.

---

## 7. Content voice

Quiet, tactile, specific. Short sentences. Avoid hype.

- Prefer “Hand-finished in Casablanca” over “Luxury beauty products”.
- Prefer “Up to 20 wears with care” over “Long-lasting formula”.
- Name the ritual, the material, the place.
- French/Arabic accents are atmospheric: “Fait main à Casa”, “يوغلو”. Do not fake fluency; keep Arabic brand lockups reviewed by a native speaker before launch.

---

## 8. Accessibility & quality bar

- Contrast: body copy ≥4.5:1; large display ≥3:1; decorative text not used for information.
- All interactive controls ≥44px on touch; visible keyboard focus; no hover-only actions.
- Images have meaningful alt text; decorative visuals hidden from assistive tech.
- Forms: visible labels, inline errors, `aria-invalid` and `aria-describedby`.
- Dialogs: labelled, modal, Escape-closable, focus restored.
- Test no horizontal overflow at 360, 390, 768, 1024, 1440.
- Test dialog stacking, menu→booking/search transitions, reduced-motion and console errors.

---

## 9. Interior-page patterns

All non-home pages reuse the same shell and rhythm:

- **PageHero**: small breadcrumb, 10px eyebrow, oversized serif H1 with a light-green italic accent, 540px lede, optional metadata row or search/filter controls, and an optional full-bleed nail photograph on the right (faded into cream, hidden below 980px). Background is cream with a faint rose sun at the upper right.
- **PageCta**: shared **light sand-to-cream closing band** — not a dark band — with a serif headline, 12px supporting copy, a rose sun watermark and dark-green/outline actions. The light CTA sits directly above the dark footer and must stay visually distinct from it.
- **About hero**: breadcrumb, eyebrow, oversized H1, copy and stats on the left; an arched nail image on the right. The module must fit inside a 1366×768 desktop viewport: cap the image with `max-height: clamp(380px, 56vh, 600px)` and keep hero padding at `clamp(30px, 3.8vw, 52px)` / `clamp(36px, 4.4vw, 64px)`. Story and atelier images use the same height-cap treatment so no image runs past a full screen.
- **Navigation state**: active page links are calculated from path *and* shop category, never from RouterLink’s automatic path-only active classes. Exactly one primary nav item may be marked active.
- **Shop filters**: category changes update the query string without resetting scroll position. Moving between pages still scrolls to the top (or to the requested hash).
- **Reading pages**: 710px max text column, 11–12px/1.85 body copy, numbered H2s, sticky table of contents at 230px. On mobile the table of contents collapses and the text becomes single-column.
- **FAQ**: two-column layout with sticky search/category rail, accordion rows built on native `<details>`, and the first answer open by default.
- **Shop**: PageHero → search/filter/sort toolbar → product grid → closing CTA. Filter state lives in the query string so a filtered collection can be shared; keyword search is shared by the homepage module and the full Shop page.
- **Product**: breadcrumb strip, sticky two-column gallery/purchase panel, ritual strip, review panel, related products, closing CTA.
- **Reviews**: product summary with rating breakdown, star-filter buttons, review cards and a validated review form. Filters stay local to the page; the form is explicitly marked as a demo. Buyer photos support up to four JPG/PNG/WebP files at 5MB each, with local object-URL previews, individual removal and a confirmation gallery; nothing is uploaded to a server.
- **Cart / checkout**: full-bag page with sticky summary, then a payment page with address, shipping and payment sections. The checkout is a demo, labels card fields as demo-only and clears the bag after the demo confirmation.
- **Newsletter**: the subscription input sits directly below the footer logo, with no separate heading, marketing copy block or standalone page section. It uses a compact inline field, explicit validation and a local success state.
- **Product reviews entry**: the rating summary on a product page is itself an obvious bordered link to `/product/:slug/reviews`, with a visible “Read all reviews” affordance and arrow. Keep a second entry in the lower review section for longer pages.
- **Navigation**: primary menu labels are 11px with generous click targets, show exactly one active item, and include a dedicated Reviews entry that activates on any product reviews route.
- **Journal**: large cover feature + archive grid + quote card; articles use a 710px reading column with a sticky TOC and “read next” module.
- **Contact / legal forms**: visible labels, inline errors, local success states clearly marked as demo interactions where no server exists.

---

## 10. Page inventory

Built:

1. Homepage
2. Shop / category listing with search, filters and sorting
3. Product detail
4. Product reviews and review form
5. Cart
6. Checkout / payment (demo)
7. About / atelier story
8. FAQ (searchable, category-filtered)
9. Contact & studio information
10. Journal index + article template
11. Privacy Policy
12. Terms of Service
13. Shipping & Returns
14. Custom 404

Next:

1. Account + Glow Club dashboard
2. Wishlist page
3. Studio booking page with calendar and service detail
4. Search results page
5. Legal review and final cookie-consent integration
6. Real payment, order and email integration

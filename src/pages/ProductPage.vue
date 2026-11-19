<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductVisual from '../components/ProductVisual.vue'
import SunMark from '../components/SunMark.vue'
import { products } from '../data/products.js'
import { useShop } from '../stores/shop.js'

const route = useRoute()
const router = useRouter()
const { wishlist, addToCart, openCart, openQuick, openBooking, toggleWishlist } = useShop()

const qty = ref(1)

const product = computed(() => products.find((item) => item.id === route.params.slug))
const relatedProducts = computed(() => {
  if (!product.value) return []
  return products.filter((item) => item.id !== product.value.id).slice(0, 4)
})
const saved = computed(() => (product.value ? wishlist.value.includes(product.value.id) : false))

watch(
  () => route.params.slug,
  () => {
    qty.value = 1
  },
)

watchEffect(() => {
  document.title = product.value ? `${product.value.name} — YOUGLOW` : 'Set not found — YOUGLOW'
})

function addToBag() {
  if (!product.value) return
  addToCart(product.value, qty.value)
  openCart()
}

function goToProduct(item) {
  router.push(`/product/${item.id}`)
}
</script>

<template>
  <div v-if="product" class="product-page">
    <div class="product-breadcrumb">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink to="/shop">Shop</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ product.name }}</span>
        </nav>
      </div>
    </div>

    <section class="product-main" aria-labelledby="product-title">
      <div class="container product-main__grid">
        <div class="product-gallery">
          <div class="product-gallery__visual">
            <ProductVisual :product="product" large />
            <span v-if="product.badge" class="product-gallery__badge">{{ product.badge }}</span>
            <span class="product-gallery__caption">Hand-finished in Casablanca · {{ product.categoryLabel }}</span>
          </div>

          <div class="product-gallery__notes">
            <div>
              <SunMark :size="25" />
              <span>Made by hand<br />in small batches</span>
            </div>
            <div>
              <Icon name="leaf" :size="25" />
              <span>10-free, vegan<br />formulas</span>
            </div>
            <div>
              <Icon name="sparkle" :size="25" />
              <span>Reusable<br />with care</span>
            </div>
          </div>
        </div>

        <div class="product-info">
          <div class="product-info__top">
            <span class="eyebrow">{{ product.categoryLabel }}</span>
            <span v-if="product.badge" class="tag">{{ product.badge }}</span>
          </div>

          <h1 id="product-title" class="product-info__title">{{ product.name }}</h1>
          <p class="product-info__shade">{{ product.shade }}</p>

          <RouterLink
            :to="`/product/${product.id}/reviews`"
            class="product-info__rating"
            :aria-label="`Read all ${product.reviews} reviews for ${product.name}`"
          >
            <span class="stars" aria-hidden="true">
              <Icon v-for="star in 5" :key="star" name="star" :size="13" />
            </span>
            <span>{{ product.rating.toFixed(1) }} · {{ product.reviews }} reviews</span>
            <span class="product-info__rating-link">
              Read all reviews
              <Icon name="arrowUpRight" :size="13" />
            </span>
          </RouterLink>

          <div class="product-info__price">
            <strong>{{ product.price }} MAD</strong>
            <s v-if="product.compareAt">{{ product.compareAt }} MAD</s>
            <span v-if="product.compareAt">Save {{ product.compareAt - product.price }} MAD</span>
          </div>

          <p class="product-info__description">{{ product.description }}</p>

          <div class="product-info__finish">
            <span>The finish</span>
            <div>
              <span
                v-for="(tip, index) in product.tips"
                :key="index"
                class="finish-dot"
                :style="{ background: tip }"
              />
              <small>{{ product.tips.length ? 'Curated colourway' : 'Salon-grade care' }}</small>
            </div>
          </div>

          <div class="product-info__highlights">
            <span v-for="highlight in product.highlights" :key="highlight">
              <Icon name="check" :size="12" />
              {{ highlight }}
            </span>
          </div>

          <div class="product-buy">
            <div class="qty-picker" aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" :disabled="qty <= 1" @click="qty--">
                <Icon name="minus" :size="14" />
              </button>
              <span aria-live="polite">{{ qty }}</span>
              <button type="button" aria-label="Increase quantity" @click="qty++">
                <Icon name="plus" :size="14" />
              </button>
            </div>
            <button type="button" class="btn btn--primary product-buy__add" @click="addToBag">
              Add to bag · {{ product.price * qty }} MAD
              <Icon name="arrowRight" :size="16" />
            </button>
            <button
              type="button"
              class="wishlist-button"
              :class="{ 'is-saved': saved }"
              :aria-pressed="saved"
              :aria-label="saved ? 'Remove from wishlist' : 'Save to wishlist'"
              @click="toggleWishlist(product)"
            >
              <Icon name="heart" :size="19" />
            </button>
          </div>

          <div class="product-info__delivery">
            <span><Icon name="truck" :size="15" /> Complimentary delivery over 350 MAD</span>
            <span><Icon name="shield" :size="15" /> 14-day returns on unopened sets</span>
          </div>

          <div class="product-accordions">
            <details open>
              <summary>What's inside <Icon name="plus" :size="15" /></summary>
              <ul>
                <li v-for="detail in product.details" :key="detail">{{ detail }}</li>
                <li>Signature keepsake pouch</li>
                <li>Prep pad &amp; application instructions</li>
              </ul>
            </details>
            <details>
              <summary>How to wear <Icon name="plus" :size="15" /></summary>
              <p>
                Start with clean, dry nails. Size each tip before applying adhesive, press from
                cuticle to tip and hold for 30 seconds. Avoid water for the first hour.
              </p>
            </details>
            <details>
              <summary>Ingredients &amp; care <Icon name="plus" :size="15" /></summary>
              <p>
                All YOUGLOW sets are 10-free and vegan. Store your tips away from direct sunlight
                and clean with the enclosed prep pad between wears. Never force a tip off — soak
                and lift gently.
              </p>
            </details>
          </div>

          <button type="button" class="product-info__book" @click="openBooking()">
            <span>Prefer to have them applied?</span>
            Book a press-on fitting
            <Icon name="arrowUpRight" :size="15" />
          </button>
        </div>
      </div>
    </section>

    <section class="product-ritual">
      <div class="container product-ritual__grid">
        <div>
          <span class="eyebrow">The YOUGLOW way</span>
          <h2>Considered from<br /><em>first press to last wear.</em></h2>
        </div>
        <div class="product-ritual__steps">
          <article>
            <span>01</span>
            <h3>Size, don't guess</h3>
            <p>Ten sizes per set make a close fit possible for every nail — no filing down a too-wide tip.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Press with patience</h3>
            <p>Clean, dry nails and a full thirty seconds of pressure are the two small steps that make a set last.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Wear it again</h3>
            <p>With gentle removal and the enclosed care pouch, a set can be worn up to twenty days in total.</p>
          </article>
        </div>
      </div>
    </section>

    <section id="product-reviews" class="product-reviews" aria-labelledby="reviews-title">
      <div class="container product-reviews__grid">
        <div>
          <span class="eyebrow">Client notes</span>
          <h2 id="reviews-title">Worn, loved,<br /><em>repeated.</em></h2>
          <div class="product-reviews__rating">
            <strong>{{ product.rating.toFixed(1) }}</strong>
            <div>
              <span class="stars" aria-hidden="true">
                <Icon v-for="star in 5" :key="star" name="star" :size="13" />
              </span>
              <p>{{ product.reviews }} verified reviews</p>
              <RouterLink :to="`/product/${product.id}/reviews`" class="product-reviews__all">
                Read all reviews
                <Icon name="arrowRight" :size="13" />
              </RouterLink>
            </div>
          </div>
        </div>
        <figure class="product-review">
          <span class="stars" aria-hidden="true">
            <Icon v-for="star in 5" :key="star" name="star" :size="12" />
          </span>
          <blockquote>
            “The finish is even better in person. I wore them for a week straight and they still
            looked fresh — the sizing made such a difference.”
          </blockquote>
          <figcaption>
            <span>SB</span>
            <div>
              <strong>Salma B.</strong>
              <small>Verified purchase · Casablanca</small>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="product-related section" aria-labelledby="related-title">
      <div class="container">
        <div class="product-related__head">
          <div>
            <span class="eyebrow">You may also love</span>
            <h2 id="related-title">More quiet <em>favourites.</em></h2>
          </div>
          <RouterLink to="/shop" class="text-link">
            Shop all pieces
            <Icon name="arrowRight" :size="14" />
          </RouterLink>
        </div>
        <div class="product-related__grid">
          <ProductCard
            v-for="item in relatedProducts"
            :key="item.id"
            :product="item"
            :saved="wishlist.includes(item.id)"
            @add="addToCart"
            @quick-view="goToProduct"
            @toggle-wishlist="toggleWishlist"
          />
        </div>
      </div>
    </section>

    <PageCta
      eyebrow="A little help?"
      text="Not sure about sizing or wear time? Our atelier team is happy to help you choose, or you can book a fitting in Casablanca."
    >
      <template #title>Your set,<br /><em>your ritual.</em></template>
      <RouterLink to="/faq" class="btn btn--ghost-light">
        Read the FAQ
        <Icon name="arrowUpRight" :size="15" />
      </RouterLink>
      <button type="button" class="btn btn--cream" @click="openBooking()">
        Book a fitting
        <Icon name="calendar" :size="15" />
      </button>
    </PageCta>
  </div>

  <div v-else class="product-missing">
    <SunMark :size="70" />
    <span class="eyebrow">Not found</span>
    <h1>This set has<br /><em>wandered off.</em></h1>
    <p>The piece you are looking for may have been renamed or sold out.</p>
    <div>
      <RouterLink to="/shop" class="btn btn--primary">Browse the collection</RouterLink>
      <RouterLink to="/" class="btn btn--outline">Back home</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  background: var(--cream);
}

.product-breadcrumb {
  padding-block: 25px;
  border-bottom: 1px solid var(--line-soft);
  background: var(--cream-soft);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  color: var(--ink-faint);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
}

.breadcrumb a {
  transition: color 200ms ease;
}

.breadcrumb a:hover {
  color: var(--ink);
}

.breadcrumb > span[aria-current] {
  color: var(--ink);
}

.product-main {
  padding-block: clamp(40px, 6vw, 86px);
}

.product-main__grid {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(0, 1.03fr) minmax(0, 0.97fr);
  gap: clamp(38px, 6vw, 92px);
}

.product-gallery {
  position: sticky;
  top: 108px;
}

.product-gallery__visual {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: var(--cream-deep);
  box-shadow: 0 30px 60px -48px rgba(47, 55, 44, 0.5);
}

.product-gallery__visual :deep(.product-visual) {
  aspect-ratio: 1 / 1.02;
}

.product-gallery__visual :deep(.pv-label),
.product-gallery__visual :deep(.pv-edition) {
  display: none;
}

.product-gallery__badge {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 5;
  padding: 8px 11px;
  border: 1px solid rgba(255, 253, 248, 0.4);
  border-radius: 999px;
  background: rgba(255, 253, 248, 0.88);
  color: var(--sage-dark);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
}

.product-gallery__caption {
  position: absolute;
  right: 17px;
  bottom: 15px;
  z-index: 5;
  color: rgba(47, 55, 44, 0.62);
  font-size: 7.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-gallery__notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.product-gallery__notes > div {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 10px;
  border: 1px solid var(--line-soft);
  border-radius: 5px;
  color: var(--rose-deep);
}

.product-gallery__notes > div > span {
  color: var(--ink-soft);
  font-size: 7px;
  letter-spacing: 0.04em;
  line-height: 1.45;
  text-transform: uppercase;
}

.product-info {
  padding-top: 8px;
}

.product-info__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.product-info__title {
  margin-top: 12px;
  font-size: clamp(3.6rem, 5.5vw, 5.7rem);
  font-weight: 300;
  line-height: 0.94;
}

.product-info__shade {
  margin-top: 9px;
  color: var(--ink-soft);
  font-size: 12px;
}

.product-info__rating {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 13px;
  margin-top: 18px;
  padding: 10px 12px;
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  background: var(--cream-soft);
  color: var(--ink-faint);
  font-size: 9px;
  transition:
    border-color 200ms ease,
    background-color 200ms ease,
    color 200ms ease;
}

.product-info__rating:hover {
  border-color: var(--sage);
  background: var(--white);
  color: var(--ink-soft);
}

.stars {
  display: flex;
  gap: 2px;
  color: var(--rose-deep);
}

.product-info__rating-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  padding-bottom: 2px;
  border-bottom: 1px solid var(--line);
  color: var(--sage-deep);
  font-weight: 500;
  transition:
    gap 200ms ease,
    border-color 200ms ease;
}

.product-info__rating:hover .product-info__rating-link {
  gap: 9px;
  border-color: var(--sage-deep);
}

.product-info__price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 22px;
  padding-block: 18px;
  border-top: 1px solid var(--line-soft);
  border-bottom: 1px solid var(--line-soft);
}

.product-info__price strong {
  font-family: var(--font-display);
  font-size: 2.1rem;
  font-weight: 500;
  line-height: 1;
}

.product-info__price s {
  color: var(--ink-faint);
  font-size: 10px;
}

.product-info__price > span {
  margin-left: auto;
  color: var(--rose-deep);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-info__description {
  max-width: 500px;
  margin-top: 20px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.85;
}

.product-info__finish {
  margin-top: 21px;
}

.product-info__finish > span {
  color: var(--ink-faint);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.product-info__finish > div {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
}

.finish-dot {
  width: 21px;
  height: 21px;
  border: 2px solid var(--cream);
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--line);
}

.product-info__finish small {
  margin-left: 5px;
  color: var(--ink-faint);
  font-size: 8px;
}

.product-info__highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 18px;
}

.product-info__highlights span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  color: var(--ink-soft);
  font-size: 8px;
  letter-spacing: 0.04em;
}

.product-info__highlights :deep(svg) {
  color: var(--sage-deep);
}

.product-buy {
  display: flex;
  align-items: stretch;
  gap: 8px;
  margin-top: 25px;
}

.qty-picker {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--cream-soft);
}

.qty-picker button {
  display: grid;
  width: 38px;
  height: 100%;
  min-height: 50px;
  place-items: center;
  color: var(--ink-soft);
}

.qty-picker button:hover:not(:disabled) {
  color: var(--ink);
}

.qty-picker button:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.qty-picker span {
  min-width: 18px;
  font-size: 10px;
  text-align: center;
}

.product-buy__add {
  flex: 1;
  padding-inline: 15px;
  font-size: 9px;
  letter-spacing: 0.08em;
}

.wishlist-button {
  display: grid;
  width: 51px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink-soft);
  transition:
    color 200ms ease,
    border-color 200ms ease;
}

.wishlist-button:hover,
.wishlist-button.is-saved {
  border-color: var(--rose);
  color: var(--rose-deep);
}

.wishlist-button.is-saved :deep(path) {
  fill: currentColor;
}

.product-info__delivery {
  display: flex;
  flex-wrap: wrap;
  gap: 7px 20px;
  margin-top: 14px;
  color: var(--ink-faint);
  font-size: 8px;
}

.product-info__delivery span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.product-info__delivery :deep(svg) {
  color: var(--sage-deep);
}

.product-accordions {
  margin-top: 24px;
  border-top: 1px solid var(--line);
}

.product-accordions details {
  border-bottom: 1px solid var(--line-soft);
}

.product-accordions summary {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding-block: 14px;
  color: var(--ink);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
  list-style: none;
  text-transform: uppercase;
}

.product-accordions summary::-webkit-details-marker {
  display: none;
}

.product-accordions details[open] summary :deep(svg) {
  transform: rotate(45deg);
}

.product-accordions summary :deep(svg) {
  transition: transform 200ms ease;
}

.product-accordions ul,
.product-accordions p {
  padding: 0 0 16px;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.75;
}

.product-accordions ul {
  display: grid;
  gap: 4px;
  padding-left: 15px;
  list-style: disc;
}

.product-info__book {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 13px 14px;
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  color: var(--ink);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-align: left;
  transition:
    border-color 200ms ease,
    background-color 200ms ease;
}

.product-info__book > span {
  color: var(--ink-faint);
  font-weight: 400;
}

.product-info__book:hover {
  border-color: var(--line);
  background: var(--cream-soft);
}

.product-info__book :deep(svg) {
  margin-left: auto;
  color: var(--sage-deep);
}

.product-ritual {
  padding-block: clamp(62px, 8vw, 102px);
  background: var(--cream-deep);
}

.product-ritual__grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: clamp(38px, 7vw, 100px);
}

.product-ritual h2 {
  margin-top: 13px;
  font-size: clamp(2.7rem, 4.3vw, 4rem);
}

.product-ritual h2 em {
  color: var(--sage-deep);
}

.product-ritual__steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.product-ritual__steps article {
  border-top: 1px solid var(--line);
  padding-top: 15px;
}

.product-ritual__steps article > span {
  color: var(--rose-deep);
  font-size: 8px;
  letter-spacing: 0.08em;
}

.product-ritual__steps h3 {
  margin-top: 12px;
  font-size: 1.35rem;
  line-height: 1.1;
}

.product-ritual__steps p {
  margin-top: 7px;
  color: var(--ink-soft);
  font-size: 10px;
  line-height: 1.7;
}

.product-reviews {
  padding-block: clamp(60px, 7vw, 92px);
  background: var(--sage-deep);
  color: var(--cream);
}

.product-reviews__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 8vw, 120px);
  align-items: center;
}

.product-reviews .eyebrow {
  color: rgba(247, 242, 233, 0.94);
}

.product-reviews h2 {
  margin-top: 13px;
  color: var(--cream);
  font-size: clamp(2.8rem, 4.5vw, 4.2rem);
}

.product-reviews h2 em {
  color: var(--rose-light);
}

.product-reviews__rating {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 26px;
}

.product-reviews__rating > strong {
  font-family: var(--font-display);
  font-size: 3.2rem;
  font-weight: 400;
  line-height: 1;
}

.product-reviews__rating p {
  margin-top: 4px;
  color: rgba(247, 242, 233, 0.95);
  font-size: 8px;
}

.product-reviews__all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--line-light);
  color: var(--cream);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition:
    gap 200ms ease,
    border-color 200ms ease;
}

.product-reviews__all:hover {
  gap: 10px;
  border-color: var(--cream);
}

.product-review {
  padding: 27px;
  border-radius: 8px;
  background: var(--cream-soft);
  color: var(--ink);
}

.product-review blockquote {
  margin-top: 17px;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 1.8vw, 1.65rem);
  line-height: 1.35;
}

.product-review figcaption {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--line-soft);
}

.product-review figcaption > span {
  display: grid;
  width: 33px;
  height: 33px;
  place-items: center;
  border-radius: 50%;
  background: var(--sage-wash);
  color: var(--sage-deep);
  font-family: var(--font-display);
  font-size: 0.85rem;
}

.product-review figcaption div {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.product-review figcaption strong {
  font-size: 9px;
  font-weight: 500;
}

.product-review figcaption small {
  color: var(--ink-faint);
  font-size: 7.5px;
}

.product-related {
  background: var(--cream);
}

.product-related__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 30px;
}

.product-related__head h2 {
  margin-top: 11px;
  font-size: clamp(2.4rem, 3.6vw, 3.3rem);
}

.product-related__head h2 em {
  color: var(--sage-deep);
}

.product-related__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(11px, 1.5vw, 20px);
}

.product-missing {
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  background: var(--cream);
  text-align: center;
}

.product-missing > :deep(svg) {
  color: var(--rose);
  margin-bottom: 18px;
}

.product-missing h1 {
  margin-top: 14px;
  font-size: clamp(3rem, 6vw, 5.5rem);
}

.product-missing h1 em {
  color: var(--sage);
}

.product-missing p {
  margin-top: 16px;
  color: var(--ink-soft);
  font-size: 12px;
}

.product-missing > div {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  margin-top: 24px;
}

@media (max-width: 980px) {
  .product-main__grid {
    grid-template-columns: 1fr;
  }

  .product-gallery {
    position: static;
    max-width: 620px;
    margin-inline: auto;
  }

  .product-ritual__grid,
  .product-reviews__grid {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .product-ritual__steps {
    gap: 18px;
  }

  .product-related__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .product-breadcrumb {
    padding-block: 17px;
  }

  .product-main {
    padding-block: 30px 64px;
  }

  .product-info__title {
    font-size: clamp(3rem, 14vw, 4.5rem);
  }

  .product-gallery__notes {
    gap: 5px;
  }

  .product-gallery__notes > div {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
    padding: 9px;
  }

  .product-gallery__notes > div > span {
    font-size: 6px;
  }

  .product-buy {
    flex-wrap: wrap;
  }

  .product-buy .qty-picker {
    width: 100%;
    justify-content: space-between;
  }

  .qty-picker button {
    width: 44px;
  }

  .product-buy__add {
    flex-basis: calc(100% - 60px);
    min-height: 50px;
  }

  .wishlist-button {
    width: 52px;
  }

  .product-ritual__steps {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .product-related__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
  }

  .product-related__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

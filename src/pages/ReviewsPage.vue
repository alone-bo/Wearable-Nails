<script setup>
import { computed, ref, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import ProductVisual from '../components/ProductVisual.vue'
import SunMark from '../components/SunMark.vue'
import { products } from '../data/products.js'
import { getProductReviews, getRatingBreakdown } from '../data/reviews.js'
import { useShop } from '../stores/shop.js'

const route = useRoute()
const { addToCart } = useShop()

const product = computed(() => products.find((item) => item.id === route.params.slug))
const reviews = computed(() => (product.value ? getProductReviews(product.value) : []))
const breakdown = computed(() => (product.value ? getRatingBreakdown(product.value.rating) : []))

const activeRating = ref('all')
const filteredReviews = computed(() => {
  if (activeRating.value === 'all') return reviews.value
  return reviews.value.filter((review) => review.rating === Number(activeRating.value))
})

const reviewRating = ref(5)
const reviewName = ref('')
const reviewTitle = ref('')
const reviewBody = ref('')
const errors = ref({})
const submitted = ref(false)

function reviewCountFor(stars) {
  return reviews.value.filter((review) => review.rating === stars).length
}

function submitReview() {
  const nextErrors = {}
  if (!reviewName.value.trim()) nextErrors.name = 'Please add your name.'
  if (!reviewTitle.value.trim()) nextErrors.title = 'Please add a short title.'
  if (!reviewBody.value.trim()) nextErrors.body = 'Please tell us a little about your set.'
  errors.value = nextErrors
  if (Object.keys(nextErrors).length) return

  submitted.value = true
}

function writeAnother() {
  submitted.value = false
  reviewRating.value = 5
  reviewName.value = ''
  reviewTitle.value = ''
  reviewBody.value = ''
  errors.value = {}
}

watchEffect(() => {
  if (product.value) document.title = `${product.value.name} reviews — YOUGLOW`
  else document.title = 'Reviews not found — YOUGLOW'
})
</script>

<template>
  <div v-if="product" class="reviews-page">
    <section class="reviews-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink to="/shop">Shop</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink :to="`/product/${product.id}`">{{ product.name }}</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Reviews</span>
        </nav>

        <div class="reviews-hero__grid">
          <div class="reviews-product">
            <RouterLink :to="`/product/${product.id}`" class="reviews-product__thumb" aria-label="Back to product">
              <ProductVisual :product="product" />
            </RouterLink>
            <div>
              <span class="eyebrow">Client notes</span>
              <h1>{{ product.name }}<br /><em>reviews.</em></h1>
              <p>{{ product.shade }} · {{ product.categoryLabel }}</p>
              <RouterLink :to="`/product/${product.id}`" class="text-link">
                Back to the product
                <Icon name="arrowUpRight" :size="14" />
              </RouterLink>
            </div>
          </div>

          <div class="reviews-summary">
            <div class="reviews-summary__score">
              <strong>{{ product.rating.toFixed(1) }}</strong>
              <div>
                <span class="stars" aria-hidden="true">
                  <Icon v-for="star in 5" :key="star" name="star" :size="14" />
                </span>
                <p>Based on {{ product.reviews }} verified reviews</p>
              </div>
            </div>

            <div class="reviews-summary__bars" aria-label="Rating breakdown">
              <div v-for="row in breakdown" :key="row.stars" class="rating-row">
                <span>{{ row.stars }} ★</span>
                <div class="rating-row__track"><span :style="{ width: `${row.percent}%` }" /></div>
                <small>{{ row.percent }}%</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="reviews-main section" aria-labelledby="reviews-list-title">
      <div class="container">
        <div class="reviews-main__head">
          <div>
            <span class="eyebrow">From the community</span>
            <h2 id="reviews-list-title">Worn, loved,<br /><em>repeated.</em></h2>
          </div>
          <a href="#write-review" class="btn btn--outline">
            Write a review
            <Icon name="arrowDown" :size="15" />
          </a>
        </div>

        <div class="reviews-toolbar">
          <div class="reviews-filters" role="group" aria-label="Filter reviews by rating">
            <button
              type="button"
              :class="{ 'is-active': activeRating === 'all' }"
              :aria-pressed="activeRating === 'all'"
              @click="activeRating = 'all'"
            >
              All reviews
              <span>{{ reviews.length }}</span>
            </button>
            <button
              v-for="stars in [5, 4, 3, 2, 1]"
              :key="stars"
              type="button"
              :class="{ 'is-active': activeRating === String(stars) }"
              :aria-pressed="activeRating === String(stars)"
              :aria-label="`${stars} star${stars === 1 ? '' : 's'}, ${reviewCountFor(stars)} reviews`"
              @click="activeRating = String(stars)"
            >
              {{ stars }} {{ stars === 1 ? 'star' : 'stars' }}
              <span>{{ reviewCountFor(stars) }}</span>
            </button>
          </div>
          <p>Showing {{ filteredReviews.length }} of {{ product.reviews }} recent notes</p>
        </div>

        <div v-if="filteredReviews.length" class="reviews-grid">
          <article v-for="review in filteredReviews" :key="review.id" class="review-card">
            <div class="review-card__top">
              <span class="stars" :aria-label="`${review.rating} out of 5 stars`">
                <Icon
                  v-for="star in 5"
                  :key="star"
                  name="star"
                  :size="12"
                  :class="{ 'is-muted': star > review.rating }"
                />
              </span>
              <span class="review-card__date">{{ review.date }}</span>
            </div>
            <h3>{{ review.title }}</h3>
            <p>{{ review.body }}</p>
            <footer>
              <span class="review-card__avatar">{{ review.initials }}</span>
              <span>
                <strong>{{ review.name }}</strong>
                <small>{{ review.verified ? 'Verified purchase' : 'Client note' }}</small>
              </span>
              <span class="review-card__shade">{{ review.shade }}</span>
            </footer>
          </article>
        </div>

        <div v-else class="reviews-empty">
          <SunMark :size="40" />
          <h3>No {{ activeRating }}-star notes yet.</h3>
          <p>Every set is different. Read all reviews or share your own experience.</p>
          <button type="button" class="btn btn--outline" @click="activeRating = 'all'">See all reviews</button>
        </div>
      </div>
    </section>

    <section id="write-review" class="write-review section" aria-labelledby="write-review-title">
      <div class="container write-review__grid">
        <div class="write-review__copy">
          <span class="eyebrow">Share your experience</span>
          <h2 id="write-review-title">Tell us how<br /><em>it wears.</em></h2>
          <p>
            Your notes help someone else choose their next set — and help us make the next batch
            even more considered.
          </p>
          <div class="write-review__product">
            <div aria-hidden="true"><ProductVisual :product="product" /></div>
            <span>
              <small>Writing about</small>
              <strong>{{ product.name }}</strong>
              <span>{{ product.shade }}</span>
            </span>
            <button type="button" class="btn btn--outline" @click="addToCart(product)">
              Add to bag
            </button>
          </div>
        </div>

        <div class="write-review__form-wrap">
          <div v-if="submitted" class="review-success" role="status">
            <span><Icon name="check" :size="26" /></span>
            <h3>Your note is ready for the atelier.</h3>
            <p>
              Thank you, {{ reviewName }}. In the final store this review would be sent to our team
              for moderation.
            </p>
            <p class="review-success__demo">Demo form — your review has not been published.</p>
            <button type="button" class="btn btn--outline" @click="writeAnother">Write another review</button>
          </div>

          <form v-else class="review-form" novalidate @submit.prevent="submitReview">
            <fieldset class="review-form__stars">
              <legend>Your rating</legend>
              <div>
                <label v-for="star in [1, 2, 3, 4, 5]" :key="star">
                  <input v-model="reviewRating" type="radio" name="rating" :value="star" />
                  <span :class="{ 'is-selected': reviewRating >= star }">
                    <Icon name="star" :size="18" />
                  </span>
                  <span class="sr-only">{{ star }} star{{ star === 1 ? '' : 's' }}</span>
                </label>
              </div>
            </fieldset>

            <div class="review-form__row">
              <div class="field">
                <label for="review-name">Your name</label>
                <input
                  id="review-name"
                  v-model="reviewName"
                  type="text"
                  autocomplete="name"
                  placeholder="First name"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'review-name-error' : undefined"
                />
                <p v-if="errors.name" id="review-name-error" class="field__error" role="alert">{{ errors.name }}</p>
              </div>
              <div class="field">
                <label for="review-title">Review title</label>
                <input
                  id="review-title"
                  v-model="reviewTitle"
                  type="text"
                  placeholder="A short summary"
                  :aria-invalid="!!errors.title"
                  :aria-describedby="errors.title ? 'review-title-error' : undefined"
                />
                <p v-if="errors.title" id="review-title-error" class="field__error" role="alert">{{ errors.title }}</p>
              </div>
            </div>

            <div class="field">
              <label for="review-body">Your review</label>
              <textarea
                id="review-body"
                v-model="reviewBody"
                rows="5"
                placeholder="How did the set feel, fit and wear?"
                :aria-invalid="!!errors.body"
                :aria-describedby="errors.body ? 'review-body-error' : undefined"
              />
              <p v-if="errors.body" id="review-body-error" class="field__error" role="alert">{{ errors.body }}</p>
            </div>

            <div class="review-form__submit">
              <button type="submit" class="btn btn--primary">
                Submit review
                <Icon name="arrowRight" :size="15" />
              </button>
              <p>Demo form · no review is sent from this page.</p>
            </div>
          </form>
        </div>
      </div>
    </section>

    <PageCta
      eyebrow="A little more glow"
      text="Explore the finish in person or add the set to your bag. Every order is hand-wrapped in Casablanca."
    >
      <template #title>Wear it,<br /><em>then tell us.</em></template>
      <button type="button" class="btn btn--cream" @click="addToCart(product)">
        Add to bag · {{ product.price }} MAD
        <Icon name="bag" :size="15" />
      </button>
      <RouterLink to="/shop" class="btn btn--ghost-light">
        Shop the collection
        <Icon name="arrowRight" :size="15" />
      </RouterLink>
    </PageCta>
  </div>

  <div v-else class="reviews-missing">
    <SunMark :size="64" />
    <span class="eyebrow">Not found</span>
    <h1>These notes have<br /><em>wandered off.</em></h1>
    <p>This product may have moved or sold out.</p>
    <RouterLink to="/shop" class="btn btn--primary">Browse the collection</RouterLink>
  </div>
</template>

<style scoped>
.reviews-page {
  background: var(--cream);
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

.reviews-hero {
  padding-block: clamp(34px, 4.5vw, 62px) clamp(40px, 5vw, 68px);
  background:
    radial-gradient(circle at 92% 8%, rgba(229, 200, 184, 0.24), transparent 28%),
    var(--cream);
}

.reviews-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: clamp(36px, 7vw, 100px);
  align-items: center;
  margin-top: 31px;
}

.reviews-product {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 36px);
}

.reviews-product__thumb {
  width: clamp(120px, 15vw, 180px);
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 7px;
  box-shadow: 0 20px 40px -34px rgba(47, 55, 44, 0.55);
}

.reviews-product__thumb :deep(.product-visual) {
  aspect-ratio: 1;
}

.reviews-product__thumb :deep(.pv-label),
.reviews-product__thumb :deep(.pv-edition),
.reviews-product__thumb :deep(.pv-seal) {
  display: none;
}

.reviews-product h1 {
  margin-top: 11px;
  font-size: clamp(3.3rem, 5.5vw, 5.4rem);
  font-weight: 300;
  line-height: 0.9;
}

.reviews-product h1 em {
  color: var(--sage);
}

.reviews-product p {
  margin-top: 9px;
  color: var(--ink-soft);
  font-size: 11px;
}

.reviews-product .text-link {
  margin-top: 17px;
}

.reviews-summary {
  padding: 25px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--cream-soft);
}

.reviews-summary__score {
  display: flex;
  align-items: center;
  gap: 14px;
}

.reviews-summary__score > strong {
  font-family: var(--font-display);
  font-size: 3.8rem;
  font-weight: 400;
  line-height: 0.8;
}

.stars {
  display: flex;
  gap: 2px;
  color: var(--rose-deep);
}

.stars :deep(.is-muted) {
  opacity: 0.25;
}

.reviews-summary__score p {
  margin-top: 5px;
  color: var(--ink-faint);
  font-size: 8px;
}

.reviews-summary__bars {
  display: grid;
  gap: 8px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--line-soft);
}

.rating-row {
  display: grid;
  grid-template-columns: 34px 1fr 32px;
  align-items: center;
  gap: 9px;
  color: var(--ink-soft);
  font-size: 8px;
}

.rating-row small {
  color: var(--ink-faint);
  font-size: 7.5px;
  text-align: right;
}

.rating-row__track {
  height: 4px;
  overflow: hidden;
  border-radius: 99px;
  background: var(--cream-deep);
}

.rating-row__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--rose);
}

.reviews-main {
  padding-top: clamp(52px, 6vw, 82px);
  background: var(--cream-soft);
}

.reviews-main__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding-bottom: 26px;
  border-bottom: 1px solid var(--line-soft);
}

.reviews-main__head h2 {
  margin-top: 12px;
  font-size: clamp(2.8rem, 4.5vw, 4.2rem);
}

.reviews-main__head h2 em {
  color: var(--sage);
}

.reviews-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding-block: 17px;
}

.reviews-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.reviews-filters button {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--ink-soft);
  font-size: 8px;
  letter-spacing: 0.04em;
  line-height: 1;
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
}

.reviews-filters button:hover {
  border-color: var(--line);
  color: var(--ink);
}

.reviews-filters button.is-active {
  border-color: var(--sage-deep);
  background: var(--sage-deep);
  color: var(--white);
}

.reviews-filters button span {
  color: var(--ink-faint);
  font-size: 7px;
}

.reviews-filters button.is-active span {
  color: rgba(255, 253, 248, 0.65);
}

.reviews-toolbar > p {
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.04em;
}

.reviews-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.review-card {
  display: flex;
  min-height: 245px;
  flex-direction: column;
  padding: 22px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--cream);
}

.review-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.review-card__date {
  color: var(--ink-faint);
  font-size: 7.5px;
}

.review-card h3 {
  margin-top: 16px;
  font-size: 1.5rem;
}

.review-card > p {
  margin-top: 8px;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.75;
}

.review-card footer {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: auto;
  padding-top: 19px;
}

.review-card__avatar {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: var(--sage-wash);
  color: var(--sage-deep);
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 500;
}

.review-card footer > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.review-card footer strong {
  font-size: 8.5px;
  font-weight: 500;
}

.review-card footer small {
  color: var(--ink-faint);
  font-size: 7.5px;
}

.review-card__shade {
  margin-left: auto;
  color: var(--ink-faint);
  font-size: 7px;
  letter-spacing: 0.04em;
  text-align: right;
}

.reviews-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 42px 24px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--cream);
  text-align: center;
}

.reviews-empty :deep(svg) {
  color: var(--rose);
}

.reviews-empty h3 {
  margin-top: 14px;
  font-size: 1.8rem;
}

.reviews-empty p {
  margin-top: 6px;
  color: var(--ink-soft);
  font-size: 10px;
}

.reviews-empty .btn {
  margin-top: 18px;
}

.write-review {
  background: var(--cream-deep);
}

.write-review__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(38px, 7vw, 100px);
  align-items: start;
}

.write-review__copy h2 {
  margin-top: 13px;
  font-size: clamp(2.9rem, 4.4vw, 4.2rem);
}

.write-review__copy h2 em {
  color: var(--sage-deep);
}

.write-review__copy > p {
  max-width: 430px;
  margin-top: 17px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.8;
}

.write-review__product {
  display: flex;
  max-width: 470px;
  align-items: center;
  gap: 11px;
  margin-top: 27px;
  padding: 10px;
  border: 1px solid var(--line-soft);
  border-radius: 7px;
  background: var(--cream-soft);
}

.write-review__product > div {
  width: 58px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
}

.write-review__product > div :deep(.product-visual) {
  aspect-ratio: 1;
}

.write-review__product > div :deep(.pv-label),
.write-review__product > div :deep(.pv-edition),
.write-review__product > div :deep(.pv-seal) {
  display: none;
}

.write-review__product > span {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1px;
}

.write-review__product small {
  color: var(--ink-faint);
  font-size: 7px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.write-review__product strong {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.1;
}

.write-review__product > span > span {
  color: var(--ink-faint);
  font-size: 8px;
}

.write-review__product .btn {
  min-height: 36px;
  margin-left: auto;
  padding: 8px 10px;
  font-size: 7.5px;
}

.review-form {
  padding: 25px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--cream-soft);
}

.review-form__stars {
  margin: 0 0 17px;
  padding: 0;
  border: 0;
}

.review-form__stars legend {
  margin-bottom: 8px;
  color: var(--ink-faint);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.review-form__stars > div {
  display: flex;
  gap: 2px;
}

.review-form__stars label {
  position: relative;
  cursor: pointer;
}

.review-form__stars input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.review-form__stars label > span:not(.sr-only) {
  display: grid;
  width: 29px;
  height: 29px;
  place-items: center;
  border-radius: 50%;
  color: var(--cream-deep);
  transition: color 150ms ease;
}

.review-form__stars label > span.is-selected,
.review-form__stars label:hover > span {
  color: var(--rose-deep);
}

.review-form__stars input:focus-visible + span {
  outline: 2px solid var(--sage-deep);
  outline-offset: 2px;
}

.review-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.review-form .field {
  margin-top: 13px;
}

.review-form .field label {
  display: block;
  margin-bottom: 5px;
  color: var(--ink-faint);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.review-form .field > input,
.review-form .field > textarea {
  width: 100%;
  border: 1px solid var(--line-soft);
  border-radius: 4px;
  background: var(--cream);
  transition: border-color 200ms ease;
}

.review-form .field > input {
  height: 43px;
  padding: 0 11px;
  font-size: 10.5px;
}

.review-form .field > textarea {
  min-height: 120px;
  padding: 10px 11px;
  resize: vertical;
  font-size: 10.5px;
  line-height: 1.7;
}

.review-form .field > input:focus,
.review-form .field > textarea:focus {
  border-color: var(--sage);
  outline: 0;
}

.review-form .field > input::placeholder,
.review-form .field > textarea::placeholder {
  color: var(--ink-faint);
  font-size: 9.5px;
}

.review-form .field__error {
  margin-top: 4px;
  color: #924c3b;
  font-size: 8px;
}

.review-form__submit {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 18px;
}

.review-form__submit p {
  max-width: 190px;
  color: var(--ink-faint);
  font-size: 8px;
  line-height: 1.5;
}

.review-success {
  padding: 25px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--cream-soft);
}

.review-success > span {
  display: grid;
  width: 43px;
  height: 43px;
  place-items: center;
  border-radius: 50%;
  background: var(--sage-wash);
  color: var(--sage-deep);
}

.review-success h3 {
  margin-top: 16px;
  font-size: 1.8rem;
}

.review-success p {
  margin-top: 7px;
  color: var(--ink-soft);
  font-size: 10px;
  line-height: 1.7;
}

.review-success__demo {
  color: var(--ink-faint) !important;
  font-size: 8px !important;
}

.review-success .btn {
  margin-top: 16px;
}

.reviews-missing {
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  background: var(--cream);
  text-align: center;
}

.reviews-missing > :deep(svg) {
  color: var(--rose);
  margin-bottom: 17px;
}

.reviews-missing h1 {
  margin-top: 13px;
  font-size: clamp(3rem, 6vw, 5.5rem);
}

.reviews-missing h1 em {
  color: var(--sage);
}

.reviews-missing p {
  margin-top: 14px;
  color: var(--ink-soft);
  font-size: 12px;
}

.reviews-missing .btn {
  margin-top: 23px;
}

@media (max-width: 980px) {
  .reviews-hero__grid,
  .write-review__grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .reviews-summary {
    max-width: 560px;
  }

  .reviews-product__thumb {
    width: 145px;
  }
}

@media (max-width: 700px) {
  .reviews-product {
    align-items: flex-start;
  }

  .reviews-product__thumb {
    width: 95px;
  }

  .reviews-product h1 {
    font-size: clamp(2.6rem, 12vw, 3.8rem);
  }

  .reviews-main__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .reviews-toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .reviews-grid {
    grid-template-columns: 1fr;
  }

  .review-form__row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .review-card {
    min-height: 0;
  }

  .review-form__submit {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .review-form__submit p {
    max-width: none;
  }
}
</style>

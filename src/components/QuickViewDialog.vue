<script setup>
import { ref, watch } from 'vue'
import BaseDialog from './BaseDialog.vue'
import Icon from './Icon.vue'
import ProductVisual from './ProductVisual.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  product: { type: Object, default: null },
  saved: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'add', 'toggle-wishlist', 'view-details'])
const qty = ref(1)

watch(
  () => [props.open, props.product?.id],
  ([open]) => {
    if (open) qty.value = 1
  },
)

function addToBag() {
  if (!props.product) return
  emit('add', props.product, qty.value)
}
</script>

<template>
  <BaseDialog
    :open="open"
    variant="modal"
    :label="product ? product.name : 'Product details'"
    @close="emit('close')"
  >
    <div v-if="product" class="quick">
      <div class="quick__media">
        <ProductVisual :product="product" large />
        <span class="quick__media-note">Hand-finished in Casablanca · Ships in 1–2 days</span>
      </div>

      <div class="quick__body">
        <div class="quick__top">
          <div class="quick__eyebrow">
            <span>{{ product.categoryLabel }}</span>
            <span v-if="product.badge" class="quick__badge">{{ product.badge }}</span>
          </div>
          <h2>{{ product.name }}</h2>
          <p class="quick__subtitle">{{ product.shade }}</p>

          <div class="quick__rating" :aria-label="`${product.rating} out of 5 stars, ${product.reviews} reviews`">
            <span class="quick__stars" aria-hidden="true">
              <Icon v-for="n in 5" :key="n" name="star" :size="12" />
            </span>
            <span>{{ product.rating.toFixed(1) }} · {{ product.reviews }} reviews</span>
          </div>
        </div>

        <div class="quick__price">
          <strong>{{ product.price }} MAD</strong>
          <s v-if="product.compareAt">{{ product.compareAt }} MAD</s>
          <span v-if="product.compareAt">Save {{ product.compareAt - product.price }} MAD</span>
        </div>

        <p class="quick__description">{{ product.description }}</p>

        <div v-if="product.tips.length" class="quick__swatches">
          <span class="quick__label">The finish</span>
          <div class="quick__swatch-row">
            <span
              v-for="(tip, index) in product.tips"
              :key="index"
              class="quick__swatch"
              :style="{ background: tip }"
            />
          </div>
        </div>

        <div class="quick__highlights">
          <span v-for="highlight in product.highlights" :key="highlight">
            <Icon name="sparkle" :size="12" />
            {{ highlight }}
          </span>
        </div>

        <div class="quick__buy">
          <div class="quick__qty" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" :disabled="qty <= 1" @click="qty--">
              <Icon name="minus" :size="14" />
            </button>
            <span aria-live="polite">{{ qty }}</span>
            <button type="button" aria-label="Increase quantity" @click="qty++">
              <Icon name="plus" :size="14" />
            </button>
          </div>

          <button type="button" class="btn btn--primary quick__add" @click="addToBag">
            Add to bag · {{ product.price * qty }} MAD
          </button>

          <button
            type="button"
            class="quick__wish"
            :class="{ 'is-saved': saved }"
            :aria-pressed="saved"
            :aria-label="saved ? 'Remove from wishlist' : 'Save to wishlist'"
            @click="emit('toggle-wishlist', product)"
          >
            <Icon name="heart" :size="18" />
          </button>
        </div>

        <p class="quick__delivery">
          <Icon name="truck" :size="14" />
          Complimentary delivery over 350 MAD · 14-day returns
        </p>

        <button
          type="button"
          class="quick__full-details"
          @click="emit('view-details', product)"
        >
          View full product details
          <Icon name="arrowRight" :size="14" />
        </button>

        <div class="quick__details">
          <details>
            <summary>Details &amp; care <Icon name="plus" :size="14" /></summary>
            <ul>
              <li v-for="detail in product.details" :key="detail">{{ detail }}</li>
            </ul>
          </details>
          <details>
            <summary>Delivery &amp; returns <Icon name="plus" :size="14" /></summary>
            <p>
              Orders leave our Casablanca atelier within 1–2 working days. Delivery across Morocco
              takes 2–5 days. Unopened sets can be returned within 14 days.
            </p>
          </details>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<style scoped>
.quick {
  display: grid;
  min-height: 610px;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  background: var(--cream-soft);
}

.quick__media {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 22px;
  background: var(--cream-deep);
}

.quick__media :deep(.product-visual) {
  min-height: 0;
  flex: 1;
  aspect-ratio: auto;
  border-radius: 8px;
}

.quick__media :deep(.pv-edition) {
  display: none;
}

.quick__media-note {
  margin-top: 18px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.1em;
  text-align: center;
  text-transform: uppercase;
}

.quick__body {
  display: flex;
  flex-direction: column;
  padding: 48px clamp(30px, 4vw, 54px) 38px;
}

.quick__eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  color: var(--sage-deep);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.16em;
  line-height: 1;
  text-transform: uppercase;
}

.quick__badge {
  padding: 6px 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--rose-deep);
  font-size: 7.5px;
  letter-spacing: 0.1em;
}

.quick__top h2 {
  margin-top: 12px;
  font-size: clamp(3rem, 5vw, 4.4rem);
  line-height: 0.95;
}

.quick__subtitle {
  margin-top: 8px;
  color: var(--ink-soft);
  font-size: 11px;
  letter-spacing: 0.04em;
}

.quick__rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: var(--ink-faint);
  font-size: 9px;
}

.quick__stars {
  display: flex;
  gap: 2px;
  color: var(--rose);
}

.quick__price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 24px;
  padding-block: 16px;
  border-top: 1px solid var(--line-soft);
  border-bottom: 1px solid var(--line-soft);
}

.quick__price strong {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
}

.quick__price s {
  color: var(--ink-faint);
  font-size: 10px;
}

.quick__price > span {
  margin-left: auto;
  color: var(--rose-deep);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.quick__description {
  margin-top: 18px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.85;
}

.quick__swatches {
  margin-top: 20px;
}

.quick__label {
  color: var(--ink-faint);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.quick__swatch-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.quick__swatch {
  width: 20px;
  height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--line-soft);
}

.quick__swatch--empty {
  background: var(--cream-deep);
}

.quick__highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 16px;
}

.quick__highlights span {
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

.quick__highlights :deep(svg) {
  color: var(--rose);
}

.quick__buy {
  display: flex;
  align-items: stretch;
  gap: 8px;
  margin-top: 24px;
}

.quick__qty {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 6px;
}

.quick__qty button {
  display: grid;
  width: 38px;
  height: 100%;
  min-height: 48px;
  place-items: center;
  color: var(--ink-soft);
}

.quick__qty button:hover:not(:disabled) {
  color: var(--ink);
}

.quick__qty button:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.quick__qty span {
  min-width: 18px;
  font-size: 10px;
  text-align: center;
}

.quick__add {
  flex: 1;
  padding-inline: 16px;
  font-size: 9px;
  letter-spacing: 0.1em;
}

.quick__wish {
  display: grid;
  width: 49px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--ink-soft);
  transition:
    color 200ms ease,
    border-color 200ms ease;
}

.quick__wish:hover,
.quick__wish.is-saved {
  border-color: var(--rose);
  color: var(--rose-deep);
}

.quick__wish.is-saved :deep(path) {
  fill: currentColor;
}

.quick__delivery {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 14px;
  color: var(--ink-faint);
  font-size: 8.5px;
  line-height: 1.5;
}

.quick__full-details {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  margin-top: 14px;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1.5;
  text-transform: uppercase;
  transition:
    gap 200ms ease,
    color 200ms ease;
}

.quick__full-details:hover {
  gap: 13px;
  color: var(--sage-deep);
}

.quick__details {
  margin-top: auto;
  padding-top: 22px;
}

.quick__details details {
  border-top: 1px solid var(--line-soft);
}

.quick__details details:last-child {
  border-bottom: 1px solid var(--line-soft);
}

.quick__details summary {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding-block: 13px;
  color: var(--ink);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.08em;
  list-style: none;
  text-transform: uppercase;
}

.quick__details summary::-webkit-details-marker {
  display: none;
}

.quick__details details[open] summary :deep(svg) {
  transform: rotate(45deg);
}

.quick__details summary :deep(svg) {
  transition: transform 200ms ease;
}

.quick__details ul,
.quick__details p {
  padding: 0 0 14px;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.75;
}

.quick__details ul {
  display: grid;
  gap: 4px;
  list-style: disc;
  padding-left: 16px;
}

@media (max-width: 800px) {
  .quick {
    min-height: 0;
    grid-template-columns: 1fr;
  }

  .quick__media {
    min-height: 330px;
    padding: 12px;
  }

  .quick__media :deep(.product-visual) {
    aspect-ratio: 1 / 0.9;
  }

  .quick__media-note {
    margin-top: 10px;
  }

  .quick__body {
    padding: 32px 24px 28px;
  }

  .quick__details {
    margin-top: 22px;
  }
}

@media (max-width: 480px) {
  .quick__buy {
    flex-wrap: wrap;
  }

  .quick__add {
    order: 1;
    flex-basis: calc(100% - 57px);
  }

  .quick__wish {
    order: 2;
  }

  .quick__qty {
    order: 0;
    width: 100%;
    justify-content: space-between;
  }

  .quick__qty button {
    width: 44px;
  }
}
</style>

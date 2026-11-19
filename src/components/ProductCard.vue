<script setup>
import Icon from './Icon.vue'
import ProductVisual from './ProductVisual.vue'

defineProps({
  product: { type: Object, required: true },
  saved: Boolean,
})

const emit = defineEmits(['add', 'quick-view', 'toggle-wishlist'])
</script>

<template>
  <article class="product-card">
    <div class="product-card__media">
      <button
        type="button"
        class="product-card__open"
        :aria-label="`View ${product.name}`"
        @click="emit('quick-view', product)"
      >
        <ProductVisual :product="product" />
      </button>

      <span v-if="product.badge" class="product-card__badge">{{ product.badge }}</span>

      <button
        type="button"
        class="product-card__wish"
        :class="{ 'is-saved': saved }"
        :aria-pressed="saved"
        :aria-label="saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`"
        @click="emit('toggle-wishlist', product)"
      >
        <Icon name="heart" :size="17" />
      </button>

      <button
        type="button"
        class="product-card__quick"
        :aria-label="`Quick add ${product.name} to bag`"
        @click="emit('add', product)"
      >
        <Icon name="plus" :size="17" />
      </button>
    </div>

    <div class="product-card__body">
      <div class="product-card__eyebrow">
        <span>{{ product.categoryLabel }}</span>
        <span class="product-card__rating" :aria-label="`${product.rating} out of 5 stars, ${product.reviews} reviews`">
          <Icon name="star" :size="10" />
          {{ product.rating.toFixed(1) }}
          <span>({{ product.reviews }})</span>
        </span>
      </div>

      <h3 class="product-card__name">
        <button type="button" @click="emit('quick-view', product)">{{ product.name }}</button>
      </h3>
      <p class="product-card__shade">{{ product.subtitle }}</p>

      <div class="product-card__swatches" aria-hidden="true">
        <span
          v-for="(tip, index) in product.tips.slice(0, 4)"
          :key="index"
          class="product-card__swatch"
          :style="{ background: tip }"
        />
        <span v-if="product.kind === 'box'" class="product-card__sizes">10 sizes</span>
      </div>

      <div class="product-card__footer">
        <p class="product-card__price">
          <span>{{ product.price }} MAD</span>
          <s v-if="product.compareAt">{{ product.compareAt }} MAD</s>
        </p>
        <button type="button" class="product-card__add" @click="emit('add', product)">
          <Icon name="bag" :size="14" />
          Add
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 9px 9px 0;
  border: 1px solid var(--line-soft);
  border-radius: 12px;
  background: rgba(255, 253, 248, 0.54);
  transition:
    box-shadow 320ms var(--ease-out),
    transform 320ms var(--ease-out),
    border-color 320ms ease;
}

.product-card:hover {
  border-color: var(--line);
  box-shadow: var(--shadow-card);
  transform: translateY(-5px);
}

.product-card__media {
  position: relative;
  overflow: hidden;
  border-radius: 7px;
  background: var(--cream-deep);
}

.product-card__open {
  display: block;
  width: 100%;
  padding: 0;
  text-align: left;
}

.product-card__open :deep(.product-visual) {
  transition: transform 700ms var(--ease-out);
}

.product-card:hover .product-card__open :deep(.product-visual) {
  transform: scale(1.025);
}

.product-card__open :deep(.pv-label),
.product-card__open :deep(.pv-edition) {
  display: none;
}

.product-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 8;
  padding: 6px 9px;
  border: 1px solid rgba(255, 253, 248, 0.36);
  border-radius: 999px;
  background: rgba(255, 253, 248, 0.88);
  color: var(--sage-dark);
  font-size: 7.5px;
  font-weight: 600;
  letter-spacing: 0.13em;
  line-height: 1;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
}

.product-card__wish {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 8;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(255, 253, 248, 0.25);
  border-radius: 50%;
  background: rgba(255, 253, 248, 0.76);
  color: var(--ink-soft);
  backdrop-filter: blur(6px);
  transition:
    background-color 200ms ease,
    color 200ms ease,
    transform 200ms ease;
}

.product-card__wish:hover {
  background: var(--white);
  transform: scale(1.05);
}

.product-card__wish.is-saved {
  color: var(--rose-deep);
}

.product-card__wish.is-saved :deep(path) {
  fill: currentColor;
}

.product-card__quick {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 8;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid rgba(57, 71, 51, 0.1);
  border-radius: 50%;
  background: rgba(255, 253, 248, 0.92);
  color: var(--sage-dark);
  opacity: 0;
  box-shadow: 0 8px 20px -12px rgba(47, 55, 44, 0.6);
  transform: translateY(6px);
  transition:
    opacity 220ms ease,
    transform 220ms var(--ease-out),
    background-color 200ms ease;
}

.product-card:hover .product-card__quick,
.product-card:focus-within .product-card__quick {
  opacity: 1;
  transform: translateY(0);
}

.product-card__quick:hover {
  background: var(--sage-deep);
  color: var(--white);
}

.product-card__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 15px 8px 17px;
}

.product-card__eyebrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--ink-faint);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
}

.product-card__rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--sage-deep);
  letter-spacing: 0.04em;
}

.product-card__rating :deep(svg) {
  color: var(--rose);
}

.product-card__rating span {
  color: var(--ink-faint);
}

.product-card__name {
  margin-top: 9px;
  font-size: clamp(1.38rem, 1.8vw, 1.66rem);
  line-height: 1.06;
}

.product-card__name button {
  padding: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  transition: color 200ms ease;
}

.product-card__name button:hover {
  color: var(--sage-deep);
}

.product-card__shade {
  margin-top: 5px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.5;
}

.product-card__swatches {
  display: flex;
  min-height: 18px;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
}

.product-card__swatch {
  display: block;
  width: 13px;
  height: 13px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(57, 71, 51, 0.1);
}

.product-card__sizes {
  margin-left: 4px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 15px;
}

.product-card__price {
  display: flex;
  align-items: baseline;
  gap: 7px;
  color: var(--ink);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1.4;
}

.product-card__price s {
  color: var(--ink-faint);
  font-size: 9px;
  font-weight: 400;
}

.product-card__add {
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  gap: 7px;
  padding: 8px 11px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--sage-deep);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
}

.product-card__add:hover {
  border-color: var(--sage-deep);
  background: var(--sage-deep);
  color: var(--white);
}

@media (hover: none) {
  .product-card__quick {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 640px) {
  .product-card {
    padding: 6px 6px 0;
    border-radius: 10px;
  }

  .product-card__body {
    padding: 12px 5px 14px;
  }

  .product-card__badge {
    top: 8px;
    left: 8px;
    padding: 5px 7px;
    font-size: 6.5px;
  }

  .product-card__wish {
    top: 7px;
    right: 7px;
    width: 32px;
    height: 32px;
  }

  .product-card__quick {
    right: 8px;
    bottom: 8px;
    width: 34px;
    height: 34px;
  }

  .product-card__name {
    font-size: 1.25rem;
  }

  .product-card__shade {
    font-size: 10px;
  }

  .product-card__footer {
    align-items: flex-end;
    padding-top: 10px;
  }

  .product-card__add {
    padding: 8px;
  }

  .product-card__add :deep(svg) {
    display: none;
  }

  .product-card__sizes {
    display: none;
  }
}
</style>

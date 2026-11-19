<script setup>
import { computed } from 'vue'
import BaseDialog from './BaseDialog.vue'
import Icon from './Icon.vue'
import ProductVisual from './ProductVisual.vue'
import SunMark from './SunMark.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  subtotal: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'update-qty', 'remove', 'checkout', 'browse', 'view-cart'])

const threshold = 350
const remaining = computed(() => Math.max(0, threshold - props.subtotal))
const progress = computed(() => Math.min(100, Math.round((props.subtotal / threshold) * 100)))

function money(value) {
  return `${value} MAD`
}
</script>

<template>
  <BaseDialog :open="open" variant="drawer" label="Shopping bag" @close="emit('close')">
    <div class="cart">
      <header class="cart__head">
        <span class="eyebrow">Your selection</span>
        <h2>Shopping bag <span>({{ count }})</span></h2>
      </header>

      <div v-if="items.length" class="cart__shipping">
        <div class="cart__shipping-row">
          <span v-if="remaining > 0">You are {{ money(remaining) }} away from complimentary delivery.</span>
          <span v-else class="cart__shipping-done">
            <Icon name="check" :size="13" />
            Complimentary delivery unlocked.
          </span>
          <span>{{ money(threshold) }}</span>
        </div>
        <div class="cart__progress" aria-hidden="true">
          <span :style="{ width: `${progress}%` }" />
        </div>
      </div>

      <div v-if="items.length" class="cart__items">
        <article v-for="item in items" :key="item.id" class="cart-item">
          <div class="cart-item__media" aria-hidden="true">
            <ProductVisual :product="item.product" />
          </div>

          <div class="cart-item__body">
            <div class="cart-item__top">
              <div>
                <h3>{{ item.product.name }}</h3>
                <p>{{ item.product.shade }}</p>
              </div>
              <button
                type="button"
                class="cart-item__remove"
                :aria-label="`Remove ${item.product.name} from bag`"
                @click="emit('remove', item.id)"
              >
                <Icon name="close" :size="15" />
              </button>
            </div>

            <div class="cart-item__bottom">
              <div class="qty" :aria-label="`Quantity for ${item.product.name}`">
                <button
                  type="button"
                  :aria-label="`Decrease quantity of ${item.product.name}`"
                  :disabled="item.qty <= 1"
                  @click="emit('update-qty', item.id, item.qty - 1)"
                >
                  <Icon name="minus" :size="13" />
                </button>
                <span aria-live="polite">{{ item.qty }}</span>
                <button
                  type="button"
                  :aria-label="`Increase quantity of ${item.product.name}`"
                  @click="emit('update-qty', item.id, item.qty + 1)"
                >
                  <Icon name="plus" :size="13" />
                </button>
              </div>
              <p class="cart-item__price">{{ money(item.product.price * item.qty) }}</p>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="cart__empty">
        <span class="cart__empty-sun" aria-hidden="true"><SunMark :size="58" /></span>
        <h3>Your bag is waiting.</h3>
        <p>Small-batch sets and quiet essentials, made to be worn and worn again.</p>
        <button type="button" class="btn btn--primary" @click="emit('browse')">Explore the collection</button>
      </div>

      <footer v-if="items.length" class="cart__footer">
        <div class="cart__subtotal">
          <span>Subtotal</span>
          <strong>{{ money(subtotal) }}</strong>
        </div>
        <p class="cart__fineprint">Taxes included. Delivery calculated at checkout.</p>

        <button type="button" class="btn btn--primary btn--block cart__checkout" @click="emit('checkout')">
          Continue to checkout
          <Icon name="arrowRight" :size="16" />
        </button>

        <button type="button" class="cart__continue" @click="emit('close')">Continue shopping</button>

        <button type="button" class="cart__view" @click="emit('view-cart')">
          View full bag
          <Icon name="arrowUpRight" :size="12" />
        </button>

        <div class="cart__assurance">
          <span><Icon name="shield" :size="14" /> Secure checkout</span>
          <span><Icon name="truck" :size="14" /> Tracked delivery</span>
        </div>

        <div class="cart__payments" aria-label="Accepted payment methods">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>CMI</span>
          <span>Cash on delivery</span>
        </div>
      </footer>
    </div>
  </BaseDialog>
</template>

<style scoped>
.cart {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  background:
    radial-gradient(circle at 100% 0%, rgba(229, 200, 184, 0.25), transparent 30%),
    var(--cream);
}

.cart__head {
  padding: 39px 32px 26px;
  border-bottom: 1px solid var(--line-soft);
}

.cart__head h2 {
  margin-top: 11px;
  font-size: clamp(2.5rem, 5vw, 3.15rem);
  line-height: 1;
}

.cart__head h2 span {
  color: var(--ink-faint);
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  vertical-align: middle;
}

.cart__shipping {
  padding: 20px 32px;
  border-bottom: 1px solid var(--line-soft);
  background: rgba(255, 253, 248, 0.5);
}

.cart__shipping-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  color: var(--ink-soft);
  font-size: 9.5px;
  letter-spacing: 0.04em;
  line-height: 1.55;
}

.cart__shipping-row > span:last-child {
  flex-shrink: 0;
  color: var(--ink-faint);
  font-size: 8.5px;
}

.cart__shipping-done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--sage-deep) !important;
}

.cart__progress {
  height: 3px;
  margin-top: 12px;
  overflow: hidden;
  border-radius: 99px;
  background: var(--cream-deep);
}

.cart__progress span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--sage), var(--rose));
  transition: width 500ms var(--ease-out);
}

.cart__items {
  flex: 1;
  padding-inline: 32px;
}

.cart-item {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 16px;
  padding-block: 22px;
  border-bottom: 1px solid var(--line-soft);
}

.cart-item__media {
  height: 104px;
  overflow: hidden;
  border-radius: 7px;
}

.cart-item__media :deep(.product-visual) {
  height: 100%;
  aspect-ratio: auto;
}

.cart-item__media :deep(.pv-label),
.cart-item__media :deep(.pv-edition),
.cart-item__media :deep(.pv-seal) {
  display: none;
}

.cart-item__body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
  padding-block: 2px;
}

.cart-item__top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.cart-item__top h3 {
  font-size: 1.35rem;
  line-height: 1.1;
}

.cart-item__top p {
  margin-top: 5px;
  color: var(--ink-faint);
  font-size: 9.5px;
  line-height: 1.4;
}

.cart-item__remove {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  color: var(--ink-faint);
  transition:
    background-color 200ms ease,
    color 200ms ease;
}

.cart-item__remove:hover {
  background: var(--cream-deep);
  color: var(--ink);
}

.cart-item__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.qty {
  display: inline-flex;
  height: 32px;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 253, 248, 0.65);
}

.qty button {
  display: grid;
  width: 32px;
  height: 30px;
  place-items: center;
  border-radius: 50%;
  color: var(--ink-soft);
}

.qty button:hover:not(:disabled) {
  color: var(--ink);
}

.qty button:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.qty span {
  min-width: 18px;
  color: var(--ink);
  font-size: 10px;
  text-align: center;
}

.cart-item__price {
  color: var(--ink);
  font-size: 10.5px;
  letter-spacing: 0.04em;
}

.cart__empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  text-align: center;
}

.cart__empty-sun {
  display: grid;
  width: 74px;
  height: 74px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--rose);
}

.cart__empty-sun :deep(svg) {
  width: 52px;
  height: 52px;
}

.cart__empty h3 {
  margin-top: 22px;
  font-size: 2.1rem;
}

.cart__empty p {
  max-width: 280px;
  margin-top: 12px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.7;
}

.cart__empty .btn {
  margin-top: 24px;
}

.cart__footer {
  margin-top: auto;
  padding: 24px 32px 28px;
  border-top: 1px solid var(--line);
  background: rgba(255, 253, 248, 0.55);
}

.cart__subtotal {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cart__subtotal strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}

.cart__fineprint {
  margin-top: 5px;
  color: var(--ink-faint);
  font-size: 8.5px;
}

.cart__checkout {
  margin-top: 18px;
}

.cart__continue {
  display: block;
  width: 100%;
  padding-block: 13px 4px;
  color: var(--ink-soft);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-transform: uppercase;
}

.cart__continue:hover {
  color: var(--ink);
}

.cart__view {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding-block: 3px 4px;
  color: var(--sage-deep);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: gap 200ms ease;
}

.cart__view:hover {
  gap: 9px;
}

.cart__assurance {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 14px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.04em;
}

.cart__assurance span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.cart__payments {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-top: 15px;
}

.cart__payments span {
  padding: 4px 7px;
  border: 1px solid var(--line-soft);
  border-radius: 3px;
  color: var(--ink-faint);
  font-size: 7px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@media (max-width: 440px) {
  .cart__head,
  .cart__shipping,
  .cart__footer {
    padding-inline: 22px;
  }

  .cart__items {
    padding-inline: 22px;
  }
}
</style>

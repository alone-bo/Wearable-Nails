<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductVisual from '../components/ProductVisual.vue'
import SunMark from '../components/SunMark.vue'
import { products } from '../data/products.js'
import { useShop } from '../stores/shop.js'

const {
  cartItems,
  cartCount,
  cartSubtotal,
  wishlist,
  addToCart,
  openQuick,
  toggleWishlist,
  updateQty,
  removeFromCart,
} = useShop()

const deliveryFee = computed(() => (cartSubtotal.value >= 350 || cartSubtotal.value === 0 ? 0 : 35))
const total = computed(() => cartSubtotal.value + deliveryFee.value)
const remainingForFreeDelivery = computed(() => Math.max(0, 350 - cartSubtotal.value))
const freeDeliveryProgress = computed(() => Math.min(100, Math.round((cartSubtotal.value / 350) * 100)))

const recommendedProducts = computed(() => {
  const inBag = new Set(cartItems.value.map((item) => item.id))
  return products.filter((product) => !inBag.has(product.id)).slice(0, 4)
})

function money(value) {
  return `${value} MAD`
}
</script>

<template>
  <div class="cart-page">
    <header class="cart-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Shopping bag</span>
        </nav>
        <div class="cart-hero__inner">
          <div>
            <span class="eyebrow">Your selection</span>
            <h1>Shopping <em>bag.</em></h1>
            <p v-if="cartCount">{{ cartCount }} {{ cartCount === 1 ? 'piece' : 'pieces' }}, wrapped by hand in Casablanca.</p>
            <p v-else>Your bag is waiting for a little glow.</p>
          </div>
          <RouterLink to="/shop" class="text-link">
            Continue shopping
            <Icon name="arrowRight" :size="14" />
          </RouterLink>
        </div>
      </div>
    </header>

    <section class="cart-main section" aria-labelledby="bag-title">
      <div class="container">
        <h2 id="bag-title" class="sr-only">Your shopping bag</h2>

        <div v-if="cartItems.length" class="cart-layout">
          <div class="cart-items">
            <div class="cart-items__head">
              <span>Piece</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <article v-for="item in cartItems" :key="item.id" class="cart-line">
              <RouterLink :to="`/product/${item.product.id}`" class="cart-line__media" aria-hidden="true">
                <ProductVisual :product="item.product" />
              </RouterLink>

              <div class="cart-line__info">
                <span class="cart-line__category">{{ item.product.categoryLabel }}</span>
                <h3>
                  <RouterLink :to="`/product/${item.product.id}`">{{ item.product.name }}</RouterLink>
                </h3>
                <p>{{ item.product.shade }}</p>
                <span class="cart-line__price">{{ money(item.product.price) }} each</span>
                <button
                  type="button"
                  class="cart-line__remove"
                  :aria-label="`Remove ${item.product.name} from bag`"
                  @click="removeFromCart(item.id)"
                >
                  Remove
                </button>
              </div>

              <div class="qty" :aria-label="`Quantity for ${item.product.name}`">
                <button
                  type="button"
                  :aria-label="`Decrease quantity of ${item.product.name}`"
                  :disabled="item.qty <= 1"
                  @click="updateQty(item.id, item.qty - 1)"
                >
                  <Icon name="minus" :size="13" />
                </button>
                <span aria-live="polite">{{ item.qty }}</span>
                <button
                  type="button"
                  :aria-label="`Increase quantity of ${item.product.name}`"
                  @click="updateQty(item.id, item.qty + 1)"
                >
                  <Icon name="plus" :size="13" />
                </button>
              </div>

              <strong class="cart-line__total">{{ money(item.product.price * item.qty) }}</strong>
            </article>

            <div class="cart-shipping">
              <div class="cart-shipping__copy">
                <span v-if="remainingForFreeDelivery > 0">
                  You are <strong>{{ money(remainingForFreeDelivery) }}</strong> away from complimentary delivery.
                </span>
                <span v-else class="cart-shipping__done">
                  <Icon name="check" :size="14" />
                  Complimentary delivery unlocked.
                </span>
                <small>{{ money(350) }} threshold</small>
              </div>
              <div class="cart-shipping__track" aria-hidden="true">
                <span :style="{ width: `${freeDeliveryProgress}%` }" />
              </div>
            </div>

            <div class="cart-items__foot">
              <span><Icon name="leaf" :size="15" /> 10-free formulas</span>
              <span><Icon name="shield" :size="15" /> Secure checkout</span>
              <span><Icon name="truck" :size="15" /> Tracked delivery</span>
            </div>
          </div>

          <aside class="cart-summary" aria-labelledby="summary-title">
            <span class="eyebrow">Order summary</span>
            <h2 id="summary-title">Your <em>total.</em></h2>

            <div class="cart-summary__lines">
              <div>
                <span>Subtotal</span>
                <strong>{{ money(cartSubtotal) }}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{{ deliveryFee === 0 ? 'Complimentary' : money(deliveryFee) }}</strong>
              </div>
              <div class="cart-summary__total">
                <span>Total</span>
                <strong>{{ money(total) }}</strong>
              </div>
            </div>

            <RouterLink to="/checkout" class="btn btn--primary btn--block">
              Continue to checkout
              <Icon name="arrowRight" :size="16" />
            </RouterLink>
            <p class="cart-summary__note">Taxes included. You will choose delivery and payment on the next step.</p>

            <div class="cart-summary__secure">
              <Icon name="shield" :size="15" />
              Secure demo checkout · No payment details stored
            </div>

            <div class="cart-summary__payments" aria-label="Accepted payment methods">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>CMI</span>
              <span>Cash on delivery</span>
            </div>
          </aside>
        </div>

        <div v-else class="cart-empty">
          <SunMark :size="58" />
          <h2>Your bag is <em>waiting.</em></h2>
          <p>Small-batch sets and quiet essentials, made to be worn and worn again.</p>
          <RouterLink to="/shop" class="btn btn--primary">
            Explore the collection
            <Icon name="arrowRight" :size="15" />
          </RouterLink>
          <RouterLink to="/journal" class="text-link">Read the journal</RouterLink>
        </div>
      </div>
    </section>

    <section v-if="recommendedProducts.length" class="cart-recommendations section" aria-labelledby="recommendations-title">
      <div class="container">
        <div class="cart-recommendations__head">
          <div>
            <span class="eyebrow">A little more</span>
            <h2 id="recommendations-title">Complete the <em>ritual.</em></h2>
          </div>
          <RouterLink to="/shop" class="text-link">
            Shop all pieces
            <Icon name="arrowRight" :size="14" />
          </RouterLink>
        </div>
        <div class="cart-recommendations__grid">
          <ProductCard
            v-for="item in recommendedProducts"
            :key="item.id"
            :product="item"
            :saved="wishlist.includes(item.id)"
            @add="addToCart"
            @quick-view="openQuick"
            @toggle-wishlist="toggleWishlist"
          />
        </div>
      </div>
    </section>

    <PageCta
      eyebrow="Need a hand?"
      text="If you have a question about your order, delivery or a gift, the atelier is one message away."
    >
      <template #title>A question<br /><em>before you go?</em></template>
      <RouterLink to="/faq" class="btn btn--ghost-light">
        Read the FAQ
        <Icon name="arrowUpRight" :size="15" />
      </RouterLink>
      <RouterLink to="/contact" class="btn btn--cream">
        Contact us
        <Icon name="arrowRight" :size="15" />
      </RouterLink>
    </PageCta>
  </div>
</template>

<style scoped>
.cart-page {
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

.cart-hero {
  padding-block: clamp(34px, 4.5vw, 60px) clamp(38px, 5vw, 66px);
  border-bottom: 1px solid var(--line-soft);
  background:
    radial-gradient(circle at 90% 10%, rgba(229, 200, 184, 0.22), transparent 30%),
    var(--cream);
}

.cart-hero__inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-top: 26px;
}

.cart-hero h1 {
  margin-top: 12px;
  font-size: clamp(4rem, 7vw, 7rem);
  font-weight: 300;
  line-height: 0.86;
}

.cart-hero h1 em {
  color: var(--sage);
}

.cart-hero__inner p {
  margin-top: 13px;
  color: var(--ink-soft);
  font-size: 11px;
}

.cart-main {
  padding-top: clamp(42px, 5vw, 70px);
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(290px, 0.8fr);
  gap: clamp(32px, 6vw, 82px);
  align-items: start;
}

.cart-items__head {
  display: grid;
  grid-template-columns: 1fr 118px 84px;
  gap: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cart-items__head span:nth-child(2) {
  text-align: center;
}

.cart-items__head span:last-child {
  text-align: right;
}

.cart-line {
  display: grid;
  grid-template-columns: 112px 1fr 118px 84px;
  align-items: center;
  gap: 15px;
  padding-block: 18px;
  border-bottom: 1px solid var(--line-soft);
}

.cart-line__media {
  display: block;
  height: 124px;
  overflow: hidden;
  border-radius: 6px;
  background: var(--cream-deep);
}

.cart-line__media :deep(.product-visual) {
  height: 100%;
  aspect-ratio: auto;
}

.cart-line__media :deep(.pv-label),
.cart-line__media :deep(.pv-edition),
.cart-line__media :deep(.pv-seal) {
  display: none;
}

.cart-line__category {
  color: var(--ink-faint);
  font-size: 7px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cart-line__info h3 {
  margin-top: 5px;
  font-size: clamp(1.5rem, 2.2vw, 1.9rem);
  line-height: 1;
}

.cart-line__info h3 a {
  transition: color 200ms ease;
}

.cart-line__info h3 a:hover {
  color: var(--sage-deep);
}

.cart-line__info > p {
  margin-top: 5px;
  color: var(--ink-faint);
  font-size: 8.5px;
}

.cart-line__price {
  display: block;
  margin-top: 8px;
  color: var(--ink-soft);
  font-size: 8.5px;
}

.cart-line__remove {
  margin-top: 7px;
  padding: 0;
  color: var(--ink-faint);
  font-size: 8px;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.cart-line__remove:hover {
  color: var(--rose-deep);
}

.qty {
  display: inline-flex;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--cream-soft);
}

.qty button {
  display: grid;
  width: 32px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  color: var(--ink-soft);
}

.qty button:hover:not(:disabled) {
  color: var(--ink);
}

.qty button:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

.qty span {
  min-width: 18px;
  font-size: 10px;
  text-align: center;
}

.cart-line__total {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  text-align: right;
}

.cart-shipping {
  margin-top: 18px;
  padding: 16px;
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  background: var(--cream-soft);
}

.cart-shipping__copy {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  color: var(--ink-soft);
  font-size: 9px;
  line-height: 1.5;
}

.cart-shipping__copy strong {
  color: var(--ink);
  font-weight: 500;
}

.cart-shipping__copy small {
  flex-shrink: 0;
  color: var(--ink-faint);
  font-size: 7.5px;
}

.cart-shipping__done {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--sage-deep);
}

.cart-shipping__track {
  height: 3px;
  margin-top: 11px;
  overflow: hidden;
  border-radius: 99px;
  background: var(--cream-deep);
}

.cart-shipping__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--sage), var(--rose));
  transition: width 400ms var(--ease-out);
}

.cart-items__foot {
  display: flex;
  flex-wrap: wrap;
  gap: 15px 22px;
  margin-top: 20px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.03em;
}

.cart-items__foot span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.cart-items__foot :deep(svg) {
  color: var(--sage-deep);
}

.cart-summary {
  position: sticky;
  top: 106px;
  padding: 25px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--cream-soft);
}

.cart-summary h2 {
  margin-top: 11px;
  font-size: clamp(2.2rem, 3.3vw, 3rem);
}

.cart-summary h2 em {
  color: var(--sage-deep);
}

.cart-summary__lines {
  margin-top: 22px;
  border-top: 1px solid var(--line-soft);
}

.cart-summary__lines > div {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding-block: 10px;
  border-bottom: 1px solid var(--line-soft);
  color: var(--ink-soft);
  font-size: 9px;
}

.cart-summary__lines strong {
  color: var(--ink);
  font-weight: 500;
}

.cart-summary__total {
  padding-block: 15px !important;
  border-bottom: 0 !important;
  color: var(--ink) !important;
  font-size: 10px !important;
  font-weight: 500;
}

.cart-summary__total strong {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
}

.cart-summary .btn {
  margin-top: 15px;
}

.cart-summary__note {
  margin-top: 10px;
  color: var(--ink-faint);
  font-size: 7.5px;
  line-height: 1.6;
}

.cart-summary__secure {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding-top: 13px;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-faint);
  font-size: 8px;
}

.cart-summary__secure :deep(svg) {
  color: var(--sage-deep);
}

.cart-summary__payments {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 12px;
}

.cart-summary__payments span {
  padding: 4px 6px;
  border: 1px solid var(--line-soft);
  border-radius: 3px;
  color: var(--ink-faint);
  font-size: 6.5px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.cart-empty {
  display: flex;
  max-width: 520px;
  flex-direction: column;
  align-items: center;
  margin-inline: auto;
  padding: 55px 24px;
  text-align: center;
}

.cart-empty > :deep(svg) {
  color: var(--rose);
}

.cart-empty h2 {
  margin-top: 18px;
  font-size: clamp(2.7rem, 4.5vw, 4rem);
}

.cart-empty h2 em {
  color: var(--sage);
}

.cart-empty p {
  margin-top: 12px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.75;
}

.cart-empty .btn {
  margin-top: 22px;
}

.cart-empty .text-link {
  margin-top: 17px;
}

.cart-recommendations {
  padding-top: clamp(55px, 7vw, 90px);
  background: var(--cream-deep);
}

.cart-recommendations__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 27px;
}

.cart-recommendations__head h2 {
  margin-top: 11px;
  font-size: clamp(2.5rem, 3.8vw, 3.5rem);
}

.cart-recommendations__head h2 em {
  color: var(--sage-deep);
}

.cart-recommendations__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(11px, 1.5vw, 20px);
}

@media (max-width: 1000px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }

  .cart-recommendations__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 700px) {
  .cart-hero__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .cart-hero h1 {
    font-size: clamp(3.6rem, 16vw, 5rem);
  }

  .cart-items__head {
    display: none;
  }

  .cart-line {
    grid-template-columns: 88px 1fr;
    gap: 12px;
    align-items: start;
  }

  .cart-line__media {
    grid-column: 1;
    grid-row: 1 / span 2;
    height: 118px;
  }

  .cart-line__info {
    grid-column: 2;
    grid-row: 1;
  }

  .cart-line .qty {
    grid-column: 2;
    grid-row: 2;
    justify-self: start;
    margin-top: -2px;
  }

  .cart-line__total {
    grid-column: 2;
    grid-row: 2;
    align-self: center;
    justify-self: end;
    font-size: 1.1rem;
  }

  .cart-shipping__copy {
    flex-direction: column;
    gap: 3px;
  }

  .cart-recommendations__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .cart-recommendations__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

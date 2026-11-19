<script setup>
import { computed, nextTick, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import ProductVisual from '../components/ProductVisual.vue'
import SunMark from '../components/SunMark.vue'
import { useShop } from '../stores/shop.js'

const { cartItems, cartSubtotal, cartCount, clearCart } = useShop()

const shippingMethod = ref('standard')
const paymentMethod = ref('card')
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const address = ref('')
const city = ref('')
const postalCode = ref('')
const country = ref('Morocco')
const cardName = ref('')
const cardNumber = ref('')
const expiry = ref('')
const cvc = ref('')
const errors = ref({})
const success = ref(false)
const order = ref(null)

const deliveryFee = computed(() => {
  if (shippingMethod.value === 'express') return 70
  return cartSubtotal.value >= 350 ? 0 : 35
})

const total = computed(() => cartSubtotal.value + deliveryFee.value)

const shippingLabel = computed(() =>
  shippingMethod.value === 'express' ? 'Express delivery · 1–2 working days' : 'Standard delivery · 2–5 working days',
)

function money(value) {
  return `${value} MAD`
}

function validate() {
  const next = {}
  if (!email.value.trim()) next.email = 'Please add an email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) next.email = 'That email address does not look right.'
  if (!firstName.value.trim()) next.firstName = 'Please add your first name.'
  if (!lastName.value.trim()) next.lastName = 'Please add your last name.'
  if (!phone.value.trim()) next.phone = 'Please add a phone number.'
  if (!address.value.trim()) next.address = 'Please add a delivery address.'
  if (!city.value.trim()) next.city = 'Please add a city.'
  if (!country.value.trim()) next.country = 'Please choose a country.'

  if (paymentMethod.value === 'card') {
    if (!cardName.value.trim()) next.cardName = 'Please add the name on the card.'
    const digits = cardNumber.value.replace(/\s/g, '')
    if (!digits) next.cardNumber = 'Please add a card number.'
    else if (!/^\d{12,19}$/.test(digits)) next.cardNumber = 'Use a 12–19 digit card number.'
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.value)) next.expiry = 'Use MM/YY format.'
    if (!/^\d{3,4}$/.test(cvc.value)) next.cvc = 'Use 3 or 4 digits.'
  }

  errors.value = next
  return Object.keys(next).length === 0
}

function placeOrder() {
  if (!cartItems.value.length) return
  if (!validate()) {
    nextTick(() => {
      const firstError = document.querySelector('.checkout-form [aria-invalid="true"]')
      firstError?.focus()
    })
    return
  }

  const snapshotItems = cartItems.value.map((item) => ({
    name: item.product.name,
    shade: item.product.shade,
    qty: item.qty,
    price: item.product.price,
    imageProduct: item.product,
  }))

  order.value = {
    number: `YG-${String(Date.now()).slice(-6)}`,
    email: email.value,
    name: `${firstName.value} ${lastName.value}`,
    address: `${address.value}, ${city.value}${postalCode.value ? ` ${postalCode.value}` : ''}, ${country.value}`,
    shippingLabel: shippingLabel.value,
    paymentLabel: paymentMethod.value === 'card' ? 'Card payment · demo' : 'Cash on delivery',
    subtotal: cartSubtotal.value,
    delivery: deliveryFee.value,
    total: total.value,
    items: snapshotItems,
  }

  success.value = true
  clearCart()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div v-if="success && order" class="checkout-page">
    <section class="order-success">
      <div class="container order-success__inner">
        <SunMark :size="76" />
        <span class="eyebrow">Order confirmed</span>
        <h1>Your glow is<br /><em>on its way.</em></h1>
        <p class="order-success__lede">
          Thank you, {{ order.name.split(' ')[0] }}. We have noted your order and would normally
          send a confirmation to <strong>{{ order.email }}</strong>.
        </p>

        <div class="order-success__card">
          <div class="order-success__top">
            <span>Order</span>
            <strong>{{ order.number }}</strong>
            <span>Demo confirmation</span>
          </div>

          <div class="order-success__items">
            <div v-for="item in order.items" :key="item.name" class="order-success__item">
              <div aria-hidden="true"><ProductVisual :product="item.imageProduct" /></div>
              <span>
                <strong>{{ item.name }}</strong>
                <small>{{ item.shade }} · {{ item.qty }} × {{ money(item.price) }}</small>
              </span>
              <span>{{ money(item.qty * item.price) }}</span>
            </div>
          </div>

          <div class="order-success__details">
            <div>
              <span>Delivery to</span>
              <strong>{{ order.address }}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{{ order.shippingLabel }}</strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>{{ order.paymentLabel }}</strong>
            </div>
          </div>

          <div class="order-success__totals">
            <span>Subtotal · {{ money(order.subtotal) }}</span>
            <span>Delivery · {{ order.delivery ? money(order.delivery) : 'Complimentary' }}</span>
            <strong>Total · {{ money(order.total) }}</strong>
          </div>
        </div>

        <p class="order-success__demo">
          This is a front-end demo. No payment has been taken and no order has been placed with a
          server.
        </p>

        <div class="order-success__actions">
          <RouterLink to="/shop" class="btn btn--primary">
            Continue shopping
            <Icon name="arrowRight" :size="15" />
          </RouterLink>
          <RouterLink to="/" class="btn btn--outline">Back home</RouterLink>
        </div>
      </div>
    </section>
  </div>

  <div v-else-if="!cartItems.length" class="checkout-page">
    <div class="checkout-empty">
      <SunMark :size="56" />
      <span class="eyebrow">Checkout</span>
      <h1>Your bag is<br /><em>empty.</em></h1>
      <p>Add a set or a small ritual before continuing to checkout.</p>
      <RouterLink to="/shop" class="btn btn--primary">Browse the collection</RouterLink>
    </div>
  </div>

  <div v-else class="checkout-page">
    <header class="checkout-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink to="/cart">Bag</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Checkout</span>
        </nav>

        <div class="checkout-steps" aria-label="Checkout progress">
          <RouterLink to="/cart" class="checkout-step is-done">
            <span><Icon name="check" :size="13" /></span>
            Bag
          </RouterLink>
          <span class="checkout-step__line" aria-hidden="true" />
          <span class="checkout-step is-current">
            <span>02</span>
            Details &amp; payment
          </span>
        </div>

        <h1>Checkout,<br /><em>quietly.</em></h1>
        <p>One last considered step before your pieces leave the atelier.</p>
      </div>
    </header>

    <section class="checkout-main section" aria-labelledby="checkout-title">
      <div class="container checkout-layout">
        <form class="checkout-form" novalidate @submit.prevent="placeOrder">
          <h2 id="checkout-title" class="sr-only">Delivery and payment details</h2>

          <div class="checkout-block">
            <div class="checkout-block__head">
              <span>01</span>
              <div>
                <h2>Contact</h2>
                <p>We will send your order confirmation and tracking here.</p>
              </div>
            </div>
            <div class="field">
              <label for="checkout-email">Email</label>
              <input
                id="checkout-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'checkout-email-error' : undefined"
              />
              <p v-if="errors.email" id="checkout-email-error" class="field__error" role="alert">{{ errors.email }}</p>
            </div>
          </div>

          <div class="checkout-block">
            <div class="checkout-block__head">
              <span>02</span>
              <div>
                <h2>Delivery address</h2>
                <p>Delivery across Morocco. We currently do not ship internationally online.</p>
              </div>
            </div>
            <div class="checkout-form__row">
              <div class="field">
                <label for="checkout-first-name">First name</label>
                <input id="checkout-first-name" v-model="firstName" type="text" autocomplete="given-name" placeholder="First name" :aria-invalid="!!errors.firstName" />
                <p v-if="errors.firstName" class="field__error" role="alert">{{ errors.firstName }}</p>
              </div>
              <div class="field">
                <label for="checkout-last-name">Last name</label>
                <input id="checkout-last-name" v-model="lastName" type="text" autocomplete="family-name" placeholder="Last name" :aria-invalid="!!errors.lastName" />
                <p v-if="errors.lastName" class="field__error" role="alert">{{ errors.lastName }}</p>
              </div>
            </div>
            <div class="field">
              <label for="checkout-phone">Phone</label>
              <input id="checkout-phone" v-model="phone" type="tel" autocomplete="tel" placeholder="+212 6 00 00 00 00" :aria-invalid="!!errors.phone" />
              <p v-if="errors.phone" class="field__error" role="alert">{{ errors.phone }}</p>
            </div>
            <div class="field">
              <label for="checkout-address">Address</label>
              <input id="checkout-address" v-model="address" type="text" autocomplete="street-address" placeholder="Street and number" :aria-invalid="!!errors.address" />
              <p v-if="errors.address" class="field__error" role="alert">{{ errors.address }}</p>
            </div>
            <div class="checkout-form__row">
              <div class="field">
                <label for="checkout-city">City</label>
                <input id="checkout-city" v-model="city" type="text" autocomplete="address-level2" placeholder="Casablanca" :aria-invalid="!!errors.city" />
                <p v-if="errors.city" class="field__error" role="alert">{{ errors.city }}</p>
              </div>
              <div class="field">
                <label for="checkout-postal">Postal code <span>(optional)</span></label>
                <input id="checkout-postal" v-model="postalCode" type="text" autocomplete="postal-code" placeholder="20000" />
              </div>
            </div>
            <div class="field">
              <label for="checkout-country">Country</label>
              <div class="field__select">
                <select id="checkout-country" v-model="country" autocomplete="country-name">
                  <option value="Morocco">Morocco</option>
                </select>
                <Icon name="chevronDown" :size="14" />
              </div>
            </div>
          </div>

          <div class="checkout-block">
            <div class="checkout-block__head">
              <span>03</span>
              <div>
                <h2>Delivery method</h2>
                <p>Orders are prepared within one to two working days.</p>
              </div>
            </div>
            <div class="checkout-options">
              <label :class="{ 'is-selected': shippingMethod === 'standard' }">
                <input v-model="shippingMethod" type="radio" name="shipping" value="standard" />
                <span class="checkout-options__radio" aria-hidden="true" />
                <span>
                  <strong>Standard delivery</strong>
                  <small>2–5 working days · {{ cartSubtotal >= 350 ? 'Complimentary' : '35 MAD' }}</small>
                </span>
                <span>{{ cartSubtotal >= 350 ? 'Free' : '35 MAD' }}</span>
              </label>
              <label :class="{ 'is-selected': shippingMethod === 'express' }">
                <input v-model="shippingMethod" type="radio" name="shipping" value="express" />
                <span class="checkout-options__radio" aria-hidden="true" />
                <span>
                  <strong>Express delivery</strong>
                  <small>1–2 working days · Priority dispatch</small>
                </span>
                <span>70 MAD</span>
              </label>
            </div>
          </div>

          <div class="checkout-block">
            <div class="checkout-block__head">
              <span>04</span>
              <div>
                <h2>Payment</h2>
                <p>This is a demo checkout. No payment will be taken.</p>
              </div>
            </div>

            <div class="payment-methods">
              <label :class="{ 'is-selected': paymentMethod === 'card' }">
                <input v-model="paymentMethod" type="radio" name="payment" value="card" />
                <span class="checkout-options__radio" aria-hidden="true" />
                <span>
                  <strong>Card</strong>
                  <small>Visa, Mastercard or CMI · demo only</small>
                </span>
                <Icon name="shield" :size="17" />
              </label>
              <label :class="{ 'is-selected': paymentMethod === 'cod' }">
                <input v-model="paymentMethod" type="radio" name="payment" value="cod" />
                <span class="checkout-options__radio" aria-hidden="true" />
                <span>
                  <strong>Cash on delivery</strong>
                  <small>Pay the courier when your order arrives</small>
                </span>
                <Icon name="truck" :size="17" />
              </label>
            </div>

            <div v-if="paymentMethod === 'card'" class="card-fields">
              <p class="card-fields__demo">
                <Icon name="shield" :size="14" />
                Demo checkout — please do not enter real card details.
              </p>
              <div class="field">
                <label for="checkout-card-name">Name on card</label>
                <input id="checkout-card-name" v-model="cardName" type="text" autocomplete="cc-name" placeholder="Name as it appears on the card" :aria-invalid="!!errors.cardName" />
                <p v-if="errors.cardName" class="field__error" role="alert">{{ errors.cardName }}</p>
              </div>
              <div class="field">
                <label for="checkout-card-number">Card number</label>
                <div class="card-field">
                  <input id="checkout-card-number" v-model="cardNumber" type="text" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" :aria-invalid="!!errors.cardNumber" />
                  <Icon name="shield" :size="16" />
                </div>
                <p v-if="errors.cardNumber" class="field__error" role="alert">{{ errors.cardNumber }}</p>
              </div>
              <div class="checkout-form__row">
                <div class="field">
                  <label for="checkout-expiry">Expiry</label>
                  <input id="checkout-expiry" v-model="expiry" type="text" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" :aria-invalid="!!errors.expiry" />
                  <p v-if="errors.expiry" class="field__error" role="alert">{{ errors.expiry }}</p>
                </div>
                <div class="field">
                  <label for="checkout-cvc">CVC</label>
                  <input id="checkout-cvc" v-model="cvc" type="text" inputmode="numeric" autocomplete="cc-csc" placeholder="123" :aria-invalid="!!errors.cvc" />
                  <p v-if="errors.cvc" class="field__error" role="alert">{{ errors.cvc }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="checkout-form__submit">
            <button type="submit" class="btn btn--primary">
              Place demo order · {{ money(total) }}
              <Icon name="arrowRight" :size="16" />
            </button>
            <p>
              By placing this demo order you agree to our
              <RouterLink to="/terms">terms</RouterLink> and <RouterLink to="/privacy">privacy policy</RouterLink>.
            </p>
          </div>
        </form>

        <aside class="checkout-summary" aria-labelledby="checkout-summary-title">
          <div class="checkout-summary__head">
            <span class="eyebrow">In your bag</span>
            <RouterLink to="/cart">Edit bag</RouterLink>
          </div>
          <h2 id="checkout-summary-title">{{ cartCount }} {{ cartCount === 1 ? 'piece' : 'pieces' }}</h2>

          <div class="checkout-summary__items">
            <div v-for="item in cartItems" :key="item.id" class="checkout-summary__item">
              <div aria-hidden="true"><ProductVisual :product="item.product" /></div>
              <span>
                <strong>{{ item.product.name }}</strong>
                <small>{{ item.product.shade }} · Qty {{ item.qty }}</small>
              </span>
              <span>{{ money(item.product.price * item.qty) }}</span>
            </div>
          </div>

          <div class="checkout-summary__lines">
            <div>
              <span>Subtotal</span>
              <strong>{{ money(cartSubtotal) }}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{{ deliveryFee === 0 ? 'Complimentary' : money(deliveryFee) }}</strong>
            </div>
            <div class="checkout-summary__total">
              <span>Total</span>
              <strong>{{ money(total) }}</strong>
            </div>
          </div>

          <div class="checkout-summary__note">
            <SunMark :size="22" />
            <p>Hand-wrapped in Casablanca · 14-day returns on unopened sets.</p>
          </div>
        </aside>
      </div>
    </section>

    <div class="checkout-help">
      <div class="container checkout-help__inner">
        <p><Icon name="mail" :size="15" /> Questions about checkout? <a href="mailto:hello@youglow.ma">hello@youglow.ma</a></p>
        <RouterLink to="/shipping-returns" class="text-link">
          Shipping &amp; returns
          <Icon name="arrowRight" :size="14" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
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

.checkout-hero {
  padding-block: clamp(30px, 4vw, 54px) clamp(34px, 4.5vw, 60px);
  border-bottom: 1px solid var(--line-soft);
  background:
    radial-gradient(circle at 90% 10%, rgba(229, 200, 184, 0.22), transparent 30%),
    var(--cream);
}

.checkout-steps {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 26px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.checkout-step {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.checkout-step > span {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  font-size: 7px;
}

.checkout-step.is-done > span {
  border-color: var(--sage-deep);
  background: var(--sage-deep);
  color: var(--cream);
}

.checkout-step.is-current {
  color: var(--ink);
}

.checkout-step.is-current > span {
  border-color: var(--ink);
}

.checkout-step__line {
  width: 30px;
  height: 1px;
  background: var(--line);
}

.checkout-hero h1 {
  margin-top: 19px;
  font-size: clamp(3.8rem, 6.5vw, 6.5rem);
  font-weight: 300;
  line-height: 0.86;
}

.checkout-hero h1 em {
  color: var(--sage);
}

.checkout-hero p {
  margin-top: 12px;
  color: var(--ink-soft);
  font-size: 11px;
}

.checkout-main {
  padding-top: clamp(42px, 5vw, 68px);
}

.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(290px, 0.88fr);
  gap: clamp(32px, 6vw, 80px);
  align-items: start;
}

.checkout-block {
  padding-bottom: 25px;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--line);
}

.checkout-block:last-of-type {
  padding-bottom: 0;
  border-bottom: 0;
}

.checkout-block__head {
  display: flex;
  gap: 12px;
}

.checkout-block__head > span {
  padding-top: 3px;
  color: var(--rose-deep);
  font-size: 8px;
  letter-spacing: 0.08em;
}

.checkout-block__head h2 {
  font-size: 1.9rem;
  line-height: 1;
}

.checkout-block__head p {
  margin-top: 5px;
  color: var(--ink-faint);
  font-size: 9px;
  line-height: 1.6;
}

.checkout-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.field {
  margin-top: 15px;
}

.field label {
  display: block;
  margin-bottom: 5px;
  color: var(--ink-faint);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.field label span {
  font-weight: 400;
  letter-spacing: 0.02em;
  text-transform: none;
}

.field > input,
.field__select,
.card-field {
  width: 100%;
  height: 44px;
  border: 1px solid var(--line-soft);
  border-radius: 4px;
  background: var(--cream-soft);
  transition: border-color 200ms ease;
}

.field > input {
  padding: 0 11px;
  font-size: 10.5px;
}

.field > input:hover,
.field__select:hover,
.card-field:hover {
  border-color: var(--line);
}

.field > input:focus,
.field__select:focus-within,
.card-field:focus-within {
  border-color: var(--sage);
  outline: 0;
}

.field > input[aria-invalid='true'],
.card-field:has(input[aria-invalid='true']) {
  border-color: #a85743;
}

.field > input::placeholder {
  color: var(--ink-faint);
  font-size: 9.5px;
}

.field__select {
  position: relative;
  display: flex;
  align-items: center;
}

.field__select select {
  width: 100%;
  height: 100%;
  padding: 0 11px;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 10.5px;
  cursor: pointer;
  appearance: none;
}

.field__select :deep(svg) {
  position: absolute;
  right: 11px;
  color: var(--ink-faint);
  pointer-events: none;
}

.card-field {
  display: flex;
  align-items: center;
  padding: 0 11px;
}

.card-field input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 10.5px;
}

.card-field :deep(svg) {
  flex-shrink: 0;
  color: var(--sage-deep);
}

.field__error {
  margin-top: 4px;
  color: #924c3b;
  font-size: 8px;
  line-height: 1.4;
}

.checkout-options,
.payment-methods {
  display: grid;
  gap: 5px;
  margin-top: 16px;
}

.checkout-options label,
.payment-methods label {
  display: flex;
  min-height: 54px;
  cursor: pointer;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--line-soft);
  border-radius: 5px;
  background: var(--cream-soft);
  transition:
    border-color 200ms ease,
    background-color 200ms ease;
}

.checkout-options label:hover,
.payment-methods label:hover {
  border-color: var(--line);
}

.checkout-options label.is-selected,
.payment-methods label.is-selected {
  border-color: var(--sage);
  background: var(--sage-wash);
}

.checkout-options input,
.payment-methods input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.checkout-options__radio {
  display: grid;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--cream-soft);
}

.is-selected .checkout-options__radio {
  border-color: var(--sage-deep);
}

.is-selected .checkout-options__radio::after {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sage-deep);
  content: '';
}

.checkout-options label > span:nth-child(3),
.payment-methods label > span:nth-child(3) {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.checkout-options label > span:last-child,
.payment-methods label > :deep(svg) {
  margin-left: auto;
  color: var(--ink-soft);
  font-size: 9px;
}

.payment-methods label > :deep(svg) {
  color: var(--sage-deep);
}

.checkout-options strong,
.payment-methods strong {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  line-height: 1.1;
}

.checkout-options small,
.payment-methods small {
  color: var(--ink-faint);
  font-size: 8px;
  line-height: 1.4;
}

.card-fields {
  margin-top: 17px;
  padding: 15px;
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  background: var(--cream-soft);
}

.card-fields__demo {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--rose-deep);
  font-size: 8.5px;
  line-height: 1.5;
}

.card-fields .field {
  margin-top: 11px;
}

.checkout-form__submit {
  margin-top: 25px;
  padding-top: 19px;
  border-top: 1px solid var(--line);
}

.checkout-form__submit p {
  max-width: 360px;
  margin-top: 11px;
  color: var(--ink-faint);
  font-size: 8px;
  line-height: 1.6;
}

.checkout-form__submit a {
  color: var(--ink-soft);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.checkout-summary {
  position: sticky;
  top: 106px;
  padding: 25px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--cream-soft);
}

.checkout-summary__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.checkout-summary__head > a {
  color: var(--ink-soft);
  font-size: 8px;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.checkout-summary h2 {
  margin-top: 12px;
  font-size: 2rem;
}

.checkout-summary__items {
  margin-top: 18px;
  border-top: 1px solid var(--line-soft);
}

.checkout-summary__item {
  display: grid;
  grid-template-columns: 54px 1fr auto;
  align-items: center;
  gap: 10px;
  padding-block: 10px;
  border-bottom: 1px solid var(--line-soft);
}

.checkout-summary__item > div {
  width: 54px;
  height: 58px;
  overflow: hidden;
  border-radius: 4px;
}

.checkout-summary__item :deep(.product-visual) {
  height: 100%;
  aspect-ratio: auto;
}

.checkout-summary__item :deep(.pv-label),
.checkout-summary__item :deep(.pv-edition),
.checkout-summary__item :deep(.pv-seal) {
  display: none;
}

.checkout-summary__item > span:nth-child(2) {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.checkout-summary__item strong {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.1;
}

.checkout-summary__item small {
  color: var(--ink-faint);
  font-size: 7.5px;
}

.checkout-summary__item > span:last-child {
  color: var(--ink-soft);
  font-size: 8.5px;
}

.checkout-summary__lines {
  margin-top: 13px;
}

.checkout-summary__lines > div {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding-block: 8px;
  border-bottom: 1px solid var(--line-soft);
  color: var(--ink-soft);
  font-size: 9px;
}

.checkout-summary__lines strong {
  color: var(--ink);
  font-weight: 500;
}

.checkout-summary__total {
  padding-block: 13px !important;
  border-bottom: 0 !important;
  color: var(--ink) !important;
  font-size: 10px !important;
  font-weight: 500;
}

.checkout-summary__total strong {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 500;
}

.checkout-summary__note {
  display: flex;
  gap: 9px;
  margin-top: 12px;
  padding: 12px;
  border-radius: 5px;
  background: var(--sage-wash);
}

.checkout-summary__note :deep(svg) {
  flex-shrink: 0;
  color: var(--rose-deep);
}

.checkout-summary__note p {
  color: var(--ink-soft);
  font-size: 8px;
  line-height: 1.6;
}

.checkout-help {
  padding-block: 22px;
  border-top: 1px solid var(--line-soft);
  background: var(--cream-soft);
}

.checkout-help__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
}

.checkout-help p {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-faint);
  font-size: 8.5px;
}

.checkout-help p :deep(svg) {
  color: var(--sage-deep);
}

.checkout-help p a {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.checkout-empty,
.order-success {
  min-height: 62vh;
}

.checkout-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 24px;
  text-align: center;
}

.checkout-empty > :deep(svg) {
  color: var(--rose);
}

.checkout-empty h1 {
  margin-top: 15px;
  font-size: clamp(3rem, 6vw, 5rem);
}

.checkout-empty h1 em {
  color: var(--sage);
}

.checkout-empty p {
  margin-top: 13px;
  color: var(--ink-soft);
  font-size: 11px;
}

.checkout-empty .btn {
  margin-top: 22px;
}

.order-success {
  padding-block: clamp(52px, 7vw, 86px);
  background:
    radial-gradient(circle at 50% 0%, rgba(229, 200, 184, 0.28), transparent 32%),
    var(--cream);
}

.order-success__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.order-success__inner > :deep(svg) {
  color: var(--rose);
}

.order-success h1 {
  margin-top: 14px;
  font-size: clamp(3.7rem, 7vw, 6.4rem);
  font-weight: 300;
  line-height: 0.88;
}

.order-success h1 em {
  color: var(--sage);
}

.order-success__lede {
  max-width: 470px;
  margin-top: 18px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.8;
}

.order-success__lede strong {
  color: var(--ink);
  font-weight: 500;
}

.order-success__card {
  width: min(660px, 100%);
  margin-top: 25px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--cream-soft);
  text-align: left;
}

.order-success__top {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 7px;
  padding-bottom: 13px;
  border-bottom: 1px solid var(--line-soft);
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.order-success__top strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}

.order-success__top span:last-child {
  margin-left: auto;
  color: var(--sage-deep);
}

.order-success__items {
  padding-block: 5px;
}

.order-success__item {
  display: grid;
  grid-template-columns: 45px 1fr auto;
  align-items: center;
  gap: 9px;
  padding-block: 7px;
}

.order-success__item > div {
  width: 45px;
  height: 48px;
  overflow: hidden;
  border-radius: 3px;
}

.order-success__item :deep(.product-visual) {
  height: 100%;
  aspect-ratio: auto;
}

.order-success__item :deep(.pv-label),
.order-success__item :deep(.pv-edition),
.order-success__item :deep(.pv-seal) {
  display: none;
}

.order-success__item > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.order-success__item strong {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
}

.order-success__item small {
  color: var(--ink-faint);
  font-size: 7.5px;
}

.order-success__item > span:last-child {
  color: var(--ink-soft);
  font-size: 8px;
}

.order-success__details {
  display: grid;
  gap: 8px;
  margin-top: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--line-soft);
}

.order-success__details > div {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
}

.order-success__details span {
  color: var(--ink-faint);
  font-size: 7.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.order-success__details strong {
  color: var(--ink-soft);
  font-size: 9px;
  font-weight: 400;
  line-height: 1.5;
}

.order-success__totals {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
  margin-top: 14px;
  padding-top: 13px;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-faint);
  font-size: 8px;
}

.order-success__totals strong {
  width: 100%;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  text-align: right;
}

.order-success__demo {
  max-width: 460px;
  margin-top: 16px;
  color: var(--ink-faint);
  font-size: 8px;
  line-height: 1.6;
}

.order-success__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  margin-top: 18px;
}

@media (max-width: 1000px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: static;
    order: -1;
    max-width: 600px;
  }
}

@media (max-width: 700px) {
  .checkout-hero h1 {
    font-size: clamp(3.2rem, 14vw, 4.5rem);
  }

  .checkout-form__row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .checkout-summary {
    padding: 19px;
  }

  .checkout-help__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .order-success__card {
    padding: 17px;
  }

  .order-success__details > div {
    grid-template-columns: 1fr;
    gap: 2px;
  }

  .order-success__actions {
    width: 100%;
  }

  .order-success__actions :deep(.btn) {
    flex: 1;
  }
}
</style>

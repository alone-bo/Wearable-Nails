<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import PageHero from '../components/PageHero.vue'
import SunMark from '../components/SunMark.vue'
import { useShop } from '../stores/shop.js'

const { openBooking } = useShop()

const name = ref('')
const email = ref('')
const subject = ref('Order question')
const message = ref('')
const errors = ref({})
const sent = ref(false)

const subjects = ['Order question', 'Product advice', 'Studio appointment', 'Press & partnerships', 'Something else']

const channels = [
  { label: 'Email', value: 'hello@youglow.ma', href: 'mailto:hello@youglow.ma', icon: 'mail' },
  { label: 'Call', value: '+212 5 22 00 00 00', href: 'tel:+212522000000', icon: 'phone' },
  { label: 'WhatsApp', value: 'Message the atelier', href: 'https://wa.me/212522000000', icon: 'whatsapp' },
]

function validate() {
  const next = {}
  if (!name.value.trim()) next.name = 'Please tell us your name.'
  if (!email.value.trim()) next.email = 'Please add an email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) next.email = 'That email address does not look right.'
  if (!message.value.trim()) next.message = 'Please add a short message.'
  errors.value = next
  return !Object.keys(next).length
}

function submit() {
  if (!validate()) return
  sent.value = true
}

function reset() {
  name.value = ''
  email.value = ''
  subject.value = 'Order question'
  message.value = ''
  errors.value = {}
  sent.value = false
}
</script>

<template>
  <div class="contact-page">
    <PageHero
      eyebrow="Contact & visit"
      lede="A question about a set, a note about an order, or simply a hello — the atelier reads every message. You can also find us on the Corniche, seven days a week."
      :crumbs="[{ label: 'Contact' }]"
      image="/images/gallery-gold.webp"
      image-position="50% 45%"
    >
      <template #title>Come by.<br /><em>Or write to us.</em></template>
    </PageHero>

    <section class="contact-main section" aria-labelledby="contact-title">
      <div class="container contact-main__grid">
        <div class="contact-form-wrap">
          <div class="contact-form__head">
            <span class="eyebrow">Send a note</span>
            <h2 id="contact-title">How can we<br /><em>help?</em></h2>
            <p>We reply within one working day, Monday to Sunday.</p>
          </div>

          <div v-if="sent" class="contact-success" role="status">
            <span class="contact-success__icon"><Icon name="check" :size="26" /></span>
            <h3>Your note is on its way.</h3>
            <p>Thank you, {{ name }}. We have your message about {{ subject.toLowerCase() }} and will reply to {{ email }} shortly.</p>
            <p class="contact-success__demo">
              This is a front-end demo — no message has been sent to the atelier.
            </p>
            <button type="button" class="text-link" @click="reset">
              Write another note
              <Icon name="arrowRight" :size="14" />
            </button>
          </div>

          <form v-else class="contact-form" novalidate @submit.prevent="submit">
            <div class="contact-form__row">
              <div class="field">
                <label for="contact-name">Your name</label>
                <input
                  id="contact-name"
                  v-model="name"
                  type="text"
                  autocomplete="name"
                  placeholder="First and last name"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'contact-name-error' : undefined"
                />
                <p v-if="errors.name" id="contact-name-error" class="field__error" role="alert">{{ errors.name }}</p>
              </div>
              <div class="field">
                <label for="contact-email">Email</label>
                <input
                  id="contact-email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="errors.email ? 'contact-email-error' : undefined"
                />
                <p v-if="errors.email" id="contact-email-error" class="field__error" role="alert">{{ errors.email }}</p>
              </div>
            </div>

            <div class="field">
              <label for="contact-subject">What is it about?</label>
              <div class="field__select">
                <select id="contact-subject" v-model="subject">
                  <option v-for="option in subjects" :key="option" :value="option">{{ option }}</option>
                </select>
                <Icon name="chevronDown" :size="14" />
              </div>
            </div>

            <div class="field">
              <label for="contact-message">Your message</label>
              <textarea
                id="contact-message"
                v-model="message"
                rows="6"
                placeholder="Tell us a little about what you need…"
                :aria-invalid="!!errors.message"
                :aria-describedby="errors.message ? 'contact-message-error' : undefined"
              />
              <p v-if="errors.message" id="contact-message-error" class="field__error" role="alert">{{ errors.message }}</p>
            </div>

            <div class="contact-form__submit">
              <button type="submit" class="btn btn--primary">
                Send message
                <Icon name="arrowRight" :size="16" />
              </button>
              <p>Demo form · no message is sent from this page.</p>
            </div>
          </form>
        </div>

        <aside class="contact-studio">
          <div class="contact-studio__map" aria-hidden="true">
            <span class="contact-studio__road contact-studio__road--one" />
            <span class="contact-studio__road contact-studio__road--two" />
            <span class="contact-studio__road contact-studio__road--three" />
            <span class="contact-studio__pin">
              <SunMark :size="38" />
              <small>YOUGLOW</small>
            </span>
            <span class="contact-studio__label">The Corniche · Casa</span>
          </div>

          <div class="contact-studio__card">
            <span class="eyebrow eyebrow--light">Visit the atelier</span>
            <h2>127 Boulevard<br /><em>de la Corniche.</em></h2>
            <p>Casablanca 20000, Morocco</p>
            <div class="contact-studio__hours">
              <span>Open daily</span>
              <strong>10:00 — 20:00</strong>
            </div>
            <a
              href="https://maps.google.com/?q=127+Boulevard+de+la+Corniche+Casablanca"
              target="_blank"
              rel="noreferrer"
              class="text-link text-link--light"
            >
              Open in Google Maps
              <Icon name="arrowUpRight" :size="14" />
            </a>
          </div>

          <div class="contact-channels">
            <a v-for="channel in channels" :key="channel.label" :href="channel.href" target="_blank" rel="noreferrer">
              <span class="contact-channels__icon"><Icon :name="channel.icon" :size="17" /></span>
              <span>
                <small>{{ channel.label }}</small>
                <strong>{{ channel.value }}</strong>
              </span>
              <Icon name="arrowUpRight" :size="14" />
            </a>
          </div>
        </aside>
      </div>
    </section>

    <section class="contact-more">
      <div class="container contact-more__inner">
        <div>
          <span class="eyebrow">Prefer to talk it through?</span>
          <h2>One quiet hour<br /><em>on the Corniche.</em></h2>
        </div>
        <div>
          <p>
            Book a signature manicure, a hand ritual or a press-on fitting. We will take care of
            the rest — including the tea.
          </p>
          <button type="button" class="btn btn--primary" @click="openBooking()">
            Book a studio visit
            <Icon name="calendar" :size="16" />
          </button>
        </div>
      </div>
    </section>

    <PageCta
      eyebrow="Quick answers"
      text="Delivery times, wear advice, returns and the Glow Club — the most common questions are answered in our FAQ."
    >
      <template #title>Before you write,<br /><em>we may have answered.</em></template>
      <RouterLink to="/faq" class="btn btn--cream">
        Read the FAQ
        <Icon name="arrowUpRight" :size="15" />
      </RouterLink>
      <RouterLink to="/shipping-returns" class="btn btn--ghost-light">
        Shipping &amp; returns
        <Icon name="arrowRight" :size="15" />
      </RouterLink>
    </PageCta>
  </div>
</template>

<style scoped>
.contact-page {
  background: var(--cream);
}

.contact-main {
  padding-top: clamp(50px, 6vw, 82px);
}

.contact-main__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  gap: clamp(42px, 7vw, 100px);
  align-items: start;
}

.contact-form__head h2 {
  margin-top: 13px;
  font-size: clamp(2.9rem, 4.5vw, 4.3rem);
}

.contact-form__head h2 em {
  color: var(--sage-deep);
}

.contact-form__head p {
  margin-top: 12px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.7;
}

.contact-form {
  margin-top: 26px;
}

.contact-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  margin-top: 14px;
}

.field label {
  display: block;
  margin-bottom: 6px;
  color: var(--ink-faint);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.field > input,
.field > textarea,
.field__select {
  width: 100%;
  border: 1px solid var(--line-soft);
  border-radius: 5px;
  background: var(--cream-soft);
  transition: border-color 200ms ease;
}

.field > input {
  height: 46px;
  padding: 0 13px;
  font-size: 11px;
}

.field > textarea {
  min-height: 150px;
  padding: 12px 13px;
  resize: vertical;
  font-size: 11px;
  line-height: 1.7;
}

.field > input:hover,
.field > textarea:hover,
.field__select:hover {
  border-color: var(--line);
}

.field > input:focus,
.field > textarea:focus,
.field__select:focus-within {
  border-color: var(--sage);
  outline: 0;
}

.field > input[aria-invalid='true'],
.field > textarea[aria-invalid='true'] {
  border-color: #a85743;
}

.field > input::placeholder,
.field > textarea::placeholder {
  color: var(--ink-faint);
  font-size: 10px;
  opacity: 0.8;
}

.field__select {
  position: relative;
  display: flex;
  height: 46px;
  align-items: center;
}

.field__select select {
  width: 100%;
  height: 100%;
  padding: 0 13px;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 10.5px;
  cursor: pointer;
  appearance: none;
}

.field__select :deep(svg) {
  position: absolute;
  right: 12px;
  color: var(--ink-faint);
  pointer-events: none;
}

.field__error {
  margin-top: 4px;
  color: #924c3b;
  font-size: 8.5px;
  line-height: 1.4;
}

.contact-form__submit {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--line-soft);
}

.contact-form__submit p {
  max-width: 210px;
  color: var(--ink-faint);
  font-size: 8px;
  line-height: 1.6;
}

.contact-success {
  margin-top: 26px;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--cream-soft);
}

.contact-success__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 50%;
  background: var(--sage-wash);
  color: var(--sage-deep);
}

.contact-success h3 {
  margin-top: 20px;
  font-size: 2rem;
}

.contact-success > p {
  margin-top: 9px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.75;
}

.contact-success__demo {
  color: var(--ink-faint) !important;
  font-size: 8.5px !important;
}

.contact-success .text-link {
  margin-top: 18px;
}

.contact-studio {
  padding-top: 7px;
}

.contact-studio__map {
  position: relative;
  height: 240px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  background:
    linear-gradient(135deg, transparent 0 45%, rgba(255, 253, 248, 0.45) 45% 48%, transparent 48%),
    linear-gradient(24deg, transparent 0 58%, rgba(255, 253, 248, 0.5) 58% 61%, transparent 61%),
    linear-gradient(90deg, rgba(97, 110, 84, 0.1) 1px, transparent 1px),
    linear-gradient(rgba(97, 110, 84, 0.1) 1px, transparent 1px),
    var(--sage-wash);
  background-size:
    auto,
    auto,
    38px 38px,
    38px 38px,
    auto;
}

.contact-studio__road {
  position: absolute;
  height: 12px;
  background: rgba(255, 253, 248, 0.72);
  transform: rotate(-25deg);
}

.contact-studio__road--one {
  top: 34%;
  left: -10%;
  width: 130%;
}

.contact-studio__road--two {
  top: 68%;
  left: -5%;
  width: 120%;
  transform: rotate(8deg);
}

.contact-studio__road--three {
  top: -5%;
  left: 40%;
  width: 12px;
  height: 120%;
  transform: rotate(0);
}

.contact-studio__pin {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: var(--rose-deep);
  transform: translate(-50%, -50%);
}

.contact-studio__pin small {
  padding: 3px 5px;
  border-radius: 2px;
  background: var(--cream);
  color: var(--ink);
  font-size: 6px;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.contact-studio__label {
  position: absolute;
  right: 14px;
  bottom: 12px;
  color: var(--ink-faint);
  font-size: 7px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.contact-studio__card {
  margin-top: -1px;
  padding: 28px;
  border-radius: 0 0 8px 8px;
  background: var(--sage-deep);
  color: var(--cream);
}

.contact-studio__card h2 {
  margin-top: 12px;
  color: var(--cream);
  font-size: clamp(2.1rem, 3.4vw, 3rem);
}

.contact-studio__card h2 em {
  color: var(--rose-light);
}

.contact-studio__card > p {
  margin-top: 7px;
  color: rgba(247, 242, 233, 0.96);
  font-size: 10px;
}

.contact-studio__hours {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;
  padding-top: 14px;
  border-top: 1px solid var(--line-light);
}

.contact-studio__hours span {
  color: rgba(247, 242, 233, 0.94);
  font-size: 7px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.contact-studio__hours strong {
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 400;
}

.contact-studio__card .text-link {
  margin-top: 15px;
}

.contact-channels {
  display: grid;
  gap: 1px;
  margin-top: 12px;
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  overflow: hidden;
  background: var(--line-soft);
}

.contact-channels a {
  display: flex;
  min-height: 60px;
  align-items: center;
  gap: 11px;
  padding: 11px 13px;
  background: var(--cream-soft);
  transition: background-color 200ms ease;
}

.contact-channels a:hover {
  background: var(--white);
}

.contact-channels__icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--line-soft);
  border-radius: 50%;
  color: var(--sage-deep);
}

.contact-channels a > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.contact-channels small {
  color: var(--ink-faint);
  font-size: 7px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.contact-channels strong {
  color: var(--ink);
  font-size: 10px;
  font-weight: 500;
}

.contact-channels a > :deep(svg) {
  margin-left: auto;
  color: var(--ink-faint);
}

.contact-more {
  padding-block: clamp(56px, 7vw, 90px);
  background: var(--sand);
}

.contact-more__inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 50px;
}

.contact-more h2 {
  margin-top: 13px;
  font-size: clamp(2.8rem, 4.5vw, 4.3rem);
}

.contact-more h2 em {
  color: var(--sage-deep);
}

.contact-more__inner > div:last-child {
  max-width: 330px;
}

.contact-more p {
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.75;
}

.contact-more .btn {
  margin-top: 18px;
}

@media (max-width: 980px) {
  .contact-main__grid {
    grid-template-columns: 1fr;
  }

  .contact-studio {
    max-width: 600px;
  }

  .contact-more__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 22px;
  }

  .contact-more__inner > div:last-child {
    max-width: 480px;
  }
}

@media (max-width: 600px) {
  .contact-form__row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .contact-form__submit {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .contact-form__submit p {
    max-width: none;
  }

  .contact-studio__card {
    padding: 24px;
  }

  .contact-studio__map {
    height: 200px;
  }
}
</style>

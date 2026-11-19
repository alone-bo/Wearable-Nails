<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import BaseDialog from './BaseDialog.vue'
import Icon from './Icon.vue'
import SunMark from './SunMark.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  services: { type: Array, default: () => [] },
  initialServiceId: { type: String, default: '' },
})

const emit = defineEmits(['close'])

const selectedService = ref('')
const date = ref('')
const time = ref('10:00')
const name = ref('')
const email = ref('')
const phone = ref('')
const note = ref('')
const errors = ref({})
const success = ref(false)
const successEl = ref(null)

const timeSlots = ['10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00']

function localIso(dateValue) {
  const y = dateValue.getFullYear()
  const m = String(dateValue.getMonth() + 1).padStart(2, '0')
  const d = String(dateValue.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return localIso(tomorrow)
})

const maxDate = computed(() => {
  const soon = new Date()
  soon.setDate(soon.getDate() + 60)
  return localIso(soon)
})

const chosen = computed(() => props.services.find((service) => service.id === selectedService.value))

const prettyDate = computed(() => {
  if (!date.value) return ''
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date.value}T12:00:00`))
})

function resetForm() {
  selectedService.value = props.initialServiceId || props.services[0]?.id || ''
  date.value = ''
  time.value = '10:00'
  name.value = ''
  email.value = ''
  phone.value = ''
  note.value = ''
  errors.value = {}
  success.value = false
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) resetForm()
  },
)

watch(
  () => props.initialServiceId,
  (id) => {
    if (props.open && id) selectedService.value = id
  },
)

function validate() {
  const nextErrors = {}
  if (!name.value.trim()) nextErrors.name = 'Please tell us your name.'
  if (!email.value.trim()) nextErrors.email = 'Please add an email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) nextErrors.email = 'That email address does not look right.'
  if (!date.value) nextErrors.date = 'Choose a day for your visit.'
  if (!time.value) nextErrors.time = 'Choose a time that suits you.'
  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function submit() {
  if (!validate()) {
    nextTick(() => {
      const firstError = document.querySelector('.booking [aria-invalid="true"]')
      firstError?.focus()
    })
    return
  }

  success.value = true
  nextTick(() => successEl.value?.focus())
}
</script>

<template>
  <BaseDialog :open="open" variant="modal" label="Book a studio visit" @close="emit('close')">
    <div class="booking" :class="{ 'booking--success': success }">
      <template v-if="!success">
        <div class="booking__aside">
          <div>
            <span class="eyebrow eyebrow--light">The atelier · Casablanca</span>
            <h2>Reserve your <em>quiet hour.</em></h2>
            <p>
              A slow, considered appointment in our Corniche studio. Choose a ritual and a time —
              we will confirm the details by email.
            </p>
          </div>

          <div class="booking__aside-bottom">
            <div class="booking__hours">
              <span>Open daily</span>
              <strong>10:00 — 20:00</strong>
            </div>
            <p>127 Boulevard de la Corniche<br />Casablanca 20000</p>
            <a href="tel:+212522000000" class="booking__phone">
              <Icon name="phone" :size="15" />
              +212 5 22 00 00 00
            </a>
            <SunMark class="booking__sun" :size="74" />
          </div>
        </div>

        <form class="booking__form" novalidate @submit.prevent="submit">
          <fieldset class="booking__fieldset">
            <legend>Choose your ritual</legend>
            <div class="booking__services">
              <label
                v-for="service in services"
                :key="service.id"
                class="service-option"
                :class="{ 'is-selected': selectedService === service.id }"
              >
                <input v-model="selectedService" type="radio" name="service" :value="service.id" />
                <span class="service-option__radio" aria-hidden="true" />
                <span class="service-option__copy">
                  <strong>{{ service.name }}</strong>
                  <small>{{ service.detail }} · {{ service.duration }}</small>
                </span>
                <span class="service-option__price">{{ service.price }} MAD</span>
              </label>
            </div>
          </fieldset>

          <div class="booking__row">
            <div class="field">
              <label for="booking-date">Date</label>
              <div class="field__control">
                <Icon name="calendar" :size="16" />
                <input
                  id="booking-date"
                  v-model="date"
                  type="date"
                  :min="minDate"
                  :max="maxDate"
                  :aria-invalid="!!errors.date"
                  :aria-describedby="errors.date ? 'date-error' : undefined"
                />
              </div>
              <p v-if="errors.date" id="date-error" class="field__error" role="alert">{{ errors.date }}</p>
            </div>

            <div class="field">
              <label for="booking-time">Time</label>
              <div class="field__control field__control--select">
                <Icon name="clock" :size="16" />
                <select
                  id="booking-time"
                  v-model="time"
                  :aria-invalid="!!errors.time"
                  :aria-describedby="errors.time ? 'time-error' : undefined"
                >
                  <option v-for="slot in timeSlots" :key="slot" :value="slot">{{ slot }}</option>
                </select>
                <Icon name="chevronDown" :size="14" />
              </div>
              <p v-if="errors.time" id="time-error" class="field__error" role="alert">{{ errors.time }}</p>
            </div>
          </div>

          <div class="booking__row">
            <div class="field">
              <label for="booking-name">Your name</label>
              <input
                id="booking-name"
                v-model="name"
                type="text"
                autocomplete="name"
                placeholder="First and last name"
                :aria-invalid="!!errors.name"
                :aria-describedby="errors.name ? 'name-error' : undefined"
              />
              <p v-if="errors.name" id="name-error" class="field__error" role="alert">{{ errors.name }}</p>
            </div>

            <div class="field">
              <label for="booking-email">Email</label>
              <input
                id="booking-email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                :aria-invalid="!!errors.email"
                :aria-describedby="errors.email ? 'email-error' : undefined"
              />
              <p v-if="errors.email" id="email-error" class="field__error" role="alert">{{ errors.email }}</p>
            </div>
          </div>

          <div class="booking__row">
            <div class="field">
              <label for="booking-phone">Phone <span>(optional)</span></label>
              <input id="booking-phone" v-model="phone" type="tel" autocomplete="tel" placeholder="+212 6 00 00 00 00" />
            </div>

            <div class="field">
              <label for="booking-note">A note <span>(optional)</span></label>
              <input id="booking-note" v-model="note" type="text" placeholder="Allergies, inspiration, anything else" />
            </div>
          </div>

          <div class="booking__submit">
            <button type="submit" class="btn btn--primary">
              Request appointment
              <Icon name="arrowUpRight" :size="16" />
            </button>
            <p>No prepayment. We will confirm by email within one working day.</p>
          </div>
        </form>
      </template>

      <div v-else ref="successEl" class="booking__success" tabindex="-1">
        <SunMark :size="74" class="booking__success-sun" />
        <span class="eyebrow">Request received</span>
        <h2>Your quiet hour is <em>pencilled in.</em></h2>
        <p>
          Thank you, {{ name.split(' ')[0] }}. We have noted your request for
          <strong>{{ chosen?.name }}</strong> on <strong>{{ prettyDate }}</strong> at
          <strong>{{ time }}</strong>.
        </p>

        <div class="booking__ticket">
          <div>
            <span>Ritual</span>
            <strong>{{ chosen?.name }}</strong>
          </div>
          <div>
            <span>Date</span>
            <strong>{{ prettyDate }}</strong>
          </div>
          <div>
            <span>Time</span>
            <strong>{{ time }}</strong>
          </div>
          <div>
            <span>Studio</span>
            <strong>Corniche, Casablanca</strong>
          </div>
        </div>

        <p class="booking__success-note">
          A confirmation would normally arrive at {{ email }}. This is a front-end demo — no real
          appointment has been reserved.
        </p>

        <div class="booking__success-actions">
          <button type="button" class="btn btn--primary" @click="emit('close')">Back to YOUGLOW</button>
          <button type="button" class="btn btn--outline" @click="success = false">Edit request</button>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<style scoped>
.booking {
  display: grid;
  min-height: 640px;
  grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.28fr);
  background: var(--cream-soft);
}

.booking__aside {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 46px 38px 34px;
  overflow: hidden;
  background:
    radial-gradient(circle at 8% 90%, rgba(229, 200, 184, 0.18), transparent 36%),
    var(--sage-dark);
  color: var(--cream);
}

.booking__aside h2 {
  margin-top: 16px;
  color: var(--cream);
  font-size: clamp(2.7rem, 4vw, 3.6rem);
}

.booking__aside h2 em {
  color: var(--rose-light);
}

.booking__aside > div > p {
  margin-top: 20px;
  color: rgba(247, 242, 233, 0.96);
  font-size: 11.5px;
  line-height: 1.8;
}

.booking__aside-bottom {
  position: relative;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--line-light);
  color: rgba(247, 242, 233, 0.96);
  font-size: 10px;
  line-height: 1.8;
}

.booking__hours {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 15px;
}

.booking__hours span {
  color: rgba(247, 242, 233, 0.94);
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.booking__hours strong {
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 400;
}

.booking__phone {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  color: var(--cream);
  font-size: 9.5px;
  transition: color 200ms ease;
}

.booking__phone:hover {
  color: var(--white);
}

.booking__sun {
  position: absolute;
  right: -16px;
  bottom: -20px;
  color: var(--rose-light);
  opacity: 0.4;
}

.booking__form {
  padding: 46px clamp(26px, 4vw, 48px) 34px;
}

.booking__fieldset {
  margin: 0;
  padding: 0;
  border: 0;
}

.booking__fieldset legend {
  color: var(--ink-faint);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.booking__services {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}

.service-option {
  display: grid;
  cursor: pointer;
  align-items: center;
  grid-template-columns: 18px 1fr auto;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--line-soft);
  border-radius: 6px;
  background: rgba(255, 253, 248, 0.6);
  transition:
    border-color 200ms ease,
    background-color 200ms ease;
}

.service-option:hover {
  border-color: var(--line);
}

.service-option.is-selected {
  border-color: var(--sage);
  background: var(--sage-wash);
}

.service-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.service-option__radio {
  display: grid;
  width: 16px;
  height: 16px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--cream-soft);
}

.service-option.is-selected .service-option__radio {
  border-color: var(--sage-deep);
}

.service-option.is-selected .service-option__radio::after {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sage-deep);
  content: '';
}

.service-option input:focus-visible + .service-option__radio {
  outline: 2px solid var(--sage-deep);
  outline-offset: 3px;
}

.service-option__copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.service-option__copy strong {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.1;
}

.service-option__copy small {
  color: var(--ink-faint);
  font-size: 8px;
  line-height: 1.4;
}

.service-option__price {
  color: var(--ink-soft);
  font-size: 9px;
  letter-spacing: 0.03em;
}

.booking__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 18px;
}

.field {
  min-width: 0;
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

.field label span {
  font-weight: 400;
  letter-spacing: 0.03em;
  text-transform: none;
}

.field > input,
.field__control {
  width: 100%;
  height: 46px;
  border: 1px solid var(--line-soft);
  border-radius: 5px;
  background: rgba(255, 253, 248, 0.72);
  transition: border-color 200ms ease;
}

.field > input {
  padding: 0 13px;
  font-size: 11px;
}

.field > input::placeholder {
  color: var(--ink-faint);
  font-size: 10px;
  opacity: 0.7;
}

.field > input:hover,
.field__control:hover {
  border-color: var(--line);
}

.field > input:focus,
.field__control:focus-within {
  border-color: var(--sage);
  outline: 0;
}

.field > input[aria-invalid='true'],
.field__control:has(input[aria-invalid='true']) {
  border-color: #a85743;
}

.field__control {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
}

.field__control > :deep(svg) {
  flex-shrink: 0;
  color: var(--sage-deep);
}

.field__control input,
.field__control select {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 10.5px;
}

.field__control--select select {
  cursor: pointer;
  appearance: none;
}

.field__control--select > :deep(svg:last-child) {
  color: var(--ink-faint);
  pointer-events: none;
}

.field__error {
  margin-top: 4px;
  color: #924c3b;
  font-size: 8.5px;
  line-height: 1.4;
}

.booking__submit {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--line-soft);
}

.booking__submit p {
  max-width: 200px;
  color: var(--ink-faint);
  font-size: 8.5px;
  line-height: 1.6;
}

.booking__success {
  display: flex;
  min-height: 620px;
  grid-column: 1 / -1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 54px clamp(24px, 8vw, 110px);
  background:
    radial-gradient(circle at 50% 0%, rgba(229, 200, 184, 0.35), transparent 40%),
    var(--cream);
  text-align: center;
}

.booking__success:focus {
  outline: none;
}

.booking__success-sun {
  color: var(--rose);
  margin-bottom: 16px;
}

.booking__success h2 {
  max-width: 600px;
  margin-top: 14px;
  font-size: clamp(2.8rem, 5vw, 4.4rem);
}

.booking__success h2 em {
  color: var(--sage);
}

.booking__success > p {
  max-width: 520px;
  margin-top: 18px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.8;
}

.booking__success > p strong {
  color: var(--ink);
  font-weight: 500;
}

.booking__ticket {
  display: grid;
  width: min(620px, 100%);
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 26px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.6);
  text-align: left;
}

.booking__ticket div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 10px;
  border-right: 1px solid var(--line-soft);
}

.booking__ticket div:last-child {
  border-right: 0;
}

.booking__ticket span {
  color: var(--ink-faint);
  font-size: 7.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.booking__ticket strong {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.2;
}

.booking__success-note {
  max-width: 440px;
  margin-top: 18px;
  color: var(--ink-faint) !important;
  font-size: 8.5px !important;
  line-height: 1.6 !important;
}

.booking__success-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 22px;
}

@media (max-width: 840px) {
  .booking {
    grid-template-columns: 1fr;
  }

  .booking__aside {
    min-height: 260px;
    padding: 34px 26px 26px;
  }

  .booking__aside h2 {
    font-size: 2.7rem;
  }

  .booking__aside-bottom {
    display: none;
  }

  .booking__form {
    padding: 28px 24px 30px;
  }

  .booking__success {
    min-height: 520px;
    padding: 42px 24px;
  }

  .booking__ticket {
    grid-template-columns: 1fr 1fr;
  }

  .booking__ticket div:nth-child(2) {
    border-right: 0;
  }

  .booking__ticket div:nth-child(odd) {
    border-right: 1px solid var(--line-soft);
  }
}

@media (max-width: 540px) {
  .booking__row {
    grid-template-columns: 1fr;
    margin-top: 14px;
  }

  .booking__submit {
    align-items: stretch;
    flex-direction: column;
  }

  .booking__submit p {
    max-width: none;
    text-align: center;
  }

  .booking__ticket {
    grid-template-columns: 1fr;
  }

  .booking__ticket div {
    padding-bottom: 10px;
    border-right: 0 !important;
    border-bottom: 1px solid var(--line-soft);
  }

  .booking__ticket div:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
}
</style>

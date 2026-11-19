<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'

const email = ref('')
const state = ref('idle')
const message = ref('')

function subscribe() {
  const value = email.value.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    state.value = 'error'
    message.value = 'Please enter a valid email address.'
    return
  }

  state.value = 'success'
  message.value = 'You are on the list. Welcome to the glow — your 10% welcome note is on its way.'
  email.value = ''
}
</script>

<template>
  <form class="newsletter-form" novalidate @submit.prevent="subscribe">
    <label class="sr-only" for="footer-newsletter-email">Email address</label>
    <div class="newsletter-form__field">
      <input
        id="footer-newsletter-email"
        v-model="email"
        type="email"
        autocomplete="email"
        placeholder="Your email address"
        :aria-invalid="state === 'error'"
        :aria-describedby="message ? 'footer-newsletter-message' : undefined"
      />
      <button type="submit">
        Join the list
        <Icon name="arrowRight" :size="15" />
      </button>
    </div>

    <p
      v-if="message"
      id="footer-newsletter-message"
      class="newsletter-form__message"
      :class="`is-${state}`"
      :role="state === 'error' ? 'alert' : 'status'"
    >
      {{ message }}
    </p>

    <p class="newsletter-form__fineprint">
      10% off your first order · New drops and atelier notes · Unsubscribe anytime.
    </p>
  </form>
</template>

<style scoped>
.newsletter-form {
  width: 100%;
  max-width: 470px;
}

.newsletter-form__field {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border: 1px solid rgba(247, 242, 233, 0.28);
  border-radius: 6px;
  background: rgba(247, 242, 233, 0.06);
  transition:
    border-color 200ms ease,
    background-color 200ms ease;
}

.newsletter-form__field:focus-within {
  border-color: rgba(247, 242, 233, 0.64);
  background: rgba(247, 242, 233, 0.1);
}

.newsletter-form__field input {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--cream);
  font-size: 10.5px;
}

.newsletter-form__field input::placeholder {
  color: rgba(247, 242, 233, 0.62);
}

.newsletter-form__field input[aria-invalid='true'] {
  color: #f0c7b9;
}

.newsletter-form__field button {
  display: inline-flex;
  min-height: 44px;
  flex-shrink: 0;
  align-items: center;
  gap: 9px;
  padding: 0 15px;
  border-radius: 4px;
  background: var(--cream);
  color: var(--sage-deep);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition:
    background-color 200ms ease,
    color 200ms ease;
}

.newsletter-form__field button:hover {
  background: var(--white);
}

.newsletter-form__message {
  margin-top: 9px;
  font-size: 8.5px;
  line-height: 1.6;
}

.newsletter-form__message.is-error {
  color: #f0c7b9;
}

.newsletter-form__message.is-success {
  color: rgba(247, 242, 233, 0.96);
}

.newsletter-form__fineprint {
  margin-top: 10px;
  color: rgba(247, 242, 233, 0.74);
  font-size: 7.5px;
  letter-spacing: 0.02em;
  line-height: 1.6;
}

@media (max-width: 540px) {
  .newsletter-form__field {
    align-items: stretch;
    flex-direction: column;
  }

  .newsletter-form__field input {
    text-align: center;
  }

  .newsletter-form__field button {
    justify-content: center;
  }

  .newsletter-form__fineprint {
    text-align: center;
  }
}
</style>

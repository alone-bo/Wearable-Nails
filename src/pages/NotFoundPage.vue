<script setup>
import { RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import SunMark from '../components/SunMark.vue'
</script>

<template>
  <div class="not-found">
    <span class="not-found__word" aria-hidden="true">404</span>
    <div class="not-found__inner">
      <SunMark :size="84" class="not-found__sun" />
      <span class="eyebrow">Page not found</span>
      <h1>This page has<br /><em>wandered off.</em></h1>
      <p>
        The link may be old, or the page may have moved. The collection, the atelier and a quiet
        hour are still exactly where you left them.
      </p>
      <div class="not-found__actions">
        <RouterLink to="/" class="btn btn--primary">
          Back home
          <Icon name="arrowRight" :size="16" />
        </RouterLink>
        <RouterLink to="/shop" class="btn btn--outline">Browse the collection</RouterLink>
      </div>
      <div class="not-found__links">
        <RouterLink to="/faq">FAQ</RouterLink>
        <span>·</span>
        <RouterLink to="/contact">Contact</RouterLink>
        <span>·</span>
        <RouterLink to="/journal">Journal</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  position: relative;
  display: flex;
  min-height: 72vh;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-block: clamp(70px, 10vw, 140px);
  background:
    radial-gradient(circle at 50% 12%, rgba(229, 200, 184, 0.24), transparent 36%),
    var(--cream);
  text-align: center;
}

.not-found__word {
  position: absolute;
  top: 50%;
  left: 50%;
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(14rem, 40vw, 38rem);
  line-height: 0.7;
  opacity: 0.5;
  transform: translate(-50%, -50%);
  -webkit-text-stroke: 1px rgba(83, 97, 72, 0.12);
  pointer-events: none;
}

.not-found__inner {
  position: relative;
  z-index: 1;
  display: flex;
  max-width: 660px;
  flex-direction: column;
  align-items: center;
  padding-inline: 24px;
}

.not-found__sun {
  color: var(--rose);
  margin-bottom: 22px;
}

.not-found h1 {
  margin-top: 17px;
  font-size: clamp(3.5rem, 7vw, 6.6rem);
  font-weight: 300;
  line-height: 0.9;
}

.not-found h1 em {
  color: var(--sage);
}

.not-found > .not-found__inner > p {
  max-width: 450px;
  margin-top: 20px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.85;
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 9px;
  margin-top: 28px;
}

.not-found__links {
  display: flex;
  gap: 10px;
  margin-top: 30px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.not-found__links a {
  transition: color 200ms ease;
}

.not-found__links a:hover {
  color: var(--ink);
}

.not-found__links span {
  color: var(--rose);
}
</style>

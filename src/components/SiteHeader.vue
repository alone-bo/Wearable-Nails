<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BaseDialog from './BaseDialog.vue'
import BrandLogo from './BrandLogo.vue'
import Icon from './Icon.vue'

defineProps({
  cartCount: { type: Number, default: 0 },
})

const emit = defineEmits(['open-cart', 'open-search', 'open-booking'])
const route = useRoute()

const scrolled = ref(false)
const menuOpen = ref(false)

const navItems = [
  { label: 'Shop all', to: '/shop', category: 'all' },
  { label: 'Press-ons', to: '/shop?category=press-on', category: 'press-on' },
  { label: 'Nail care', to: '/shop?category=care', category: 'care' },
  { label: 'About', to: '/about' },
  { label: 'Journal', to: '/journal' },
  { label: 'Reviews', to: '/product/olive-hour/reviews', reviews: true },
  { label: 'FAQ', to: '/faq' },
]

function isCurrent(item) {
  if (item.category) {
    if (route.path !== '/shop') return false
    const currentCategory = route.query.category || 'all'
    return currentCategory === item.category
  }

  if (item.reviews) {
    return /^\/product\/[^/]+\/reviews$/.test(route.path)
  }

  if (item.to === '/journal') {
    return route.path === '/journal' || route.path.startsWith('/journal/')
  }

  return route.path === item.to
}

function handleScroll() {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

function openBooking() {
  menuOpen.value = false
  window.setTimeout(() => emit('open-booking'), 280)
}

function openSearchFromMenu() {
  menuOpen.value = false
  window.setTimeout(() => emit('open-search'), 280)
}

function handleNavClick(event, navigate) {
  navigate(event)
  menuOpen.value = false
}
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="site-header__inner">
      <RouterLink to="/" class="site-header__logo" aria-label="YOUGLOW — home">
        <BrandLogo />
      </RouterLink>

      <nav class="primary-nav" aria-label="Primary">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          custom
          v-slot="{ href, navigate }"
        >
          <a
            :href="href"
            :class="{ 'is-current': isCurrent(item) }"
            :aria-current="isCurrent(item) ? 'page' : undefined"
            @click="handleNavClick($event, navigate)"
          >
            {{ item.label }}
          </a>
        </RouterLink>
      </nav>

      <div class="site-header__actions">
        <button type="button" class="icon-btn header-icon" aria-label="Search the shop" @click="emit('open-search')">
          <Icon name="search" :size="19" />
        </button>

        <RouterLink
          to="/#glow-club"
          class="icon-btn header-icon header-account"
          aria-label="Your Glow Club rewards"
        >
          <Icon name="user" :size="19" />
        </RouterLink>

        <button type="button" class="icon-btn header-icon bag-button" aria-label="Open shopping bag" @click="emit('open-cart')">
          <Icon name="bag" :size="19" />
          <span v-if="cartCount" class="bag-count" aria-hidden="true">{{ cartCount }}</span>
        </button>

        <button type="button" class="btn btn--primary site-header__book" @click="emit('open-booking')">
          Book a visit
        </button>

        <button
          type="button"
          class="icon-btn site-header__menu"
          aria-label="Open site menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = true"
        >
          <Icon name="menu" :size="22" />
        </button>
      </div>
    </div>

    <BaseDialog :open="menuOpen" variant="drawer" label="Site menu" @close="menuOpen = false">
      <div class="mobile-menu">
        <div class="mobile-menu__head">
          <RouterLink to="/" aria-label="YOUGLOW — home" @click="menuOpen = false">
            <BrandLogo />
          </RouterLink>
          <p>Nail atelier · Casablanca</p>
        </div>

        <nav class="mobile-menu__nav" aria-label="Mobile">
          <RouterLink
            v-for="(item, index) in navItems"
            :key="item.label"
            :to="item.to"
            custom
            v-slot="{ href, navigate }"
          >
            <a
              :href="href"
              :class="{ 'is-current': isCurrent(item) }"
              :aria-current="isCurrent(item) ? 'page' : undefined"
              @click="handleNavClick($event, navigate)"
            >
              <span>{{ item.label }}</span>
              <small>0{{ index + 1 }}</small>
            </a>
          </RouterLink>
        </nav>

        <div class="mobile-menu__cta">
          <button type="button" class="btn btn--primary btn--block" @click="openBooking">
            Book a visit
            <Icon name="arrowUpRight" :size="16" />
          </button>
          <button
            type="button"
            class="btn btn--outline btn--block"
            @click="openSearchFromMenu"
          >
            Search the collection
          </button>
        </div>

        <div class="mobile-menu__meta">
          <p>127 Boulevard de la Corniche<br />Casablanca 20000</p>
          <p>Mon – Sun · 10:00 – 20:00</p>
          <a href="mailto:hello@youglow.ma">hello@youglow.ma</a>
          <div class="mobile-menu__socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="YOUGLOW on Instagram">
              <Icon name="instagram" :size="18" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="YOUGLOW on Pinterest">
              <Icon name="pinterest" :size="18" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="YOUGLOW on Facebook">
              <Icon name="facebook" :size="18" />
            </a>
          </div>
        </div>
      </div>
    </BaseDialog>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid transparent;
  background: rgba(247, 242, 233, 0.86);
  transition:
    background-color 260ms ease,
    border-color 260ms ease,
    box-shadow 260ms ease;
  backdrop-filter: blur(18px);
}

.site-header.is-scrolled {
  border-color: var(--line-soft);
  background: rgba(247, 242, 233, 0.95);
  box-shadow: 0 10px 30px -28px rgba(47, 55, 44, 0.55);
}

.site-header__inner {
  display: grid;
  width: 100%;
  max-width: 1480px;
  min-height: 82px;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  gap: 32px;
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.site-header__logo {
  display: inline-flex;
  align-items: center;
  transition: opacity 200ms ease;
}

.site-header__logo:hover {
  opacity: 0.74;
}

.primary-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(17px, 2.1vw, 30px);
}

.primary-nav a {
  position: relative;
  padding-block: 8px;
  color: var(--ink-soft);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 200ms ease;
}

.primary-nav a::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--sage-deep);
  content: '';
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 300ms var(--ease-out);
}

.primary-nav a:hover {
  color: var(--sage-deep);
}

.primary-nav a.is-current {
  color: var(--sage-deep);
}

.primary-nav a.is-current::after {
  transform: scaleX(1);
  transform-origin: left;
}

.primary-nav a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.site-header__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
}

.header-icon {
  color: var(--ink);
}

.bag-button {
  position: relative;
}

.bag-count {
  position: absolute;
  top: 3px;
  right: 1px;
  display: grid;
  min-width: 16px;
  height: 16px;
  place-items: center;
  padding: 0 4px;
  border: 2px solid var(--cream);
  border-radius: 999px;
  background: var(--rose-deep);
  color: var(--white);
  font-size: 7.5px;
  font-weight: 600;
  line-height: 1;
}

.site-header__book {
  min-height: 42px;
  margin-left: 12px;
  padding: 11px 18px;
  font-size: 9px;
}

.site-header__menu {
  display: none;
  margin-left: 2px;
}

.mobile-menu {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  padding: 82px 28px 34px;
  background: var(--cream);
}

.mobile-menu__head {
  padding-bottom: 26px;
  border-bottom: 1px solid var(--line);
}

.mobile-menu__head p {
  margin-top: 10px;
  color: var(--ink-faint);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  padding-block: 16px;
}

.mobile-menu__nav a {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  padding-block: 14px;
  border-bottom: 1px solid var(--line-soft);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 2.2rem;
  line-height: 1;
  transition: color 200ms ease;
}

.mobile-menu__nav a:hover {
  color: var(--sage-deep);
}

.mobile-menu__nav a.is-current {
  color: var(--sage-deep);
}

.mobile-menu__nav small {
  color: var(--rose);
  font-family: var(--font-sans);
  font-size: 9px;
  letter-spacing: 0.08em;
}

.mobile-menu__cta {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.mobile-menu__meta {
  display: grid;
  gap: 8px;
  margin-top: auto;
  padding-top: 34px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.8;
}

.mobile-menu__meta a {
  width: fit-content;
  border-bottom: 1px solid var(--line);
  transition: color 200ms ease;
}

.mobile-menu__meta a:hover {
  color: var(--sage-deep);
}

.mobile-menu__socials {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.mobile-menu__socials a {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  transition:
    background-color 200ms ease,
    color 200ms ease;
}

.mobile-menu__socials a:hover {
  background: var(--sage-deep);
  color: var(--white);
}

@media (max-width: 1120px) {
  .primary-nav {
    display: none;
  }

  .site-header__inner {
    grid-template-columns: 1fr auto;
  }

  .site-header__menu {
    display: inline-flex;
  }
}

@media (max-width: 760px) {
  .site-header__book,
  .header-account {
    display: none;
  }

  .site-header__inner {
    min-height: 70px;
    gap: 16px;
  }
}

@media (max-width: 440px) {
  .header-icon {
    width: 40px;
    height: 40px;
  }
}
</style>

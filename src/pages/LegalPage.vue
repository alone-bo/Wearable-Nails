<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import PageHero from '../components/PageHero.vue'
import SunMark from '../components/SunMark.vue'
import { legalPages } from '../data/legal.js'
import { useShop } from '../stores/shop.js'

const route = useRoute()
const { openBooking } = useShop()

const page = computed(() => legalPages[route.meta.legalKey] || legalPages.privacy)
</script>

<template>
  <div class="legal-page">
    <PageHero
      :eyebrow="page.eyebrow"
      :lede="page.lede"
      :crumbs="[{ label: page.eyebrow }]"
    >
      <template #title>{{ page.titleLead }}<br /><em>{{ page.titleAccent }}</em></template>
      <div class="legal-hero-meta">
        <span>Last updated · {{ page.updated }}</span>
        <RouterLink to="/contact" class="text-link">
          Ask a question
          <Icon name="arrowUpRight" :size="14" />
        </RouterLink>
      </div>
    </PageHero>

    <section class="legal-main section" aria-labelledby="legal-title">
      <div class="container">
        <div class="legal-layout">
          <aside class="legal-aside">
            <div class="legal-toc">
              <span>On this page</span>
              <a v-for="(section, index) in page.sections" :key="section.id" :href="`#${section.id}`">
                <small>{{ String(index + 1).padStart(2, '0') }}</small>
                {{ section.title }}
              </a>
            </div>

            <div class="legal-help">
              <SunMark :size="28" />
              <h2>Need a hand?</h2>
              <p>Questions about this policy or your order? We are one message away.</p>
              <RouterLink to="/contact" class="text-link">
                Contact the atelier
                <Icon name="arrowRight" :size="14" />
              </RouterLink>
            </div>
          </aside>

          <article class="legal-content">
            <h2 id="legal-title" class="sr-only">{{ page.eyebrow }}</h2>

            <div class="legal-notice">
              <strong>Template note</strong>
              <p>
                This is a demonstration policy for the YOUGLOW storefront. It is not legal advice.
                Review and adapt it with a qualified legal professional before launch.
              </p>
            </div>

            <p class="legal-intro">{{ page.intro }}</p>

            <section v-for="section in page.sections" :id="section.id" :key="section.id" class="legal-section">
              <h2>{{ section.title }}</h2>
              <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
              <ul v-if="section.bullets">
                <li v-for="item in section.bullets" :key="item">{{ item }}</li>
              </ul>
            </section>

            <div class="legal-end">
              <p>Last updated {{ page.updated }} · YOUGLOW Nail &amp; Beauty Studio</p>
              <div>
                <RouterLink to="/privacy">Privacy</RouterLink>
                <RouterLink to="/terms">Terms</RouterLink>
                <RouterLink to="/shipping-returns">Shipping &amp; returns</RouterLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <PageCta
      eyebrow="Still have a question?"
      text="Write to the atelier or book a quiet hour. We are happy to talk through the small print, a return or a studio visit."
    >
      <template #title>Clarity,<br /><em>with care.</em></template>
      <RouterLink to="/contact" class="btn btn--cream">
        Contact us
        <Icon name="arrowUpRight" :size="15" />
      </RouterLink>
      <button type="button" class="btn btn--ghost-light" @click="openBooking()">
        Book a visit
        <Icon name="calendar" :size="15" />
      </button>
    </PageCta>
  </div>
</template>

<style scoped>
.legal-page {
  background: var(--cream);
}

.legal-hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px 28px;
  margin-top: 28px;
  padding-top: 19px;
  border-top: 1px solid var(--line-soft);
}

.legal-hero-meta > span {
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.legal-main {
  padding-top: clamp(45px, 6vw, 76px);
}

.legal-layout {
  display: grid;
  width: 100%;
  max-width: 1000px;
  grid-template-columns: 230px minmax(0, 710px);
  justify-content: space-between;
  gap: 60px;
  margin-inline: auto;
  align-items: start;
}

.legal-aside {
  position: sticky;
  top: 106px;
}

.legal-toc {
  padding-top: 5px;
  border-top: 1px solid var(--line);
}

.legal-toc > span {
  display: block;
  padding-block: 12px;
  color: var(--ink-faint);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.legal-toc a {
  display: flex;
  gap: 8px;
  padding-block: 8px;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-soft);
  font-size: 9px;
  line-height: 1.5;
  transition: color 200ms ease;
}

.legal-toc a:hover {
  color: var(--ink);
}

.legal-toc small {
  color: var(--rose-deep);
  font-size: 7px;
}

.legal-help {
  margin-top: 28px;
  padding: 18px;
  border: 1px solid var(--line-soft);
  border-radius: 7px;
  background: var(--sage-wash);
}

.legal-help :deep(svg) {
  color: var(--rose-deep);
}

.legal-help h2 {
  margin-top: 11px;
  font-size: 1.35rem;
}

.legal-help p {
  margin-top: 5px;
  color: var(--ink-soft);
  font-size: 9px;
  line-height: 1.65;
}

.legal-help .text-link {
  margin-top: 13px;
}

.legal-content {
  max-width: 710px;
}

.legal-notice {
  padding: 14px 16px;
  border-left: 2px solid var(--rose);
  background: var(--cream-soft);
}

.legal-notice strong {
  color: var(--ink);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.legal-notice p {
  margin-top: 4px;
  color: var(--ink-faint);
  font-size: 9px;
  line-height: 1.6;
}

.legal-intro {
  margin-top: 24px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2vw, 1.65rem);
  line-height: 1.45;
}

.legal-section {
  margin-top: 39px;
  scroll-margin-top: 118px;
}

.legal-section h2 {
  font-size: clamp(1.8rem, 2.6vw, 2.35rem);
  line-height: 1.08;
}

.legal-section p {
  margin-top: 11px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.9;
}

.legal-section ul {
  display: grid;
  gap: 6px;
  margin-top: 12px;
  padding-left: 17px;
  list-style: disc;
}

.legal-section li {
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.75;
}

.legal-end {
  margin-top: 50px;
  padding-top: 19px;
  border-top: 1px solid var(--line);
}

.legal-end p {
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.04em;
}

.legal-end > div {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 11px;
}

.legal-end a {
  color: var(--ink-soft);
  font-size: 8px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 200ms ease;
}

.legal-end a:hover {
  color: var(--ink);
}

@media (max-width: 900px) {
  .legal-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .legal-aside {
    position: static;
  }

  .legal-toc {
    display: none;
  }

  .legal-help {
    display: none;
  }

  .legal-content {
    max-width: none;
  }
}

@media (max-width: 600px) {
  .legal-section {
    margin-top: 31px;
  }

  .legal-intro {
    font-size: 1.3rem;
  }
}
</style>

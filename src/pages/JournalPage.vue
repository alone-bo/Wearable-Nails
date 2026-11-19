<script setup>
import { RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import PageHero from '../components/PageHero.vue'
import SunMark from '../components/SunMark.vue'
import { journal } from '../data/products.js'
import { useShop } from '../stores/shop.js'

const { openBooking } = useShop()
const featured = journal[0]
const rest = journal.slice(1)
</script>

<template>
  <div class="journal-page">
    <PageHero
      eyebrow="The Journal"
      lede="Notes on colour, care and the small rituals that make a week feel softer. Written slowly, from the atelier on the Corniche."
      :crumbs="[{ label: 'Journal' }]"
    >
      <template #title>Notes on<br /><em>slow beauty.</em></template>
    </PageHero>

    <section class="journal-feature section" aria-labelledby="feature-title">
      <div class="container">
        <RouterLink :to="`/journal/${featured.slug}`" class="feature" v-reveal>
          <div class="feature__media">
            <img :src="featured.image" :alt="featured.alt" width="900" height="660" />
            <span class="feature__badge">The cover note</span>
          </div>
          <div class="feature__copy">
            <div class="feature__meta">
              <span>{{ featured.category }}</span>
              <span>·</span>
              <span>{{ featured.readTime }}</span>
            </div>
            <h2 id="feature-title">{{ featured.title }}</h2>
            <p>{{ featured.excerpt }}</p>
            <span class="feature__read">
              Read the story
              <Icon name="arrowRight" :size="15" />
            </span>
          </div>
        </RouterLink>
      </div>
    </section>

    <section class="journal-index" aria-labelledby="journal-index-title">
      <div class="container">
        <div class="journal-index__head">
          <div>
            <span class="eyebrow">From the archive</span>
            <h2 id="journal-index-title">More to<br /><em>linger over.</em></h2>
          </div>
          <span class="journal-index__count">{{ journal.length }} notes · updated monthly</span>
        </div>

        <div class="journal-index__grid">
          <article
            v-for="(article, index) in rest"
            :key="article.slug"
            v-reveal="{ delay: index * 80 }"
            class="journal-card"
          >
            <RouterLink :to="`/journal/${article.slug}`">
              <div class="journal-card__image">
                <img :src="article.image" :alt="article.alt" width="900" height="660" loading="lazy" />
                <span>{{ article.readTime }}</span>
              </div>
              <div class="journal-card__meta">
                <span>{{ article.category }}</span>
                <span>·</span>
                <span>{{ article.date }}</span>
              </div>
              <h3>{{ article.title }}</h3>
              <p>{{ article.excerpt }}</p>
              <span class="journal-card__cta">
                Read the story
                <Icon name="arrowRight" :size="14" />
              </span>
            </RouterLink>
          </article>

          <aside class="journal-quote" v-reveal="{ delay: 160 }">
            <SunMark :size="44" />
            <blockquote>
              “Beauty is not an occasion. It is the small, repeated care you give an ordinary day.”
            </blockquote>
            <span>— The YOUGLOW atelier</span>
          </aside>
        </div>
      </div>
    </section>

    <PageCta
      eyebrow="Take the ritual home"
      text="Reusable press-on sets, botanical care and small-batch gifts — designed to make the ritual feel easy."
    >
      <template #title>A note,<br /><em>then a little glow.</em></template>
      <RouterLink to="/shop" class="btn btn--cream">
        Shop the collection
        <Icon name="arrowRight" :size="15" />
      </RouterLink>
      <button type="button" class="btn btn--ghost-light" @click="openBooking()">
        Book a visit
        <Icon name="calendar" :size="15" />
      </button>
    </PageCta>
  </div>
</template>

<style scoped>
.journal-page {
  background: var(--cream);
}

.journal-feature {
  padding-top: clamp(48px, 6vw, 78px);
}

.feature {
  display: grid;
  grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
  overflow: hidden;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  background: var(--cream-soft);
  transition:
    box-shadow 300ms var(--ease-out),
    transform 300ms var(--ease-out);
}

.feature:hover {
  box-shadow: var(--shadow-card);
  transform: translateY(-3px);
}

.feature__media {
  position: relative;
  min-height: 420px;
  overflow: hidden;
}

.feature__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 900ms var(--ease-out);
}

.feature:hover .feature__media img {
  transform: scale(1.035);
}

.feature__badge {
  position: absolute;
  top: 18px;
  left: 18px;
  padding: 7px 10px;
  border: 1px solid rgba(255, 253, 248, 0.4);
  border-radius: 999px;
  background: rgba(255, 253, 248, 0.88);
  color: var(--sage-deep);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
}

.feature__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(28px, 5vw, 68px);
}

.feature__meta,
.journal-card__meta {
  display: flex;
  gap: 7px;
  color: var(--ink-faint);
  font-size: 7.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.feature__meta span:first-child,
.journal-card__meta span:first-child {
  color: var(--sage-deep);
}

.feature__copy h2 {
  max-width: 460px;
  margin-top: 13px;
  font-size: clamp(2.7rem, 4.2vw, 4.1rem);
}

.feature__copy > p {
  max-width: 390px;
  margin-top: 17px;
  color: var(--ink-soft);
  font-size: 11.5px;
  line-height: 1.8;
}

.feature__read {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  margin-top: 26px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: gap 200ms ease;
}

.feature:hover .feature__read {
  gap: 13px;
}

.journal-index {
  padding-block: clamp(64px, 8vw, 104px);
  background: var(--cream-deep);
}

.journal-index__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 35px;
}

.journal-index__head h2 {
  margin-top: 13px;
  font-size: clamp(2.9rem, 4.5vw, 4.3rem);
}

.journal-index__head h2 em {
  color: var(--sage-deep);
}

.journal-index__count {
  padding-bottom: 7px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.journal-index__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.journal-card {
  min-width: 0;
}

.journal-card__image {
  position: relative;
  aspect-ratio: 1.3;
  overflow: hidden;
  border-radius: 7px;
  background: var(--sand);
}

.journal-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 800ms var(--ease-out);
}

.journal-card:hover .journal-card__image img {
  transform: scale(1.04);
}

.journal-card__image > span {
  position: absolute;
  right: 11px;
  bottom: 11px;
  padding: 5px 7px;
  border-radius: 3px;
  background: rgba(247, 242, 233, 0.88);
  color: var(--ink-soft);
  font-size: 6.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(5px);
}

.journal-card__meta {
  margin-top: 16px;
}

.journal-card h3 {
  margin-top: 8px;
  font-size: clamp(1.45rem, 1.9vw, 1.75rem);
  line-height: 1.08;
  transition: color 200ms ease;
}

.journal-card:hover h3 {
  color: var(--sage-deep);
}

.journal-card > a > p {
  margin-top: 8px;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.7;
}

.journal-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 13px;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: gap 200ms ease;
}

.journal-card:hover .journal-card__cta {
  gap: 12px;
}

.journal-quote {
  display: flex;
  min-height: 320px;
  flex-direction: column;
  justify-content: space-between;
  padding: 27px;
  border-radius: 8px;
  background: var(--sage-deep);
  color: var(--cream);
}

.journal-quote :deep(svg) {
  color: var(--rose-light);
}

.journal-quote blockquote {
  margin-top: 30px;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.2vw, 2rem);
  line-height: 1.3;
}

.journal-quote > span {
  margin-top: 25px;
  color: rgba(247, 242, 233, 0.94);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 980px) {
  .feature {
    grid-template-columns: 1fr;
  }

  .feature__media {
    min-height: 330px;
    aspect-ratio: 1.5;
  }

  .journal-index__grid {
    grid-template-columns: 1fr 1fr;
  }

  .journal-quote {
    grid-column: 1 / -1;
    min-height: 220px;
  }
}

@media (max-width: 640px) {
  .journal-index__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .journal-index__grid {
    grid-template-columns: 1fr;
  }

  .journal-quote {
    grid-column: auto;
  }

  .feature__copy {
    padding: 25px 21px 28px;
  }
}
</style>

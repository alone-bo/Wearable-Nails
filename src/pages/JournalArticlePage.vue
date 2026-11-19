<script setup>
import { computed, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import SunMark from '../components/SunMark.vue'
import { journal } from '../data/products.js'
import { useShop } from '../stores/shop.js'

const route = useRoute()
const { openBooking } = useShop()

const article = computed(() => journal.find((item) => item.slug === route.params.slug))
const nextArticle = computed(() => {
  if (!article.value) return null
  const index = journal.findIndex((item) => item.slug === article.value.slug)
  return journal[(index + 1) % journal.length]
})

function anchorId(heading) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

watchEffect(() => {
  if (article.value) document.title = `${article.value.title} — YOUGLOW Journal`
  else document.title = 'Story not found — YOUGLOW'
})
</script>

<template>
  <div v-if="article" class="article-page">
    <header class="article-hero">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/">Home</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink to="/journal">Journal</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ article.category }}</span>
        </nav>

        <div class="article-hero__meta">
          <span>{{ article.category }}</span>
          <span>·</span>
          <span>{{ article.date }}</span>
          <span>·</span>
          <span>{{ article.readTime }}</span>
        </div>

        <h1>{{ article.title }}</h1>
        <p class="article-hero__excerpt">{{ article.excerpt }}</p>

        <div class="article-hero__byline">
          <span class="article-hero__avatar"><SunMark :size="22" /></span>
          <span>Words by {{ article.author }}</span>
          <RouterLink to="/journal" class="article-hero__back">
            <Icon name="chevronLeft" :size="14" />
            All notes
          </RouterLink>
        </div>
      </div>
    </header>

    <div class="container article-cover">
      <img :src="article.image" :alt="article.alt" width="900" height="660" />
    </div>

    <div class="container article-layout">
      <article class="article-body">
        <p class="article-body__intro">{{ article.intro }}</p>

        <section
          v-for="(section, index) in article.sections"
          :id="anchorId(section.heading)"
          :key="section.heading"
          class="article-section"
        >
          <span class="article-section__number">0{{ index + 1 }}</span>
          <h2>{{ section.heading }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
        </section>

        <aside class="article-tip">
          <SunMark :size="33" />
          <div>
            <span>A note from the atelier</span>
            <p>{{ article.tip }}</p>
          </div>
        </aside>

        <div class="article-end">
          <span class="eyebrow">The end of this note</span>
          <p>Wear slowly, care gently, and come back to this page whenever you need a reminder.</p>
          <RouterLink to="/journal" class="text-link">
            Back to the journal
            <Icon name="arrowRight" :size="14" />
          </RouterLink>
        </div>
      </article>

      <aside class="article-aside">
        <div class="article-toc">
          <span>In this note</span>
          <a
            v-for="(section, index) in article.sections"
            :key="section.heading"
            :href="`#${anchorId(section.heading)}`"
          >
            <small>0{{ index + 1 }}</small>
            {{ section.heading }}
          </a>
        </div>

        <div class="article-shop">
          <SunMark :size="32" />
          <span>The ritual, at home</span>
          <h2>Small-batch sets,<br /><em>made to be worn.</em></h2>
          <p>Discover the collection our clients return to, season after season.</p>
          <RouterLink to="/shop" class="btn btn--cream">
            Shop the collection
            <Icon name="arrowRight" :size="15" />
          </RouterLink>
        </div>
      </aside>
    </div>

    <section class="article-next">
      <div class="container article-next__inner">
        <span class="eyebrow">Read next</span>
        <RouterLink :to="`/journal/${nextArticle.slug}`" class="article-next__link">
          <div>
            <span>{{ nextArticle.category }} · {{ nextArticle.readTime }}</span>
            <h2>{{ nextArticle.title }}</h2>
          </div>
          <span class="article-next__arrow"><Icon name="arrowRight" :size="20" /></span>
        </RouterLink>
      </div>
    </section>

    <PageCta
      eyebrow="From reading to ritual"
      text="If a note has inspired you, take it slowly. Browse the collection, or let us look after your hands in the studio."
    >
      <template #title>A little care<br /><em>goes a long way.</em></template>
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

  <div v-else class="article-missing">
    <SunMark :size="64" />
    <span class="eyebrow">Not found</span>
    <h1>This note has<br /><em>wandered off.</em></h1>
    <p>The story may have moved or the link is incomplete.</p>
    <RouterLink to="/journal" class="btn btn--primary">Back to the journal</RouterLink>
  </div>
</template>

<style scoped>
.article-page {
  background: var(--cream);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
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

.article-hero {
  padding-block: clamp(44px, 5.5vw, 76px) clamp(30px, 4vw, 50px);
  background:
    radial-gradient(circle at 88% 10%, rgba(229, 200, 184, 0.2), transparent 30%),
    var(--cream);
}

.article-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  color: var(--ink-faint);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.article-hero__meta span:first-child {
  color: var(--sage-deep);
}

.article-hero h1 {
  max-width: 1020px;
  margin-top: 17px;
  font-size: clamp(3.4rem, 6.3vw, 6.6rem);
  font-weight: 300;
  line-height: 0.94;
}

.article-hero__excerpt {
  max-width: 570px;
  margin-top: 21px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.8;
}

.article-hero__byline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  margin-top: 30px;
  padding-top: 18px;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.06em;
}

.article-hero__avatar {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  background: var(--sage-wash);
  color: var(--rose-deep);
}

.article-hero__back {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: auto;
  transition: color 200ms ease;
}

.article-hero__back:hover {
  color: var(--ink);
}

.article-cover {
  padding-bottom: clamp(42px, 6vw, 78px);
}

.article-cover img {
  width: 100%;
  max-height: 580px;
  border-radius: 9px;
  object-fit: cover;
}

.article-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.74fr) minmax(250px, 0.26fr);
  gap: clamp(40px, 8vw, 120px);
  align-items: start;
  padding-bottom: clamp(60px, 8vw, 110px);
}

.article-body {
  max-width: 720px;
}

.article-body__intro {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 2.3vw, 2rem);
  line-height: 1.4;
}

.article-body__intro::first-letter {
  float: left;
  margin: 0.08em 0.12em 0 0;
  color: var(--sage-deep);
  font-family: var(--font-display);
  font-size: 4.3em;
  line-height: 0.72;
}

.article-section {
  margin-top: 46px;
  scroll-margin-top: 115px;
}

.article-section__number {
  color: var(--rose-deep);
  font-size: 8px;
  letter-spacing: 0.1em;
}

.article-section h2 {
  margin-top: 8px;
  font-size: clamp(2rem, 3vw, 2.7rem);
  line-height: 1.05;
}

.article-section p {
  margin-top: 16px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.95;
}

.article-tip {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 15px;
  margin-top: 45px;
  padding: 23px;
  border: 1px solid var(--line-soft);
  border-radius: 7px;
  background: var(--sage-wash);
}

.article-tip :deep(svg) {
  color: var(--rose-deep);
}

.article-tip span {
  color: var(--sage-deep);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.article-tip p {
  margin-top: 7px;
  color: var(--ink-soft);
  font-family: var(--font-display);
  font-size: 1.25rem;
  line-height: 1.4;
}

.article-end {
  margin-top: 55px;
  padding-top: 26px;
  border-top: 1px solid var(--line);
}

.article-end p {
  max-width: 450px;
  margin-top: 12px;
  color: var(--ink-soft);
  font-family: var(--font-display);
  font-size: 1.4rem;
  line-height: 1.4;
}

.article-end .text-link {
  margin-top: 20px;
}

.article-aside {
  position: sticky;
  top: 106px;
  display: grid;
  gap: 24px;
}

.article-toc {
  padding-top: 5px;
  border-top: 1px solid var(--line);
}

.article-toc > span {
  display: block;
  padding-block: 12px;
  color: var(--ink-faint);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.article-toc a {
  display: flex;
  gap: 8px;
  padding-block: 8px;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-soft);
  font-size: 9.5px;
  line-height: 1.5;
  transition: color 200ms ease;
}

.article-toc a:hover {
  color: var(--ink);
}

.article-toc small {
  color: var(--rose-deep);
  font-size: 7px;
}

.article-shop {
  padding: 24px;
  border-radius: 8px;
  background: var(--sage-deep);
  color: var(--cream);
}

.article-shop :deep(svg) {
  color: var(--rose-light);
}

.article-shop > span {
  display: block;
  margin-top: 14px;
  color: rgba(247, 242, 233, 0.94);
  font-size: 7px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.article-shop h2 {
  margin-top: 10px;
  color: var(--cream);
  font-size: 1.8rem;
  line-height: 1.04;
}

.article-shop h2 em {
  color: var(--rose-light);
}

.article-shop p {
  margin-top: 10px;
  color: rgba(247, 242, 233, 0.96);
  font-size: 9px;
  line-height: 1.65;
}

.article-shop .btn {
  width: 100%;
  margin-top: 17px;
  min-height: 43px;
}

.article-next {
  padding-block: clamp(42px, 5vw, 66px);
  border-top: 1px solid var(--line-soft);
  background: var(--cream-deep);
}

.article-next__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-top: 15px;
  padding-bottom: 9px;
  border-bottom: 1px solid var(--line);
}

.article-next__link span {
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.article-next__link h2 {
  margin-top: 9px;
  font-size: clamp(1.9rem, 3.4vw, 3rem);
  transition: color 200ms ease;
}

.article-next__link:hover h2 {
  color: var(--sage-deep);
}

.article-next__arrow {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--ink) !important;
  transition:
    background-color 200ms ease,
    color 200ms ease;
}

.article-next__link:hover .article-next__arrow {
  background: var(--sage-deep);
  color: var(--cream) !important;
}

.article-missing {
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  background: var(--cream);
  text-align: center;
}

.article-missing > :deep(svg) {
  color: var(--rose);
  margin-bottom: 18px;
}

.article-missing h1 {
  margin-top: 14px;
  font-size: clamp(3rem, 6vw, 5.5rem);
}

.article-missing h1 em {
  color: var(--sage);
}

.article-missing p {
  margin-top: 16px;
  color: var(--ink-soft);
  font-size: 12px;
}

.article-missing .btn {
  margin-top: 24px;
}

@media (max-width: 900px) {
  .article-layout {
    grid-template-columns: 1fr;
    gap: 42px;
  }

  .article-body {
    max-width: none;
  }

  .article-aside {
    position: static;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .article-hero h1 {
    font-size: clamp(2.8rem, 12vw, 4.5rem);
  }

  .article-hero__byline {
    gap: 7px;
  }

  .article-hero__back {
    width: 100%;
    margin-top: 6px;
    margin-left: 0;
  }

  .article-cover img {
    min-height: 220px;
    object-fit: cover;
  }

  .article-aside {
    grid-template-columns: 1fr;
  }

  .article-next__link {
    align-items: flex-start;
  }

  .article-next__arrow {
    width: 38px;
    height: 38px;
  }
}
</style>

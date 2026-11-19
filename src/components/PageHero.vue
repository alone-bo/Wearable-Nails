<script setup>
import { RouterLink } from 'vue-router'
import SunMark from './SunMark.vue'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lede: { type: String, default: '' },
  crumbs: { type: Array, default: () => [] },
  tone: { type: String, default: 'cream' },
  image: { type: String, default: '' },
  imagePosition: { type: String, default: 'center' },
})
</script>

<template>
  <section
    class="page-hero"
    :class="[`page-hero--${tone}`, { 'page-hero--with-image': image }]"
  >
    <div
      v-if="image"
      class="page-hero__image"
      :style="{ backgroundImage: `url(${image})`, backgroundPosition: imagePosition }"
      aria-hidden="true"
    />
    <span class="page-hero__sun" aria-hidden="true"><SunMark :size="310" /></span>
    <div class="container page-hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <RouterLink to="/">Home</RouterLink>
        <template v-for="crumb in crumbs" :key="crumb.label">
          <span class="breadcrumb__sep" aria-hidden="true">/</span>
          <RouterLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</RouterLink>
          <span v-else aria-current="page">{{ crumb.label }}</span>
        </template>
      </nav>

      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <h1 class="page-hero__title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p v-if="lede" class="page-hero__lede">{{ lede }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(48px, 6vw, 82px) clamp(44px, 5.5vw, 78px);
  border-bottom: 1px solid var(--line-soft);
  background:
    radial-gradient(circle at 88% 20%, rgba(229, 200, 184, 0.2), transparent 30%),
    radial-gradient(circle at 8% 110%, rgba(233, 235, 224, 0.8), transparent 34%),
    var(--cream);
}

.page-hero--sage {
  background:
    radial-gradient(circle at 90% 6%, rgba(255, 255, 255, 0.38), transparent 30%),
    var(--sage-wash);
}

.page-hero--dark {
  background: var(--sage-deep);
  color: var(--cream);
}

.page-hero__image {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  width: 43%;
  background-color: var(--sand);
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.88;
  mask-image: linear-gradient(90deg, transparent 0%, #000 26%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 26%);
}

.page-hero__image::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(247, 242, 233, 0.44), transparent 45%);
  content: '';
}

.page-hero__sun {
  position: absolute;
  top: -100px;
  right: 4%;
  z-index: 1;
  color: var(--rose);
  opacity: 0.16;
  pointer-events: none;
}

.page-hero__inner {
  position: relative;
  z-index: 2;
}

.page-hero__inner > * {
  position: relative;
  z-index: 1;
}

.page-hero--with-image .page-hero__inner > * {
  max-width: min(760px, 58%);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 35px;
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

.breadcrumb__sep {
  color: var(--rose);
}

.page-hero__title {
  max-width: 960px;
  margin-top: 17px;
  font-size: clamp(3.6rem, 7vw, 7rem);
  font-weight: 300;
  line-height: 0.92;
}

.page-hero__title :deep(em) {
  color: var(--sage);
  font-weight: 300;
}

.page-hero__lede {
  max-width: 540px;
  margin-top: 23px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.85;
}

.page-hero--dark .breadcrumb,
.page-hero--dark .page-hero__lede {
  color: rgba(247, 242, 233, 0.96);
}

.page-hero--dark .breadcrumb a:hover {
  color: var(--white);
}

.page-hero--dark :deep(.eyebrow) {
  color: rgba(247, 242, 233, 0.94);
}

.page-hero--dark .page-hero__title {
  color: var(--cream);
}

.page-hero--dark .page-hero__title :deep(em) {
  color: var(--rose-light);
}

@media (max-width: 1100px) {
  .page-hero--with-image .page-hero__inner > * {
    max-width: min(700px, 62%);
  }

  .page-hero__image {
    width: 38%;
  }
}

@media (max-width: 980px) {
  .page-hero__image {
    display: none;
  }

  .page-hero--with-image .page-hero__inner > * {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .page-hero {
    padding-block: 34px 46px;
  }

  .breadcrumb {
    margin-bottom: 25px;
  }

  .page-hero__title {
    font-size: clamp(3rem, 15vw, 5rem);
  }

  .page-hero__lede {
    font-size: 12px;
  }
}
</style>

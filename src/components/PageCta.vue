<script setup>
import SunMark from './SunMark.vue'

defineProps({
  eyebrow: { type: String, default: 'The next step' },
  text: { type: String, default: '' },
})
</script>

<template>
  <section class="page-cta">
    <div class="page-cta__halo" aria-hidden="true"><SunMark :size="380" /></div>
    <div class="container page-cta__inner">
      <div class="page-cta__copy">
        <span class="eyebrow">{{ eyebrow }}</span>
        <h2><slot name="title" /></h2>
        <p v-if="text">{{ text }}</p>
      </div>
      <div class="page-cta__actions">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-cta {
  position: relative;
  overflow: hidden;
  padding-block: clamp(64px, 8vw, 104px);
  border-top: 1px solid var(--line-soft);
  background:
    radial-gradient(circle at 88% 4%, rgba(229, 200, 184, 0.32), transparent 32%),
    linear-gradient(135deg, var(--sand) 0%, var(--cream-deep) 100%);
  color: var(--ink);
}

.page-cta__halo {
  position: absolute;
  right: -80px;
  bottom: -170px;
  color: var(--rose-deep);
  opacity: 0.12;
  pointer-events: none;
}

.page-cta__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 48px;
}

.page-cta__copy {
  max-width: 700px;
}

.page-cta .eyebrow {
  color: var(--sage-deep);
}

.page-cta h2 {
  margin-top: 14px;
  color: var(--ink);
  font-size: clamp(2.8rem, 5vw, 4.6rem);
}

.page-cta h2 :deep(em) {
  color: var(--sage-deep);
  font-weight: 300;
}

.page-cta__copy p {
  max-width: 450px;
  margin-top: 17px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.8;
}

.page-cta__actions {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  gap: 9px;
  padding-bottom: 7px;
}

/* The CTA band themes the shared button slots for its light background. */
.page-cta__actions :deep(.btn--cream),
.page-cta__actions :deep(.btn--primary) {
  background: var(--sage-deep);
  color: var(--cream);
}

.page-cta__actions :deep(.btn--cream:hover),
.page-cta__actions :deep(.btn--primary:hover) {
  background: var(--sage-press);
}

.page-cta__actions :deep(.btn--ghost-light),
.page-cta__actions :deep(.btn--outline) {
  border-color: var(--line);
  color: var(--ink);
}

.page-cta__actions :deep(.btn--ghost-light:hover),
.page-cta__actions :deep(.btn--outline:hover) {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--cream);
}

@media (max-width: 760px) {
  .page-cta__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 26px;
  }

  .page-cta__actions {
    width: 100%;
  }

  .page-cta__actions :deep(.btn) {
    flex: 1;
  }
}
</style>

<script setup>
import SunMark from './SunMark.vue'

defineProps({
  light: Boolean,
  compact: Boolean,
  arabic: { type: Boolean, default: true },
})
</script>

<template>
  <span class="brand-logo" :class="{ 'brand-logo--light': light, 'brand-logo--compact': compact }" aria-hidden="true">
    <span class="brand-logo__lockup">
      <span class="brand-logo__word">YOUGL</span>
      <SunMark class="brand-logo__sun" :size="'1em'" />
      <span class="brand-logo__word brand-logo__word--last">W</span>
    </span>
    <span v-if="arabic" class="brand-logo__arabic" dir="rtl" lang="ar">يوغلو</span>
  </span>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75em;
  color: var(--sage-dark);
  line-height: 1;
  white-space: nowrap;
}

.brand-logo__lockup {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-display);
  font-size: var(--logo-size, 2.05rem);
  font-weight: 500;
  letter-spacing: 0.075em;
  line-height: 0.8;
}

.brand-logo__word--last {
  margin-left: -0.02em;
}

.brand-logo__sun {
  width: 0.92em;
  height: 0.92em;
  margin: 0.05em 0.02em 0;
  flex-shrink: 0;
  color: var(--rose);
  transition: transform 0.8s var(--ease-out);
}

.brand-logo:hover .brand-logo__sun {
  transform: rotate(45deg);
}

.brand-logo__arabic {
  padding-top: 0.15em;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  font-size: calc(var(--logo-size, 2.05rem) * 0.48);
  font-weight: 400;
  letter-spacing: 0;
  opacity: 0.78;
}

.brand-logo--compact {
  --logo-size: 1.55rem;
}

.brand-logo--light {
  color: var(--cream);
}

.brand-logo--light .brand-logo__sun {
  color: var(--rose-light);
}

@media (max-width: 640px) {
  .brand-logo {
    --logo-size: 1.72rem;
  }

  .brand-logo__arabic {
    display: none;
  }
}
</style>

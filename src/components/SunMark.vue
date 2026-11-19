<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: [Number, String], default: 40 },
  label: { type: String, default: '' },
})

const rays = computed(() =>
  Array.from({ length: 24 }, (_, index) => {
    const angle = (index * Math.PI) / 12
    const long = index % 2 === 0
    const inner = long ? 23 : 26
    const outer = long ? 37 : 32
    return {
      x1: 40 + Math.cos(angle) * inner,
      y1: 40 + Math.sin(angle) * inner,
      x2: 40 + Math.cos(angle) * outer,
      y2: 40 + Math.sin(angle) * outer,
      opacity: long ? 0.9 : 0.55,
    }
  }),
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <circle cx="40" cy="40" r="16.5" fill="currentColor" opacity="0.08" />
    <circle cx="40" cy="40" r="12.5" fill="#f9ede0" stroke="currentColor" stroke-width="1.2" />
    <circle cx="37.5" cy="37.5" r="5.5" fill="#fffaf2" opacity="0.8" />
    <g stroke="currentColor" stroke-width="1.15" stroke-linecap="round">
      <line
        v-for="(ray, index) in rays"
        :key="index"
        :x1="ray.x1"
        :y1="ray.y1"
        :x2="ray.x2"
        :y2="ray.y2"
        :opacity="ray.opacity"
      />
    </g>
  </svg>
</template>

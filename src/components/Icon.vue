<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
  strokeWidth: { type: [Number, String], default: 1.5 },
})

const icons = {
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/>',
  user: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c.5-3.5 2.8-5.2 6.5-5.2s6 1.7 6.5 5.2"/>',
  bag: '<path d="M5.5 8.3h13l.8 12.2h-14.6L5.5 8.3Z"/><path d="M9.2 9V6.9a2.8 2.8 0 0 1 5.6 0V9"/>',
  heart:
    '<path d="M20.8 5.8a5.1 5.1 0 0 0-7.2 0L12 7.4l-1.6-1.6a5.1 5.1 0 0 0-7.2 7.2L12 21l8.8-8.8a5.1 5.1 0 0 0 0-7.2v.8Z"/>',
  star: '<path d="m12 3.2 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.2Z"/>',
  arrowRight: '<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="m4.5 12.5 4.6 4.6L19.8 6.4"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronLeft: '<path d="m15 5-7 7 7 7"/>',
  chevronRight: '<path d="m9 5 7 7-7 7"/>',
  leaf: '<path d="M20.5 3.5C10 4 4.2 8.5 4.2 14.6a5 5 0 0 0 5 5c6.1 0 10.6-5.8 11.3-16.1Z"/><path d="M4.8 19.2C8 14.5 11.8 11 16.3 8.5"/>',
  sparkle:
    '<path d="M12 3c.6 4.5 3.1 7 7.5 7.5C15.1 11 12.6 13.5 12 18c-.6-4.5-3.1-7-7.5-7.5C8.9 10 11.4 7.5 12 3Z"/><path d="M19 16.4c.2 1.5 1.1 2.4 2.6 2.6-1.5.2-2.4 1.1-2.6 2.6-.2-1.5-1.1-2.4-2.6-2.6 1.5-.2 2.4-1.1 2.6-2.6Z"/>',
  calendar: '<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M8 3v5M16 3v5M3.5 10.5h17"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
  mapPin: '<path d="M19 10c0 5.5-7 11-7 11S5 15.5 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.8 6.2 8.2 6 8.2-6"/>',
  phone: '<path d="M7.2 3.5H4.5c-.7 0-1.2.6-1.1 1.3.7 8.3 7.5 15.1 15.8 15.8.7.1 1.3-.4 1.3-1.1v-2.7c0-.5-.4-1-.9-1.1l-3.1-.7c-.5-.1-1 .1-1.3.5l-1.2 1.5a14.6 14.6 0 0 1-5.8-5.8l1.5-1.2c.4-.3.6-.8.5-1.3l-.7-3.1c-.1-.5-.6-.9-1.1-.9Z"/>',
  instagram:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.9" r=".8" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M14.5 8.2h2.6V4.5h-2.8c-2.8 0-4.5 1.7-4.5 4.6v2.2H7v3.6h2.8v6.6h3.7v-6.6h2.8l.5-3.6h-3.3V9.2c0-.7.3-1 1-1Z"/>',
  pinterest:
    '<path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-1.3 0-2.8.3-4l1.4-6s-.4-.7-.4-1.9c0-1.8 1-3.1 2.3-3.1 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.8-1.1 4.4-.3 1.3.7 2.3 2 2.3 2.3 0 3.9-3 3.9-6.5 0-2.7-1.8-4.7-5-4.7-3.6 0-5.9 2.7-5.9 5.7 0 1 .3 1.8.8 2.4.2.2.2.3.2.6l-.3 1c-.1.3-.3.4-.6.3-1.7-.7-2.6-2.5-2.6-4.5 0-3.4 2.9-7.5 8.6-7.5 4.6 0 7.6 3.3 7.6 6.8 0 4.7-2.6 8.1-6.3 8.1-1.3 0-2.5-.7-2.9-1.5l-.8 3c-.3 1-1 2.3-1.6 3.1A9 9 0 1 0 12 3Z"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5v8h14v-8M12 8.5v12"/><path d="M12 8.5H8.2A2.2 2.2 0 1 1 10.4 6c1.1.6 1.6 2.5 1.6 2.5ZM12 8.5h3.8A2.2 2.2 0 1 0 13.6 6C12.5 6.6 12 8.5 12 8.5Z"/>',
  truck: '<path d="M3 6.5h11v10H3zM14 10h3.5l3 3v3.5H14z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/>',
  droplet: '<path d="M12 3.2S5.8 9.7 5.8 14a6.2 6.2 0 0 0 12.4 0c0-4.3-6.2-10.8-6.2-10.8Z"/>',
  shield: '<path d="M12 3.2 4.8 6v5.4c0 4.4 3 7.6 7.2 9.4 4.2-1.8 7.2-5 7.2-9.4V6L12 3.2Z"/><path d="m9 12 2.1 2.1 4-4"/>',
  quote: '<path d="M9.3 6C6 7.6 4.4 10 4.4 13.2c0 2.6 1.5 4.3 3.7 4.3 1.9 0 3.3-1.3 3.3-3.1 0-1.8-1.3-3-3-3-.3 0-.7 0-.9.1.3-1.6 1.4-2.9 3.1-3.9L9.3 6Zm9.4 0c-3.3 1.6-4.9 4-4.9 7.2 0 2.6 1.5 4.3 3.7 4.3 1.9 0 3.3-1.3 3.3-3.1 0-1.8-1.3-3-3-3-.3 0-.7 0-.9.1.3-1.6 1.4-2.9 3.1-3.9L18.7 6Z"/>',
}

const filled = new Set(['star', 'facebook', 'pinterest', 'quote'])
const markup = computed(() => icons[props.name] || '')
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="filled.has(name) ? 'currentColor' : 'none'"
    :stroke="filled.has(name) ? 'none' : 'currentColor'"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="markup"
  />
</template>

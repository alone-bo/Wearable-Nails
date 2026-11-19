<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import BaseDialog from './BaseDialog.vue'
import Icon from './Icon.vue'
import ProductVisual from './ProductVisual.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  products: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'select'])
const query = ref('')
const inputEl = ref(null)

const suggestions = ['Olive', 'Press-on', 'Nail care', 'Gift set']

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return props.products.filter((product) =>
    [product.name, product.subtitle, product.shade, product.categoryLabel, product.description]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    nextTick(() => {
      window.setTimeout(() => inputEl.value?.focus(), 120)
    })
  },
)

function select(product) {
  emit('select', product)
}

function submitSearch() {
  if (results.value.length) select(results.value[0])
}
</script>

<template>
  <BaseDialog :open="open" variant="search" label="Search the YOUGLOW collection" @close="emit('close')">
    <div class="search">
      <div class="search__head">
        <span class="eyebrow">Search the collection</span>
        <p>Find a set, a shade, a small ritual.</p>
      </div>

      <form class="search__form" role="search" @submit.prevent="submitSearch">
        <Icon name="search" :size="21" />
        <label class="sr-only" for="collection-search">Search products</label>
        <input
          id="collection-search"
          ref="inputEl"
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="Try “olive”, “serum” or “gift”"
          autofocus
        />
        <button
          v-if="query"
          type="button"
          class="search__clear"
          aria-label="Clear search"
          @click="query = ''"
        >
          <Icon name="close" :size="16" />
        </button>
        <kbd>ENTER</kbd>
      </form>

      <div class="search__suggestions">
        <span>Try</span>
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          type="button"
          @click="query = suggestion"
        >
          {{ suggestion }}
        </button>
      </div>

      <div v-if="query" class="search__results">
        <div class="search__results-head">
          <span>{{ results.length }} {{ results.length === 1 ? 'piece' : 'pieces' }} found</span>
          <span v-if="results.length">Curated for you</span>
        </div>

        <button
          v-for="product in results"
          :key="product.id"
          type="button"
          class="search-result"
          @click="select(product)"
        >
          <span class="search-result__media" aria-hidden="true">
            <ProductVisual :product="product" />
          </span>
          <span class="search-result__copy">
            <small>{{ product.categoryLabel }}</small>
            <strong>{{ product.name }}</strong>
            <span>{{ product.shade }}</span>
          </span>
          <span class="search-result__price">{{ product.price }} MAD</span>
          <Icon name="arrowUpRight" :size="16" />
        </button>

        <p v-if="!results.length" class="search__no-results">
          Nothing matched “{{ query }}”. Try “olive”, “care” or browse the full collection.
        </p>
      </div>

      <div v-else class="search__popular">
        <div class="search__results-head">
          <span>Most loved</span>
          <span>Small-batch, always</span>
        </div>
        <div class="search__popular-grid">
          <button
            v-for="product in products.slice(0, 3)"
            :key="product.id"
            type="button"
            class="popular-card"
            @click="select(product)"
          >
            <span class="popular-card__media" aria-hidden="true">
              <ProductVisual :product="product" />
            </span>
            <span class="popular-card__copy">
              <strong>{{ product.name }}</strong>
              <span>{{ product.price }} MAD</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<style scoped>
.search {
  padding: 38px clamp(22px, 5vw, 48px) 34px;
  background:
    radial-gradient(circle at 90% 0%, rgba(229, 200, 184, 0.23), transparent 34%),
    var(--cream-soft);
}

.search__head {
  padding-right: 50px;
}

.search__head p {
  margin-top: 10px;
  color: var(--ink-soft);
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-style: italic;
  line-height: 1.2;
}

.search__form {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  padding: 5px 10px 5px 18px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: rgba(255, 253, 248, 0.75);
  transition: border-color 200ms ease;
}

.search__form:focus-within {
  border-color: var(--sage);
}

.search__form > :deep(svg) {
  flex-shrink: 0;
  color: var(--sage-deep);
}

.search__form input {
  width: 100%;
  min-height: 46px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1;
}

.search__form input::placeholder {
  color: var(--ink-faint);
  opacity: 0.7;
}

.search__form input::-webkit-search-cancel-button {
  display: none;
}

.search__clear {
  display: grid;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  color: var(--ink-faint);
}

.search__clear:hover {
  background: var(--cream-deep);
  color: var(--ink);
}

.search__form kbd {
  flex-shrink: 0;
  padding: 5px 7px;
  border: 1px solid var(--line-soft);
  border-radius: 3px;
  color: var(--ink-faint);
  font-family: var(--font-sans);
  font-size: 7px;
  letter-spacing: 0.1em;
}

.search__suggestions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 13px;
}

.search__suggestions > span {
  margin-right: 2px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.search__suggestions button {
  padding: 6px 10px;
  border: 1px solid var(--line-soft);
  border-radius: 999px;
  color: var(--ink-soft);
  font-size: 8.5px;
  line-height: 1;
  transition:
    background-color 180ms ease,
    border-color 180ms ease;
}

.search__suggestions button:hover {
  border-color: var(--line);
  background: var(--cream-deep);
}

.search__results,
.search__popular {
  margin-top: 26px;
  border-top: 1px solid var(--line-soft);
}

.search__results-head {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-block: 13px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.search-result {
  display: grid;
  width: 100%;
  grid-template-columns: 60px 1fr auto 24px;
  align-items: center;
  gap: 14px;
  padding-block: 10px;
  border-top: 1px solid var(--line-soft);
  text-align: left;
  transition:
    background-color 200ms ease,
    padding 200ms var(--ease-out);
}

.search-result:hover {
  padding-inline: 8px;
  background: rgba(231, 233, 221, 0.45);
}

.search-result__media {
  display: block;
  height: 66px;
  overflow: hidden;
  border-radius: 4px;
}

.search-result__media :deep(.product-visual) {
  height: 100%;
  aspect-ratio: auto;
}

.search-result__media :deep(.pv-label),
.search-result__media :deep(.pv-edition),
.search-result__media :deep(.pv-seal) {
  display: none;
}

.search-result__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.search-result__copy small {
  color: var(--ink-faint);
  font-size: 7px;
  letter-spacing: 0.12em;
  line-height: 1.4;
  text-transform: uppercase;
}

.search-result__copy strong {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 1.05;
}

.search-result__copy > span {
  color: var(--ink-faint);
  font-size: 8.5px;
}

.search-result__price {
  color: var(--ink-soft);
  font-size: 9px;
}

.search-result > :deep(svg) {
  color: var(--ink-faint);
}

.search__no-results {
  padding: 26px 0 16px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.7;
}

.search__popular-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.popular-card {
  min-width: 0;
  padding: 7px;
  border: 1px solid var(--line-soft);
  border-radius: 7px;
  text-align: left;
  transition:
    border-color 200ms ease,
    transform 260ms var(--ease-out);
}

.popular-card:hover {
  border-color: var(--line);
  transform: translateY(-3px);
}

.popular-card__media {
  display: block;
  overflow: hidden;
  border-radius: 4px;
}

.popular-card__media :deep(.pv-label),
.popular-card__media :deep(.pv-edition),
.popular-card__media :deep(.pv-seal) {
  display: none;
}

.popular-card__copy {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 4px 5px;
}

.popular-card__copy strong {
  overflow: hidden;
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popular-card__copy span {
  flex-shrink: 0;
  color: var(--ink-faint);
  font-size: 7.5px;
}

@media (max-width: 600px) {
  .search {
    padding: 30px 18px 24px;
  }

  .search__head {
    padding-right: 38px;
  }

  .search__form {
    margin-top: 20px;
    padding-left: 14px;
  }

  .search__form kbd {
    display: none;
  }

  .search__popular-grid {
    grid-template-columns: 1fr 1fr;
  }

  .popular-card:last-child {
    display: none;
  }

  .search-result {
    grid-template-columns: 52px 1fr auto;
    gap: 11px;
  }

  .search-result > :deep(svg) {
    display: none;
  }
}
</style>

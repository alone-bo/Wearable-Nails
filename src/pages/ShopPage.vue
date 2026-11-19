<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import PageHero from '../components/PageHero.vue'
import ProductCard from '../components/ProductCard.vue'
import { categories, products } from '../data/products.js'
import { useShop } from '../stores/shop.js'

const route = useRoute()
const router = useRouter()
const { wishlist, addToCart, openQuick, openBooking, toggleWishlist } = useShop()

const validCategories = ['all', 'press-on', 'care', 'sets']
const activeCategory = ref(validCategories.includes(route.query.category) ? route.query.category : 'all')
const sortBy = ref('featured')

watch(
  () => route.query.category,
  (category) => {
    activeCategory.value = validCategories.includes(category) ? category : 'all'
  },
)

const filteredProducts = computed(() => {
  const base =
    activeCategory.value === 'all'
      ? [...products]
      : products.filter((product) => product.category === activeCategory.value)

  if (sortBy.value === 'price-asc') return base.sort((a, b) => a.price - b.price)
  if (sortBy.value === 'price-desc') return base.sort((a, b) => b.price - a.price)
  if (sortBy.value === 'rating') return base.sort((a, b) => b.rating - a.rating)
  return base
})

const activeLabel = computed(
  () => categories.find((category) => category.id === activeCategory.value)?.label || 'All pieces',
)

function selectCategory(id) {
  activeCategory.value = id
  router.replace({
    path: '/shop',
    query: id === 'all' ? {} : { category: id },
  })
}

function categoryCount(id) {
  return id === 'all' ? products.length : products.filter((product) => product.category === id).length
}
</script>

<template>
  <div class="shop-page">
    <PageHero
      eyebrow="The collection"
      lede="Reusable press-on sets, salon-grade nail care and small-batch gifts. Designed in Casablanca, made to be worn on repeat."
      :crumbs="[{ label: 'Shop' }]"
    >
      <template #title>Everyday pieces,<br /><em>made slowly.</em></template>

      <div class="shop-hero-meta">
        <span><Icon name="leaf" :size="15" /> 10-free formulas</span>
        <span><Icon name="sparkle" :size="15" /> Reusable up to 20 wears</span>
        <span><Icon name="truck" :size="15" /> Free delivery over 350 MAD</span>
      </div>
    </PageHero>

    <section class="catalog section" aria-labelledby="catalog-title">
      <div class="container">
        <div class="catalog__head">
          <div>
            <span class="eyebrow">Filter the edit</span>
            <h2 id="catalog-title">{{ activeLabel }} <span>({{ filteredProducts.length }})</span></h2>
          </div>
          <p class="catalog__note">
            Every set is packed by hand in our Casablanca atelier. Not sure which to choose?
            <RouterLink to="/faq">Read our wear guide</RouterLink>.
          </p>
        </div>

        <div class="catalog__controls">
          <div class="catalog__filters" role="group" aria-label="Filter products">
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              :class="{ 'is-active': activeCategory === category.id }"
              :aria-pressed="activeCategory === category.id"
              @click="selectCategory(category.id)"
            >
              {{ category.label }}
              <span>{{ categoryCount(category.id) }}</span>
            </button>
          </div>

          <label class="catalog__sort">
            <span>Sort by</span>
            <select v-model="sortBy">
              <option value="featured">Featured</option>
              <option value="price-asc">Price · low to high</option>
              <option value="price-desc">Price · high to low</option>
              <option value="rating">Highest rated</option>
            </select>
            <Icon name="chevronDown" :size="13" />
          </label>
        </div>

        <div class="catalog__grid product-grid" aria-live="polite">
          <ProductCard
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            v-reveal="{ delay: Math.min(index, 4) * 55 }"
            :product="product"
            :saved="wishlist.includes(product.id)"
            @add="addToCart"
            @quick-view="openQuick"
            @toggle-wishlist="toggleWishlist"
          />
        </div>

        <div class="catalog__foot">
          <p><strong>{{ filteredProducts.length }} pieces</strong> in this edit</p>
          <p>Complimentary gift wrapping · 14-day returns · Secure checkout</p>
        </div>
      </div>
    </section>

    <PageCta
      eyebrow="Need a little guidance?"
      text="Our atelier team can help with sizing, wear time and colour matching. Browse the FAQ or book a fitting in Casablanca."
    >
      <template #title>Find the set<br /><em>that feels like you.</em></template>
      <RouterLink to="/faq" class="btn btn--ghost-light">
        Read the FAQ
        <Icon name="arrowUpRight" :size="15" />
      </RouterLink>
      <button type="button" class="btn btn--cream" @click="openBooking()">
        Book a fitting
        <Icon name="calendar" :size="15" />
      </button>
    </PageCta>
  </div>
</template>

<style scoped>
.shop-page {
  background: var(--cream);
}

.shop-hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 9px 22px;
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid var(--line-soft);
}

.shop-hero-meta span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-soft);
  font-size: 8.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.shop-hero-meta :deep(svg) {
  color: var(--rose-deep);
}

.catalog {
  padding-top: clamp(48px, 6vw, 82px);
}

.catalog__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding-bottom: 21px;
  border-bottom: 1px solid var(--line-soft);
}

.catalog__head h2 {
  margin-top: 11px;
  font-size: clamp(2.3rem, 3.8vw, 3.4rem);
}

.catalog__head h2 span {
  color: var(--ink-faint);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  vertical-align: middle;
}

.catalog__note {
  max-width: 350px;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.7;
  text-align: right;
}

.catalog__note a {
  color: var(--sage-deep);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.catalog__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding-block: 16px;
}

.catalog__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.catalog__filters button {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--ink-soft);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.06em;
  line-height: 1;
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
}

.catalog__filters button:hover {
  border-color: var(--line);
  color: var(--ink);
}

.catalog__filters button.is-active {
  border-color: var(--sage-deep);
  background: var(--sage-deep);
  color: var(--white);
}

.catalog__filters button span {
  color: var(--ink-faint);
  font-size: 7px;
}

.catalog__filters button.is-active span {
  color: rgba(255, 253, 248, 0.65);
}

.catalog__sort {
  display: flex;
  min-height: 40px;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 0 11px;
  border: 1px solid var(--line-soft);
  border-radius: 5px;
  background: rgba(255, 253, 248, 0.5);
}

.catalog__sort > span {
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.catalog__sort select {
  max-width: 150px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font-size: 9px;
  cursor: pointer;
  appearance: none;
}

.catalog__sort :deep(svg) {
  color: var(--ink-faint);
  pointer-events: none;
}

.catalog__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(11px, 1.5vw, 20px);
}

.catalog__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid var(--line-soft);
  color: var(--ink-faint);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.catalog__foot strong {
  color: var(--ink);
  font-weight: 500;
}

@media (max-width: 1100px) {
  .catalog__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .catalog__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 13px;
  }

  .catalog__note {
    max-width: none;
    text-align: left;
  }

  .catalog__controls {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .catalog__filters {
    width: calc(100% + var(--gutter));
    margin-right: calc(-1 * var(--gutter));
    padding-right: var(--gutter);
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: none;
  }

  .catalog__filters::-webkit-scrollbar {
    display: none;
  }

  .catalog__filters button {
    flex-shrink: 0;
  }

  .catalog__grid {
    grid-template-columns: 1fr 1fr;
  }

  .catalog__foot {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }
}
</style>

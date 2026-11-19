<script setup>
import { watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import BookingDialog from './components/BookingDialog.vue'
import CartDrawer from './components/CartDrawer.vue'
import QuickViewDialog from './components/QuickViewDialog.vue'
import SearchDialog from './components/SearchDialog.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import SunMark from './components/SunMark.vue'
import { products, services } from './data/products.js'
import { useShop } from './stores/shop.js'

const route = useRoute()
const router = useRouter()

const {
  cartOpen,
  searchOpen,
  quickViewOpen,
  bookingOpen,
  quickProduct,
  initialService,
  cartItems,
  cartSubtotal,
  cartCount,
  wishlist,
  toast,
  closeAllDialogs,
  openCart,
  openSearch,
  openQuick,
  openBooking,
  selectSearchResult,
  addFromQuick,
  updateQty,
  removeFromCart,
  toggleWishlist,
  checkout,
} = useShop()

function browseFromCart() {
  cartOpen.value = false
  window.setTimeout(() => {
    router.push('/shop')
  }, 260)
}

function viewQuickProductDetails(product) {
  quickViewOpen.value = false
  window.setTimeout(() => {
    router.push(`/product/${product.id}`)
  }, 260)
}

watch(
  () => route.fullPath,
  () => {
    closeAllDialogs()
  },
)
</script>

<template>
  <div id="top" class="site-shell">
    <a class="skip-link" href="#main-content">Skip to content</a>

    <div class="announcement">
      <div class="container announcement__inner">
        <p class="announcement__left">
          <SunMark :size="13" />
          Hand-finished in Casablanca
        </p>
        <p class="announcement__center">
          Complimentary delivery over 350 MAD
          <span class="announcement__dot">·</span>
          14-day returns
        </p>
        <div class="announcement__right">
          <RouterLink to="/#glow-club">Glow Club</RouterLink>
          <span>·</span>
          <span>MAD</span>
        </div>
      </div>
    </div>

    <SiteHeader
      :cart-count="cartCount"
      @open-cart="openCart"
      @open-search="openSearch"
      @open-booking="openBooking"
    />

    <main id="main-content">
      <RouterView />
    </main>

    <SiteFooter @open-booking="openBooking()" />

    <CartDrawer
      :open="cartOpen"
      :items="cartItems"
      :subtotal="cartSubtotal"
      :count="cartCount"
      @close="cartOpen = false"
      @update-qty="updateQty"
      @remove="removeFromCart"
      @checkout="checkout"
      @browse="browseFromCart"
    />

    <QuickViewDialog
      :open="quickViewOpen"
      :product="quickProduct"
      :saved="quickProduct ? wishlist.includes(quickProduct.id) : false"
      @close="quickViewOpen = false"
      @add="addFromQuick"
      @toggle-wishlist="toggleWishlist"
      @view-details="viewQuickProductDetails"
    />

    <SearchDialog
      :open="searchOpen"
      :products="products"
      @close="searchOpen = false"
      @select="selectSearchResult"
    />

    <BookingDialog
      :open="bookingOpen"
      :services="services"
      :initial-service-id="initialService"
      @close="bookingOpen = false"
    />

    <Teleport to="body">
      <Transition name="toast">
        <div v-if="toast" class="toast" role="status" aria-live="polite">
          <SunMark :size="19" />
          <span>{{ toast }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.site-shell {
  min-height: 100vh;
}

main {
  min-height: 52vh;
}

/* Announcement */
.announcement {
  background: var(--sage-deep);
  color: var(--cream);
}

.announcement__inner {
  display: grid;
  min-height: 34px;
  align-items: center;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  font-size: 7.5px;
  font-weight: 500;
  letter-spacing: 0.13em;
  line-height: 1.4;
  text-transform: uppercase;
}

.announcement__left {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(247, 242, 233, 0.95);
}

.announcement__left :deep(svg) {
  color: var(--rose-light);
}

.announcement__center {
  color: var(--cream);
  text-align: center;
}

.announcement__dot {
  margin-inline: 6px;
  color: var(--rose-light);
}

.announcement__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  color: rgba(247, 242, 233, 0.95);
}

.announcement__right a {
  color: var(--cream);
  transition: color 200ms ease;
}

.announcement__right a:hover {
  color: var(--white);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  z-index: 9999;
  display: flex;
  max-width: min(92vw, 480px);
  align-items: center;
  gap: 10px;
  padding: 13px 17px;
  border: 1px solid rgba(247, 242, 233, 0.16);
  border-radius: 6px;
  background: rgba(97, 110, 84, 0.97);
  color: var(--cream);
  box-shadow: 0 18px 40px -20px rgba(20, 27, 18, 0.7);
  font-size: 9.5px;
  letter-spacing: 0.02em;
  line-height: 1.5;
  transform: translateX(-50%);
  backdrop-filter: blur(10px);
}

.toast :deep(svg) {
  flex-shrink: 0;
  color: var(--rose-light);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 250ms ease,
    transform 300ms var(--ease-out);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

@media (max-width: 760px) {
  .announcement__inner {
    grid-template-columns: 1fr auto;
    gap: 12px;
  }

  .announcement__left {
    display: none;
  }

  .announcement__center {
    text-align: left;
  }

  .announcement__right {
    font-size: 7px;
  }
}

@media (max-width: 480px) {
  .announcement__right {
    display: none;
  }

  .announcement__inner {
    min-height: 32px;
    grid-template-columns: 1fr;
    text-align: center;
  }

  .announcement__center {
    font-size: 7px;
    text-align: center;
  }

  .toast {
    bottom: 16px;
    font-size: 9px;
  }
}
</style>

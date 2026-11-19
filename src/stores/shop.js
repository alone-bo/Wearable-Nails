import { computed, ref } from 'vue'
import { products, services } from '../data/products.js'

const cart = ref([{ id: 'olive-hour', qty: 1 }])
const wishlist = ref([])

const cartOpen = ref(false)
const searchOpen = ref(false)
const quickViewOpen = ref(false)
const bookingOpen = ref(false)
const quickProduct = ref(null)
const initialService = ref(services[0].id)

const toast = ref('')
let toastTimer

const cartItems = computed(() =>
  cart.value
    .map((line) => ({
      ...line,
      product: products.find((product) => product.id === line.id),
    }))
    .filter((line) => line.product),
)

const cartCount = computed(() => cart.value.reduce((total, line) => total + line.qty, 0))
const cartSubtotal = computed(() =>
  cart.value.reduce((total, line) => {
    const product = products.find((item) => item.id === line.id)
    return total + (product ? product.price * line.qty : 0)
  }, 0),
)

const anyDialogOpen = computed(
  () => cartOpen.value || searchOpen.value || quickViewOpen.value || bookingOpen.value,
)

function closeAllDialogs() {
  cartOpen.value = false
  searchOpen.value = false
  quickViewOpen.value = false
  bookingOpen.value = false
}

function openAfterClose(callback) {
  const delay = anyDialogOpen.value ? 240 : 0
  closeAllDialogs()
  if (delay) window.setTimeout(callback, delay)
  else callback()
}

function openCart() {
  openAfterClose(() => {
    cartOpen.value = true
  })
}

function openSearch() {
  openAfterClose(() => {
    searchOpen.value = true
  })
}

function openQuick(product) {
  openAfterClose(() => {
    quickProduct.value = product
    quickViewOpen.value = true
  })
}

function openBooking(serviceId = services[0].id) {
  initialService.value = serviceId || services[0].id
  openAfterClose(() => {
    bookingOpen.value = true
  })
}

function selectSearchResult(product) {
  openAfterClose(() => {
    quickProduct.value = product
    quickViewOpen.value = true
  })
}

function showToast(message) {
  toast.value = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.value = ''
  }, 3400)
}

function addToCart(product, qty = 1) {
  const existing = cart.value.find((line) => line.id === product.id)
  if (existing) existing.qty += qty
  else cart.value.push({ id: product.id, qty })
  showToast(`${product.name} added to your bag.`)
}

function addFromQuick(product, qty) {
  addToCart(product, qty)
  openAfterClose(() => {
    cartOpen.value = true
  })
}

function updateQty(id, qty) {
  if (qty < 1) return
  const line = cart.value.find((item) => item.id === id)
  if (line) line.qty = qty
}

function removeFromCart(id) {
  cart.value = cart.value.filter((line) => line.id !== id)
}

function toggleWishlist(product) {
  const index = wishlist.value.indexOf(product.id)
  if (index >= 0) {
    wishlist.value.splice(index, 1)
    showToast(`${product.name} removed from your wishlist.`)
  } else {
    wishlist.value.push(product.id)
    showToast(`${product.name} saved to your wishlist.`)
  }
}

function checkout() {
  cartOpen.value = false
  window.setTimeout(() => {
    showToast('Demo storefront — checkout is not connected yet.')
  }, 240)
}

export function useShop() {
  return {
    cart,
    cartItems,
    cartCount,
    cartSubtotal,
    wishlist,
    cartOpen,
    searchOpen,
    quickViewOpen,
    bookingOpen,
    quickProduct,
    initialService,
    toast,
    closeAllDialogs,
    openCart,
    openSearch,
    openQuick,
    openBooking,
    selectSearchResult,
    showToast,
    addToCart,
    addFromQuick,
    updateQty,
    removeFromCart,
    toggleWishlist,
    checkout,
  }
}

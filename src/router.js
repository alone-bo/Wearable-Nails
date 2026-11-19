import { createRouter, createWebHistory } from 'vue-router'

const defaultTitle = 'YOUGLOW — Nail Atelier & Beauty Studio, Casablanca'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/HomePage.vue'),
    meta: { title: defaultTitle },
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('./pages/ShopPage.vue'),
    meta: { title: 'Shop the collection — YOUGLOW' },
  },
  {
    path: '/product/:slug',
    name: 'product',
    component: () => import('./pages/ProductPage.vue'),
    meta: { title: 'Product — YOUGLOW' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('./pages/AboutPage.vue'),
    meta: { title: 'About YOUGLOW — Our atelier & story' },
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('./pages/FaqPage.vue'),
    meta: { title: 'Frequently asked questions — YOUGLOW' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('./pages/ContactPage.vue'),
    meta: { title: 'Contact & visit — YOUGLOW' },
  },
  {
    path: '/journal',
    name: 'journal',
    component: () => import('./pages/JournalPage.vue'),
    meta: { title: 'The Journal — YOUGLOW' },
  },
  {
    path: '/journal/:slug',
    name: 'journal-article',
    component: () => import('./pages/JournalArticlePage.vue'),
    meta: { title: 'Journal article — YOUGLOW' },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('./pages/LegalPage.vue'),
    meta: {
      title: 'Privacy Policy — YOUGLOW',
      legalKey: 'privacy',
    },
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('./pages/LegalPage.vue'),
    meta: {
      title: 'Terms of Service — YOUGLOW',
      legalKey: 'terms',
    },
  },
  {
    path: '/shipping-returns',
    name: 'shipping-returns',
    component: () => import('./pages/LegalPage.vue'),
    meta: {
      title: 'Shipping & Returns — YOUGLOW',
      legalKey: 'shipping',
    },
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('./pages/NotFoundPage.vue'),
    meta: { title: 'Page not found — YOUGLOW' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'catch-all',
    component: () => import('./pages/NotFoundPage.vue'),
    meta: { title: 'Page not found — YOUGLOW' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return { el: to.hash, top: 104, behavior: 'smooth' }
    }
    // Filtering the shop updates only the query string. Keep the user at the
    // product grid instead of jumping back to the top of the page.
    if (to.path === from.path && to.hash === from.hash) return false
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title || defaultTitle
})

export default router

import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './fonts.css'
import './styles.css'

const app = createApp(App)

app.use(router)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

app.directive('reveal', {
  mounted(el, binding) {
    if (reduceMotion) return
    el.classList.add('reveal')
    if (binding.value?.delay) {
      el.style.setProperty('--reveal-delay', `${binding.value.delay}ms`)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          el.classList.add('is-visible')
          observer.disconnect()
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px' },
    )
    observer.observe(el)
    el._revealObserver = observer
  },
  unmounted(el) {
    el._revealObserver?.disconnect()
  },
})

app.mount('#app')

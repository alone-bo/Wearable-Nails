<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BrandLogo from '../components/BrandLogo.vue'
import Icon from '../components/Icon.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductVisual from '../components/ProductVisual.vue'
import SunMark from '../components/SunMark.vue'
import { categories, journal, products, services, testimonials } from '../data/products.js'
import { useShop } from '../stores/shop.js'

const { wishlist, addToCart, openQuick, openBooking, toggleWishlist } = useShop()

const activeCategory = ref('all')
const newsletterEmail = ref('')
const newsletterState = ref('idle')
const newsletterMessage = ref('')

const ratingStars = [1, 2, 3, 4, 5]

const rituals = [
  {
    title: 'Considered by nature',
    text: '10-free, vegan formulas with olive leaf and jojoba — kind to nails, never tested on animals.',
  },
  {
    title: 'Made to be worn again',
    text: 'Reusable tips and salon-grade prep, designed for up to 20 days of beautiful wear.',
  },
  {
    title: 'Finished by hand',
    text: 'Every set is shaped, checked and packed by our small team in Casablanca. No two exactly alike.',
  },
]

const perks = [
  { title: 'Earn on every ritual', text: 'One point for every 10 MAD spent, online or in the studio.' },
  { title: 'First light on new edits', text: 'Early access to limited colour stories before they sell out.' },
  { title: 'A birthday set, on us', text: 'A little something hand-wrapped for your month of glow.' },
]

const gallery = [
  { src: '/images/gallery-nude.webp', alt: 'Soft lilac and pearl press-on nails on a cream knit', label: 'A softer nude' },
  { src: '/images/gallery-gold.webp', alt: 'Pink manicured hands with a gold ring on soft cream fabric', label: 'The rose edit' },
  { src: '/images/gallery-care.webp', alt: 'A hand ritual with cream and dried flowers', label: 'The hand ritual' },
  { src: '/images/gallery-art.webp', alt: 'Hands with sage, mocha and cream nail art', label: 'Sunday light' },
]

const visibleProducts = computed(() => {
  if (activeCategory.value === 'all') return products
  return products.filter((product) => product.category === activeCategory.value)
})

function categoryCount(id) {
  return id === 'all' ? products.length : products.filter((product) => product.category === id).length
}

function scrollToNewsletter() {
  document.querySelector('#newsletter')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  window.setTimeout(() => {
    document.querySelector('#newsletter-email')?.focus({ preventScroll: true })
  }, 700)
}

function subscribe() {
  const email = newsletterEmail.value.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newsletterState.value = 'error'
    newsletterMessage.value = 'Please enter a valid email address.'
    return
  }
  newsletterState.value = 'success'
  newsletterMessage.value = 'You are on the list. Welcome to the glow — your 10% welcome note is on its way.'
  newsletterEmail.value = ''
}
</script>

<template>
  <div class="home-page">
<section class="hero" aria-labelledby="hero-title">
        <span class="hero__watermark" aria-hidden="true">BEAUTÉ</span>
        <div class="container hero__inner">
          <div class="hero__copy">
            <p class="eyebrow">Nail atelier · Casablanca · est. 2024</p>

            <h1 id="hero-title" class="hero__title">
              Quietly
              <em>luminous.</em>
            </h1>

            <p class="hero__lede">
              Press-on nail rituals and slow studio care, made by hand in Casablanca.
              Considered colour, effortless wear — a little glow, every day.
            </p>

            <div class="hero__actions">
              <RouterLink to="/shop" class="btn btn--primary">
                Shop the collection
                <Icon name="arrowRight" :size="16" />
              </RouterLink>
              <button type="button" class="btn btn--outline" @click="openBooking()">
                Book a manicure
              </button>
            </div>

            <div class="hero__proof">
              <div class="hero__avatars" aria-hidden="true">
                <span>SB</span>
                <span>YK</span>
                <span>LR</span>
              </div>
              <div class="hero__rating">
                <span class="hero__stars">
                  <Icon v-for="star in ratingStars" :key="star" name="star" :size="11" />
                </span>
                <p><strong>4.9 / 5</strong> from 1,200+ glowing hands</p>
              </div>
              <div class="hero__promise">
                <SunMark :size="30" />
                <span>10-free<br />always</span>
              </div>
            </div>

            <p class="hero__french">Fait main à Casa.</p>
          </div>

          <div class="hero__visual">
            <div class="hero__halo" aria-hidden="true">
              <SunMark :size="530" />
            </div>

            <figure class="hero__figure">
              <img
                src="/images/hero-nails.webp"
                width="1200"
                height="1502"
                alt="Close-up of hands wearing sage, mocha and cream press-on nails"
                fetchpriority="high"
              />
              <figcaption>01 — The winter edit</figcaption>
            </figure>

            <button type="button" class="hero-product" @click="openQuick(products[0])">
              <img src="/images/hero-detail.webp" width="900" height="900" alt="" aria-hidden="true" />
              <span class="hero-product__copy">
                <small>The signature set</small>
                <strong>The Olive Hour</strong>
                <span>189 MAD · Shop the set</span>
              </span>
              <span class="hero-product__arrow">
                <Icon name="arrowUpRight" :size="16" />
              </span>
            </button>

            <div class="hero-loyalty">
              <div class="hero-loyalty__top">
                <span>Glow Club</span>
                <SunMark :size="24" />
              </div>
              <strong>240 <small>pts</small></strong>
              <div class="hero-loyalty__bar" aria-hidden="true"><span /></div>
              <p>60 points to your next reward</p>
            </div>

            <span class="hero__side-label" aria-hidden="true">MAISON DE BEAUTÉ · CASA</span>
          </div>
        </div>
      </section>

      <section class="values" aria-label="Our promise">
        <div class="container values__inner">
          <span><Icon name="leaf" :size="17" /> 10-free formulas</span>
          <span><Icon name="sparkle" :size="17" /> Reusable up to 20 wears</span>
          <span><Icon name="shield" :size="17" /> Hand-finished in Casa</span>
          <span><Icon name="truck" :size="17" /> Free delivery over 350 MAD</span>
        </div>
      </section>

      <section id="shop" class="section shop" aria-labelledby="shop-title">
        <div class="container">
          <div class="section-head" v-reveal>
            <div class="section-head__copy">
              <span class="eyebrow">Shop the collection</span>
              <h2 id="shop-title">Small rituals,<br /><em>lasting glow.</em></h2>
            </div>
            <div class="section-head__aside">
              <p class="section-head__lede">
                Reusable press-on sets, salon-grade care and small-batch gifts. Made to wear now,
                and again, and again.
              </p>
              <a href="#ritual" class="text-link shop__story-link">
                The story behind the polish
                <Icon name="arrowRight" :size="14" />
              </a>
            </div>
          </div>

          <div class="shop__toolbar">
            <div class="shop__filters" role="group" aria-label="Filter the collection">
              <button
                v-for="category in categories"
                :key="category.id"
                type="button"
                :class="{ 'is-active': activeCategory === category.id }"
                :aria-pressed="activeCategory === category.id"
                @click="activeCategory = category.id"
              >
                {{ category.label }}
                <span>{{ categoryCount(category.id) }}</span>
              </button>
            </div>
            <p class="shop__note">
              <SunMark :size="18" />
              Small batches, packed by hand
            </p>
          </div>

          <div class="product-grid" aria-live="polite">
            <ProductCard
              v-for="(product, index) in visibleProducts"
              :key="product.id"
              v-reveal="{ delay: Math.min(index, 4) * 55 }"
              :product="product"
              :saved="wishlist.includes(product.id)"
              @add="addToCart"
              @quick-view="openQuick"
              @toggle-wishlist="toggleWishlist"
            />
          </div>

          <div class="shop__footer">
            <p><strong>{{ visibleProducts.length }} pieces</strong> in this edit</p>
            <p class="shop__footer-note">
              Complimentary delivery over 350 MAD · Gift wrapping always included
            </p>
          </div>
        </div>
      </section>

      <section id="ritual" class="ritual" aria-labelledby="ritual-title">
        <div class="container ritual__grid">
          <div class="ritual__media" v-reveal>
            <div class="ritual__image-wrap">
              <img
                src="/images/hand-ritual.webp"
                width="1100"
                height="760"
                alt="Hands being cared for with a rich cream and dried botanicals"
              />
              <span class="ritual__image-label">The hand ritual · 60 min</span>
            </div>
            <div class="ritual__seal">
              <SunMark :size="42" />
              <span>Small batch<br />big care</span>
            </div>
            <p class="ritual__caption"><span>01</span> Made slowly, in Casablanca.</p>
          </div>

          <div class="ritual__copy" v-reveal="{ delay: 100 }">
            <span class="eyebrow">The YOUGLOW difference</span>
            <h2 id="ritual-title">Beauty that<br /><em>stays awhile.</em></h2>
            <p class="ritual__lede">
              We believe the best beauty is quiet: formulas you can trust, colours that feel like
              you, and rituals worth slowing down for.
            </p>

            <div class="ritual__list">
              <article v-for="(ritual, index) in rituals" :key="ritual.title">
                <span class="ritual__index">0{{ index + 1 }}</span>
                <div>
                  <h3>{{ ritual.title }}</h3>
                  <p>{{ ritual.text }}</p>
                </div>
              </article>
            </div>

            <div class="ritual__bottom">
              <button type="button" class="text-link" @click="openBooking()">
                Experience the studio
                <Icon name="arrowUpRight" :size="14" />
              </button>
              <div class="ritual__stats">
                <span><strong>10-free</strong>formulas</span>
                <span><strong>20</strong>days of wear</span>
                <span><strong>100%</strong>hand-finished</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="studio" class="studio section section--dark" aria-labelledby="studio-title">
        <div class="container studio__grid">
          <div class="studio__media" v-reveal>
            <img
              src="/images/studio.webp"
              width="1000"
              height="1175"
              alt="Warm treatment room with sage walls, candles and a soft treatment bed in the YOUGLOW atelier"
              loading="lazy"
            />
            <div class="studio__hours">
              <SunMark :size="24" />
              <div>
                <span>Open daily</span>
                <strong>10:00 — 20:00</strong>
              </div>
            </div>
            <p class="studio__address">127 Boulevard de la Corniche · Casablanca</p>
          </div>

          <div class="studio__copy" v-reveal="{ delay: 100 }">
            <span class="eyebrow eyebrow--light">The atelier</span>
            <h2 id="studio-title">A quiet hour,<br /><em>entirely yours.</em></h2>
            <p class="studio__lede">
              Step off the Corniche and into a slower kind of beauty. Warm hands, considered
              colour and nowhere else to be. Every visit includes tea, a hand ritual and our full
              attention.
            </p>

            <div class="service-list">
              <button
                v-for="(service, index) in services"
                :key="service.id"
                type="button"
                class="service-row"
                @click="openBooking(service.id)"
              >
                <span class="service-row__index">0{{ index + 1 }}</span>
                <span class="service-row__copy">
                  <strong>{{ service.name }}</strong>
                  <small>{{ service.detail }} · {{ service.duration }}</small>
                </span>
                <span class="service-row__price">{{ service.price }} MAD</span>
                <span class="service-row__arrow"><Icon name="arrowUpRight" :size="16" /></span>
              </button>
            </div>

            <div class="studio__actions">
              <button type="button" class="btn btn--cream" @click="openBooking()">
                Reserve your visit
                <Icon name="calendar" :size="16" />
              </button>
              <a href="tel:+212522000000" class="text-link text-link--light">
                +212 5 22 00 00 00
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="campaign" aria-labelledby="campaign-title">
        <div class="container">
          <div class="campaign__inner" v-reveal>
            <div class="campaign__visual">
              <span class="campaign__bgword" aria-hidden="true">OLIVE</span>
              <ProductVisual :product="products[0]" large />
              <span class="campaign__limited">Limited run · 200 sets</span>
              <span class="campaign__sun" aria-hidden="true"><SunMark :size="200" /></span>
            </div>

            <div class="campaign__copy">
              <span class="eyebrow">The limited edit</span>
              <h2 id="campaign-title">The Olive<br /><em>Hour.</em></h2>
              <p>
                A colour story inspired by late-afternoon light through olive trees. Five
                hand-finished shades in one reusable set — sage, oat, pearl and a single
                rose-gold flick.
              </p>

              <div class="campaign__swatches">
                <span style="background: #7c8e67" />
                <span style="background: #9ca990" />
                <span style="background: #efe8d8" />
                <span style="background: #c69a82" />
                <span style="background: #616e54" />
                <small>5 shades · 24 tips</small>
              </div>

              <div class="campaign__buy">
                <div>
                  <strong>189 MAD</strong>
                  <s>219 MAD</s>
                </div>
                <button type="button" class="btn btn--primary" @click="addToCart(products[0])">
                  Add the set
                  <Icon name="plus" :size="15" />
                </button>
              </div>

              <button type="button" class="text-link campaign__link" @click="openQuick(products[0])">
                Discover the Olive Hour
                <Icon name="arrowUpRight" :size="14" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="testimonials" aria-labelledby="testimonials-title">
        <div class="container">
          <div class="testimonials__head" v-reveal>
            <div>
              <span class="eyebrow eyebrow--light">Client notes</span>
              <h2 id="testimonials-title">Loved, worn,<br /><em>repeated.</em></h2>
            </div>
            <div class="testimonials__summary">
              <strong>4.9</strong>
              <div>
                <span class="testimonials__stars" aria-hidden="true">
                  <Icon v-for="star in ratingStars" :key="star" name="star" :size="13" />
                </span>
                <p>From 1,200+ hands across Morocco</p>
              </div>
            </div>
          </div>

          <div class="testimonials__grid">
            <figure
              v-for="(item, index) in testimonials"
              :key="item.name"
              v-reveal="{ delay: index * 80 }"
              class="quote-card"
            >
              <div class="quote-card__stars" :aria-label="`${ratingStars.length} out of 5 stars`">
                <Icon v-for="star in ratingStars" :key="star" name="star" :size="12" />
              </div>
              <blockquote>“{{ item.quote }}”</blockquote>
              <figcaption>
                <span class="quote-card__avatar">{{ item.initials }}</span>
                <span>
                  <strong>{{ item.name }}</strong>
                  <small>{{ item.meta }}</small>
                </span>
                <Icon name="quote" :size="26" />
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="glow-club" class="glow-club section" aria-labelledby="glow-title">
        <div class="container glow-club__grid">
          <div class="glow-club__copy" v-reveal>
            <span class="eyebrow">The Glow Club</span>
            <h2 id="glow-title">A little more glow,<br /><em>every visit.</em></h2>
            <p class="glow-club__lede">
              More than a loyalty card — a quiet invitation to look after your hands, and
              yourself. Points, early access and small gifts, all year round.
            </p>

            <div class="perks">
              <div v-for="perk in perks" :key="perk.title" class="perk">
                <SunMark :size="27" />
                <div>
                  <h3>{{ perk.title }}</h3>
                  <p>{{ perk.text }}</p>
                </div>
              </div>
            </div>

            <button type="button" class="btn btn--primary" @click="scrollToNewsletter">
              Join the Glow Club
              <Icon name="arrowRight" :size="16" />
            </button>
          </div>

          <div class="glow-club__visual" v-reveal="{ delay: 100 }">
            <div class="member-card">
              <div class="member-card__top">
                <BrandLogo light compact />
                <span>Glow Club</span>
              </div>
              <p class="member-card__name">Your glow, <em>rewarded.</em></p>
              <div class="member-card__points">
                <strong>240</strong>
                <span>points</span>
              </div>
              <div
                class="member-card__progress"
                role="progressbar"
                aria-label="60 points until next reward"
                aria-valuemin="0"
                aria-valuemax="300"
                aria-valuenow="240"
              >
                <span />
              </div>
              <p class="member-card__next">60 points until 20% off your next studio ritual.</p>
              <div class="member-card__bottom">
                <span>Member since 2024</span>
                <span>No. 024</span>
              </div>
              <SunMark :size="180" class="member-card__sun" />
            </div>

            <div class="reward-card">
              <SunMark :size="24" />
              <span>Next reward</span>
              <strong>20% off a studio ritual</strong>
              <small>at 300 points</small>
            </div>
          </div>
        </div>
      </section>

      <section id="journal" class="section journal" aria-labelledby="journal-title">
        <div class="container">
          <div class="section-head" v-reveal>
            <div class="section-head__copy">
              <span class="eyebrow">Notes from the atelier</span>
              <h2 id="journal-title">Read, rest,<br /><em>repeat.</em></h2>
            </div>
            <div class="section-head__aside">
              <p class="section-head__lede">
                Slow beauty notes, colour stories and the small rituals that make a week feel
                softer.
              </p>
              <RouterLink to="/journal" class="text-link">
                Visit the journal
                <Icon name="arrowUpRight" :size="14" />
              </RouterLink>
            </div>
          </div>

          <div class="journal__grid">
            <article
              v-for="(article, index) in journal"
              :key="article.title"
              v-reveal="{ delay: index * 80 }"
              class="journal-card"
            >
              <RouterLink :to="`/journal/${article.slug}`" class="journal-card__link" :aria-label="`Read ${article.title}`">
                <div class="journal-card__image">
                  <img :src="article.image" :alt="article.alt" width="900" height="660" loading="lazy" />
                  <span class="journal-card__read">{{ article.readTime }}</span>
                </div>
                <div class="journal-card__meta">
                  <span>{{ article.category }}</span>
                  <span>·</span>
                  <span>{{ article.readTime }}</span>
                </div>
                <h3>{{ article.title }}</h3>
                <p>{{ article.excerpt }}</p>
                <span class="journal-card__cta">
                  Read the story
                  <Icon name="arrowRight" :size="14" />
                </span>
              </RouterLink>
            </article>
          </div>
        </div>
      </section>

      <section class="gallery" aria-labelledby="gallery-title">
        <div class="container">
          <div class="gallery__head" v-reveal>
            <div>
              <span class="eyebrow">From the atelier</span>
              <h2 id="gallery-title">A little light,<br /><em>every day.</em></h2>
            </div>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" class="text-link">
              @youglow.casa
              <Icon name="instagram" :size="15" />
            </a>
          </div>

          <div class="gallery__grid">
            <a
              v-for="item in gallery"
              :key="item.label"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              class="gallery-tile"
            >
              <img :src="item.src" :alt="item.alt" width="800" height="800" loading="lazy" />
              <span class="gallery-tile__overlay">
                <span>{{ item.label }}</span>
                <Icon name="arrowUpRight" :size="16" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section id="newsletter" class="newsletter" aria-labelledby="newsletter-title">
        <span class="newsletter__word" aria-hidden="true">GLOW</span>
        <SunMark :size="120" class="newsletter__sun" />
        <div class="container newsletter__inner" v-reveal>
          <span class="eyebrow eyebrow--plain">Letters from the atelier</span>
          <h2 id="newsletter-title">Stay in the <em>glow.</em></h2>
          <p class="newsletter__lede">
            New drops, studio notes and small-batch invitations. Join the list and enjoy 10% off
            your first order.
          </p>

          <form class="newsletter__form" novalidate @submit.prevent="subscribe">
            <label class="sr-only" for="newsletter-email">Email address</label>
            <input
              id="newsletter-email"
              v-model="newsletterEmail"
              type="email"
              autocomplete="email"
              placeholder="Your email address"
              :aria-invalid="newsletterState === 'error'"
              :aria-describedby="newsletterMessage ? 'newsletter-message' : undefined"
            />
            <button type="submit" class="btn btn--primary">
              Subscribe
              <Icon name="arrowRight" :size="15" />
            </button>
          </form>

          <p
            v-if="newsletterMessage"
            id="newsletter-message"
            class="newsletter__message"
            :class="`is-${newsletterState}`"
            :role="newsletterState === 'error' ? 'alert' : 'status'"
          >
            {{ newsletterMessage }}
          </p>

          <p class="newsletter__fineprint">
            No noise, only the good stuff. Unsubscribe anytime. By joining you agree to our privacy
            note.
          </p>
        </div>
      </section>
  </div>
</template>

<style scoped>
.site-shell {
  min-height: 100vh;
}

/* Announcement */
.announcement {
  background: var(--sage-dark);
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
  color: var(--rose-light);
}

/* Hero */
.hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(46px, 6.4vw, 92px) clamp(60px, 7vw, 100px);
  background:
    radial-gradient(circle at 7% 15%, rgba(235, 223, 205, 0.6), transparent 32%),
    radial-gradient(circle at 92% 80%, rgba(229, 200, 184, 0.18), transparent 30%),
    var(--cream);
}

.hero::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 42%;
  height: 100%;
  background: linear-gradient(90deg, rgba(247, 242, 233, 0.9), transparent);
  content: '';
  pointer-events: none;
}

.hero__watermark {
  position: absolute;
  bottom: -4.2vw;
  left: -1.5vw;
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(8rem, 20vw, 21rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 0.7;
  opacity: 0.32;
  pointer-events: none;
  -webkit-text-stroke: 1px rgba(83, 97, 72, 0.11);
}

.hero__inner {
  position: relative;
  z-index: 1;
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 0.94fr) minmax(0, 1.06fr);
  gap: clamp(28px, 4vw, 70px);
}

.hero__copy {
  max-width: 670px;
  padding-block: 8px;
}

.hero__title {
  margin-top: 24px;
  color: var(--ink);
  font-size: clamp(5.4rem, 9.4vw, 9.6rem);
  font-weight: 300;
  letter-spacing: -0.038em;
  line-height: 0.78;
}

.hero__title em {
  display: block;
  margin-left: clamp(10px, 4vw, 60px);
  color: var(--sage);
  font-family: var(--font-display);
  font-size: 0.98em;
  font-weight: 300;
  line-height: 0.85;
}

.hero__lede {
  max-width: 430px;
  margin-top: 31px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.9;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
}

.hero__proof {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 42px;
  padding-top: 24px;
  border-top: 1px solid var(--line-soft);
}

.hero__avatars {
  display: flex;
  padding-left: 7px;
}

.hero__avatars span {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  margin-left: -7px;
  border: 2px solid var(--cream);
  border-radius: 50%;
  background: var(--sage-wash);
  color: var(--sage-deep);
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 500;
}

.hero__avatars span:nth-child(2) {
  background: var(--sand);
  color: var(--rose-deep);
}

.hero__avatars span:nth-child(3) {
  background: var(--sage-deep);
  color: var(--cream);
}

.hero__rating {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hero__stars {
  display: flex;
  gap: 1px;
  color: var(--rose);
}

.hero__rating p {
  color: var(--ink-faint);
  font-size: 8.5px;
  letter-spacing: 0.02em;
  line-height: 1.5;
}

.hero__rating strong {
  color: var(--ink);
  font-weight: 500;
}

.hero__promise {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  padding-left: 18px;
  border-left: 1px solid var(--line);
  color: var(--rose-deep);
}

.hero__promise span {
  color: var(--ink-faint);
  font-size: 7px;
  letter-spacing: 0.13em;
  line-height: 1.5;
  text-transform: uppercase;
}

.hero__french {
  margin-top: 18px;
  color: var(--rose-deep);
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-style: italic;
  letter-spacing: 0.02em;
}

.hero__visual {
  position: relative;
  min-height: clamp(570px, 51vw, 720px);
}

.hero__halo {
  position: absolute;
  top: 51%;
  left: 50%;
  color: var(--sage);
  opacity: 0.18;
  transform: translate(-50%, -50%);
}

.hero__figure {
  position: absolute;
  top: 0;
  right: 1%;
  width: min(78%, 560px);
  height: 92%;
  margin: 0;
  overflow: hidden;
  border-radius: 49% 49% 7px 7px;
  background: var(--sand);
  box-shadow: 0 34px 70px -44px rgba(47, 55, 44, 0.55);
}

.hero__figure::after {
  position: absolute;
  inset: 10px;
  border: 1px solid rgba(255, 253, 248, 0.38);
  border-radius: inherit;
  content: '';
  pointer-events: none;
}

.hero__figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 36%;
  filter: saturate(0.88) contrast(0.98) sepia(0.04);
  transition: transform 1.4s var(--ease-out);
}

.hero__visual:hover .hero__figure img {
  transform: scale(1.025);
}

.hero__figure figcaption {
  position: absolute;
  right: 24px;
  bottom: 21px;
  color: rgba(255, 253, 248, 0.82);
  font-size: 7px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-shadow: 0 1px 8px rgba(47, 55, 44, 0.35);
}

.hero-product {
  position: absolute;
  bottom: 4%;
  left: 0;
  z-index: 3;
  display: grid;
  width: min(294px, 58%);
  grid-template-columns: 74px 1fr 28px;
  align-items: center;
  gap: 13px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.91);
  box-shadow: 0 26px 50px -34px rgba(47, 55, 44, 0.7);
  text-align: left;
  backdrop-filter: blur(10px);
  transition:
    transform 300ms var(--ease-out),
    box-shadow 300ms ease;
}

.hero-product:hover {
  box-shadow: 0 32px 56px -30px rgba(47, 55, 44, 0.65);
  transform: translateY(-4px);
}

.hero-product img {
  width: 74px;
  height: 82px;
  border-radius: 4px;
  object-fit: cover;
}

.hero-product__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.hero-product__copy small {
  color: var(--ink-faint);
  font-size: 7px;
  letter-spacing: 0.11em;
  line-height: 1.4;
  text-transform: uppercase;
}

.hero-product__copy strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  line-height: 1.05;
}

.hero-product__copy > span {
  color: var(--ink-soft);
  font-size: 8px;
  line-height: 1.4;
}

.hero-product__arrow {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  color: var(--sage-deep);
  transition:
    background-color 200ms ease,
    color 200ms ease;
}

.hero-product:hover .hero-product__arrow {
  background: var(--sage-deep);
  color: var(--white);
}

.hero-loyalty {
  position: absolute;
  top: 8%;
  left: 1%;
  z-index: 3;
  width: 202px;
  padding: 15px 17px 14px;
  border: 1px solid rgba(255, 255, 255, 0.56);
  border-radius: 8px;
  background: rgba(247, 242, 233, 0.9);
  box-shadow: 0 24px 44px -34px rgba(47, 55, 44, 0.6);
  backdrop-filter: blur(12px);
}

.hero-loyalty__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--ink-faint);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-loyalty strong {
  display: block;
  margin-top: 8px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
  line-height: 0.9;
}

.hero-loyalty strong small {
  color: var(--ink-faint);
  font-family: var(--font-sans);
  font-size: 7px;
  font-weight: 500;
  letter-spacing: 0.08em;
}

.hero-loyalty__bar {
  height: 3px;
  margin-top: 10px;
  overflow: hidden;
  border-radius: 99px;
  background: var(--cream-deep);
}

.hero-loyalty__bar span {
  display: block;
  width: 80%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--sage), var(--rose));
}

.hero-loyalty p {
  margin-top: 7px;
  color: var(--ink-faint);
  font-size: 7px;
  line-height: 1.4;
}

.hero__side-label {
  position: absolute;
  top: 42%;
  right: -26px;
  color: var(--ink-faint);
  font-size: 6.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  transform: rotate(90deg);
}

/* Values */
.values {
  border-block: 1px solid var(--line-soft);
  background: var(--cream-soft);
}

.values__inner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.values__inner > span {
  display: flex;
  min-height: 58px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-left: 1px solid var(--line-soft);
  color: var(--ink-soft);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-align: center;
  text-transform: uppercase;
}

.values__inner > span:first-child {
  border-left: 0;
}

.values__inner :deep(svg) {
  color: var(--rose-deep);
}

/* Shop */
.shop {
  background: var(--cream);
}

.shop__story-link {
  margin-top: 23px;
}

.shop__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 17px;
  border-bottom: 1px solid var(--line-soft);
}

.shop__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.shop__filters button {
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

.shop__filters button:hover {
  border-color: var(--line);
  color: var(--ink);
}

.shop__filters button.is-active {
  border-color: var(--sage-deep);
  background: var(--sage-deep);
  color: var(--white);
}

.shop__filters button span {
  color: var(--ink-faint);
  font-size: 7px;
}

.shop__filters button.is-active span {
  color: rgba(255, 253, 248, 0.6);
}

.shop__note {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 7px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.06em;
}

.shop__note :deep(svg) {
  color: var(--rose);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(11px, 1.5vw, 20px);
  margin-top: 21px;
}

.shop__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 30px;
  color: var(--ink-faint);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.shop__footer strong {
  color: var(--ink);
  font-weight: 500;
}

.shop__footer-note {
  text-align: right;
}

/* Ritual */
.ritual {
  position: relative;
  overflow: hidden;
  padding-block: clamp(78px, 9vw, 130px);
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 253, 248, 0.7), transparent 32%),
    var(--cream-deep);
}

.ritual::after {
  position: absolute;
  top: 9%;
  right: -140px;
  width: 360px;
  height: 360px;
  border: 1px solid rgba(83, 97, 72, 0.13);
  border-radius: 50%;
  content: '';
}

.ritual__grid {
  position: relative;
  z-index: 1;
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 0.93fr) minmax(0, 1.07fr);
  gap: clamp(48px, 8vw, 118px);
}

.ritual__media {
  position: relative;
  max-width: 510px;
}

.ritual__image-wrap {
  position: relative;
  aspect-ratio: 4 / 4.8;
  overflow: hidden;
  border-radius: 240px 240px 7px 7px;
  background: var(--sand);
  box-shadow: 0 32px 60px -46px rgba(47, 55, 44, 0.55);
}

.ritual__image-wrap::after {
  position: absolute;
  inset: 11px;
  border: 1px solid rgba(255, 253, 248, 0.4);
  border-radius: inherit;
  content: '';
  pointer-events: none;
}

.ritual__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 52% 50%;
  transition: transform 1.4s var(--ease-out);
}

.ritual__media:hover .ritual__image-wrap img {
  transform: scale(1.03);
}

.ritual__image-label {
  position: absolute;
  bottom: 19px;
  left: 21px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  background: rgba(47, 55, 44, 0.34);
  color: var(--cream);
  font-size: 7px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  backdrop-filter: blur(5px);
}

.ritual__seal {
  position: absolute;
  right: -31px;
  bottom: 13%;
  display: grid;
  width: 110px;
  height: 110px;
  place-content: center;
  gap: 4px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--cream-soft);
  color: var(--rose-deep);
  text-align: center;
}

.ritual__seal :deep(svg) {
  margin-inline: auto;
}

.ritual__seal span {
  color: var(--ink-soft);
  font-size: 6.5px;
  letter-spacing: 0.1em;
  line-height: 1.5;
  text-transform: uppercase;
}

.ritual__caption {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 18px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.07em;
}

.ritual__caption span {
  color: var(--rose-deep);
}

.ritual__copy h2 {
  margin-top: 15px;
}

.ritual__copy h2 em {
  color: var(--sage-deep);
}

.ritual__lede {
  max-width: 480px;
  margin-top: 22px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.85;
}

.ritual__list {
  margin-top: 32px;
  border-top: 1px solid var(--line);
}

.ritual__list article {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 13px;
  padding-block: 17px;
  border-bottom: 1px solid var(--line);
}

.ritual__index {
  padding-top: 3px;
  color: var(--rose-deep);
  font-size: 8px;
  letter-spacing: 0.08em;
}

.ritual__list h3 {
  font-size: 1.45rem;
  line-height: 1.1;
}

.ritual__list p {
  max-width: 430px;
  margin-top: 5px;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.7;
}

.ritual__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-top: 28px;
}

.ritual__stats {
  display: flex;
  gap: 20px;
}

.ritual__stats span {
  display: flex;
  flex-direction: column;
  color: var(--ink-faint);
  font-size: 7px;
  letter-spacing: 0.06em;
  line-height: 1.5;
  text-transform: uppercase;
}

.ritual__stats strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1;
  text-transform: none;
}

/* Studio */
.studio {
  background:
    radial-gradient(circle at 94% 16%, rgba(191, 141, 118, 0.11), transparent 32%),
    var(--sage-dark);
  color: var(--cream);
}

.studio__grid {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(46px, 7vw, 110px);
}

.studio__media {
  position: relative;
  max-width: 570px;
}

.studio__media > img {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 4.7;
  border-radius: 7px;
  object-fit: cover;
  object-position: 55% 54%;
  filter: saturate(0.86) contrast(1.02) brightness(1.05);
}

.studio__media::after {
  position: absolute;
  inset: 0;
  border-radius: 7px;
  background: linear-gradient(180deg, transparent 52%, rgba(38, 47, 32, 0.44));
  content: '';
  pointer-events: none;
}

.studio__hours {
  position: absolute;
  right: 19px;
  bottom: 52px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 6px;
  background: rgba(247, 242, 233, 0.9);
  color: var(--ink);
  backdrop-filter: blur(10px);
}

.studio__hours :deep(svg) {
  color: var(--rose-deep);
}

.studio__hours div {
  display: flex;
  flex-direction: column;
}

.studio__hours span {
  color: var(--ink-faint);
  font-size: 6.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.studio__hours strong {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.2;
}

.studio__address {
  position: absolute;
  bottom: 18px;
  left: 20px;
  z-index: 2;
  color: rgba(247, 242, 233, 0.96);
  font-size: 7.5px;
  letter-spacing: 0.08em;
}

.studio__copy h2 {
  margin-top: 16px;
  color: var(--cream);
}

.studio__copy h2 em {
  color: var(--rose-light);
}

.studio__lede {
  max-width: 480px;
  margin-top: 21px;
  color: rgba(247, 242, 233, 0.96);
  font-size: 12.5px;
  line-height: 1.9;
}

.service-list {
  margin-top: 28px;
  border-top: 1px solid var(--line-light);
}

.service-row {
  display: grid;
  width: 100%;
  grid-template-columns: 30px 1fr auto 34px;
  align-items: center;
  gap: 12px;
  padding-block: 15px;
  border-bottom: 1px solid var(--line-light);
  color: var(--cream);
  text-align: left;
  transition:
    padding 280ms var(--ease-out),
    background-color 280ms ease;
}

.service-row:hover {
  padding-inline: 8px;
  background: rgba(247, 242, 233, 0.05);
}

.service-row__index {
  color: rgba(247, 242, 233, 0.35);
  font-size: 7.5px;
}

.service-row__copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.service-row__copy strong {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.1;
}

.service-row__copy small {
  color: rgba(247, 242, 233, 0.96);
  font-size: 8.5px;
  line-height: 1.4;
}

.service-row__price {
  color: rgba(247, 242, 233, 0.96);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.service-row__arrow {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid var(--line-light);
  border-radius: 50%;
  color: var(--cream);
  transition:
    background-color 200ms ease,
    color 200ms ease;
}

.service-row:hover .service-row__arrow {
  background: var(--cream);
  color: var(--sage-dark);
}

.studio__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 22px;
  margin-top: 28px;
}

.studio__actions .text-link {
  padding-block: 6px;
}

/* Campaign */
.campaign {
  padding-block: clamp(64px, 7vw, 100px);
  background: var(--sand);
}

.campaign__inner {
  display: grid;
  min-height: clamp(500px, 48vw, 620px);
  overflow: hidden;
  border: 1px solid rgba(57, 71, 51, 0.1);
  border-radius: 12px;
  grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr);
  box-shadow: 0 26px 60px -50px rgba(47, 55, 44, 0.6);
}

.campaign__visual {
  position: relative;
  min-height: 490px;
  overflow: hidden;
  background:
    radial-gradient(circle at 78% 8%, rgba(255, 255, 255, 0.28), transparent 30%),
    var(--sage-deep);
}

.campaign__bgword {
  position: absolute;
  top: -0.08em;
  left: 0.01em;
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(7rem, 13vw, 13rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 0.8;
  opacity: 0.38;
  -webkit-text-stroke: 1px rgba(247, 242, 233, 0.32);
}

.campaign__visual :deep(.product-visual) {
  position: absolute;
  right: -1%;
  bottom: -8%;
  width: 74%;
  height: auto;
  aspect-ratio: 1 / 1.06;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  box-shadow: 0 30px 70px -36px rgba(20, 27, 18, 0.7);
  transform: rotate(-2deg);
}

.campaign__visual :deep(.pv-edition) {
  display: none;
}

.campaign__limited {
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 4;
  padding: 8px 11px;
  border: 1px solid rgba(247, 242, 233, 0.35);
  border-radius: 999px;
  color: var(--cream);
  font-size: 7px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.campaign__sun {
  position: absolute;
  bottom: 8%;
  left: -40px;
  color: var(--rose-light);
  opacity: 0.18;
}

.campaign__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(34px, 5vw, 68px);
  background: var(--cream-soft);
}

.campaign__copy h2 {
  margin-top: 15px;
  font-size: clamp(3.8rem, 6vw, 6rem);
}

.campaign__copy h2 em {
  color: var(--sage);
}

.campaign__copy > p {
  max-width: 420px;
  margin-top: 21px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.85;
}

.campaign__swatches {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 25px;
}

.campaign__swatches > span {
  width: 23px;
  height: 23px;
  border: 2px solid var(--cream-soft);
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--line);
}

.campaign__swatches small {
  margin-left: 5px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.06em;
}

.campaign__buy {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin-top: 28px;
  padding-top: 23px;
  border-top: 1px solid var(--line-soft);
}

.campaign__buy > div {
  display: flex;
  align-items: baseline;
  gap: 9px;
}

.campaign__buy strong {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1;
}

.campaign__buy s {
  color: var(--ink-faint);
  font-size: 8px;
}

.campaign__link {
  align-self: flex-start;
  margin-top: 20px;
}

/* Testimonials */
.testimonials {
  padding-block: clamp(72px, 8vw, 118px);
  background:
    radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.08), transparent 30%),
    var(--sage-deep);
  color: var(--cream);
}

.testimonials__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: clamp(34px, 4vw, 54px);
}

.testimonials__head h2 {
  margin-top: 16px;
  color: var(--cream);
}

.testimonials__head h2 em {
  color: var(--rose-light);
}

.testimonials__summary {
  display: flex;
  align-items: center;
  gap: 13px;
  padding-bottom: 8px;
}

.testimonials__summary > strong {
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 3.2rem;
  font-weight: 400;
  line-height: 0.8;
}

.testimonials__stars {
  display: flex;
  gap: 2px;
  color: var(--rose-light);
}

.testimonials__summary p {
  margin-top: 5px;
  color: rgba(247, 242, 233, 0.96);
  font-size: 8px;
  letter-spacing: 0.04em;
}

.testimonials .eyebrow--light {
  color: rgba(247, 242, 233, 0.94);
}

.testimonials__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.quote-card {
  display: flex;
  min-height: 280px;
  flex-direction: column;
  padding: 26px;
  border-radius: 9px;
  background: var(--cream-soft);
  color: var(--ink);
  box-shadow: 0 24px 50px -40px rgba(20, 27, 18, 0.5);
}

.quote-card__stars {
  display: flex;
  gap: 2px;
  color: var(--rose-deep);
}

.quote-card blockquote {
  margin-top: 21px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 1.7vw, 1.6rem);
  font-weight: 400;
  line-height: 1.35;
}

.quote-card figcaption {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 25px;
}

.quote-card__avatar {
  display: grid;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: var(--sage-wash);
  color: var(--sage-deep);
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 500;
}

.quote-card figcaption > span:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.quote-card figcaption strong {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

.quote-card figcaption small {
  color: var(--ink-faint);
  font-size: 7.5px;
  letter-spacing: 0.03em;
}

.quote-card figcaption > :deep(svg) {
  margin-left: auto;
  color: var(--sand-deep);
}

/* Glow Club */
.glow-club {
  background:
    radial-gradient(circle at 10% 75%, rgba(191, 141, 118, 0.18), transparent 30%),
    var(--sage-wash);
}

.glow-club__grid {
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 1.08fr) minmax(380px, 0.92fr);
  gap: clamp(44px, 7vw, 100px);
}

.glow-club__copy h2 {
  margin-top: 15px;
}

.glow-club__copy h2 em {
  color: var(--sage-deep);
}

.glow-club__lede {
  max-width: 470px;
  margin-top: 21px;
  color: var(--ink-soft);
  font-size: 12.5px;
  line-height: 1.85;
}

.perks {
  display: grid;
  gap: 14px;
  margin-block: 28px;
}

.perk {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 13px;
}

.perk :deep(svg) {
  color: var(--rose-deep);
}

.perk h3 {
  font-size: 1.3rem;
  line-height: 1.1;
}

.perk p {
  margin-top: 3px;
  color: var(--ink-soft);
  font-size: 10px;
  line-height: 1.6;
}

.glow-club__visual {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 470px;
  flex-direction: column;
  align-items: flex-end;
  justify-self: end;
}

.member-card {
  position: relative;
  width: 100%;
  min-height: 312px;
  overflow: hidden;
  padding: 32px;
  border-radius: 13px;
  background:
    radial-gradient(circle at 88% 10%, rgba(229, 200, 184, 0.16), transparent 34%),
    var(--sage-dark);
  color: var(--cream);
  box-shadow: 0 30px 60px -36px rgba(31, 39, 27, 0.65);
}

.member-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.member-card__top :deep(.brand-logo) {
  --logo-size: 1.4rem;
}

.member-card__top > span {
  color: rgba(247, 242, 233, 0.94);
  font-size: 7px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.member-card__name {
  margin-top: 29px;
  color: rgba(247, 242, 233, 0.96);
  font-family: var(--font-display);
  font-size: 1.55rem;
  line-height: 1.1;
}

.member-card__name em {
  color: var(--rose-light);
}

.member-card__points {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 20px;
}

.member-card__points strong {
  font-family: var(--font-display);
  font-size: 4.6rem;
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 0.72;
}

.member-card__points span {
  color: rgba(247, 242, 233, 0.94);
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.member-card__progress {
  height: 3px;
  margin-top: 25px;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(247, 242, 233, 0.15);
}

.member-card__progress span {
  display: block;
  width: 80%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--rose-light), var(--cream));
}

.member-card__next {
  margin-top: 9px;
  color: rgba(247, 242, 233, 0.94);
  font-size: 7.5px;
  line-height: 1.5;
}

.member-card__bottom {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 31px;
  padding-top: 15px;
  border-top: 1px solid var(--line-light);
  color: rgba(247, 242, 233, 0.94);
  font-size: 6.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.member-card__sun {
  position: absolute;
  right: -45px;
  bottom: -58px;
  color: var(--rose-light);
  opacity: 0.12;
}

.reward-card {
  position: relative;
  z-index: 2;
  display: flex;
  width: 232px;
  flex-direction: column;
  gap: 2px;
  margin-top: -13px;
  margin-right: -17px;
  padding: 16px 17px;
  border: 1px solid rgba(57, 71, 51, 0.12);
  border-radius: 7px;
  background: var(--cream-soft);
  box-shadow: 0 20px 40px -28px rgba(31, 39, 27, 0.55);
}

.reward-card :deep(svg) {
  margin-bottom: 4px;
  color: var(--rose-deep);
}

.reward-card > span {
  color: var(--ink-faint);
  font-size: 6.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.reward-card strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.12rem;
  font-weight: 500;
  line-height: 1.05;
}

.reward-card small {
  color: var(--ink-faint);
  font-size: 7px;
}

/* Journal */
.journal {
  background: var(--cream);
}

.journal__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2.2vw, 30px);
}

.journal-card__link {
  display: block;
}

.journal-card__image {
  position: relative;
  aspect-ratio: 1.36;
  overflow: hidden;
  border-radius: 7px;
  background: var(--cream-deep);
}

.journal-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 800ms var(--ease-out);
}

.journal-card:hover .journal-card__image img {
  transform: scale(1.04);
}

.journal-card__read {
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 6px 8px;
  border-radius: 3px;
  background: rgba(247, 242, 233, 0.86);
  color: var(--ink-soft);
  font-size: 6.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
}

.journal-card__meta {
  display: flex;
  gap: 7px;
  margin-top: 17px;
  color: var(--ink-faint);
  font-size: 7px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.journal-card__meta span:first-child {
  color: var(--sage-deep);
}

.journal-card h3 {
  margin-top: 8px;
  font-size: clamp(1.45rem, 1.9vw, 1.8rem);
  line-height: 1.08;
  transition: color 200ms ease;
}

.journal-card:hover h3 {
  color: var(--sage-deep);
}

.journal-card p {
  margin-top: 8px;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.7;
}

.journal-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 15px;
  padding-bottom: 3px;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  transition: gap 200ms ease;
}

.journal-card:hover .journal-card__cta {
  gap: 12px;
}

/* Gallery */
.gallery {
  padding-block: 0 clamp(76px, 9vw, 120px);
  background: var(--cream);
}

.gallery__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: clamp(30px, 4vw, 48px);
}

.gallery__head h2 {
  margin-top: 14px;
}

.gallery__head h2 em {
  color: var(--sage);
}

.gallery__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}

.gallery-tile {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 6px;
  background: var(--cream-deep);
}

.gallery-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 850ms var(--ease-out);
}

.gallery-tile:hover img {
  transform: scale(1.055);
}

.gallery-tile__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(180deg, transparent 55%, rgba(34, 42, 29, 0.52));
  color: var(--cream);
  font-size: 8px;
  letter-spacing: 0.08em;
  opacity: 0;
  transition: opacity 280ms ease;
}

.gallery-tile__overlay span {
  transform: translateY(6px);
  transition: transform 300ms var(--ease-out);
}

.gallery-tile__overlay :deep(svg) {
  transform: translateY(6px);
  transition: transform 300ms var(--ease-out);
}

.gallery-tile:hover .gallery-tile__overlay,
.gallery-tile:focus-visible .gallery-tile__overlay {
  opacity: 1;
}

.gallery-tile:hover .gallery-tile__overlay span,
.gallery-tile:hover .gallery-tile__overlay :deep(svg) {
  transform: translateY(0);
}

/* Newsletter */
.newsletter {
  position: relative;
  overflow: hidden;
  padding-block: clamp(74px, 9vw, 124px);
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 253, 248, 0.55), transparent 42%),
    var(--sand);
}

.newsletter__word {
  position: absolute;
  top: 50%;
  left: 50%;
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(12rem, 34vw, 34rem);
  font-weight: 400;
  letter-spacing: 0.03em;
  line-height: 0.7;
  opacity: 0.26;
  transform: translate(-50%, -50%);
  -webkit-text-stroke: 1px rgba(83, 97, 72, 0.13);
  pointer-events: none;
}

.newsletter__sun {
  position: absolute;
  top: 12%;
  right: 8%;
  color: var(--rose-deep);
  opacity: 0.3;
}

.newsletter__inner {
  position: relative;
  z-index: 1;
  max-width: 650px;
  text-align: center;
}

.newsletter__inner .eyebrow {
  justify-content: center;
}

.newsletter__inner h2 {
  margin-top: 13px;
  font-size: clamp(3.7rem, 6.8vw, 6.2rem);
}

.newsletter__inner h2 em {
  color: var(--sage-deep);
}

.newsletter__lede {
  max-width: 430px;
  margin: 18px auto 0;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.8;
}

.newsletter__form {
  display: flex;
  max-width: 510px;
  align-items: center;
  gap: 5px;
  margin: 28px auto 0;
  padding: 5px;
  border: 1px solid rgba(57, 71, 51, 0.18);
  border-radius: 7px;
  background: rgba(255, 253, 248, 0.8);
  box-shadow: 0 18px 40px -34px rgba(47, 55, 44, 0.45);
}

.newsletter__form input {
  width: 100%;
  min-height: 46px;
  padding: 0 13px;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 10.5px;
}

.newsletter__form input::placeholder {
  color: var(--ink-faint);
  opacity: 0.8;
}

.newsletter__form input[aria-invalid='true'] {
  color: #924c3b;
}

.newsletter__form .btn {
  flex-shrink: 0;
  min-height: 46px;
}

.newsletter__message {
  max-width: 450px;
  margin: 12px auto 0;
  font-size: 9.5px;
  line-height: 1.6;
}

.newsletter__message.is-error {
  color: #8e4a39;
}

.newsletter__message.is-success {
  color: var(--sage-deep);
}

.newsletter__fineprint {
  margin-top: 15px;
  color: var(--ink-faint);
  font-size: 7.5px;
  letter-spacing: 0.02em;
  line-height: 1.7;
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

/* Responsive */
@media (max-width: 1180px) {
  .hero__inner {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }

  .hero-loyalty {
    display: none;
  }

  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hero__side-label {
    display: none;
  }
}

@media (max-width: 980px) {
  .hero {
    padding-block: 48px 64px;
  }

  .hero__inner {
    grid-template-columns: 1fr;
    gap: 52px;
  }

  .hero__copy {
    max-width: 680px;
  }

  .hero__title {
    font-size: clamp(5rem, 14vw, 8.5rem);
  }

  .hero__visual {
    width: min(100%, 640px);
    min-height: 620px;
    margin-inline: auto;
  }

  .hero__figure {
    width: 78%;
    right: 6%;
  }

  .hero-product {
    left: 3%;
  }

  .hero-loyalty {
    display: block;
    top: 12%;
    left: 0;
  }

  .ritual__grid,
  .studio__grid {
    grid-template-columns: 1fr;
    gap: 52px;
  }

  .ritual__media {
    width: min(100%, 520px);
    margin-inline: auto;
  }

  .ritual__seal {
    right: 12px;
  }

  .ritual__copy {
    max-width: 720px;
  }

  .studio__media {
    width: min(100%, 540px);
  }

  .studio__media > img {
    aspect-ratio: 4 / 3.2;
  }

  .campaign__inner {
    grid-template-columns: 1fr;
  }

  .campaign__visual {
    min-height: 440px;
  }

  .campaign__visual :deep(.product-visual) {
    width: min(58%, 380px);
    right: 6%;
  }

  .campaign__copy {
    min-height: 440px;
  }

  .testimonials__grid {
    grid-template-columns: 1fr 1fr;
  }

  .quote-card:last-child {
    grid-column: 1 / -1;
    min-height: 220px;
  }

  .glow-club__grid {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .glow-club__visual {
    width: min(100%, 480px);
    justify-self: start;
  }

  .journal__grid {
    grid-template-columns: 1fr 1fr;
  }

  .journal-card:last-child {
    grid-column: 1 / -1;
    max-width: calc(50% - 15px);
  }

  .gallery__grid {
    grid-template-columns: 1fr 1fr;
  }
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

  .hero {
    padding-top: 38px;
  }

  .hero__title {
    font-size: clamp(4.5rem, 19vw, 7.4rem);
  }

  .hero__title em {
    margin-left: 4vw;
  }

  .hero__lede {
    font-size: 12px;
  }

  .hero__proof {
    flex-wrap: wrap;
    gap: 15px;
  }

  .hero__promise {
    margin-left: 0;
  }

  .hero__visual {
    min-height: 540px;
  }

  .hero__figure {
    width: 84%;
    right: 0;
  }

  .hero-product {
    bottom: 0;
    left: 0;
    width: min(280px, 70%);
  }

  .hero-loyalty {
    top: 4%;
    left: 0;
  }

  .values__inner {
    grid-template-columns: 1fr 1fr;
  }

  .values__inner > span {
    min-height: 52px;
    padding-inline: 8px;
    font-size: 7.5px;
  }

  .values__inner > span:nth-child(3) {
    border-left: 0;
    border-top: 1px solid var(--line-soft);
  }

  .values__inner > span:nth-child(4) {
    border-top: 1px solid var(--line-soft);
  }

  .section-head {
    display: block;
  }

  .shop__toolbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .shop__filters {
    flex-wrap: nowrap;
    width: calc(100% + var(--gutter));
    margin-right: calc(-1 * var(--gutter));
    padding-right: var(--gutter);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .shop__filters::-webkit-scrollbar {
    display: none;
  }

  .shop__filters button {
    flex-shrink: 0;
  }

  .product-grid {
    grid-template-columns: 1fr 1fr;
  }

  .shop__footer {
    align-items: flex-start;
    flex-direction: column;
    gap: 6px;
  }

  .shop__footer-note {
    text-align: left;
  }

  .ritual__grid {
    gap: 43px;
  }

  .ritual__stats {
    gap: 14px;
  }

  .ritual__bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .studio__actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .campaign__copy {
    min-height: 0;
  }

  .campaign__visual {
    min-height: 370px;
  }

  .testimonials__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 24px;
  }

  .testimonials__grid {
    grid-template-columns: 1fr;
  }

  .quote-card,
  .quote-card:last-child {
    grid-column: auto;
    min-height: 0;
  }

  .glow-club__visual {
    width: 100%;
    max-width: none;
    align-items: stretch;
  }

  .member-card {
    padding: 25px;
  }

  .reward-card {
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    width: min(280px, 100%);
    align-self: flex-end;
    margin-top: -8px;
    margin-right: 0;
  }

  .journal__grid {
    grid-template-columns: 1fr;
  }

  .journal-card:last-child {
    grid-column: auto;
    max-width: none;
  }

  .gallery__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }

  .newsletter__form {
    flex-direction: column;
    align-items: stretch;
    padding: 7px;
  }

  .newsletter__form input {
    min-height: 43px;
    text-align: center;
  }

  .newsletter__form .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero {
    padding-top: 28px;
    padding-bottom: 54px;
  }

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

  .hero__title {
    margin-top: 18px;
    font-size: clamp(4rem, 20vw, 6rem);
  }

  .hero__lede {
    margin-top: 22px;
  }

  .hero__actions {
    margin-top: 22px;
  }

  .hero__proof {
    margin-top: 30px;
    padding-top: 18px;
  }

  .hero__visual {
    min-height: 475px;
  }

  .hero__figure {
    width: 88%;
    height: 90%;
  }

  .hero-product {
    width: 76%;
    grid-template-columns: 62px 1fr 24px;
    gap: 10px;
  }

  .hero-product img {
    width: 62px;
    height: 70px;
  }

  .hero-loyalty {
    width: 174px;
    padding: 12px 14px;
  }

  .hero-loyalty strong {
    font-size: 1.7rem;
  }

  .hero__proof {
    align-items: flex-start;
  }

  .hero__french {
    margin-top: 12px;
    font-size: 1rem;
  }

  .ritual__seal {
    width: 88px;
    height: 88px;
  }

  .campaign__visual {
    min-height: 330px;
  }

  .campaign__visual :deep(.product-visual) {
    width: 74%;
    bottom: -10%;
  }

  .campaign__copy h2 {
    font-size: 3.8rem;
  }

  .member-card__points strong {
    font-size: 3.8rem;
  }

  .reward-card {
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    width: 100%;
    align-self: stretch;
    margin-top: 10px;
    margin-right: 0;
  }

  .glow-club__visual {
    align-items: stretch;
  }

  .gallery__grid {
    gap: 5px;
  }

  .gallery-tile__overlay {
    padding: 10px;
    font-size: 7px;
  }

  .toast {
    bottom: 16px;
    font-size: 9px;
  }
}
</style>

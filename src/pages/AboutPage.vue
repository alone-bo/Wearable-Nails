<script setup>
import { RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import SunMark from '../components/SunMark.vue'
import { useShop } from '../stores/shop.js'

const { openBooking } = useShop()

const values = [
  {
    title: 'Considered by nature',
    text: '10-free, vegan formulas and botanical oils chosen for what they do, not what they promise.',
  },
  {
    title: 'Made by hand',
    text: 'Every set is shaped, checked and packed by a small team in our Casablanca atelier.',
  },
  {
    title: 'Made to be worn again',
    text: 'Reusable tips, refillable care and a wardrobe of colour designed to outlast a trend.',
  },
]

const timeline = [
  { year: '2024', title: 'A small table in Casa', text: 'The first YOUGLOW set is made and gifted to friends.' },
  { year: '2025', title: 'The Corniche studio', text: 'A quiet room opens for fittings, hand rituals and slow appointments.' },
  { year: '2026', title: 'The Olive Hour', text: 'Our first limited colour story, hand-finished in a run of 200.' },
]
</script>

<template>
  <div class="about-page">
    <section class="about-hero">
      <span class="about-hero__watermark" aria-hidden="true">MADE SLOWLY</span>
      <div class="container about-hero__grid">
        <div class="about-hero__copy">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <RouterLink to="/">Home</RouterLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">About</span>
          </nav>
          <span class="eyebrow">Our story · Casablanca</span>
          <h1>Made slowly.<br /><em>Worn quietly.</em></h1>
          <p>
            YOUGLOW is a nail atelier and small-batch press-on studio on the Casablanca
            Corniche. We make considered colour for hands that are busy living.
          </p>
          <div class="about-hero__actions">
            <RouterLink to="/shop" class="btn btn--primary">
              Shop the collection
              <Icon name="arrowRight" :size="16" />
            </RouterLink>
            <button type="button" class="btn btn--outline" @click="openBooking()">Visit the studio</button>
          </div>
          <div class="about-hero__stats">
            <span><strong>2024</strong>Founded in Casa</span>
            <span><strong>20</strong>Days of wear</span>
            <span><strong>1,200+</strong>Hands, and counting</span>
          </div>
        </div>

        <figure class="about-hero__media">
          <img
            src="/images/hero-detail.webp"
            width="900"
            height="900"
            alt="Soft lilac and pearl press-on nails resting on a cream knit"
            fetchpriority="high"
          />
          <figcaption><span>01</span> The everyday set, in soft lilac and pearl.</figcaption>
        </figure>
      </div>
    </section>

    <section class="about-story section">
      <div class="container about-story__grid">
        <div class="about-story__copy" v-reveal>
          <span class="eyebrow">The beginning</span>
          <h2>A small table,<br /><em>a quiet idea.</em></h2>
          <p>
            YOUGLOW began with a simple frustration: beautiful nails were either too time-consuming
            for a normal week, or too fragile to feel worth it. We wanted the ritual without the
            compromise — a set that looked like it had been done in a salon, but could be worn,
            removed and worn again.
          </p>
          <p>
            The first sets were made at a small table in Casablanca, packed in linen pouches and
            hand-delivered to friends. The idea stayed the same as the table grew into a studio:
            considered colour, a close fit, and the kind of care you can feel.
          </p>
          <p class="about-story__signature">— The YOUGLOW atelier</p>
        </div>

        <figure class="about-story__media" v-reveal="{ delay: 100 }">
          <img
            src="/images/hand-ritual.webp"
            width="1100"
            height="760"
            alt="Hands being cared for with a rich cream and dried botanicals"
            loading="lazy"
          />
          <figcaption>
            <span>02</span>
            The hand ritual — slow care, warm hands.
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="about-values section" aria-labelledby="values-title">
      <div class="container">
        <div class="about-values__head" v-reveal>
          <div>
            <span class="eyebrow">What we believe</span>
            <h2 id="values-title">Beauty that respects<br /><em>the everyday.</em></h2>
          </div>
          <p>
            We do not believe in saving your best hands for a special occasion. We believe in
            small rituals that make an ordinary Tuesday feel a little more considered.
          </p>
        </div>

        <div class="about-values__grid">
          <article v-for="(value, index) in values" :key="value.title" v-reveal="{ delay: index * 70 }">
            <span class="about-values__number">0{{ index + 1 }}</span>
            <SunMark :size="30" />
            <h3>{{ value.title }}</h3>
            <p>{{ value.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="about-atelier">
      <div class="container about-atelier__grid">
        <figure v-reveal>
          <img
            src="/images/studio.webp"
            width="1000"
            height="1175"
            alt="The warm treatment room at the YOUGLOW atelier in Casablanca"
            loading="lazy"
          />
          <figcaption>
            <SunMark :size="22" />
            The treatment room · 127 Boulevard de la Corniche
          </figcaption>
        </figure>

        <div class="about-atelier__copy" v-reveal="{ delay: 100 }">
          <span class="eyebrow eyebrow--light">Inside the atelier</span>
          <h2>A room that asks<br />you to <em>slow down.</em></h2>
          <p>
            Step off the Corniche and leave the hurry outside. Our studio is built around warm
            plaster, olive branches and the quiet luxury of having nowhere else to be.
          </p>
          <p>
            Come for a signature manicure, a hand ritual or a press-on fitting. Tea arrives without
            asking, the music stays low, and your technician has time to get the details right.
          </p>

          <div class="about-atelier__details">
            <div>
              <span>Open daily</span>
              <strong>10:00 — 20:00</strong>
            </div>
            <div>
              <span>Find us</span>
              <strong>Boulevard de la Corniche</strong>
            </div>
          </div>

          <button type="button" class="btn btn--cream" @click="openBooking()">
            Reserve your visit
            <Icon name="calendar" :size="16" />
          </button>
        </div>
      </div>
    </section>

    <section class="about-timeline section" aria-labelledby="timeline-title">
      <div class="container">
        <div class="about-timeline__head" v-reveal>
          <span class="eyebrow">The chapters so far</span>
          <h2 id="timeline-title">Growing,<br /><em>gently.</em></h2>
        </div>

        <div class="about-timeline__list">
          <article v-for="item in timeline" :key="item.year" v-reveal>
            <span class="about-timeline__year">{{ item.year }}</span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </div>
            <SunMark :size="24" />
          </article>
        </div>

        <div class="about-timeline__note">
          <p>There is more to come — slowly, and in good company.</p>
          <RouterLink to="/journal" class="text-link">
            Read the journal
            <Icon name="arrowRight" :size="14" />
          </RouterLink>
        </div>
      </div>
    </section>

    <PageCta
      eyebrow="Come say hello"
      text="The studio is open daily on the Corniche. Book a quiet hour, or browse the collection from wherever you are."
    >
      <template #title>Good light.<br /><em>Good hands.</em></template>
      <button type="button" class="btn btn--cream" @click="openBooking()">
        Book a visit
        <Icon name="calendar" :size="15" />
      </button>
      <RouterLink to="/contact" class="btn btn--ghost-light">
        Contact us
        <Icon name="arrowUpRight" :size="15" />
      </RouterLink>
    </PageCta>
  </div>
</template>

<style scoped>
.about-page {
  background: var(--cream);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  color: var(--ink-faint);
  font-size: 8.5px;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
}

.breadcrumb a {
  transition: color 200ms ease;
}

.breadcrumb a:hover {
  color: var(--ink);
}

.breadcrumb > span[aria-current] {
  color: var(--ink);
}

.about-hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(30px, 3.8vw, 52px) clamp(36px, 4.4vw, 64px);
  background:
    radial-gradient(circle at 90% 10%, rgba(229, 200, 184, 0.22), transparent 30%),
    var(--cream);
}

.about-hero__watermark {
  position: absolute;
  bottom: -3vw;
  left: -1vw;
  color: transparent;
  font-family: var(--font-display);
  font-size: clamp(6rem, 15vw, 15rem);
  letter-spacing: 0.01em;
  line-height: 0.7;
  opacity: 0.42;
  pointer-events: none;
  -webkit-text-stroke: 1px rgba(83, 97, 72, 0.1);
}

.about-hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  align-items: center;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: clamp(38px, 7vw, 100px);
}

.about-hero h1 {
  max-width: 760px;
  margin-top: 18px;
  font-size: clamp(4.2rem, 7.4vw, 7.5rem);
  font-weight: 300;
  line-height: 0.84;
}

.about-hero h1 em {
  color: var(--sage);
}

.about-hero__copy > p {
  max-width: 480px;
  margin-top: 25px;
  color: var(--ink-soft);
  font-size: 13px;
  line-height: 1.9;
}

.about-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 27px;
}

.about-hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  margin-top: 42px;
  padding-top: 21px;
  border-top: 1px solid var(--line-soft);
}

.about-hero__stats span {
  display: flex;
  flex-direction: column;
  color: var(--ink-faint);
  font-size: 7.5px;
  letter-spacing: 0.08em;
  line-height: 1.5;
  text-transform: uppercase;
}

.about-hero__stats strong {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1;
  text-transform: none;
}

.about-hero__media {
  position: relative;
  max-width: 480px;
  justify-self: end;
}

.about-hero__media::before {
  position: absolute;
  inset: -14px 14px 14px -14px;
  border: 1px solid var(--line);
  border-radius: 200px 200px 8px 8px;
  content: '';
  pointer-events: none;
}

.about-hero__media img {
  width: 100%;
  height: auto;
  max-height: clamp(380px, 56vh, 600px);
  aspect-ratio: 4 / 4.7;
  border-radius: 200px 200px 8px 8px;
  object-fit: cover;
  object-position: center;
}

.about-hero__media figcaption {
  display: flex;
  gap: 8px;
  margin-top: 13px;
  color: var(--ink-faint);
  font-size: 7.5px;
  letter-spacing: 0.04em;
}

.about-hero__media figcaption span {
  color: var(--rose-deep);
}

.about-story {
  border-top: 1px solid var(--line-soft);
  background: var(--cream-soft);
  padding-block: clamp(62px, 7vw, 96px);
}

.about-story__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(44px, 8vw, 120px);
  align-items: center;
}

.about-story__copy h2 {
  margin-top: 15px;
  font-size: clamp(2.9rem, 4.5vw, 4.3rem);
}

.about-story__copy h2 em {
  color: var(--sage-deep);
}

.about-story__copy p {
  max-width: 510px;
  margin-top: 19px;
  color: var(--ink-soft);
  font-size: 12px;
  line-height: 1.9;
}

.about-story__signature {
  color: var(--rose-deep) !important;
  font-family: var(--font-display);
  font-size: 1.4rem !important;
  font-style: italic;
}

.about-story__media {
  position: relative;
}

.about-story__media img {
  width: 100%;
  height: auto;
  max-height: clamp(380px, 58vh, 620px);
  aspect-ratio: 4 / 4.8;
  border-radius: 240px 240px 7px 7px;
  object-fit: cover;
  object-position: center;
}

.about-story__media figcaption {
  display: flex;
  gap: 8px;
  margin-top: 13px;
  color: var(--ink-faint);
  font-size: 7.5px;
  letter-spacing: 0.04em;
}

.about-story__media figcaption span {
  color: var(--rose-deep);
}

.about-values {
  background: var(--cream-deep);
}

.about-values__head {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(24px, 6vw, 100px);
  align-items: end;
  margin-bottom: 43px;
}

.about-values__head h2 {
  margin-top: 13px;
  font-size: clamp(2.9rem, 4.5vw, 4.3rem);
}

.about-values__head h2 em {
  color: var(--sage-deep);
}

.about-values__head p {
  max-width: 390px;
  padding-bottom: 6px;
  color: var(--ink-soft);
  font-size: 11.5px;
  line-height: 1.8;
}

.about-values__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.about-values__grid article {
  display: flex;
  min-height: 230px;
  flex-direction: column;
  padding: 24px;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  background: var(--cream-soft);
}

.about-values__number {
  align-self: flex-end;
  color: var(--rose-deep);
  font-size: 8px;
  letter-spacing: 0.08em;
}

.about-values__grid article :deep(svg) {
  margin-top: 26px;
  color: var(--rose-deep);
}

.about-values__grid h3 {
  margin-top: 19px;
  font-size: 1.6rem;
  line-height: 1.08;
}

.about-values__grid p {
  margin-top: 7px;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.75;
}

.about-atelier {
  padding-block: clamp(60px, 6.5vw, 92px);
  background:
    radial-gradient(circle at 92% 4%, rgba(191, 141, 118, 0.12), transparent 30%),
    var(--sage-deep);
  color: var(--cream);
}

.about-atelier__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(44px, 8vw, 110px);
  align-items: center;
}

.about-atelier figure {
  position: relative;
  max-width: 470px;
}

.about-atelier figure img {
  width: 100%;
  height: auto;
  max-height: clamp(380px, 60vh, 620px);
  aspect-ratio: 4 / 4.7;
  border-radius: 7px;
  object-fit: cover;
  filter: saturate(0.86) contrast(1.02) brightness(1.04);
}

.about-atelier figcaption {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 13px;
  color: rgba(247, 242, 233, 0.94);
  font-size: 7.5px;
  letter-spacing: 0.04em;
}

.about-atelier figcaption :deep(svg) {
  color: var(--rose-light);
}

.about-atelier__copy h2 {
  margin-top: 15px;
  color: var(--cream);
  font-size: clamp(2.9rem, 4.5vw, 4.3rem);
}

.about-atelier__copy h2 em {
  color: var(--rose-light);
}

.about-atelier__copy > p {
  max-width: 480px;
  margin-top: 19px;
  color: rgba(247, 242, 233, 0.96);
  font-size: 12px;
  line-height: 1.9;
}

.about-atelier__details {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  margin-top: 27px;
  padding-top: 20px;
  border-top: 1px solid var(--line-light);
}

.about-atelier__details div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.about-atelier__details span {
  color: rgba(247, 242, 233, 0.94);
  font-size: 7px;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.about-atelier__details strong {
  color: var(--cream);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
}

.about-atelier__copy .btn {
  margin-top: 27px;
}

.about-timeline__head {
  display: block;
  margin-bottom: 33px;
}

.about-timeline__head h2 {
  margin-top: 13px;
  font-size: clamp(2.9rem, 4.5vw, 4.3rem);
}

.about-timeline__head h2 em {
  color: var(--sage-deep);
}

.about-timeline__list {
  border-top: 1px solid var(--line);
}

.about-timeline__list article {
  display: grid;
  grid-template-columns: 100px 1fr 28px;
  align-items: center;
  gap: 20px;
  padding-block: 22px;
  border-bottom: 1px solid var(--line);
}

.about-timeline__year {
  color: var(--rose-deep);
  font-family: var(--font-display);
  font-size: 1.65rem;
  line-height: 1;
}

.about-timeline__list h3 {
  font-size: 1.55rem;
}

.about-timeline__list p {
  margin-top: 4px;
  color: var(--ink-soft);
  font-size: 10.5px;
  line-height: 1.65;
}

.about-timeline__list :deep(svg) {
  color: var(--rose);
}

.about-timeline__note {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 25px;
}

.about-timeline__note p {
  color: var(--ink-faint);
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-style: italic;
}

@media (max-width: 980px) {
  .about-hero__grid,
  .about-story__grid,
  .about-atelier__grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .about-hero__media {
    width: min(100%, 470px);
    max-width: none;
    justify-self: start;
  }

  .about-hero__media img {
    max-height: 420px;
  }

  .about-story__media {
    width: min(100%, 470px);
  }

  .about-story__media img {
    max-height: 440px;
  }

  .about-values__head {
    display: block;
  }

  .about-values__head p {
    margin-top: 18px;
  }

  .about-atelier figure {
    width: min(100%, 460px);
  }

  .about-atelier figure img {
    max-height: 440px;
  }
}

@media (max-width: 760px) {
  .about-values__grid {
    grid-template-columns: 1fr;
  }

  .about-values__grid article {
    min-height: 210px;
  }

  .about-timeline__list article {
    grid-template-columns: 58px 1fr;
    gap: 14px;
  }

  .about-timeline__list :deep(svg) {
    display: none;
  }

  .about-timeline__note {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 500px) {
  .about-hero__stats {
    gap: 16px;
  }

  .about-hero__stats strong {
    font-size: 1.3rem;
  }

  .about-timeline__list article {
    grid-template-columns: 1fr;
  }

  .about-timeline__year {
    font-size: 1.3rem;
  }
}
</style>

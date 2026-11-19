<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import PageCta from '../components/PageCta.vue'
import PageHero from '../components/PageHero.vue'
import SunMark from '../components/SunMark.vue'
import { useShop } from '../stores/shop.js'

const { openBooking } = useShop()

const query = ref('')
const activeGroup = ref('all')

const faqGroups = [
  {
    id: 'orders',
    label: 'Orders & delivery',
    eyebrow: '01',
    items: [
      {
        q: 'When will my order arrive?',
        a: 'Orders leave our Casablanca atelier within one to two working days. Delivery across Morocco usually takes two to five working days. Once your order is on its way, you will receive a tracking link by email.',
      },
      {
        q: 'How much is delivery?',
        a: 'Delivery is complimentary on orders over 350 MAD. Below that, standard delivery is 35 MAD anywhere in Morocco. We currently do not ship internationally through the website — for international requests, please contact the atelier directly.',
      },
      {
        q: 'Can I change my delivery address after ordering?',
        a: 'If your order has not yet been packed, we can usually update the address. Email hello@youglow.ma with your order number as soon as possible. Once a parcel is in transit, the address cannot be changed.',
      },
      {
        q: 'Do you offer gift wrapping?',
        a: 'Yes. Every order is hand-wrapped in our signature linen paper and sealed with a sun sticker, at no extra cost. If you would like a handwritten note included, add your message at checkout.',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products & wear',
    eyebrow: '02',
    items: [
      {
        q: 'How long do the press-on sets last?',
        a: 'With careful preparation and application, a set can be worn for up to 20 days in total. Most people wear one application for seven to ten days, then clean, store and re-wear the tips.',
      },
      {
        q: 'How do I choose the right size?',
        a: 'Every set includes 24 tips across ten sizes. Match each tip to the widest part of your natural nail before applying. If a tip sits between sizes, choose the smaller size and gently file the sides — never force a wider tip onto a narrower nail.',
      },
      {
        q: 'Are the products vegan and cruelty-free?',
        a: 'Yes. Our formulas are 10-free, vegan and never tested on animals. The adhesive is designed for gentle, temporary wear. If you have sensitive skin or a known acrylate allergy, please patch test first and contact us with any questions.',
      },
      {
        q: 'Can I reuse the tips?',
        a: 'Absolutely. Remove the adhesive residue gently with the enclosed prep pad, store the tips in the keepsake pouch and re-apply with fresh adhesive. On average, a set can be worn two to three times depending on care.',
      },
      {
        q: 'Do you sell the adhesive separately?',
        a: 'Not yet — each set includes a tube of our gentle adhesive and a prep pad. If you run out before your next set, email us and we will help you find a suitable refill.',
      },
    ],
  },
  {
    id: 'studio',
    label: 'Studio & appointments',
    eyebrow: '03',
    items: [
      {
        q: 'Where is the studio?',
        a: 'The atelier is at 127 Boulevard de la Corniche, Casablanca 20000. We are open Monday to Sunday, 10:00–20:00. The entrance is on the street side, just along from the Corniche walk.',
      },
      {
        q: 'How do I book an appointment?',
        a: 'Use any “Book a visit” button on this site, or contact us on WhatsApp. Choose a ritual, a date and a time; our team will confirm by email within one working day. No prepayment is required.',
      },
      {
        q: 'What should I bring to my appointment?',
        a: 'Just yourself. You are welcome to bring inspiration, a preferred colour or a set you already own. If you are coming for a press-on fitting, we will size your nails and prepare them in the studio.',
      },
      {
        q: 'Can I cancel or reschedule?',
        a: 'Yes — life happens. Please let us know at least 24 hours before your appointment so we can offer the time to someone else. There is no cancellation fee for studio rituals.',
      },
    ],
  },
  {
    id: 'returns',
    label: 'Returns & care',
    eyebrow: '04',
    items: [
      {
        q: 'What is your returns policy?',
        a: 'Unopened and unused sets can be returned within 14 days of delivery. For hygiene reasons, opened press-on sets and used care products cannot be returned unless they arrived damaged or faulty.',
      },
      {
        q: 'My order arrived damaged. What now?',
        a: 'We are so sorry. Email hello@youglow.ma within 48 hours with a photo of the parcel and the damaged piece. We will replace it or refund you, and we will take up the issue with our delivery partner.',
      },
      {
        q: 'How should I store my set between wears?',
        a: 'Keep the tips in the keepsake pouch, away from direct sunlight and heat. Clean away any adhesive residue before storing, and avoid leaving them loose in a handbag where they can scratch.',
      },
    ],
  },
  {
    id: 'glow-club',
    label: 'The Glow Club',
    eyebrow: '05',
    items: [
      {
        q: 'How does the Glow Club work?',
        a: 'You earn one point for every 10 MAD spent, online or in the studio. Points unlock rewards at 100, 200 and 300 points, including complimentary add-ons and 20% off a studio ritual.',
      },
      {
        q: 'Do my points expire?',
        a: 'Points remain valid for 12 months from the date they are earned. We will always remind you before they expire — no surprise disappearances.',
      },
      {
        q: 'Can I combine rewards with a promotion?',
        a: 'One reward can be used per order. Rewards can be combined with complimentary delivery, but not with another discount code. If you are unsure, contact the atelier and we will help.',
      },
    ],
  },
]

const totalQuestions = faqGroups.reduce((total, group) => total + group.items.length, 0)

const filteredGroups = computed(() => {
  const search = query.value.trim().toLowerCase()
  return faqGroups
    .filter((group) => activeGroup.value === 'all' || group.id === activeGroup.value)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!search) return true
        return `${item.q} ${item.a}`.toLowerCase().includes(search)
      }),
    }))
    .filter((group) => group.items.length)
})

const resultCount = computed(() => filteredGroups.value.reduce((total, group) => total + group.items.length, 0))

function countFor(id) {
  if (id === 'all') return totalQuestions
  return faqGroups.find((group) => group.id === id)?.items.length || 0
}
</script>

<template>
  <div class="faq-page">
    <PageHero
      eyebrow="Support"
      title="Good questions, answered."
      lede="Everything you might want to know about our sets, the studio, delivery and the small print. If your question is not here, we are one message away."
      :crumbs="[{ label: 'FAQ' }]"
      image="/images/hero-detail.webp"
      image-position="50% 48%"
    >
      <template #title>Good questions,<br /><em>answered.</em></template>

      <div class="faq-hero-meta">
        <span><SunMark :size="18" /> {{ totalQuestions }} answers from the atelier</span>
        <RouterLink to="/contact" class="text-link">
          Ask us something else
          <Icon name="arrowUpRight" :size="14" />
        </RouterLink>
      </div>
    </PageHero>

    <section class="faq-main section" aria-labelledby="faq-title">
      <div class="container">
        <h2 id="faq-title" class="sr-only">Frequently asked questions</h2>

        <div class="faq-layout">
          <aside class="faq-aside">
            <div class="faq-search">
              <label class="sr-only" for="faq-search">Search the FAQ</label>
              <Icon name="search" :size="17" />
              <input id="faq-search" v-model="query" type="search" placeholder="Search questions…" />
              <button v-if="query" type="button" aria-label="Clear search" @click="query = ''">
                <Icon name="close" :size="14" />
              </button>
            </div>

            <nav class="faq-nav" aria-label="FAQ categories">
              <button
                type="button"
                :class="{ 'is-active': activeGroup === 'all' }"
                :aria-pressed="activeGroup === 'all'"
                @click="activeGroup = 'all'"
              >
                <span>All questions</span>
                <small>{{ countFor('all') }}</small>
              </button>
              <button
                v-for="group in faqGroups"
                :key="group.id"
                type="button"
                :class="{ 'is-active': activeGroup === group.id }"
                :aria-pressed="activeGroup === group.id"
                @click="activeGroup = group.id"
              >
                <span>{{ group.label }}</span>
                <small>{{ countFor(group.id) }}</small>
              </button>
            </nav>

            <div class="faq-help">
              <SunMark :size="30" />
              <h3>Still wondering?</h3>
              <p>Write to us and a real person in the atelier will reply within one working day.</p>
              <RouterLink to="/contact" class="text-link">
                Contact the atelier
                <Icon name="arrowRight" :size="14" />
              </RouterLink>
            </div>
          </aside>

          <div class="faq-content">
            <div class="faq-content__head">
              <span>{{ resultCount }} {{ resultCount === 1 ? 'answer' : 'answers' }}</span>
              <span v-if="query">for “{{ query }}”</span>
              <span v-else>Curated from the atelier</span>
            </div>

            <div v-for="group in filteredGroups" :key="group.id" class="faq-group">
              <div class="faq-group__head">
                <span class="faq-group__index">{{ group.eyebrow }}</span>
                <h3>{{ group.label }}</h3>
              </div>

              <details
                v-for="(item, itemIndex) in group.items"
                :key="item.q"
                class="faq-item"
                :open="activeGroup === 'all' && !query && group.id === 'orders' && itemIndex === 0"
              >
                <summary>
                  <span>{{ item.q }}</span>
                  <Icon name="plus" :size="16" />
                </summary>
                <div class="faq-answer">
                  <p>{{ item.a }}</p>
                </div>
              </details>
            </div>

            <div v-if="!filteredGroups.length" class="faq-empty">
              <SunMark :size="42" />
              <h3>Nothing matched that search.</h3>
              <p>Try a shorter phrase, or send us a note and we will answer it directly.</p>
              <RouterLink to="/contact" class="btn btn--primary">Ask the atelier</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <PageCta
      eyebrow="A human answer"
      text="Not everything fits neatly into a question. Message the atelier for sizing help, a colour recommendation or a note about your order."
    >
      <template #title>Still curious?<br /><em>Let's talk.</em></template>
      <RouterLink to="/contact" class="btn btn--cream">
        Contact us
        <Icon name="arrowUpRight" :size="15" />
      </RouterLink>
      <button type="button" class="btn btn--ghost-light" @click="openBooking()">
        Book a visit
        <Icon name="calendar" :size="15" />
      </button>
    </PageCta>
  </div>
</template>

<style scoped>
.faq-page {
  background: var(--cream);
}

.faq-hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px 30px;
  margin-top: 30px;
  padding-top: 19px;
  border-top: 1px solid var(--line-soft);
}

.faq-hero-meta > span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.faq-hero-meta > span :deep(svg) {
  color: var(--rose-deep);
}

.faq-main {
  padding-top: clamp(46px, 6vw, 76px);
}

.faq-layout {
  display: grid;
  grid-template-columns: minmax(230px, 0.32fr) minmax(0, 1fr);
  gap: clamp(34px, 6vw, 90px);
  align-items: start;
}

.faq-aside {
  position: sticky;
  top: 106px;
}

.faq-search {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: var(--cream-soft);
  transition: border-color 200ms ease;
}

.faq-search:focus-within {
  border-color: var(--sage);
}

.faq-search > :deep(svg) {
  flex-shrink: 0;
  color: var(--sage-deep);
}

.faq-search input {
  width: 100%;
  min-height: 42px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 10px;
}

.faq-search input::placeholder {
  color: var(--ink-faint);
}

.faq-search > button {
  display: grid;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  color: var(--ink-faint);
}

.faq-search > button:hover {
  background: var(--cream-deep);
  color: var(--ink);
}

.faq-nav {
  display: grid;
  gap: 2px;
  margin-top: 14px;
  border-top: 1px solid var(--line-soft);
}

.faq-nav button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 11px 0;
  border-bottom: 1px solid var(--line-soft);
  color: var(--ink-soft);
  font-size: 9px;
  text-align: left;
  transition:
    color 200ms ease,
    padding 200ms var(--ease-out);
}

.faq-nav button:hover {
  color: var(--ink);
}

.faq-nav button.is-active {
  color: var(--sage-deep);
  font-weight: 500;
}

.faq-nav button.is-active span {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.faq-nav small {
  color: var(--ink-faint);
  font-size: 7.5px;
  font-weight: 400;
}

.faq-help {
  margin-top: 27px;
  padding: 20px;
  border: 1px solid var(--line-soft);
  border-radius: 7px;
  background: var(--sage-wash);
}

.faq-help :deep(svg) {
  color: var(--rose-deep);
}

.faq-help h3 {
  margin-top: 12px;
  font-size: 1.3rem;
}

.faq-help p {
  margin-top: 6px;
  color: var(--ink-soft);
  font-size: 9.5px;
  line-height: 1.65;
}

.faq-help .text-link {
  margin-top: 13px;
}

.faq-content__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 13px;
  border-bottom: 1px solid var(--line);
  color: var(--ink-faint);
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.faq-group {
  margin-top: 33px;
}

.faq-group__head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 7px;
}

.faq-group__index {
  color: var(--rose-deep);
  font-size: 8px;
  letter-spacing: 0.08em;
}

.faq-group__head h3 {
  font-size: 1.55rem;
}

.faq-item {
  border-bottom: 1px solid var(--line-soft);
}

.faq-item summary {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding-block: 15px;
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.15rem;
  line-height: 1.2;
  list-style: none;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary :deep(svg) {
  flex-shrink: 0;
  color: var(--sage-deep);
  transition: transform 200ms ease;
}

.faq-item[open] summary :deep(svg) {
  transform: rotate(45deg);
}

.faq-answer {
  max-width: 700px;
  padding: 0 38px 17px 0;
}

.faq-answer p {
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.8;
}

.faq-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px 0;
}

.faq-empty :deep(svg) {
  color: var(--rose);
}

.faq-empty h3 {
  margin-top: 16px;
  font-size: 1.8rem;
}

.faq-empty p {
  max-width: 400px;
  margin-top: 7px;
  color: var(--ink-soft);
  font-size: 11px;
  line-height: 1.7;
}

.faq-empty .btn {
  margin-top: 20px;
}

@media (max-width: 900px) {
  .faq-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .faq-aside {
    position: static;
  }

  .faq-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    padding-bottom: 4px;
  }

  .faq-nav button {
    min-height: 34px;
    padding: 7px 11px;
    border: 1px solid var(--line-soft);
    border-radius: 999px;
    font-size: 8px;
  }

  .faq-nav button.is-active {
    border-color: var(--sage-deep);
    background: var(--sage-deep);
    color: var(--white);
  }

  .faq-nav button.is-active span {
    text-decoration: none;
  }

  .faq-nav button.is-active small {
    color: rgba(255, 253, 248, 0.65);
  }

  .faq-help {
    display: none;
  }
}

@media (max-width: 600px) {
  .faq-content__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .faq-item summary {
    gap: 14px;
    font-size: 1.05rem;
  }

  .faq-answer {
    padding-right: 0;
  }
}
</style>
